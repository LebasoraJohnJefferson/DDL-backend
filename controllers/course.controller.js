const {
    Course,
  } = require("../models");


exports.getCourse = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.status(200).json({courses:courses})
    } catch (error) {
        console.log(error);
    }
};