const Joi = require("joi");

// Resiter Validation

const registerValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string()
      .alphanum() // Chỉ chứa các ký tự chữ và số
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    rePassword: Joi.ref("password"),
    phone: Joi.string().optional().allow(""),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string()
      .alphanum() // Chỉ chứa các ký tự chữ và số
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
