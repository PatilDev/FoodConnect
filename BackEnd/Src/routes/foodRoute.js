const express = require("express");
const router = express.Router();
const multer = require("multer");
const foodController = require("../controller/foodController");

// store file in memory (we will put into MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("foodImage"), foodController.addFoodData);
router.get("/", foodController.getFoods);
router.get("/:userId", foodController.getFoodsByUserId);
router.put("/:id", upload.single("foodImage"), foodController.updateFood);
router.delete("/:id", foodController.deleteFood);

module.exports = router;
