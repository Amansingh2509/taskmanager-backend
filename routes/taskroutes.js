const express = require("express");
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskcontroller");
const auth = require("../middleware/authmiddleware");
const router = express.Router();

router.get("/", auth, getTasks);
router.post("/", auth, addTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
