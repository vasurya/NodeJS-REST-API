// REST API

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view-engine", "ejs");

mongoose.connect("mongodb://localhost/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);
//ALL ARTICLES
app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    console.log(newArticle);

    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("It went well");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: "Deku" }, function (err) {
      if (err) {
        res.send("Error in deletion");
      } else {
        res.send("Deleted Successfully");
      }
    });
  });

// SPECIFIC ARTICLE
app
  .route("/articles/:articleName")
  .get(function (req, res) {
    const articleTitle = req.params.articleName;
    Article.findOne({ title: articleTitle }, function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.update(
      { title: req.params.articleName },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Document updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleName },
      { $set: req.body },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Patched successfully");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleName }, function (err) {
      if (!err) {
        res.send("Deleted Successfully");
      } else {
        res.send(err);
      }
    });
  });
app.listen(3000, function () {
  console.log("Listening on PORT 3000");
});
