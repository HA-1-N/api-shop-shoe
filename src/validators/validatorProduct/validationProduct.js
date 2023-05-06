const Joi = require("joi");

const productValidation = (data) => {
  const schema = Joi.object({
    productCode: Joi.string().required(),
    brandCode: Joi.string().required(),
    image: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().integer().required(),
    size: Joi.array().items(Joi.number()),
    color: Joi.array().items(Joi.string()),
    categories: Joi.array().items(Joi.string()),
    description: Joi.string().optional().allow(""),
    inStock: Joi.boolean(),
  });

  return schema.validate(data);
};

module.exports = { productValidation };
