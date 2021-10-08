const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://sandman47:Godman47@cluster0.6arj4.mongodb.net/Tusk?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  module.exports = client.db();
  const app = require("./app");
  app.listen(5000);
  //client.close();
});
