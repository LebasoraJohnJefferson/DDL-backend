const {
    User,
    File
  } = require("../models");

exports.getAdmin = async (req, res) => {
  try {
    const { id, email } = req.credentials;
    const user = await User.findOne({
      where: {
        id: id,
        role: "admin",
      },
      attributes: ["id", "firstName","middleName","lastName","suffix", "email", "image"],
    });

    

    if (!user) return res.sendStatus(401);

    res.status(200).send({ user: user });
  } catch (error) {
    handleError(error, res);
  }
};


exports.getAllOwner = async(req,res)=>{
  try {
    const owners = await File.findAll({
      include:[{
        model:User,
        attributes:{exclude:['password']},
      }],
      group:['User.id']
    })


    return res.status(200).json({users:owners})


  } catch (error) {
    console.log(error)
  }
}


exports.getAllFilesByOwnerId = async(req,res)=>{
  try {
    const {ownerId} = req.params;

    const isOwnerExist = await User.findOne({
      where:{
        id:ownerId
      }
    })

    if(!isOwnerExist) return res.status(404).json({message:"Owner doens`t Exist!"})


    const files = await File.findAll({
      where:{
        userId:ownerId
      },
      order: [['createdAt', 'DESC']]
    })

    res.status(200).json({owner:isOwnerExist,files:files})
  } catch (error) {
    console.log(error)
  }
}