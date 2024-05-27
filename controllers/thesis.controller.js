const {
    Thesis,
    Course,
    User
  } = require("../models");
  const { Op } = require('sequelize');
  const { cloudinary } = require("../utils/cloudinary");



exports.createThesis = async (req, res) => {
  try {
    const {courseId,adviser,title,coverPhoto} = req.body
    const isCourseExist = await Course.findOne({
      where:{
        id:courseId
      }
    })
    if(!isCourseExist) return res.status(404).send({message:"Program doesnt exist"})
    const isUserExist = await User.findOne({
      where:{id:adviser}
    })
    if(!isUserExist) return res.status(404).send({message:"Program doesnt exist"})
    
      const isThesisTitleExist = await Thesis.findOne({
        where:{
          title:title
        }
      })
    if(isThesisTitleExist) return res.status(409).send({message:"Thesis already Exist"})
        
    let imgRoute =''
    if (coverPhoto && coverPhoto.length > 0) {
      try{
          if(!coverPhoto.trim()) return
          imgRoute = await cloudinary.uploader.upload(coverPhoto);
      }catch(e){
          console.log(e)
      }
    }

    
    await Thesis.create({...req.body,coverPhoto:imgRoute?.secure_url})
    res.status(201).json({message: "Successfully created!"})
  } catch (error) {
    console.log(error);
  }
};

exports.getThesis = async (req,res)=>{
  try{
    
    const thesis= await Thesis.findAll({
      include: [
        {
          model: Course, 
        },
        {
          model: User, 
          attributes:{exclude:['password']},
        },
      ],
    })

    res.status(200).json({thesis:thesis})
  } catch (error) {
    console.log(error);
  }
}

exports.deleteThesis = async(req,res)=>{
  try{
    const {thesisId} = req.params;
    const isThesisExist = await Thesis.findOne({
      where:{
        id:thesisId
      }
    })

    if(!isThesisExist) return res.status(404).json({ message: "Personnel not found!" });

    isThesisExist.destroy()

    res.sendStatus(204)

  } catch (error) {
    console.log(error);
  }
}


exports.updateThesis = async(req,res)=>{
  try{
    const {thesisId} = req.params;

    const {courseId,adviser,title,coverPhoto} = req.body


    const isCourseExist = await Course.findOne({
      where:{
        id:courseId
      }
    })

    if(!isCourseExist) return res.status(404).send({message:"Program doesnt exist"})

    const isAdviserExist = await User.findOne({
      where:{id:adviser}
    })
    if(!isAdviserExist) return res.status(404).send({message:"Program doesnt exist"})
    
    const isThesisTitleExist = await Thesis.findOne({
      where:{
        title:title,
        id:{
          [Op.not]:thesisId
        }
      }
    })

    
    if(isThesisTitleExist) return res.status(409).send({message:"Thesis already Exist"})
        
    let imgRoute =''
    if (coverPhoto && coverPhoto.length > 0) {
      try{
          if(!coverPhoto.trim()) return
          imgRoute = await cloudinary.uploader.upload(coverPhoto);
      }catch(e){
          console.log(e)
      }
    }


    const isThesisExist = await Thesis.findOne({
      where:{
        id:thesisId
      }
    })


    if(!isThesisExist) return res.status(404).json({ message: "Thesis not found!" });
    const imgUrl = imgRoute ? imgRoute.secure_url : isThesisExist?.coverPhoto
    await isThesisExist.update({...req.body,coverPhoto:imgUrl})


    res.status(200).json({message:'Successfully updated!'})

  } catch (error) {
    console.log(error);
  }
}


exports.importThesis = async(req,res)=>{
  try{
    const thesis = req.body

    const users = await User.findAll({
      attributes: ['firstName','lastName','id'],
      where:{
        role:'personnel'
      }
    });


    const importPromises = thesis.map(async (books) => {
      const {adviser,course,title,authors,years,abstract} = books
      const isCourseExist = await Course.findOne({
        where:{
          acronym:course ? course?.toUpperCase() :''
        }
      })

      const isTitleExist = await Thesis.findOne({
        where:{
          title:title
        }
      })
      
      if(isTitleExist) return

      if(!isCourseExist) return

      const userId = users.map((user)=>{
        if(adviser.includes(user?.firstName) && adviser.includes(user?.lastName)) return user?.id
      })

      if(!userId) return

      await Thesis.create({...books,courseId:isCourseExist?.id,adviser:userId})
    })

    await Promise.all(importPromises);

    res.status(201).send({message:'Successfully imported'})
  } catch (error) {
    console.log(error);
  }
}

exports.getSpecificThesis = async (req,res)=>{
  try {
    const {thesisId} = req.params;
    const thesis = await Thesis.findOne({
      where:{
        id:thesisId
      },
      include: [
        {
          model: Course, 
        },
        {
          model: User, 
          attributes:{exclude:['password']},
        },
      ],
    })

    if(!thesis) return res.status(404).json({message:"Thesis not found!"})


    res.status(200).json({
      thesis:thesis
    })
  } catch (error) {
    console.log(error)
  }
}