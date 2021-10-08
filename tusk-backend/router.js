const express = require("express");
const cors = require("cors");
const userController = require("./controllers/userController");
const taskController = require("./controllers/taskController");
const bucketController = require("./controllers/bucketController");
// const productsController = require("./controllers/productsController");
const router = express.Router();

router.use(cors());

// router.get("/", function (req, res) {
//   res.send("TUSK API Backend Running ...");
// });

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/addtask", taskController.addtask);
router.post("/getalltasks", taskController.getalltasks);
router.post("/deltask", taskController.deltask);
router.post("/updatetask", taskController.updatetask);
router.post("/createbucket", bucketController.createbucket);
router.post("/getallbuckets", bucketController.getallbuckets);

module.exports = router;
