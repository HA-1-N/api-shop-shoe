const Joi = require("joi");

const categoryValidation = (data) => {
  const schema = Joi.object({
    categoryName: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { categoryValidation };
