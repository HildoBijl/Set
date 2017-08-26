import React, { Component } from 'react'

export default class ShapeDefinitions extends Component {
  render() {
    return (
      <svg width="0" height="0">
        <defs>
          <filter id="dots">
            <feTurbulence baseFrequency=".08" numOctaves="2" result="turbulence" seed="13" />
            <feColorMatrix type="matrix" values="0.42 0.42 0.42 0.42 0 0.42 0.42 0.42 0.42 0 0.42 0.42 0.42 0.42 0 0 0 0 0 1" in="turbulence" result="greyscale" />
            <feComponentTransfer in="greyscale" result="saturated">
              <feFuncR type="discrete" tableValues="0 1" />
              <feFuncG type="discrete" tableValues="0 1" />
              <feFuncB type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
          <mask id="dotMask" x="0" y="0" width="468" height="175.5">
            <rect x="0" y="0" width="468" height="175.5" fill="#000000" filter="url(#dots)" />
          </mask>
          <symbol id="wavePath" viewBox="0 0 468 175.5">
            <path className="wave" d="M84,102.75c0,-40 25,-80 75,-80c60,0 80,23 130,23c40,0 50,-23 70,-23c15,0 25,20 25,50c0,40 -25,80 -75,80c-60,0 -80,-23 -130,-23c-40,0 -50,23 -70,23c-15,0 -25,-20 -25,-50z" />
          </symbol>
          <symbol id="wave" viewBox="0 0 468 175.5">
            <use href="#wavePath" />
            <use href="#wavePath" fill="currentColor" mask="url(#dotMask)" />
            <use href="#wavePath" fill="none" />
          </symbol>
          <symbol id="ellipsePath" viewBox="0 0 468 175.5">
            <ellipse cx="234" cy="87.75" rx="154.5" ry="67.5" />
          </symbol>
          <symbol id="ellipse" viewBox="0 0 468 175.5">
            <use href="#ellipsePath" />
            <use href="#ellipsePath" fill="currentColor" mask="url(#dotMask)" />
            <use href="#ellipsePath" fill="none" />
          </symbol>
          <symbol id="rectPath" viewBox="0 0 468 175.5">
            <rect x="87.5" y="29" width="293" height="117.5" />
          </symbol>
          <symbol id="rect" viewBox="0 0 468 175.5">
            <use href="#rectPath" />
            <use href="#rectPath" fill="currentColor" mask="url(#dotMask)" />
            <use href="#rectPath" fill="none" />
          </symbol>
        </defs>
      </svg>
    )
  }
}
