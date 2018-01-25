

var SpacebookApp = function () {

  var posts = [];

  var fetch = function () {
    $.ajax({
      method: "GET",
      url: '/posts',
      success: function (data) {
        console.log(data);
        posts = data;
        _renderPosts();

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };


  var $posts = $(".posts");

  _renderPosts();

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  // function addPost(newPost) {
  //   posts.push({ text: newPost, comments: [] });
  //   _renderPosts();
  // }

  function addPost(newPost) {
    var postObj = { "text": newPost };
    $.ajax({
      method: "POST",
      url: '/posts',
      data: postObj,
      success: function (post) {
        posts.push(post)
        console.log("post added")
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  // posts.push({ text: newPost, comments: [] });
  //  _renderPosts();



  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (index) {
    var postId = posts[index]._id;
    $.ajax({
      method: "DELETE",
      url: '/posts/' + postId,
      success: function (post) {
        console.log(post);
        console.log("post deleted");
        posts.splice(index, 1);
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };



  var addComment = function (newComment, postIndex) {
    var postId = posts[postIndex]._id;
    $.ajax({
      method: "POST",
      url: '/posts/' + postId + '/comments',
      data: newComment,
      success: function (post) {
        console.log(posts);
        // posts[postIndex].comments.push(newComment);
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }

    })
  };


  var deleteComment = function (postIndex, commentIndex) {
    var postId = posts[postIndex]._id;
    var commentId = posts[postIndex].comments[commentIndex]._id;
    console.log(postId);
    console.log(commentId);
    $.ajax({
      method: "DELETE",
      url: '/posts/' + postId + '/comments/' + commentId,  
      success: function (post) {
        console.log("post deleted");
        posts[postIndex].comments.splice(commentIndex, 1);
        _renderComments(postIndex);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };




  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    fetch: fetch
  };
}






var app = SpacebookApp();

app.fetch();

// on click of addpost btn ,extract the input field and send to addpost function.
$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    var newPostText = $input.val()
    app.addPost(newPostText);
    $input.val("");
  }
});

// posts div - where all the posts are inside
var $posts = $(".posts");

// binding remove post btn to posts div. on click of removebtn invoke function removPost
$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();;
  app.removePost(index);
});


// binding "toggle-comments to posts div. on click of comments toggle comments 
$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});


$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});





// add to database 
// 

  // var addToDatabase = function (post) {
  //   $.ajax({
  //     method: "POST",
  //     url: '/posts',
  //     data: post,
  //     success: function(post) {
  //       posts.push(post)
  //       console.log("post added")
  //       _renderPosts();

  //     },
  //     error: function(jqXHR, textStatus, errorThrown) {
  //       console.log(textStatus);
  //     }
  //   }); 
  // };


