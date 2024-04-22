const {
    User,
  } = require("../models");
  const bcrypt = require("bcrypt");
  const accessToken = require("../middlewares/generateToken");
  const emailMaker = require("../utils/emailSender")
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
      if (!user.status) {
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

  exports.forgotPassword = async (req, res) => {
    try {
      // Check for required fields in the request body
      if (!req.body.email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const isUser = await User.findOne({
        where: [{
          email: req.body.email,
        },{
          isDeleted: false,
        }],
      });
  
      if (!isUser)
        return res
          .status(404)
          .send(
            "Email address is not associated with any account registered on the system."
          );
  
      // Switch to the specified environment
      // Logic for handling forgot password
      // Generate a password reset token and send it to the user's email
      let email =isUser.email;
      const user = { email: email, id: isUser.id };
      const token = await accessToken.forgetpasswordToken(user);
      const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
      result = emailMaker(
        "resetPassword",
        isUser,
        req.body.email,
        "Reset Password",
        resetPasswordURL
      );
  
      // Send a response indicating that the password reset email has been sent
  
      if (result == 401) res.status(401).send({ message: "Request Denied!" });
      else
        res.status(201).send({ message: "Password reset email has been sent!" });
    } catch (error) {
      handleError(error, res);
    }
  };


  exports.resetPassword = async (req, res) => {
    try {
      const { id, email } = req.credentials;
      const newPassword = req.body.password.trim();
      // Check for required fields in the request body
      if (!newPassword) {
        return res.status(400).json({ message: "Password is required" });
      }
      const isUser = await User.findOne({
        where:[{
          isDeleted: false,
          id: id,
          email: email,
        }]
      });
  
      if (!isUser)
        return res.status(404).send({ message: "account doesn`t exist" });
  
      isUser.password = newPassword;
      await isUser.save();
      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      handleError(error, res);
    }
  };
