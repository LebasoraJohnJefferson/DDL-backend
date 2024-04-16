const cron = require("node-cron");
const moment = require("moment"); // Import the 'moment' library for date manipulation
const { Op, fn, col, where } = require("sequelize");
const { User } = require("../models");

const PH_TIMEZONE = "Asia/Manila";




cron.schedule(
  "0 55 9 * * *",
  async () => {
    // uncomment this to run everysec
    // cron.schedule(
    //   "*/1 * * * * *",
    //   async () => {
    const today = new Date();

    yearlyNotice(today);
    accountDeletionReminder();
    accountDeletion();
  },
  {
    scheduled: true,
    timezone: PH_TIMEZONE,
  }
);