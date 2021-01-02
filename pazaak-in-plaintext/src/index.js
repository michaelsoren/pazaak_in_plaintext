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
            />
          </div>
          <div>{"Total: "}</div>
        </div>
        <div className="playerColumn">
          <div>{"Player Two"}</div>
          <div className="board">
            <Board
              squares={this.props.squares}
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
      playerOneBoard: Array(numRows * numCols).fill(null),
      playerTwoBoard: Array(numRows * numCols).fill(null),
      playerOneScore: 0,
      playerTwoScore: 0,
      playerOneStanding: false,
      playerTwoStanding: false,
      oneIsNext: true
    };
  }

  handleForfeit(player) {
    if (calculateWinner(this.props.playerOneScore, this.props.playerOneStanding, this.props.playerTwoScore, this.props.playerTwoStanding)) {
      return;
    }

    if (player === 1) {
      this.setState();
    } else {
      this.setState();
    }
  }

  handleEndTurn(player) {
    if (calculateWinner(this.props.playerOneScore, this.props.playerOneStanding, this.props.playerTwoScore, this.props.playerTwoStanding)) {
      return;
    }

    if (player === 1) {
      this.setState();
    } else {
      this.setState();
    }
  }

  handleStand(player) {
    if (calculateWinner(this.props.playerOneScore, this.props.playerOneStanding, this.props.playerTwoScore, this.props.playerTwoStanding)) {
      return;
    }

    if (player === 1) {
      this.setState();
    } else {
      this.setState();
    }
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
            playerOneBoard={this.props.playerOneBoard}
            playerTwoBoard={this.props.playerTwoBoard}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="game-buttons">
              <button className="game-button" onClick={() => this.handleEndTurn(0)}>{"End Turn"}</button>
              <button className="game-button" onClick={() => this.handleStand(0)}>{"Stand"}</button>
              <button className="game-button" onClick={() => this.handleForfeit(0)}>{"Forfeit"}</button>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(pOneScore, pOneStanding, pTwoScore, pTwoStanding) {
  if (pOneScore > 20) {
    return "Two";
  } else if (pTwoScore > 20) {
    return "One";
  } else if (pOneStanding && pOneScore < pTwoScore) {
    return "Two";
  } else if (pTwoStanding && pOneScore > pTwoScore) {
    return "Two";
  } else {
    return null;
  }
}
