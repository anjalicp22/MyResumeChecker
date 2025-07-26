//server\routes\applicationRoutes.js
const express = require("express");
const router = express.Router();
const {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController.js");
const { protect } = require("../middleware/authMiddleware.js");

router
  .route("/")
  .get(protect, getApplications)
  .post(protect, createApplication);
router
  .route("/:id")
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

module.exports = router;
