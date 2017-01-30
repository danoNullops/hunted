var Player = require('./Player.js');

class Players {
  constructor() {
    this.players = [];
    this.gameIndex = null;
  }

  updatePlayerScore(data) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === data.id) {
        this.players[i].score = data.score;
      }
    }
  }

  detectPlayersCollision() {
    let prey;
    let hunter;

    this.players.forEach((val) => {
      if (val.isHunted) {
        prey = val;
      } else {
        hunter = val;
      }
    })

    if (
      prey &&
      hunter &&
      hunter.x >= prey.x - 25 &&
      hunter.x <= prey.x + 25 &&
      hunter.y >= prey.y - 25 &&
      hunter.y <= prey.y + 25
    ) {
      return true;
    } else {
      return false;
    }
  }

  updatePlayers(updatedPlayer) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id === updatedPlayer.id) {
        this.players[i].x = updatedPlayer.x;
        this.players[i].y = updatedPlayer.y;
        this.players[i].direction = updatedPlayer.direction;
        return this.players[i];
      }
    }
  }

  addPlayer(data, id) {
    let player;

    player = new Player(
      data.x, data.y, data.direction, data.type,
      data.isHunted, data.id, 0, false, this.gameIndex
    );
    this.players.push(player);

    return player;
  }

  reverseIsHunted() {
    this.players.forEach(player => player.isHunted = !player.isHunted)
  }

  clearPlayers() {
    this.players = [];
  }

  removePlayerById(id) {
    let idx;
    let temp = this.players;
    this.players = [];
    temp.forEach((player, i) => {
      if (player.id === id) {
        idx = i;
      }
    });
    if (!isNaN(idx)) {
      temp.splice(idx, 1);
    }
    this.players = temp;
  }

  getWinner() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].isHunted === false) {
        return this.players[i];
      }
    }
  }

  getLoser() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].isHunted === true) {
        return this.players[i];
      }
    }
  }

  setGameIndex(index) {
    this.gameIndex = index;
  }
}

module.exports = Players;
