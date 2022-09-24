// const express = require("express");
// const router = express.Router();
import express, {Request, Response} from "express"
const router = express.Router()

const authController = require("../controllers/authController");
// const userController = require("../controllers/userController");

router.post(
  "/signup",
  authController.encryptPassword,
  authController.signup,
  authController.createSession,
  (req: Request, res: Response) => {
    return res.status(200);
  }
);

router.post(
  "/login",
  authController.verifyUser,
  authController.verifyPassword,
  authController.createSession, 
  (req: Request, res: Response) => {
    return res.status(200);
  }
);

module.exports = router;