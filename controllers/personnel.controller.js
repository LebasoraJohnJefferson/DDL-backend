const {
    User,
    Course,
    UserCredential,
    EventImages,
    Event,
    SharedFile,
    File
  } = require("../models");
  const { Op } = require('sequelize');

exports.createPersonnel = async (req, res) => {
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
      status: status==null || status=='' ? false : status,
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


exports.getSpecificPersonnel = async (req,res)=>{
  try {
    const { id, email } = req.credentials;
    const user = await User.findOne({
      where: {
        id: id,
        role: "personnel",
      },
      attributes: ["id","role", "firstName","middleName","lastName","suffix", "email", "image"],
    });
    
    if (!user) return res.sendStatus(401);

    res.status(200).send({ user: user });

  } catch (error) {
    console.log(error)
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
                [Op.in]:['All','Teacher']
              }
          },
          order: [['createdAt', 'DESC']]
      })
    res.status(200).json({event:events})
  } catch (error) {
    console.log(error)
  }
}


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
          [Op.not]:['admin','student'],
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


exports.updatePersonnel = async (req,res)=>{
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
      role:"personnel",
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

exports.importPersonnel = async(req,res)=>{
  try{
    const personnels = req.body
    personnels.map(async(personnel)=>{
      const {faculty,email,status,...rest} = personnel

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
        role:'personnel'
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


exports.getCoWorker = async(req,res)=>{
  try {
    const { id } = req.credentials;
    const {fileId} = req.params;

    const sharedFileUsers = await SharedFile.findAll({
      attributes: ['shareTo'],
      where: {
        fileId: fileId, // Specify the fileId you are concerned with
      },
      raw: true,
    });

    const sharedUserIds = sharedFileUsers.map(sharedFile => sharedFile.shareTo);


    const users = await User.findAll({
      include:[{
        model:SharedFile
      }],
      where: {
        id:{
          [Op.notIn]: sharedUserIds, 
          [Op.not]: id,
        },
        role: "personnel",
      },
      attributes: ["id","role", "firstName","middleName","lastName","suffix", "email", "image"],
    });

    res.status(200).send({ users: users });

  } catch (error) {
    console.log(error)
  }
}


exports.sharedFile = async(req,res)=>{
  try {

    const {fileId,shareTo} = req.body
    const { id } = req.credentials;
    
    if(fileId == id) return res.status(409).json({message:"File Can't assigned to yourself!"})

    const isPersonnelExist = await User.findOne({
      where:{
        id:shareTo
      }
    })

    if(!isPersonnelExist) return res.status(404).json({message:"Co-work doens't exist!"})

    const isFileExist = await File.findOne({
      where:{
        id:fileId
      }
    })

    if(!isFileExist) return res.status(404).json({message:"File not found!"})

    const isAlreadyInvited = await SharedFile.findOne({
      where:{
        fileId:fileId,
        shareTo:shareTo
      }
    })

    if(isAlreadyInvited) return res.status(404).json({message:"Co-work already invited!"})

    await SharedFile.create({...req.body})

    res.status(201).json({message:'Successfully invated!'})
  } catch (error) {
    console.log(error)
  }
}

exports.getInviteCoWorker = async(req,res)=>{
  try {
    const {fileId} = req.params;

    const invitedUser = await SharedFile.findAll({
      include:[
        {
          model: User,
          attributes:{exclude:['password']},
        },
      ],
      where:{
        fileId:fileId
      }
    })

    res.status(200).json({users:invitedUser})


  } catch (error) {
    console.log(error)
  }
}

exports.removeInvitation = async(req,res)=>{
  try {
    const {invitationId} = req.params;

    const isInvitationExist = await SharedFile.findOne({
      where:{
        id:invitationId
      }
    })

    if(!isInvitationExist) return res.status(404).json({message:"Co-worker not found!"})

    await isInvitationExist.destroy()

    res.status(204).json({message:"Successfully remove!"})
  } catch (error) {
    console.log(error)
  }
}


exports.getUserWhoInvitedTheAuthUser = async(req,res)=>{
  try {
    const { id } = req.credentials;
    const users = await SharedFile.findAll({
      include:[{
        model:File,
        include:[{
          model:User,
          attributes:{exclude:['password']},
        }]
      }],
      where:{
        shareTo:id
      },
      group:['File.User.id']
    })

    res.status(200).json({users:users})
  } catch (error) {
    console.log(error)
  }
}


exports.getSharedFiles = async(req,res)=>{
  try {
    const {userId} = req.params;
    const { id } = req.credentials;

    const isOwnerExist = await User.findOne({
      where:{
        id:userId
      }
    })

    if(!isOwnerExist) return res.status(404).json({message:"Owner of the file not found!"})


      const files = await SharedFile.findAll({
        include:[{
          model:File,
          include:[{
            model:User,
            attributes:{exclude:['password']},
          }]
        }],
        where:{
          shareTo:id,
          '$File.User.id$':userId
        },
      })

    res.status(200).json({owner:isOwnerExist,files:files})
  } catch (error) {
    console.log(error)
  }
}


const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};