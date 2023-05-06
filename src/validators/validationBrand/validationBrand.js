const Joi = require("joi");

const brandValidation = (data) => {
  const schema = Joi.object({
    brandCode: Joi.string().required(),
    name: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { brandValidation };
