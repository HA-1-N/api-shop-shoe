const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: process.env.SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: "abc@gmail.com", // generated ethereal user
        pass: "abc", // generated ethereal password
      },
    });

    await transporter.sendMail({
      from: "Admin",
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = { sendEmail };
