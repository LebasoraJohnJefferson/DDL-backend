const {
    Faculty, Course, User, UserCredential,BaelStudentChart
  } = require("../models");
  const { Op } = require('sequelize');

exports.createStudentChart = async (req,res)=>{
    try {
        BaelStudentChart.create(req.body)
        res.status(200).json({message:"Successfully Created!"})
    } catch (error) {
        console.log(error)
    }
}