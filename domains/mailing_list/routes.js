const express = require("express");
const mailingListRouter = express.Router();
const { MailingListValidationMW } = require("./validators");
const mailingListController = require("./controllers");

mailingListRouter.post(
  "/mailing-list",
  MailingListValidationMW,
  mailingListController.mailingList
);

module.exports = mailingListRouter;
