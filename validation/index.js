const { body } = require("express-validator");

exports.userValidator = [
  body("name").notEmpty().withMessage("Enter name"),
  body("username").notEmpty().withMessage("Enter username"),
  body("password").notEmpty().withMessage("Enter password"),
  body("email").isEmail().withMessage("Enter email"),
];
