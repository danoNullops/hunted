// require dependencies
const mongoose = require('mongoose');
const db = require('./config/db.js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// setup express, http, and socket.io
const express = require('express');
const app = express();
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Games = require('./Games');
const Players = require('./Players');
const games = new Games();
// const playerInstance = new Players();
// const routes = require('./routes')(playerInstance);
const routes = require('./routes')(games);

var playerID;

// connect to mongoDB
mongoose.connect(db.url, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to mongoDB');
  }
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
});

// set up express app to use passport
require('./config/passportConfig.js')(passport); //does this need to be above the mongodb connection?
// the above require statement passes in 'passport' for configuration
app.use(cookieParser());
app.use(session({ secret: 'howlatthemoon' }));
app.use(passport.initialize());
app.use(passport.session());

// set up middleware
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '..', 'build')));
}

app.use('/', routes);

io.on('connection', client => {
  client.on('new player', function(data) {
    let players, player, gameIndex;
    if (!games.gameStore.length) {
      players = new Players();
      gameIndex = games.addGame(players);
      players.setGameIndex(gameIndex);
    } else {
      let openGame = false;
      games.gameStore.forEach(game => {
        if (game.players.length === 1) {
          players = game;
          this.emit('new enemy', players.players[0]);
          players.setGameIndex(gameIndex);
          openGame = true;
        }
      });
      if (!openGame) {
        players = new Players();
        gameIndex = games.addGame(players);
        players.setGameIndex(gameIndex);
      }
    }
    player = players.addPlayer(data);
    this.emit('new player added', player);
    this.broadcast.emit('new enemy', player);

    // if (playerInstance.players.length >= 2) {
    //   playerInstance.clearPlayers();
    // } else if (playerInstance.players.length === 1) {
    //   this.emit('new enemy', playerInstance.players[0]);
    // }
    // let newPlayer = playerInstance.addPlayer(data);
    // this.emit('new player added', newPlayer);
    // this.broadcast.emit('new enemy', newPlayer);
  });

  client.on('disconnect', function(data) {

    if (data.gameIndex) {
      games.gameStore[data.gameIndex].removePlayerById(this.id);
    } else {
      games.gameStore.forEach(game => {
        game.players.forEach(player => {
          if (player.id === this.id) {
            game.removePlayerById(this.id);
          }
        });
      });
    }
    // playerInstance.removePlayerById(this.id);
    console.log('disconnected');
  });

  client.on('eat', function(data) {
    console.log("something was eaten", data);
    if (data.gameIndex) {
      games.gameStore[data.gameIndex].updatePlayerScore(data);
      // playerInstance.updatePlayerScore(data);
      this.broadcast.emit('eat', data);
    }
  });

  client.on('forge', function(data) {
    console.log("somthing was forged", data);
    if (data.gameIndex) {
      games.gameStore[data.gameIndex].updatePlayerScore(data);
      // playerInstance.updatePlayerScore(data);
      this.broadcast.emit('forge', data);
    }
  });

  client.on('move', function(data) {
    if (data.gameIndex) {
      const game = games.gameStore[data.gameIndex];
      const updatedObj = game.updatePlayers(data);
      const killed = game.detectPlayersCollision();
      // var updatedObj = playerInstance.updatePlayers(data);
      // var killed = playerInstance.detectPlayersCollision();
      this.broadcast.emit('move', updatedObj);
      if (killed) {
        const winner = game.getWinner();
        const loser = game.getLoser();
        // var winner = playerInstance.getWinner(playerInstance.players);
        // var loser = playerInstance.getLoser(playerInstance.players);
        io.emit('winner', winner);
        io.emit('loser', loser);
        game.clearPlayers();
        // playerInstance.clearPlayers();
        io.emit('player killed');
      }
    }
  });

  client.on('switch', function(data) {
    if (data.gameIndex) {
      const game = games.gameStore[data.gameIndex];
      game.reverseIsHunted();
      // playerInstance.reverseIsHunted();
      console.log('player array after switch.....', game.players);
      // console.log('player array after switch.....', playerInstance.players);
      this.emit('switch');
      this.broadcast.emit('switch');
    }
  })
});

module.exports = server;
