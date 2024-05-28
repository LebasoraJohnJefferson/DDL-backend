const {
    
  } = require("../models");
  const { Op } = require('sequelize');



  exports.uploadFile = async (req,res)=>{
    try {
        res.status(201).json({message:'Successfully uploaded!'})
    } catch (error) {
        console.log(error)
    }
  }