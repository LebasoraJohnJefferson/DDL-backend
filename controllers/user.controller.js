const {
    User,
  } = require("../models");
  const { Op } = require('sequelize');
  const { cloudinary } = require("../utils/cloudinary");

exports.getLoginUser = async (req,res)=>{
    try {
        const {id} = req.credentials
        const user = await User.findOne({
            where:{
                id:id
            },
            attributes:{exclude:['password']},
        });

        if(!user) return res.status(404).json({message:"User not found!"})

        res.status(200).json({user:user})

    } catch (error) {
        console.log(error)
    }
}


exports.getUser = async (req, res) => {
    try {
        const users = await User.findAll({
            where:{
                role:{
                    [Op.not]:['admin'],
                }
            },
            attributes:{exclude:['password']},
        });
        res.status(200).json({users:users})
    } catch (error) {
        console.log(error);
    }
};

exports.updateUser = async (req,res)=>{
    try {
        const {id} = req.credentials
        const { email,image,password } = req.body;
    
        const emailValidated = validateEmail(email)
        if(!emailValidated) return res.status(409).json({message:'Invalid Email'})

        const isEmailAlreadyExist = await User.findOne({
            where:{
                email:email,
                id:{
                [Op.not]:id
                }
            }
            })
        const userDetails = await User.findOne({
            where:{
                id:id
            }
        })
        let imgRoute = ''
        if(isEmailAlreadyExist) return res.status(409).json({message:'Email already used!'})
        if (image && image.length > 0) {
            try{
                if(!image.trim()) return
                imgRoute = await cloudinary.uploader.upload(image);
            }catch(e){
                console.log(e)
            }
        }
        const trimPassword = password.trim()
        if(!trimPassword) return res.status(409).json({message:'Invalid Password!'})
        const assignedImage = imgRoute.secure_url ? imgRoute.secure_url : userDetails?.image

        await userDetails.update({
            ...req.body,
            password:trimPassword,
            image:assignedImage
        })
        
        res.status(200).send({message:'Successfully updated'})
    } catch (error) {
        console.log(error)
    }
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };