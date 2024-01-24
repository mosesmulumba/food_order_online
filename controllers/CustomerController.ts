import { plainToClass } from "class-transformer";
import express, { Request, Response, NextFunction } from "express";
import { CreateCustomerInput } from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOtp,
} from "../utility";
import { Customer } from "../models";
import { sign } from "crypto";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInput, req.body);

  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const existingCustomer = await Customer.findOne({ email: email });
  if (existingCustomer !== null) {
    return res
      .status(500)
      .json({ message: "Customer with the same email already exists" });
  }

  const { otp, expiry } = GenerateOtp();
  console.log(otp, expiry);

  const result = await Customer.create({
    email: email,
    password: userPassword,
    firstName: "",
    lastName: "",
    phone: phone,
    salt: salt,
    otp: otp,
    otp_expiry: expiry,
    lng: 0,
    lat: 0,
    address: "",
    verified: false,
  });

  if (result) {
    // send the OTP to customer
    await onRequestOtp(otp, phone);

    // generate the signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to customer
    return res
      .status(200)
      .json({
        signature: signature,
        verified: result.verified,
        email: result.email,
      });
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;
  if (customer) {

    const profile = await Customer.findById(customer._id);
    console.log(profile);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){

        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        // generate a new signature
        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        // send the result to customer
        return res
          .status(201)
          .json({
            signature: signature,
            verified: updatedCustomerResponse.verified,
            email: updatedCustomerResponse.email
          });
      }
    }
  }
  return res.status(400).json({message: "Error in otp validation"});
};


export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};



export const CustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};


export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
