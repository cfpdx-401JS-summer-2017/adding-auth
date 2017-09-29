const User = require("../../lib/models/User");
const Car = require("../../lib/models/Car");
const { assert } = require("chai");

const expectedValidation = () => {
  throw new Error("expected validation errors");
};



// check validity of user and car models