var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');

var Event = require('../models/Event'); //database

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
  res.render('index', {layout: false});
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        // Do something?
        return next();
    }
}


module.exports = router;