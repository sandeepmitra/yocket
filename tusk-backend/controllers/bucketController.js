const Bucket = require("../models/Bucket");

exports.createbucket = function (req, res) {
  bucket = new Bucket(req.body);
  bucket
    .create()
    .then(() => {
      res.send("Bucket Created");
    })
    .catch(regErrors => {
      res.send(regErrors);
    });
};

exports.getallbuckets = function (req, res) {
  bucket = new Bucket(req.body);
  bucket
    .getAllPosts()
    .then(result => {
      res.send(result);
    })
    .catch(err => console.log(err));
};
