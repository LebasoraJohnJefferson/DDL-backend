const {
    Faculty, Course, User, UserCredential
  } = require("../models");
  const { Op } = require('sequelize');



  exports.getUnassignedFacultyMember = async (req,res)=>{
    try{
      const users= await User.findAll({
        include: [
          {
            model: UserCredential, 
            include: [Course],
          },
          {
            model: Faculty,
          }
        ],
        where:{
          isDeleted:false,
          role:{
            [Op.not]:['admin','student'],
          },
          '$Faculty.id$': { [Op.is]: null }
        },
        attributes:{exclude:['password']},
        order: [['createdAt', 'DESC']]
      })
      res.status(200).json({users:users})
    }catch(e){
        console.log(e);
    }
  }


  exports.postFaculty =  async (req,res)=>{
    const {userId} = req.body;

    const isAlreadyAssigned = await Faculty.findOne({
      where:{
        userId:userId
      }
    })

    if(isAlreadyAssigned) return res.status(409).json({message:"User already assigned!"})
    
    await Faculty.create(req.body)
    res.status(201).json({message:'Successfully Created!'})
    try{
    }catch(e){
        console.log(e);
    }
}