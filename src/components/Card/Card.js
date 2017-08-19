import './Card.css'

import React, { Component } from 'react'
import classnames from 'classnames'

export default class Card extends Component {
  render() {
    const card = this.props.details
    const numberOfShapes = card[1] + 1
    const arr = new Array(numberOfShapes).fill(0).map((v,i) => <div key={i} className="shape"></div>)
    return (
      <div onClick={this.props.onClick} className={
          classnames(
            "card",
            "prop0" + card[0],
            "prop1" + card[1],
            "prop2" + card[2],
            "prop3" + card[3],
            "y" + (this.props.pos % 3),
            "x" + Math.floor(this.props.pos/3),
            {selected: this.props.selected}
          )
        }>
        {arr}
      </div>
    )
  }
}
