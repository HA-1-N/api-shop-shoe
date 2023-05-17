const Joi = require("joi");

const colorValidation = (data) => {
  const schema = Joi.object({
    colorCode: Joi.string().required(),
    colorName: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { colorValidation };
