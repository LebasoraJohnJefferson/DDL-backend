const {
    User,
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