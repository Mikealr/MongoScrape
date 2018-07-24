var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new PostSchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({

	comment: {
		type: String,
		trim: true,
		required: "comment is Required"
	},
	article: {
		type: String,
		trim: true,
		required: "Article is Required"
	}

});


// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;