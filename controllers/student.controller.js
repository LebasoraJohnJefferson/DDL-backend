const {
    User,
    Course,
    UserCredential,
    EventImages,
    Event
  } = require("../models");
  const { Op } = require('sequelize');

exports.createStudent = async (req, res) => {
  try {
    const { email, password,status,courseId } = req.body;
    const emailCheck = await User.findOne({
      where: { email: email },
    });

    const emailValidated = validateEmail(email)

    if(!emailValidated) return res.status(409).json({message:'Invalid Email'})

    if (emailCheck) return res.status(401).json({ message: "Email address already used." });
    const defaultPassword = '12345';
    const trimmedPassword = password ? password.trim() : '';
    let user = await User.create({
      ...req.body,
      password:trimmedPassword || defaultPassword,
      status: status==null || status == '' ? false : status,
      role:"student",
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

exports.getStudent = async (req,res)=>{
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
          [Op.not]:['admin','personnel']
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


exports.updateStudent = async (req,res)=>{
  try{
    const {id} = req.credentials
    const {userId} = req.params;
    const { email, password,status,courseId } = req.body;
    
    const emailValidated = validateEmail(email)

    if(!emailValidated) return res.status(409).json({message:'Invalid Email'})

    const isAdmin = await User.findOne({where:{id:id}}); 

    if(!isAdmin) return res.status(409).json({message:'Unauthorized user!'})

    const isUser = await User.findOne({where:{id:userId}})
    
    if(!isUser) return res.status(404).json({message:'User not found!'})

    const isEmailAlreadyExist = await User.findOne({
      where:{
        email:email,
        id:{
          [Op.not]:userId
        }
      }
    })

    if(isEmailAlreadyExist) return res.status(409).json({message:'Email already used!'})


    const defaultPassword = '12345';
    const trimmedPassword = password ? password.trim() : '';
    let user = await isUser.update({
      ...req.body,
      password:trimmedPassword || defaultPassword,
      status: status==null ? false : status,
      role:"student",
    });

    const userCredential = await UserCredential.findOne({
      where:{
        userId:user.id
      }
    })

    if(userCredential) await userCredential.update({courseId:courseId})

    


    res.status(200).json({message:'Successfully updated'})
  } catch (error) {
    console.log(error);
  }
}


exports.deleteStudent = async(req,res)=>{
  try{
    const {userId} = req.params;
    const isUserExist = await User.findOne({
      where:{
        id:userId
      }
    })

    if(!isUserExist) return res.status(404).json({ message: "Student not found!" });

    isUserExist.destroy()

    res.sendStatus(204)

  } catch (error) {
    console.log(error);
  }
}

exports.importStudent = async(req,res)=>{
  try{
    const students = req.body
    students.map(async(student)=>{
      const {faculty,email,status,...rest} = student

      const isValidEmail = validateEmail(email)
      if(!isValidEmail) return

      const isEmailExist = await User.findOne({
        where:{
          email:email
        }
      })

      if(isEmailExist) return

      let isCourse = await Course.findOne({
        where:{
          acronym:faculty ? faculty?.toUpperCase() : ''
        }
      })

      if(!isCourse) return
      let tempStatus = {
        'INACTIVE':false,
        'ACTIVE':true
      }
      const stat = status ? status.toUpperCase() : ''
      const user = await User.create({
        ...rest,
        status:tempStatus[stat] ? tempStatus[stat]  : false ,
        email:email,
        password:'12345',
        role:'student'
      })

      await UserCredential.create({
        courseId:isCourse?.id,
        userId:user?.id
      })


    })

    res.status(201).send({message:'Successfully imported'})
  } catch (error) {
    console.log(error);
  }
}


exports.getEvent = async (req,res)=>{
  try {
      const events = await Event.findAll({
          include: [
              {model: EventImages},
              {
                  model: User,
                  attributes:{exclude:['password']},
              },
          ],
          where:{
              privacy:{
                [Op.in]:['All','Student']
              }
          },
          order: [['createdAt', 'DESC']]
      })
    res.status(200).json({event:events})
  } catch (error) {
    console.log(error)
  }
}

exports.getSpecificStudent = async (req,res)=>{
  try {
    const { id, email } = req.credentials;
    const user = await User.findOne({
      where: {
        id: id,
        role: "student",
      },
      include: [
        {
          model: UserCredential,
          include: [
            {model: Course},
        ],
        },
      ],
      attributes: ["id", "firstName","middleName","lastName","suffix", "email", "image"],
    });
    
    if (!user) return res.sendStatus(401);

    res.status(200).send({ user: user });

  } catch (error) {
    console.log(error)
  }
}


const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};