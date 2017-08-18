import './App.css'

import React, { Component } from 'react'
import logo from '../../logo.svg'

import Set from '../Set/Set.js'

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="header">
          <img src={logo} className="logo" alt="logo" />
          <h2>Set - An online game</h2>
        </div>
        <Set />
      </div>
    )
  }
}

export default App
