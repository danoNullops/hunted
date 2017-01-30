class Games {
  constructor() {
    this.gameStore = [];
  }

  addGame(game) {
    this.gameStore.push(game);

    return this.gameStore.length - 1;
  }
}

module.exports = Games;
