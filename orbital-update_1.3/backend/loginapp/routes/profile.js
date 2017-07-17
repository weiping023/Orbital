var express = require('express');
var router = express.Router();
var fs = require('fs');

var Profile = require('../models/Event');

var event_data;

fs.readFile('../loginapp/events_data.out', 'utf8', function(err, data) {
	if(err) throw err;
	event_data = JSON.parse(data);
})

router.get('/', isLoggedIn, function(req, res){
	res.render('profile', { data: event_data });
});


function isLoggedIn(req, res, next){
	if (req.isAuthenticated())
		return next();

	res.redirect('/users/login');
}



module.exports = router;