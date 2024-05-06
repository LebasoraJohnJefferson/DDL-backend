const {
    User,
  } = require("../models");
  const { Op } = require('sequelize');


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