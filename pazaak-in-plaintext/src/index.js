import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import chunk from 'lodash/chunk'

const numRows = 4;
const numCols = 4;

function Card(props) {
  return (
    <div className="card">
      {props.value}
    </div>
  );
}

class Card extends React.Component {
  renderCard(i) {
    return (
      <Square
        value={this.props.cards[i] !== 0 ? this.props.cards[i] : null}
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
                  {item.map((col, colIndex) => this.renderCard(numRows * rowIndex + colIndex))}
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
              cards={this.props.playerOneCards}
            />
          </div>
          <div>{"Total: "}</div>
        </div>
        <div className="playerColumn">
          <div>{"Player Two"}</div>
          <div className="board">
            <Board
              cards={this.props.playerTwoCards}
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
      playerOneCards: Array(numRows * numCols).fill(0),
      playerTwoCards: Array(numRows * numCols).fill(0),
      isPlayerOneStanding: false,
      isPlayerTwoStanding: false,
      oneIsNext: true
    };
  }

  handleForfeit(player) {
    if (calculateWinner(this.props.playerOneCards.reduce((a, b) => a + b, 0), this.props.isPlayerOneStanding, this.props.playerTwoCards.reduce((a, b) => a + b, 0), this.props.isPlayerTwoStanding)) {
      return;
    }

    if (player === 1) {
      this.setState();
    } else {
      this.setState();
    }
  }

  handleEndTurn(player) {
    if (calculateWinner(this.props.playerOneCards.reduce((a, b) => a + b, 0), this.props.isPlayerOneStanding, this.props.playerTwoCards.reduce((a, b) => a + b, 0), this.props.isPlayerTwoStanding)) {
      return;
    }

    if (player === 1) {
      this.setState({
        playerOneCards: this.props.playerOneCards,
        playerTwoCards: this.props.playerTwoCards,
        oneIsNext: true,
      });
    } else {
      this.setState();
    }
  }

  handleStand(player) {
    if (calculateWinner(this.props.playerOneCards.reduce((a, b) => a + b, 0), this.props.isPlayerOneStanding, this.props.playerTwoScore.reduce((a, b) => a + b, 0), this.props.isPlayerTwoStanding)) {
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
            playerOneCards={this.props.playerOneCards}
            playerTwoCards={this.props.playerTwoCards}
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
