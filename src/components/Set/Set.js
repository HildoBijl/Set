import './Set.css'

import React, { Component } from 'react'
import classnames from 'classnames'

import Card from '../Card/Card.js'

export default class Set extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: this.shuffle(18),
      table: [],
      selected: [],
      cardsUsed: 0,
      gameOver: false,
    }
  }

  componentDidMount() {
    this.addCardsToTable([])
    this.initialize()
  }

  initialize() {
    document.onkeydown = this.handleKeyPress.bind(this)
  }

  shuffle(n) {
    const arr = new Array(n).fill(0).map((v,i) => i)
    arr.forEach((v,i) => {
      const ind = Math.floor(i + (n-i)*Math.random())
      arr[i] = arr[ind]
      arr[ind] = v
    })
    return arr
  }

  propToIndex(card) {
    return card.reduce((sum,v,i) => sum + v*Math.pow(3,i), 0)
  }
  indexToProp(index) {
    const arr = []
    for (let i = 0; i < 4; i++) {
      arr[i] = index % 3
      index = (index - arr[i])/3
    }
    return arr
  }

  getCardFromIndex(index) {
    return {
      prop: this.indexToProp(index),
      index,
      selected: false
    }
  }

  isSet(cards) {
    if (cards.length !== 3)
      throw new Error('isSet received an array of cards that was not of length 3.')
    for (let i = 0; i < cards[0].length; i++) {
      if ((cards[0][i] + cards[1][i] + cards[2][i]) % 3 !== 0)
        return false
    }
    return true
  }

  findSet(cards) {
    let sets = []
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < i; j++) {
        for (let k = 0; k < j; k++) {
            if (this.isSet([cards[i], cards[j], cards[k]]))
              sets.push([k,j,i])
         }
      }
    }
    return sets
  }

  addCardsToTable(table) {
    const tableAsProp = table.map(this.indexToProp)
    let cardsUsed = this.state.cardsUsed
    const deck = this.state.deck
    while (this.findSet(tableAsProp).length === 0 || table.length < 12 || table.length % 3 !== 0) {
      if (cardsUsed >= deck.length)
        break
      const cardFromDeck = deck[cardsUsed++]
      table.push(cardFromDeck)
      tableAsProp.push(this.indexToProp(cardFromDeck))
    }
    const aantalSets = this.findSet(tableAsProp).length
    console.log(aantalSets === 1 ? 'Er is nu 1 set.' : 'Er zijn nu ' + aantalSets + ' sets.')
    if (aantalSets === 0) {
      return this.setState({ gameOver: true })
    }
    this.setState({ table, cardsUsed })
  }

  handleClick(pos) {
    let selected = this.state.selected.slice(0)
    const indexOf = selected.indexOf(pos)
    if (indexOf === -1) {
      selected.push(pos)
    } else {
      selected.splice(indexOf, 1)
    }
    if (selected.length >= 3) {
      if (this.isSet(selected.map((v) => this.state.table[v]).map(this.indexToProp))) {
        let x = selected.sort((a,b) => b-a)
        let table = this.state.table.slice(0)
        x.forEach((pos) => table.splice(pos, 1))
        selected = []
        this.setState({ table, selected })
        this.addCardsToTable(table)
        return
      }
      selected = []
    }
    this.setState({ selected })
  }

  handleKeyPress(event) {
    const pos = keyToPos[event.key]
    if (!(pos >= 0 && pos < this.state.table.length))
      return
    event.preventDefault()
    this.handleClick(pos)
  }

  resetGame() {
    this.setState({
      deck: this.shuffle(18),
      table: [],
      selected: [],
      cardsUsed: 0,
      gameOver: false,
    })
    this.addCardsToTable([])
  }

  render() {
    const table = this.state.table
    return (
      <div
        className={classnames(
          "set",
          "w"+Math.ceil(table.length/3),
          {gameOver: this.state.gameOver}
        )}
      >
        {table.map((cardIndex, pos) => <Card
          key={cardIndex}
          details={this.indexToProp(cardIndex)}
          pos={pos}
          selected={this.state.selected.includes(pos)}
          onClick={() => this.handleClick(pos)}
        />)}
        <div className="gameOverScreen">
          Your game is over. Well done!
          <span className="btn" onClick={this.resetGame.bind(this)}>Play again</span>
        </div>
      </div>
    )
  }
}

const keyToPos = {
  q: 0, w: 3, e: 6, r: 9, t: 12, y: 15, u: 18,
  a: 1, s: 4, d: 7, f: 10, g: 13, h: 16, j: 19,
  z: 2, x: 5, c: 8, v: 11, b: 14, n: 17, m: 20,
}
