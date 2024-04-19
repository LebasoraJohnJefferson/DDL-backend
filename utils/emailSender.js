const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

module.exports = (template, receiver, email, title, customLink = null) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./templates/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./templates/"),
  };

  transporter.use("compile", hbs(handlebarOptions));

  transporter.sendMail(
    {
      from: "ddl_support@gmail.com",
      to: email,
      subject: `Intel alumni | ${title}`,
      template: template,
      context: {
        name: receiver.name,
        domain: process.env.FRONTEND_URL,
        customLink: customLink,
      },
    },
    (err) => {
      if (err) return 401;
      return 201;
    }
  );
};