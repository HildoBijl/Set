import './Set.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { indexToProp, keyToPos } from '../../logic/setGame.js'
import setActions from '../../actions/setGame.js'

import Card from '../Card/Card.js'

class Set extends Component {
  componentDidMount() {
    document.onkeydown = this.handleKeyPress.bind(this)
  }

  handleClick(pos) {
    this.props.selectCard(pos)
  }

  handleKeyPress(event) {
    const pos = keyToPos[event.key]
    if (!(pos >= 0 && pos < this.props.table.length))
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
    const table = this.props.table
    return (
      <div
        className={classnames(
          "set",
          "w"+Math.ceil(table.length/3),
          {gameOver: this.props.gameOver}
        )}
      >
        {table.map((cardIndex, pos) => <Card
          key={cardIndex}
          details={indexToProp(cardIndex)}
          pos={pos}
          selected={this.props.selected.includes(pos)}
          onClick={() => this.handleClick(pos)}
        />)}
        <div className="gameOverScreen">
          Your game is over. Well done!
          <span className="btn" onClick={this.props.resetGame}>Play again</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.setGame
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectCard: (pos) => dispatch(setActions.selectCard(pos)),
    resetGame: () => dispatch(setActions.resetGame()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Set)
