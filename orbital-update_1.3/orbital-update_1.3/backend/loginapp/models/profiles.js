var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var Todo = new Schema (
{
	user_id: String,
	content: String,
	updated: Date},
	{collection: 'request'}
);

mongoose.model('Todo', Todo);
mongoose.connect( 'mongodb://localhost/loginapp');