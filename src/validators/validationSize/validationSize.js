const Joi = require("joi");

const sizeValidation = (data) => {
  const schema = Joi.object({
    sizeCode: Joi.string().required(),
    sizeName: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { sizeValidation };
