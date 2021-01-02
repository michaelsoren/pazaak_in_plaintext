import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import chunk from 'lodash/chunk'

const numRows = 4;
const numCols = 4;

function Square(props) {
  return (
    <div className="square">
      {props.value}
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board">
          {
            chunk(new Array(numRows * numCols).fill(0), numCols).map((item, rowIndex) => {
              return (
                <div key={rowIndex} className="row">
                  {item.map((col, colIndex) => this.renderSquare(numRows * rowIndex + colIndex))}
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

class Table extends React.Component {
  render() {
    return (
      <div className="game-table">
        <div className="playerColumn">
          <div>{"Player One"}</div>
          <div className="board">
            <Board
              squares={this.props.squares}
              onClick={this.props.onClick}
            />
          </div>
          <div>{"Total: "}</div>
        </div>
        <div className="playerColumn">
          <div>{"Player Two"}</div>
          <div className="board">
            <Board
              squares={this.props.squares}
              onClick={this.props.onClick}
            />
          </div>
          <div>{"Total: "}</div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      oneIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.oneIsNext ? "One" : "Two";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      oneIsNext: !this.state.oneIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      oneIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Current player: " + (this.state.oneIsNext ? "One" : "Two");
    }

    return (
      <div className="game">
        <div>
          <Table
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="game-buttons">
              <button className="game-button" onClick={() => this.jumpTo(0)}>{"End Turn"}</button>
              <button className="game-button" onClick={() => this.jumpTo(0)}>{"Stand"}</button>
              <button className="game-button" onClick={() => this.jumpTo(0)}>{"Forfeit"}</button>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
