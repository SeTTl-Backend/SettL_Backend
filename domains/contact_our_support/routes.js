const express = require("express");
const { ContactOurSupportMW } = require("./validators");
const ContactOurSupportRouter = express.Router();

const contactOurSupportController = require("./controllers");

ContactOurSupportRouter.post(
  "/contact-our-support",
  ContactOurSupportMW,
  contactOurSupportController.contactOurSupport
);

module.exports = ContactOurSupportRouter;
