const express = require("express");
const {
  getUser,
  getUsers,
  login,
  register,
  editProfile,
  getChildren,
  forgotPassword,
  resetPassword,
  getParents,
} = require("../controllers/userController");
const { userAuth, adminAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all users (admin only)
router.get("/user", adminAuth, getUsers);

// Route to get children of the user (authenticated users)
router.get("/user/children", userAuth, getChildren);

// Route to get parents of the user (authenticated users)
router.get("/user/parents", userAuth, getParents);

// Route to get the profile of the authenticated user
router.get("/user/profile", userAuth, getUser);

// Route to register a new user
router.post("/user/register", register);

// Route for user login
router.post("/login", login);

// Route to handle forgot password functionality
router.post("/user/forgotPassword", forgotPassword);

// Route to reset the user's password
router.post("/user/resetPassword", resetPassword);

// Route to edit the profile of the authenticated user
router.put("/user/profile", userAuth, editProfile);

module.exports = router;
