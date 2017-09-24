import './Set.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { indexToProp, keyToPos } from '../../logic/setGame.js'
import setActions from '../../actions/setGame.js'

import ShapeDefinitions from '../../assets/ShapeDefinitions.js'
import logo from '../../assets/logo.svg'
import Card from '../Card/Card.js'
import Info from '../Info/Info.js'

class Set extends Component {
  componentDidMount() {
    document.onkeydown = this.handleKeyPress.bind(this)
  }
  handleKeyPress(event) {
    // Check the spacebar/enter for starting/resetting the game.
    if (this.props.gameOver && (event.key === " " || event.key === "Enter")) {
      event.preventDefault()
      this.props.resetGame()
    }

    // Check the letter keys for selecting a card.
    let pos = keyToPos[event.key.toLowerCase()]
    pos = this.props.table.length - 3 - pos + 2*(pos % 3) // We adjust the position because cards are actually shown from the right to the left.
    if (pos >= 0 && pos < this.props.table.length) {
      event.preventDefault()
      this.props.selectCard(pos)
    }
  }

  render() {
    const table = this.props.table
    const deck = this.props.deck
    const cardsUsed = this.props.cardsUsed

    return (
      <div
        className={classnames(
          "set",
          "w"+Math.ceil(table.length/3),
          {gameOver: this.props.gameOver},
          {noCardsInDeck: this.props.cardsUsed >= this.props.deck.length},
          {cardsOnPile: this.props.cardsUsed !== this.props.table.length},
          {starting: !this.props.gameOver && this.props.table.length === 0}
        )}
      >
        <Info /> 
        {deck.map((cardIndex, deckPos) => {
          let pos = table.indexOf(cardIndex)
          if (pos === -1) {
            if (deckPos < cardsUsed) {
              pos = "pile"
            } else {
              pos = "deck"
            }
          }
          return <Card
            key={cardIndex}
            details={indexToProp(cardIndex)}
            pos={pos}
            lastChange={this.props.lastCardChange[cardIndex]}
            numColumns={table.length/3}
            selected={this.props.selected.includes(pos)}
            onClick={() => this.props.selectCard(pos)}
          />
        })}
        <Card key="deck" details="deck"><img src={logo} className="cardLogo" alt="Set logo" /></Card>
        <Card key="pile" details="pile">
          {this.props.finalScore > 0 ? (
            <div className="gameControl">
              <div className="scores">
                <p>You finished the game.</p>
                <p>Score: {Math.round(this.props.finalScore)}</p>
              </div>
              <img src={logo} className="cardLogo" alt="Set logo" />
              <span className="btn" onClick={this.props.resetGame}>Play again</span>
            </div>
          ) : (
            <div className="gameControl">
              <img src={logo} className="cardLogo" alt="Set logo" />
              <span className="btn" onClick={this.props.resetGame}>Start the game</span>
            </div>
          )}
        </Card>
        <ShapeDefinitions />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
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
