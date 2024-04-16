const {
    User,
  } = require("../models");
  const bcrypt = require("bcrypt");
  const accessToken = require("../middlewares/generateToken");
  const { Op, literal } = require("sequelize");
  
  const handleError = (error, res) => {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  };
  
  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check for required fields in the request body
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and Password are required" });
      }
  
      // Logic for alumni login
      const user = await User.findOne({
        where: {
          [Op.or]: [
            {
              email: email,
            },
          ],
          isDeleted: false,
        },
      });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "Invalid Email or Password" });
      }
  
      // Check user status
      if (user.status != "active") {
        return res.status(404).json({
          message:
            "Your account is inactive. Please contact the system administrator.",
        });
      }
  
      // Authenticate the alumni user with the provided credentials
      // Generate and return an authentication token
      bcrypt
        .compare(password, user.password)
        .then(async (result) => {
          if (result) {
            const userData = { email: user.email, id: user.id };
            const token = accessToken.generateAuthToken(userData);
            res.json({ accessToken: token, message: "Successfully logged in!" , role:user.role });
          } else {
            res.status(404).json({ message: "Invalid Email or Password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      handleError(error, res);
    }
  };
  
  exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      // Check for required fields in the request body
      //image is optional
      const requiredFields = ["password", "email", "name", "role"];
      const missingFields = [];
      requiredFields.forEach((field) => {
        if (!eval(field)) {
          console.log(!eval(field));
          missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
        }
      });
  
      if (missingFields.length > 0) {
        let errorMsg;
  
        if (missingFields.length === 1) {
          errorMsg = `${missingFields[0]} is required`;
        } else {
          const lastField = missingFields.pop();
          const joinedFields = missingFields.join(", ");
          errorMsg = `${joinedFields}, and ${lastField} are required`;
        }
  
        return res.status(400).json({ message: errorMsg });
      }
  
      // Logic for alumni registration
      isEmailTaken = await User.findOne({
        where: {
          email: email,
        },
      });
      if (isEmailTaken) return res.status(409).send("Email already taken");
      const newUser = await User.create(req.body);
      res.json({ user: newUser });
    } catch (error) {
      handleError(error, res);
    }
  };