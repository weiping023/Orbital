var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
	event_id: String,
	username: String
});

module.exports = mongoose.model('Event', EventSchema);