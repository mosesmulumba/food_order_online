import { plainToClass } from "class-transformer";
import express, { Request, Response, NextFunction } from "express";
import { CreateCustomerInput, EditCustomerProfileInputs, UserLoginIputs } from "../dto/Customer.dto";
import { ValidationError, validate } from "class-validator";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  onRequestOtp,
} from "../utility";
import { Customer } from "../models";
import { sign, verify } from "crypto";

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
    // await onRequestOtp(otp, phone);

    // generate the signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to customer
    return res.status(200).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }
};

// the customer should be able to login using this controller
export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginIputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json({ loginErrors });
  }

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      // generate the signature
      const signature = GenerateSignature({
        _id: customer._id,
        verified: customer.verified,
        email: customer.email,
      });

      // send the result to the client
      return res.status(201).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
      });
    }
  }
  return res.status(404).json({ message: "Error in Login" });
};


// the customer can verify whether they are able to login and also receive the otp 
// which is to be passed as the request to verify 
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
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        // generate a new signature
        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        // send the result to customer
        return res.status(201).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: "Error in otp validation" });
};


// the customer can request for the otp Again using this controller
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const customer = req.body;
  if(customer){
    const profile = await Customer.findById(customer._id);
    if(profile){
      const {otp , expiry} = GenerateOtp();
      customer.otp = otp;
      customer.otp_expiry = expiry;

      await profile.save();
      await onRequestOtp(otp, profile.phone);

      res.status(200).json({message: "OTP sent to registered phone number"});
    }
  }
  return res.status(400).json({message: "Error in requesting the OTP"});
};


// fetching the customer profile
export const CustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.body;
  if(customer){
    const profile = await Customer.findById(customer._id);
    // console.log(profile);
    if(profile){
    return res.status(200).json(profile);
    }else {
      return res.status(404).json({ message: "Customer not found" });
    }
  }
  return res.status(400).json({message: "Error fetching the customer profile"});
};


// edit the customer profile
export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.body;

  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs , {validationError: {target: false}});

  if(profileErrors.length > 0){
    return res.status(400).json(profileErrors);
  }

  const {firstName, lastName , address} = profileInputs;
  if(customer){
    const profile = await Customer.findById(customer._id)
    if(profile){

      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();
      res.status(200).json(result);
    }
  }
};
