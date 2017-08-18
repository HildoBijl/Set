import './Set.css'

import React, { Component } from 'react'
import classnames from 'classnames'

import Card from '../Card/Card.js'

export default class Set extends Component {
  getCardIndex(card) {
    return card.reduce((sum,v,i) => sum + v*Math.pow(3,i), 0)
  }
  getRandomCards(n) {
    return new Array(n).fill(0).map(() => this.getRandomCard())
  }
  getRandomCard() {
    return new Array(4).fill(0).map(() => Math.floor(3*Math.random()))
  }
  render() {
    const numCards = 13
    const cards = this.getRandomCards(numCards)
    return (
      <div className={classnames(
        "set",
        "w"+Math.ceil(numCards/3)
      )}>
        {cards.map((card, ind) => <Card key={this.getCardIndex(card)} details={card} pos={ind} />)}
      </div>
    )
  }
}
