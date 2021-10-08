const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = function (req, res) {
  user = new User(req.body);

  user
    .register()
    .then(() => {
      res.status(200).send("User Registered");
    })
    .catch(regErrors => {
      res.status(201).send(regErrors);
    });
  //   if (user.errors.length) {
  //     res.send(user.errors);
  //   } else {
  //     res.send("No errors .. ");
  //   }
};

exports.login = function (req, res) {
  user = new User(req.body);
  let token = jwt.sign({ email: user.data.email }, "jwtse3423cretfsfhhss443", { expiresIn: "1d" });
  //console.log(token);
  user
    .login()
    .then(result => {
      //res.send(result);
      res.json(token);
    })
    .catch(err => res.send(err));
};

exports.logout = function () {};
