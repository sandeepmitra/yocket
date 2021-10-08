const userCollection = require("../db").collection("users");
const validator = require("validator");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.passwd != "string") {
    this.data.passwd = "";
  }
  if (typeof this.data.repasswd != "string") {
    this.data.repasswd = "";
  }

  this.data = {
    email: this.data.email.trim().toLowerCase(),
    passwd: this.data.passwd,
    repasswd: this.data.repasswd
  };
};

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.email == "") {
      this.errors.push("Email is Mandetory");
    }
    if (this.data.passwd == "") {
      this.errors.push("Password is Mandetory");
    }
    if (this.data.repasswd == "") {
      this.errors.push("Repete Password is Mandetory");
    }

    if (this.data.email != "") {
      let emailExists = await userCollection.findOne({ email: this.data.email });
      //console.log("email check", emailExists);
      if (emailExists) {
        this.errors.push("This email is already registered");
      }
    }

    if (this.data.passwd !== this.data.repasswd) {
      this.errors.push("Password and repete password did not match !");
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("Please enter a valid email !");
    }
    resolve();
  });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();

    if (!this.errors.length) {
      await userCollection.insertOne(this.data);
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    userCollection
      .findOne({ email: this.data.email })
      .then(attemptedUser => {
        if (attemptedUser && attemptedUser.passwd == this.data.passwd) {
          resolve("user found");
        } else {
          reject("Invalid username / password");
        }
      })
      .catch(err => reject("Please try gain later"));
  });
};

module.exports = User;
