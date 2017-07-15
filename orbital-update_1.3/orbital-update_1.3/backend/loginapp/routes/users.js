var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../models/user'); //database

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

// Account page
router.get('/', ensureAuthenticated, function(req, res){
  res.render('account');
});

// Register
router.get('/register', function(req, res){
    res.render('register');
});

// Login
router.get('/login', function(req, res){
    res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/users', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

// Event maintenance functions
var userDataSchema = new Schema({
  name: {type: String, required: true},
  org: String,
  content: String,
  date: String
}, {collection: 'request'});

var UserData = mongoose.model('UserData', userDataSchema);


router.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('account', {items: doc});
      });
});

router.post('/new', function(req, res, next) {
  var item = {
    name: req.body.name,
    org: req.body.org,
    content: req.body.eventDetails,
    date: req.body.date
  };

  var data = new UserData(item);
  data.save();

  res.redirect('/users');
});

//Insert new marked event
router.post('/profile/markEvent', function(req, res, next) {

  var markedEvent = new Event();
  markedEvent.event_id = req.body.event_id;
  markedEvent.username = req.user.username;

  markedEvent.save();
  res.redirect('/profile');
});


module.exports = router;