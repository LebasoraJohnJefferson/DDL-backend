const {
    User,
    Course,
    UserCredential
  } = require("../models");
  const { Op } = require('sequelize');

exports.createPersonnel = async (req, res) => {
  try {
    const { email, password,status,courseId } = req.body;
    const emailCheck = await User.findOne({
      where: { email: email },
    });

    if (emailCheck) return res.status(401).json({ message: "Email address already used." });
    const defaultPassword = '12345';
    const trimmedPassword = password ? password.trim() : '';
    let user = await User.create({
      ...req.body,
      password:trimmedPassword || defaultPassword,
      status: status==null ? false : status,
      role:"personnel",
    });

    await UserCredential.create({
      courseId:courseId,
      userId:user.id
    })

    res.status(201).json({message: "Account Created"})
  } catch (error) {
    console.log(error);
  }
};

exports.getPersonnel = async (req,res)=>{
  try{
    const users= await User.findAll({
      include: [
        {
          model: UserCredential, 
          include: [Course],
        },
      ],
      where:{
        isDeleted:false,
        role:{
          [Op.not]:'admin'
        }
      },
      attributes:{exclude:['password']},
      order: [['createdAt', 'DESC']]
    })
    res.status(200).json({users:users})
  } catch (error) {
    console.log(error);
  }
}


exports.deletePersonnel = async(req,res)=>{
  try{
    const {userId} = req.params;
    const isUserExist = await User.findOne({
      where:{
        id:userId
      }
    })

    if(!isUserExist) return res.status(404).json({ message: "Personnel not found!" });

    isUserExist.destroy()

    res.sendStatus(204)

  } catch (error) {
    console.log(error);
  }
}