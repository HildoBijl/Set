import './Card.css'

import React, { Component } from 'react'
import classnames from 'classnames'

export default class Card extends Component {
  render() {
    const numberOfShapes = this.props.details[1] + 1
    const arr = new Array(numberOfShapes).fill(0).map((v,i) => <div key={i} className="shape"></div>)
    return (
      <div className={
          classnames(
            "card",
            "prop0" + this.props.details[0],
            "prop1" + this.props.details[1],
            "prop2" + this.props.details[2],
            "prop3" + this.props.details[3],
            "y" + (this.props.pos % 3),
            "x" + Math.floor(this.props.pos/3),
          )
        }>
        {arr}
      </div>
    )
  }
}
