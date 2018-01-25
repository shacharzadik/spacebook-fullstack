var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function (error, results) {
    if (error) { return console.log(error) }

    console.log('Connected')
});


//design the two schema below and use sub docs 
//to define the relationship between posts and comments

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    text: String,
    user: String
});


var postSchema = new Schema({
    text: String,
    comments: [commentSchema]

});

var Post = mongoose.model('post', postSchema)


// var post1 = new Post ({
//     text:"Hi everyone!",
//     comments: [{
//         text: "Hey!",
//         user: "Moshe"
//     }]
// })

// post1.save( function(err,res){
//     if (err) {
//         return console.log(err)
//     } console.log(res);
// });

// var post2 = new Post ({
//     text:"Man what a long day!",
//     comments: [{
//         text: "You have no idea!",
//         user: "Eli"
//     }]
// })

// post2.save( function(err,res){
//     if (err) {
//         return console.log(err)
//     } console.log(res);
// });

module.exports = Post


// {
//     text: "hello",
//     comments: [{
//       text: "hi there",
//       user: "me"
//     }]
//  }