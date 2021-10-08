const taskCollection = require("../db").collection("tasks");
const mongodb = require("mongodb");

let Task = function (data) {
  this.data = data;
  this.errors = "";
};

Task.prototype.cleanUp = function () {
  if (typeof this.data.taskDesc != "string") {
    this.data.taskDesc = "";
  }
  if (typeof this.data.author != "string") {
    this.data.passwd = "";
  }

  this.data = {
    taskDesc: this.data.taskDesc.trim().toLowerCase(),
    author: this.data.author.trim().toLowerCase(),
    createdDate: this.data.createdDate,
    dueDate: this.dueDate,
    priority: this.priority,
    bucket: this.bucket,
    status: this.status
  };
};

Task.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.taskDesc == "") {
      this.errors.push("Task Description is Mandetory");
    }
    if (this.data.author == "") {
      this.errors.push("Author is Mandetory");
    }

    resolve();
  });
};

Task.prototype.post = function () {
  return new Promise(async (resolve, reject) => {
    //this.cleanUp();
    //await this.validate();

    if (!this.errors.length) {
      await taskCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

Task.prototype.getAllPosts = function () {
  return new Promise(async (resolve, reject) => {
    await taskCollection.find({ author: this.data.email }).toArray(function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

Task.prototype.deltask = function () {
  return new Promise(async (resolve, reject) => {
    try {
      await taskCollection.deleteOne({ _id: new mongodb.ObjectId(this.data.id) });
      resolve("Post Deleted");
    } catch {
      reject("DB error");
    }
  });
};

Task.prototype.updatetask = function () {
  let newvalues = {
    $set: {
      taskDesc: this.data.taskDesc,
      author: this.data.author,
      createdDate: this.data.createdDate,
      dueDate: this.data.dueDate,
      priority: this.data.priority,
      bucket: this.data.bucket,
      status: this.data.status
    }
  };
  return new Promise(async (resolve, reject) => {
    try {
      await taskCollection.updateOne({ _id: new mongodb.ObjectId(this.data._id) }, newvalues);
      resolve("Post Updated");
    } catch {
      reject("DB error");
    }
  });
};

module.exports = Task;
