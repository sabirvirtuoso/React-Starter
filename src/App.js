import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Game />
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div> 
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      locations: [0],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    }
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          winSquares: [a, b, c],
        };
      }
    }

    return null;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const locations = this.state.locations.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const moveLocation = `(${i % 3}, ${Math.floor(i/ 3)})`;

    this.setState({
      history: history.concat({
        squares: squares,
      }), 
      stepNumber: history.length,
      locations: locations.concat(moveLocation),
      xIsNext: !this.state.xIsNext,});
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    })
  }

  toggleMoveOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerObject = this.calculateWinner(current.squares)

    let button;

    const moves = history.map((step, move) => {
      const goToTextForAscOrder = `Go to Move #${move} at ${this.state.locations[move]}`;
      const goToTextForDescOrder = `Go to Move #${history.length - 1 - move} at ${this.state.locations[history.length - 1 - move]}`;

      const desc = this.state.isAscending ? (move === 0 ? 'Start Game' : goToTextForAscOrder) : (move === history.length - 1  ? 'Start Game' : goToTextForDescOrder);

      if (this.state.isAscending ? move === this.state.stepNumber : move === history.length - 1 - this.state.stepNumber) {
        button = <button onClick={() => this.jumpTo(this.state.isAscending ? move : history.length - 1 - move)}><b>{desc}</b></button>
      } else {
        button = <button onClick={() => this.jumpTo(this.state.isAscending ? move : history.length - 1 - move)}>{desc}</button>
      }

      return (
        <li key={move}>
          {button}
        </li>
      );
    })

    let status;

    if (winnerObject && winnerObject.winner) {
      status = `Winner is: ${winnerObject.winner}`;
    } else if (this.state.stepNumber === 9) {
      status = 'Game is drawn';
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winSquares={winnerObject ? winnerObject.winSquares : null} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <button onClick={() => this.toggleMoveOrder()}>Toggle Moves</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );  
  }
}

class Board extends Component {  
  render() {
    let boardRows = [];

    for (let i = 0; i < 3; i++) {
      let j = i * 3;
      let rowElements = [];

      for (let k = j; k < j + 3; k++) {
        const element = <Square key={k} value={this.props.squares[k]} onClick={() => this.props.onClick(k)} style={this.props.winSquares && 
          this.props.winSquares.includes(k) ? 'square-winner': 'square'}/>;
        rowElements.push(element);
      }

      const boardRow = <div key={i} className="board-row">{rowElements}</div>
      boardRows.push(boardRow);
    }
    
    return (
      <div>
        {boardRows}
      </div>
    );
  }
}

function Square(props) {
  return (
    <button className={props.style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default App;
