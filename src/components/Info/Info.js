import './Info.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { calculatePoints } from '../../logic/setGame.js'

class Info extends Component {
  constructor() {
    super()
    this.state = {
      pointsLeft: 100,
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.updatePointsLeft.bind(this), 25)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  updatePointsLeft() {
    this.setState({
      pointsLeft: calculatePoints(this.props.lastSetAt)
    })
	}
	
  render() {
		return (
			<div className="info">
				<div className="score">Score: {Math.round(this.props.score)} + {Math.round(this.state.pointsLeft)}</div>
				<div className="setsLeft">Sets left: {(this.props.deck.length - this.props.cardsUsed + this.props.table.length) / 3}</div>
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
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)