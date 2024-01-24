import express from "express";
import {
  CustomerLogin,
  CustomerProfile,
  CustomerSignup,
  CustomerVerify,
  EditCustomerProfile,
  RequestOtp,
} from "../controllers/CustomerController";

const router = express.Router();

// signup customer
router.post("/sign-up", CustomerSignup);

// login customer
router.post("/login", CustomerLogin);

// verifyig the customer
router.patch("/verify", CustomerVerify);

// Requesting OTP
router.get("/otp", RequestOtp);

// get the profile for the customer
router.get("/profile", CustomerProfile);

// eddit the profile for the customer
router.patch("/edit-profile", EditCustomerProfile);

export { router as CustomerRoute };
