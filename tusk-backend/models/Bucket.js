const bucketCollection = require("../db").collection("buckets");
const mongodb = require("mongodb");

let Bucket = function (data) {
  this.data = data;
  this.errors = [];
};

Bucket.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      await bucketCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

Bucket.prototype.getAllPosts = function () {
  return new Promise(async (resolve, reject) => {
    await bucketCollection.find({ author: this.data.email }).toArray(function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = Bucket;
