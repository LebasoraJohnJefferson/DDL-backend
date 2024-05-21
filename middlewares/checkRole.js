const User = require("../models").User;

exports.isAdmin = async (req, res, next) => {
  try {
    const { id } = req.credentials;
    const user = await User.findOne({
      where: {
        id: id,
        role: "admin",
      },
      attributes: ["firstName", "email"],
    });

    if (!user) return res.sendStatus(401);
    next();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.isPersonnel = async (req, res, next) => {
  try {
    const { id } = req.credentials;
    const user = await User.findOne({
      where: {
        id: id,
        role: "personnel",
      },
      attributes: ["firstName", "email"],
    });
    if (!user) return res.sendStatus(401);
    next();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.isStudent = async (req, res, next) => {
  try {
    const { id } = req.credentials;
    const user = await User.findOne({
      where: {
        id: id,
        role: "student",
      },
      attributes: ["firstName", "email"],
    });
    if (!user) return res.sendStatus(401);
    next();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
