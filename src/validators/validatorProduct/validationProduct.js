const Joi = require("joi");

const productValidation = (data) => {
  const schema = Joi.object({
    productCode: Joi.string().required(),
    brandCode: Joi.string().required(),
    image: Joi.array().items(
      Joi.string().custom((value, helpers) => {
        if (!value.match(/\.(jpg|jpeg|png)$/)) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "image format validation")
    ),
    name: Joi.string().required(),
    price: Joi.number().integer().required(),
    size: Joi.array()
      .items(Joi.number().integer().positive())
      .min(1)
      .single()
      .optional(),
    color: Joi.array().items(Joi.string()).single(),
    categories: Joi.array().items(Joi.string()).single(),
    description: Joi.string().optional().allow(""),
    inStock: Joi.boolean(),
  });

  return schema.validate(data);
};

module.exports = { productValidation };
