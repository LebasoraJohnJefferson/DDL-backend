const {
    File
  } = require("../models");
  const { Op } = require('sequelize');
  const { cloudinary } = require("../utils/cloudinary");


  exports.uploadFile = async (req,res)=>{
    try {
        const {file,fileName} = req.body
        const { id } = req.credentials;

        if(!file || !fileName) return res.status(409).message({message:"Invalid File!"})

        const imgRoute = await cloudinary.uploader.upload(file, {
          resource_type: "raw",
        });
        try {
          await File.create({
              userId:id,
              couldinaryId:imgRoute.public_id,
              fileName:fileName,
              path:imgRoute.secure_url
          })
        } catch (error) {
          res.status(409).json({message:'An error occurred while uploading!'})
        }

        res.status(201).json({message:'Successfully uploaded!'})
    } catch (error) {
        console.log(error)
    }
  }



  exports.getOwnerFile = async (req,res)=>{
    try {
      const { id } = req.credentials;

      const files = await File.findAll({
        where:{
          userId:id
        },
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json({files:files})


    } catch (error) {
      console.log(error)
    }
  }


  exports.deleteFile = async (req,res)=>{
    try {
        const {fileId} = req.params;
        const { id } = req.credentials;

        const file = await File.findOne({
          where:{
            userId:id,
            id:fileId
          }
        })

        if(!file) res.status(404).send({message:"File not found!"})
        
        try {
          const result = await cloudinary.uploader.destroy(file?.couldinaryId, {
            resource_type: "raw",  // Specify the resource type if it is not an image
          });
          if(result?.result == 'not found') return res.status(409).json({message:`Error While deleting`})
        } catch (error) {
          return res.status(409).json({message:`Error deleting file from Cloudinary:, ${error}`});
        }

        file.destroy()

        return res.status(204).send({message:"Successfully deleted!"})

    } catch (error) {
      console.log(error)
    }
  }