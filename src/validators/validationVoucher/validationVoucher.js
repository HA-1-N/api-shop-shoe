const Joi = require("joi");

const voucherValidation = (data) => {
  const schema = Joi.object({
    voucherCode: Joi.string().required(),
    discount: Joi.number(),
  });

  return schema.validate(data);
};

module.exports = { voucherValidation };
