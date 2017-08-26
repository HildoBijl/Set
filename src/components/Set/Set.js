import './Set.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { indexToProp, keyToPos, calculatePoints } from '../../logic/setGame.js'
import setActions from '../../actions/setGame.js'

import ShapeDefinitions from '../../assets/ShapeDefinitions.js'
import Card from '../Card/Card.js'

class Set extends Component {
  constructor() {
    super()
    this.state = {
      pointsLeft: 0,
    }
  }
  componentDidMount() {
    document.onkeydown = this.handleKeyPress.bind(this)
    this.interval = setInterval(this.updatePointsLeft.bind(this), 50)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  updatePointsLeft() {
    this.setState({
      pointsLeft: calculatePoints(this.props.lastSetAt)
    })
  }

  handleKeyPress(event) {
    const pos = keyToPos[event.key]
    if (!(pos >= 0 && pos < this.props.table.length))
      return
    event.preventDefault()
    this.handleClick(pos)
  }

  handleClick(pos) {
    this.props.selectCard(pos)
  }

  render() {
    const table = this.props.table
    const cardsUsed = this.props.cardsUsed
    return (
      <div
        className={classnames(
          "set",
          "w"+Math.ceil(table.length/3),
          {gameOver: this.props.gameOver}
        )}
      >
        <ShapeDefinitions />
        {/*<div className="info">
          <div className="score">Score: {Math.round(this.props.score)} + {Math.round(this.state.pointsLeft)}</div>
          <div className="setsLeft">Sets left: {27 - (cardsUsed - table.length) / 3}</div>
        </div> TODO: PUT BACK*/}
        <div className="cards">
          {table.map((cardIndex, pos) => <Card
            key={cardIndex}
            details={indexToProp(cardIndex)}
            pos={pos}
            selected={this.props.selected.includes(pos)}
            onClick={() => this.handleClick(pos)}
          />)}
          <div className="gameOverScreen">
            <p>Your game is over. Well done!</p>
            <p>Score: {Math.round(this.props.score / (27 - table.length / 3) * 27) }</p>
            <span className="btn" onClick={this.props.resetGame}>Play again</span>
          </div>
        </div>
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
