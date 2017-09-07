import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Scalpel, { JscalpelType } from 'jscalpel';
class App extends Component {
  render() {
    Scalpel({
      target: {
        status: '0'
      },
      keys: 'status',
      callback: (status) => {
        console.log('status', status);
      },
      plugins: [JscalpelType]
    })
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
