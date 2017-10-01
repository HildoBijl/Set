import './Card.css'

import React, { Component } from 'react'
import classnames from 'classnames'

import { movingTime } from '../../assets/config.js'

const msBetweenTouches = 500 // This is the minimum time between two taps on a touch device.

export default class Card extends Component {
  constructor() {
    super()
    this.state = {
      lastClicked: Date.now()
    }
  }

  handleClick(event) {
    // When there was a touch very recently, ignore the mousepress.
    if (Date.now() - this.state.lastClicked < msBetweenTouches)
      return
    // Note the time at which a touch was made.
    if (event.type === "touchstart")
      this.setState({ lastClicked: Date.now() })
    // Deal with the click.
    this.props.onClick()
  }

  render() {
    // Check if the card is a deck or pile.
    const card = this.props.details
    if (card === "deck" || card === "pile")
      return <div className={classnames("card", "stack", card)}>{this.props.children}</div>

    // Set up the proper classes for the card.
    const classes = { card: true }
    for (let i = 0; i < 4; i++) {
      classes["prop" + i + card[i]] = true
    }
    classes.selected = this.props.selected
    if (this.props.pos === "pile") {
      classes.inPile = true
    } else if (this.props.pos === "deck") {
      classes.inDeck = true
    } else {
      const column = Math.floor(this.props.pos/3)
      const columnIndex = this.props.numColumns - 2*column - 1 // We position cards from the right to the left, to ensure new cards are added on the left.
      classes["y" + (this.props.pos % 3)] = true
      classes["x" + columnIndex] = true
      classes.onTable = true
    }
    classes.moving = (Date.now() - this.props.lastChange <= movingTime)
    
    // Fill the card with shapes and display it.
    const numberOfShapes = card[1] + 1
    const shapes = new Array(numberOfShapes).fill(0).map((v,i) => (
      <svg key={i} className="shape" xmlns="http://www.w3.org/2000/svg">
        <use xlinkHref={'#'+['rect','ellipse','wave'][card[2]]} />
      </svg>
    ))
    return (
      <div onMouseDown={this.handleClick.bind(this)} onTouchStart={this.handleClick.bind(this)} className={classnames(classes)}>
        {shapes}
        {this.props.children}
      </div>
    )
  }
}
