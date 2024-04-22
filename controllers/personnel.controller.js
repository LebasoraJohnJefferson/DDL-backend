const {
    User,
  } = require("../models");

exports.createPersonnel = async (req, res) => {
  try {
    const { email, password,status } = req.body;
    const emailCheck = await User.findOne({
      where: { email: email },
    });

    if (emailCheck) return res.status(401).json({ message: "Email address already used." });
    let pass = password != null ? password : '12345'
    
    let user = await User.create({
      password:pass.trim() != '' ? pass : "12345",
      status: status==null ? true : false,
      role:"personnel",
      ...req.body
    });

    res.status(201).json({message: "Account Created"})
  } catch (error) {
    handleError(error);
  }
};