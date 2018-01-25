

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


mongoose.connect(process.env.CONNECTION_STRING||'mongodb://<dbuser>:<dbpassword>@ds213688.mlab.com:13688/spacebook');

// mongoose.connect('mongodb://localhost/spacebookDB', function() {
//   console.log("DB connection established!!!");
// })

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:


// 1) to handle getting all posts and their comments

app.get('/posts', function (req, res) {
  Post.find(function (error, result){
  if(error) throw error;
  // console.log (result);
  res.send(result);
});
})

// // 2) to handle adding a post
// app.post('/posts', function (req, res) {
//   Post.find(function (error, result){
//   if(error) throw error;
//   console.log (result);
//   res.send(result);
// });
// })

// app.post('/posts', function (req, res) {
// // create new post
//   console.log(req.body);
//   var post = new Post(req.body);
//   console.log(req.body.text);
//   post.save()
//     console.log("item saved to DB");
//     console.log(req ,res)
//     res.send(res);
//   // Post.find(function (error, result){
//   if(error) throw error;
//   console.log (res);
//   // res.send(result);
// });

app.post('/posts', function(req, res) {
  var newPost = new Post(req.body);
  console.log(newPost);
  newPost.save(function(error, data){
    if(error) throw error; 
  res.send(data);
  });
});


// 3) to handle deleting a post

app.delete('/posts/:id', function(req,res){
  var id = req.params.id;
  Post.findByIdAndRemove({_id:id},
    function(err, data){
      if(err) throw err; 
      else 
      console.log('Post deleted!');
      res.send(data);
  });
});
// 4) to handle adding a comment to a post
app.post('/posts/:id/comments', function(req,res){
  //find post by id
  var id = req.params.id;
  console.log(id);
        var comment = req.body; 
        Post.findByIdAndUpdate({_id:id}, {$push:{comments: comment}}, {new: true}, function(err, data) {
           
          if (err) throw error;
          res.send(data);
        }
      )
                        
  });

// 5) to handle deleting a comment from a post

  app.delete('/posts/:id/comments/:commentId', function(req,res){
    console.log(req.body);
    console.log(req.params.id); // post id
    console.log(req.params.commentId);  //commentId 
    var removeCommentId = req.params.commentId;
    console.log({_id:removeCommentId});
    Post.findById((req.params.id), // find post by Id // you can work with findById only with Models
      function(err, data){  // data = post 
        if(err) throw err; 
        else 
        // loop through post with ragular JS, and find comment to remove.
        console.log(data);
        console.log(data.comments.length);
        for (var i=0; i<data.comments.length; i++) {
          console.log(data.comments[i]);
          console.log(data.comments[i]._id);
            if (data.comments[i]._id===removeCommentId) {
              delete data.comments[i];
              console.log('comment deleted!');
              data.save( function(err,res){
                if (err) {
                    return console.log(err)
                } console.log(res);
            });
            res.send(data);
            }   
        }
      //    data.save( function(err,res){
      //     if (err) {
      //         return console.log(err)
      //     } console.log(res);
      // });
        //post.save();
        //  res.send(data);
    });
  });

//find post by Id
// find comment inside the comments array - dlete

//to retrieve a comment that has a specific _id from aPost
//var aComment = aPost.comments.id(_id);

// //to remove a comment with a specific _id from aPost
// aPost.comments.id(_id).remove();

// findByIdAndUpdate

// //  var commentText = req.body.text;
//  Post.comments.push(req.body);
//  Post.save(function(error, data){
//  if(error) throw error; 
//  res.send(data);
//  });





// app.listen(8000, function() {
//   console.log("what do you want from me! get me on 8000 ;-)");
// });

// app.listen(process.env.PORT || '8080', function() {
//   console.log("what do you want from me! get me on 8080 ;-)");
// });



app.listen(process.env.PORT || '8080');