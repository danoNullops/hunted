const routes = require('express').Router();
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./models/User.js');
const Game = require('./models/Game.js');

require('./config/passportConfig.js')(passport);

const isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

module.exports = (games) => {

  routes.get('/api/games', (req, res) => {
    res.json(games.gameStore);
  });

  routes.get('/api/gameWithPlayer', isLoggedIn, (req, res) => {
    let results = false;

    games.gameStore.forEach(game => {
      if (game.players.length === 1) {
        console.log('GAME PLAYERS: ', game.players);
        results = game.players;
      }
    });

    if (results) {
      res.json(results);
    } else {
      res.send(results);
    }
    // if (req.params.isNewPlayer === 'true' && playerInstance.players.length >= 2) {
    //   playerInstance.clearPlayers();
    // }
    // res.json(playerInstance.players);
  });

  routes.get('/api/users', isLoggedIn, (req, res) => { //test route to retrieve all user data
    User.find().exec(function(err, users){
      res.send(users);
    });
  });

  routes.get('/api/games', isLoggedIn, (req, res) => { //test route to retrieve all game data
    Game.find().exec((err, games) => {
      res.send(games);
    });
  });

  routes.get('/api/scores', isLoggedIn, (req, res) => {
    console.log(req.session.passport.user);
    User.find({ '_id': req.session.passport.user }).exec((err, user) => {
      const { name, email } = user[0];
      Game
        .find({ 'player_id': req.session.passport.user })
        .sort({ 'player_score': -1 })
        .exec((err, games) => {
          const gamesWithName = games.map(game => {
            const { player_type, player_score, player_won } = game;
            return { name, email, player_type, player_score, player_won };
          });
          res.json(gamesWithName);
        });
    });
  });

  routes.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email']})); //route to obtain google profile data

  routes.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
      console.log('req session passport user ------------', req.session.passport.user);
      req.session.user = req.session.passport.user;
      res.cookie('loggedIn', true);
      res.redirect('/');
    });

  routes.get('/logout', function(req, res) {
    console.log('req session before destroy', req.session);
    req.session.destroy(function(e){
      req.logout();
      console.log('wrequed session..... ', req.session);
      res.clearCookie('loggedIn');
      res.redirect('/');
    });
  });

  routes.post('/api/gameover', isLoggedIn, (req, res) => {
    var date = new Date();
    var playerObj = req.body;
    var playerID;
    if (req.user && req.user._id) {
      playerID = req.user._id;
    }
    var newGame = new Game({
      player_id: playerID,
      player_type: playerObj.type,
      player_score: playerObj.score,
      player_won: playerObj.won,
      date: date
    }).save((err, game) => {
      if (err) {
        console.log(err);
      }
      if (game) {
        console.log('----- game saved! ---- ', game);
        return game;
      }
    });
  });

  if (process.env.NODE_ENV === 'production') {
    routes.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
    });
  }

  return routes;

};

// module.exports = routes;
