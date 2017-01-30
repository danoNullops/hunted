// General player class

export default class Player {
  constructor(game, x, y, direction, type, isHunted, name, id, score) {
    this.game = game;
    this.direction = direction;
    this.type = type;
    this.isHunted = isHunted;
    this.name = name;
    this.id = id;
    this.score = score;
    this.gameIndex = null;
    this.alive = true;

    this.previousPosition = { x, y, direction };

    this.player = this.game.add.sprite(x, y, this.type);

    if (this.type === 'human') {
      this.player.scale.setTo(2,2);
    }

    if (this.type === 'werewolf') {
      this.werewolfAnimations();
    } else if (this.type === 'human' && this.isHunted) {
      this.humanHuntedAnimations();
    } else if (this.type === 'human' && !this.isHunted) {
      this.humanHunterAnimations();
    }

    this.game.physics.enable(this.player, window.Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(function() {
      console.log('out of bounds');
    });
  }

  werewolfAnimations() {
    const werewolfAnims = {
      'left': [0, 9, 18, 27], 'down': [1, 10, 19, 28], 'right': [2, 11, 20, 29],
      'up': [3, 12, 21, 30], 'stop-left': [0], 'stop-down': [1], 'stop-right': [2],
      'stop-up': [3]
    };
    this.addAnimations(werewolfAnims);
  }

  humanHuntedAnimations() {
    const humanHuntAnims = {
      'left': [2], 'down': [1, 15], 'right': [4], 'up': [3, 17], 'stop-left': [2],
      'stop-down': [1], 'stop-right': [4], 'stop-up': [3]
    };
    this.addAnimations(humanHuntAnims);
  }

  humanHunterAnimations() {
    const humanAnims = {
      'left': [6], 'down': [5], 'right': [8], 'up': [7], 'stop-left': [6],
      'stop-down': [5], 'stop-right': [8], 'stop-up': [7]
    };
    this.addAnimations(humanAnims);
  }

  addAnimations(obj) {
    Object.keys(obj).forEach(v => this.player.animations.add(v, obj[v], 10, true));
  }

  showStopAnimations(direction) {
    if (direction === 'right' || direction === 'up-right' || direction === 'down-right') {
      this.player.animations.play('stop-right');
    } else if (direction === 'left' || direction === 'up-left' || direction === 'down-left') {
      this.player.animations.play('stop-left');
    } else if (direction === 'up') {
      this.player.animations.play('stop-up');
    } else if (direction === 'down') {
      this.player.animations.play('stop-down');
    }
  }

  changeHuntedStatus() {
    this.isHunted = !this.isHunted;
  }

  updateId(id) {
    this.id = id;
  }

  setGameIndex(index) {
    this.gameIndex = index;
  }
}
