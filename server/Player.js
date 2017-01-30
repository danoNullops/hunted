class Player {
  constructor(x, y, dir, type, isHunted, id, score, won, gameIndex) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.type = type;
    this.isHunted = isHunted;
    this.id = id;
    this.score = score;
    this.won = won;
    this.gameIndex = gameIndex;
  }
}

module.exports = Player;
