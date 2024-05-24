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
    res.status(201).json({message: "test"})
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