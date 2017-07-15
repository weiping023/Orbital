var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var Schema = mongoose.Schema;

var Event = require('../models/Event'); //database

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

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
        res.render('index', {items: doc});
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

  res.redirect('/');
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