const Task = require("../models/Task");

exports.addtask = function (req, res) {
  task = new Task(req.body);
  //console.log("tast body", req.body);
  task
    .post()
    .then(() => {
      res.send("Task Added");
    })
    .catch(regErrors => {
      res.send(regErrors);
    });
};

exports.getalltasks = function (req, res) {
  task = new Task(req.body);

  task
    .getAllPosts()
    .then(result => {
      res.send(result);
    })
    .catch(err => console.log(err));
};

exports.deltask = function (req, res) {
  task = new Task(req.body);

  task
    .deltask()
    .then(result => {
      res.send(result);
    })
    .catch(err => console.log(err));
};

exports.updatetask = function (req, res) {
  task = new Task(req.body);

  task
    .updatetask()
    .then(result => {
      res.send(result);
    })
    .catch(err => console.log(err));
};
