import './Set.css'

import React, { Component } from 'react'
import classnames from 'classnames'

import Card from '../Card/Card.js'

export default class Set extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: this.shuffle(81),
      table: [],
      selected: [],
      cardsUsed: 0
    }
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
    while (this.findSet(tableAsProp).length === 0 || table.length < 12 || table.length % 3 !== 0) {
      const cardFromDeck = this.state.deck[cardsUsed++]
      table.push(cardFromDeck)
      tableAsProp.push(this.indexToProp(cardFromDeck))
    }
    const aantalSets = this.findSet(tableAsProp).length
    console.log(aantalSets === 1 ? 'Er is nu 1 set.' : 'Er zijn nu ' + aantalSets + ' sets.')
    this.setState({ table, cardsUsed })
  }

  componentDidMount() {
    this.addCardsToTable([])
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

  render() {
    const table = this.state.table
    return (
      <div className={classnames(
        "set",
        "w"+Math.ceil(table.length/3)
      )}>
        {table.map((cardIndex, pos) => <Card
          key={cardIndex}
          details={this.indexToProp(cardIndex)}
          pos={pos}
          selected={this.state.selected.includes(pos)}
          onClick={() => this.handleClick(pos)}
        />)}
      </div>
    )
  }
}
