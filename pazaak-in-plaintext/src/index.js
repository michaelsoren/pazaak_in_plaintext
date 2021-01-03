import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import chunk from 'lodash/chunk'

const numRows = 3;
const numCols = 3;

function Card(props) {
  return (
    <div className="card">
      {props.value}
    </div>
  );
}

class Cards extends React.Component {
  renderCard(i) {
    let dealtCard = this.props.dealtCards[i];
    return (
      <Card
        value={dealtCard !== 0 ? dealtCard : null}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="cards">
          {
            chunk(new Array(numRows * numCols).fill(0), numCols).map((item, rowIndex) => {
              return (
                <div key={rowIndex} className="row">
                  {
                  item.map((col, colIndex) => this.renderCard(numRows * rowIndex + colIndex))
                  }
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
          <div className="cards">
            <Cards
              dealtCards={this.props.playerOneCards}
            />
          </div>
          <div>{"Total: " + this.props.playerOneCards.reduce((a, b) => a + b, 0)}</div>
        </div>
        <div className="playerColumn">
          <div>{"Player Two"}</div>
          <div className="cards">
            <Cards
              dealtCards={this.props.playerTwoCards}
            />
          </div>
          <div>{"Total: " + this.props.playerTwoCards.reduce((a, b) => a + b, 0)}</div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let playerOneInitialCards = Array(numRows * numCols).fill(0);
    let playerTwoInitialCards = Array(numRows * numCols).fill(0);
    let newCard = getNewCard();
    playerOneInitialCards[0] = newCard;
    this.state = {
      playerCards: [playerOneInitialCards, playerTwoInitialCards],
      isPlayerStanding: [false, false],
      playerCardIndexes: [1, 0],
      currentPlayer: 0,
      winner: null,
      gameHistory: [],
      setWinner: null,
    };
  }

  handleForfeit(playerIndex) {
    if (playerIndex === 1) {
      this.setState({
        winner: "Two",
      });
    } else {
      this.setState({
        winner: "One",
      });
    }
  }

  handleEndTurn(playerIndex) {
    let newCard = getNewCard();
    let otherPlayerIndex = getOtherPlayerIndex(playerIndex);
    console.log("This PlayerIndex: " + playerIndex + ", Player Card Indexes: " + this.state.playerCardIndexes + ", isPlayerOneStanding: " + this.state.isPlayerStanding + ", playerCards: " + this.state.playerCards + ", currentPlayer: " + this.state.currentPlayer);
    //Player ends turn, set up for other player's turn, splitting on whether they are standing or not
    if (!this.state.isPlayerStanding[otherPlayerIndex]) {
      //other player is not standing, deal them the card, set up, and make it their turn
      let otherPlayerNewCards = this.state.playerCards[otherPlayerIndex].slice();
      otherPlayerNewCards[this.state.playerCardIndexes[otherPlayerIndex]] = newCard;
      let otherPlayerTotal = otherPlayerNewCards.reduce((a, b) => a + b, 0);
      //check if other player has reached 20
      if (otherPlayerTotal === 20) {
        //automatically stand if other player has 20. Draw and give first player their card, set to be their turn
        let secondCard = getNewCard();
        let originalPlayerNewCards = this.state.playerCards[playerIndex].slice();
        originalPlayerNewCards[this.state.playerCardIndexes[playerIndex]] = secondCard;
        let originalPlayerTotal = otherPlayerNewCards.reduce((a, b) => a + b, 0);
        let isOriginalPlayerStanding = false;
        if (originalPlayerTotal === 20) {
          isOriginalPlayerStanding = true;
        }

        let newPlayerCards = this.state.playerCards.slice();
        newPlayerCards[playerIndex] = originalPlayerNewCards;
        newPlayerCards[otherPlayerIndex] = otherPlayerNewCards;

        let newPlayerCardIndexes = this.state.playerCardIndexes.slice();
        newPlayerCardIndexes[playerIndex] += 1;
        newPlayerCardIndexes[otherPlayerIndex] += 1;

        let newIsPlayerStanding = this.state.isPlayerStanding.slice();
        newIsPlayerStanding[playerIndex] = isOriginalPlayerStanding;
        newIsPlayerStanding[otherPlayerIndex] = true;

        let winner = calculateWinner(newPlayerCards, newIsPlayerStanding, newPlayerCardIndexes);
        let newSetWinnerIfFinished = calculateSetWinner(this.state.gameHistory, winner);

        this.setState({
          playerCards: newPlayerCards,
          playerCardIndexes: newPlayerCardIndexes,
          isPlayerStanding: newIsPlayerStanding,
          currentPlayer: playerIndex, //todo
          winner: winner,
          setWinner: newSetWinnerIfFinished,
        });
      } else {
        //other player total is not twenty, so set it to be their turn with their new card

        let newPlayerCards = this.state.playerCards.slice();
        newPlayerCards[otherPlayerIndex] = otherPlayerNewCards;

        let newPlayerCardIndexes = this.state.playerCardIndexes.slice();
        newPlayerCardIndexes[otherPlayerIndex] += 1;

        let winner = calculateWinner(newPlayerCards, this.state.isPlayerStanding, newPlayerCardIndexes);
        let newSetWinnerIfFinished = calculateSetWinner(this.state.gameHistory, winner);

        this.setState({
          playerCards: newPlayerCards,
          playerCardIndexes: newPlayerCardIndexes,
          currentPlayer: otherPlayerIndex, //todo
          winner: winner,
          setWinner: newSetWinnerIfFinished,
        });
      }
    } else {
      //other player is standing, don't deal them the new card. Instead deal to original player again. Check if they got 20.
      let originalPlayerNewCards = this.state.playerCards[playerIndex].slice();
      originalPlayerNewCards[this.state.playerCardIndexes[playerIndex]] = newCard;
      let originalPlayerTotal = originalPlayerNewCards.reduce((a, b) => a + b, 0);
      let isOriginalPlayerStanding = false;
      if (originalPlayerTotal === 20) {
        isOriginalPlayerStanding = true;
      }

      let newPlayerCards = this.state.playerCards.slice();
      newPlayerCards[otherPlayerIndex] = originalPlayerNewCards;

      let newPlayerCardIndexes = this.state.playerCardIndexes.slice();
      newPlayerCardIndexes[playerIndex] += 1;

      let newIsPlayerStanding = this.state.isPlayerStanding.slice();
      newIsPlayerStanding[playerIndex] = isOriginalPlayerStanding;

      let winner = calculateWinner(newPlayerCards, newIsPlayerStanding, newPlayerCardIndexes);
      let newSetWinnerIfFinished = calculateSetWinner(this.state.gameHistory, winner);

      this.setState({
        playerCards: newPlayerCards,
        isPlayerStanding: newIsPlayerStanding,
        playerCardIndexes: newPlayerCardIndexes,
        currentPlayer: playerIndex,
        winner: winner,
        setWinner: newSetWinnerIfFinished,
      });
    }
  }

  handleStand(playerIndex) {
    console.log("This PlayerIndex: " + playerIndex + ", Player Card Indexes: " + this.state.playerCardIndexes + ", isPlayerOneStanding: " + this.state.isPlayerStanding + ", playerCards: " + this.state.playerCards + ", currentPlayer: " + this.state.currentPlayer);    
    let newCard = getNewCard();
    let otherPlayerIndex = getOtherPlayerIndex(playerIndex);

    //If other player is not standing, draw their card
    if (!this.state.isPlayerStanding[otherPlayerIndex]) {
      let otherPlayerNewCards = this.state.playerCards[otherPlayerIndex].slice();
      otherPlayerNewCards[this.state.playerCardIndexes[otherPlayerIndex]] = newCard;
      let otherPlayerTotal = otherPlayerNewCards.reduce((a, b) => a + b, 0);
      let isOtherPlayerStanding = false;
      //If 20, then both players are already standing. Don't need to return to draw a new card for original player
      if (otherPlayerTotal === 20) {
        isOtherPlayerStanding = true;
      }

      let newPlayerCards = this.state.playerCards.slice();
      newPlayerCards[otherPlayerIndex] = otherPlayerNewCards;

      let newPlayerCardIndexes = this.state.playerCardIndexes.slice();
      newPlayerCardIndexes[otherPlayerIndex] += 1;

      let newIsPlayerStanding = this.state.isPlayerStanding.slice();
      newIsPlayerStanding[playerIndex] = true;
      newIsPlayerStanding[otherPlayerIndex] = isOtherPlayerStanding;


      let winner = calculateWinner(newPlayerCards, newIsPlayerStanding, newPlayerCardIndexes);
      let newSetWinnerIfFinished = calculateSetWinner(this.state.gameHistory, winner);
      
      this.setState({
        playerCards: newPlayerCards,
        newPlayerCardIndexes: newPlayerCardIndexes,
        newIsPlayerStanding: newIsPlayerStanding,
        currentPlayer: false,
        winner: winner,
        setWinner: newSetWinnerIfFinished,
      });
    } else {
      //both players are now standing, calculate winners and update the state
      let newIsPlayerStanding = this.state.isPlayerStanding.slice();
      newIsPlayerStanding[playerIndex] = true;

      let winner = calculateWinner(this.state.playerCards, newIsPlayerStanding, this.state.playerCardIndexes);
      let newSetWinnerIfFinished = calculateSetWinner(this.state.gameHistory, winner);
      this.setState({
        newIsPlayerStanding: newIsPlayerStanding,
        currentPlayer: otherPlayerIndex,
        winner: winner,
        setWinner: newSetWinnerIfFinished,
      });
    }
  }

  handleNewGame() {
    let playerOneInitialCards = Array(numRows * numCols).fill(0);
    let playerTwoInitialCards = Array(numRows * numCols).fill(0);
    let newCard = getNewCard();
    let gameWinner = this.state.winner;
    let newGameHistory = this.state.gameHistory.concat([gameWinner]);
    playerOneInitialCards[0] = newCard;

    this.setState({
      playerCards: [playerOneInitialCards, playerTwoInitialCards],
      isPlayerStanding: [false, false],
      playerCardIndexes: [1, 0],
      currentPlayer: 0,
      winner: null,
      gameHistory: newGameHistory,
    });
  }

  handleNewSet() {
    let playerOneInitialCards = Array(numRows * numCols).fill(0);
    let playerTwoInitialCards = Array(numRows * numCols).fill(0);
    let newCard = getNewCard();
    playerOneInitialCards[0] = newCard;
    
    this.setState({
      playerCards: [playerOneInitialCards, playerTwoInitialCards],
      isPlayerStanding: [false, false],
      playerCardIndexes: [1, 0],
      currentPlayer: 0,
      winner: null,
      gameHistory: [],
      setWinner: null,
    });
  }

  render() {
    let playerOneWinCount = 0;
    let playerTwoWinCount = 0;
    if (this.state.gameHistory) {
      playerOneWinCount = this.state.gameHistory.reduce((a, b) => b === "One" ? a + 1 : a, 0);
      playerTwoWinCount = this.state.gameHistory.reduce((a, b) => b === "Two" ? a + 1 : a, 0);
    }
    let status;
    if (this.state.winner) {
      if (this.state.setWinner) {
        status = "Overall set winner: " + this.state.winner;
        playerOneWinCount += this.state.winner === "One" ? 1 : 0;
        playerTwoWinCount += this.state.winner === "Two" ? 1 : 0;
        return (
          <div className="game">
            <div>
              <Table
                playerOneCards={this.state.playerCards[0]}
                playerTwoCards={this.state.playerCards[1]}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <div>{"Player One: " + playerOneWinCount + ", Player Two: " + playerTwoWinCount + ". Best of three."}</div>
              <div className="game-buttons">
                  <button className="game-button" onClick={() => this.handleNewSet()}>{"Play Again?"}</button>
              </div>
            </div>
          </div>
        );
      } else {
        status = "Game Winner: " + this.state.winner;
        playerOneWinCount += this.state.winner === "One" ? 1 : 0;
        playerTwoWinCount += this.state.winner === "Two" ? 1 : 0;
        return (
          <div className="game">
            <div>
              <Table
                playerOneCards={this.state.playerCards[0]}
                playerTwoCards={this.state.playerCards[1]}
              />
            </div>
            <div className="game-info">
              <div>{"Player One: " + playerOneWinCount + ", Player Two: " + playerTwoWinCount + ". Best of three."}</div>
              <div>{status}</div>
              <div className="game-buttons">
                  <button className="game-button" onClick={() => this.handleNewGame()}>{"Start Next Game?"}</button>
              </div>
            </div>
          </div>
        );
      }
    } else {
      status = "Current player: " + (this.state.currentPlayer === 0 ? "One" : "Two");
      return (
        <div className="game">
          <div>
            <Table
              playerOneCards={this.state.playerCards[0]}
              playerTwoCards={this.state.playerCards[1]}
            />
          </div>
          <div className="game-info">
            <div>{"Player One Score: " + playerOneWinCount + ", Player Two Score: " + playerTwoWinCount}</div>
            <div>{status}</div>
            <div className="game-buttons">
                <button className="game-button" onClick={() => this.handleEndTurn(this.state.currentPlayer)}>{"End Turn"}</button>
                <button className="game-button" onClick={() => this.handleStand(this.state.currentPlayer)}>{"Stand"}</button>
                <button className="game-button" onClick={() => this.handleForfeit(this.state.currentPlayer)}>{"Forfeit"}</button>
            </div>
          </div>
        </div>
      );
    }
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function getNewCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function getOtherPlayerIndex(index) {
  return (index + 1) % 2;
}

function calculateWinner(playerCards, isPlayerStanding, playerIndexes) {
  let playerOneScore = playerCards[0].reduce((a, b) => a + b, 0);
  let playerTwoScore = playerCards[1].reduce((a, b) => a + b, 0);
  let isPlayerOneStanding = isPlayerStanding[0];
  let isPlayerTwoStanding = isPlayerStanding[1];
  let playerOneIndex = playerIndexes[0];
  let playerTwoIndex = playerIndexes[1];

  if (playerOneScore > 20) {
    return "Two";
  } else if (playerTwoScore > 20) {
    return "One";
  } else if (playerOneScore === 20 && playerTwoScore === 20) {
    return "Tie";
  } else if (playerOneIndex === 8) {
    return "Two";
  } else if (playerTwoIndex === 8) {
    return "One";
  } else if (isPlayerOneStanding && playerOneScore < playerTwoScore) {
    return "Two";
  } else if (isPlayerTwoStanding && playerOneScore > playerTwoScore) {
    return "One";
  } else if (isPlayerOneStanding && isPlayerTwoStanding && playerOneScore === playerTwoScore) {
    return "Tie";
  } else {
    return null;
  }
}

function calculateSetWinner(gameHistory, winner) {
  let playerOneWinCount = 0;
  let playerTwoWinCount = 0;
  if (gameHistory) {
    playerOneWinCount = gameHistory.reduce((a, b) => b === "One" ? a + 1 : a, 0);
    playerTwoWinCount = gameHistory.reduce((a, b) => b === "Two" ? a + 1 : a, 0);
  }
  if (winner === "One") {
    playerOneWinCount += 1;
  } else if (winner === "Two") {
    playerTwoWinCount += 1;
  }

  if (playerOneWinCount === 3) {
    return "One";
  } else if (playerTwoWinCount === 3) {
    return "Two";
  }

  return null;
}
