// Dependencies
// =============================================================
// Including packages for scraping
var cheerio = require("cheerio");
var request = require("request");
// Requiring the `Post` model for accessing the `Posts` collection
var Post = require("../userModel.js");
// Requiring the `Comment` model for accessing the `Comments` collection
var Comment = require("../commentModel.js");
// Routes
// =============================================================
module.exports = function (app) {


  // Routes

  // Route for scraping the latest posts
  app.get("/api/scrape", function (req, res) {

    // Defining data object that I will fill from scraping the page
    let objects = [];
    let data = {
      title: [],
      link: []
    };
    // Make a request call to grab the HTML body from the site of your choice
    request("https://medium.freecodecamp.org/", function (error, response, html) {

      // Load the HTML into cheerio and save it to a variable
      var $ = cheerio.load(html);

      // Select these elements from the html and do something for each one
      $("div.section-inner").each(function (i, element) {
        // Get title for each post
        data.title.push($(element).find("h3").text());


      });

      // Select more elements from the html and do something for each one
      $("div.postArticle-readMore").each(function (i, element) {
        // Get links for each post
        data.link.push($(element).find("a").attr("href"));
      });
      // Organizing the data into several objects instead of two seperate arrays
      for (let i = 0; i < data.title.length; i++) {
        objects.push({
          title: data.title[i],
          link: data.link[i]
        })
      }
      // Saving this data into the database
      for (let i = 0; i < objects.length; i++) {
        // Create a new user using req.body
        let post = new Post(objects[i]);

        Post.create(post)
          .then(function (dbUser) {
            // If saved successfully, send the the new User document to the client
            // res.json(dbUser);
          })
          .catch(function (err) {
            // If an error occurs, send the error to the client
            res.json(err);
          });
      }
      // Responding to client with data
      res.json(objects);
    });

  });

  // Route for getting scraped data from the database
  app.get("/api/data", function (req, res) {
    Post.find(function (err, posts) {
      if (err) return console.error(err);
      res.send(posts);
    })
  });

  // Route for getting only Saved Articles
  app.get("/api/saved", function (req, res) {
    Post.find({ saved: true }, function (err, post) {
      if (err) return console.error(err);
      res.send(post);
    })
  });

  // Route to find post by id
  app.get("/api/:id", function (req, res) {
    Post.find({ _id: req.params.id }, function (err, post) {
      if (err) return console.error(err);
      res.send(post);
    })
  });

  // Route to change post to saved
  app.post("/api/saved/:id", function (req, res) {
    Post.findByIdAndUpdate(req.params.id, { $set: { saved: true } }, function (err, post) {
      if (err) return console.error(err);
      res.send(post);
    })
  });

  // Route to change post to unsaved
  app.post("/api/unsaved/:id", function (req, res) {
    Post.findByIdAndUpdate(req.params.id, { $set: { saved: false } }, function (err, post) {
      if (err) return console.error(err);
      res.send(post);
    })
  });

  // Route to add comment to post
  app.post("/api/addcomment", function (req, res) {

    // Create a new user using req.body
    let comment = new Comment(req.body);

    Comment.create(comment)
      .then(function (dbComment) {
        // If saved successfully, send the the new User document to the client
        res.json(dbComment);
      })
      .catch(function (err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });

  });

  // Route to delete comment from post
  app.delete("/api/deletecomment/:id", function (req, res) {
    Comment.findByIdAndDelete(req.params.id, function (err, post) {
      if (err) return console.error(err);
      res.send(post);
    })
  });

  // Route to find all comments for a particular article
  app.get("/api/comments/:id", function (req, res) {
    Comment.find({ article: req.params.id }, function (err, comment) {
      if (err) return console.error(err);
      res.send(comment);
    })
  });

};