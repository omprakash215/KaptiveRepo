const Joi = require("@hapi/joi");

const validDimensions = [
  "customer_name",
  "product",
  "product_category",
  "geography",
  "country",
  "year",
  "quarter",
  "month",
];
const validMeasures = [
  "cost_of_sales",
  "sales_price",
  "sales_units",
  "sales_revenue",
  "profit_or_loss",
];

module.exports = {
  reteriveSalesData: () => {
    return Joi.object().keys({
      sale_year: Joi.number().optional(),
      geographical_loc: Joi.string().optional(),
      product: Joi.string().optional(),
      product_category: Joi.string().optional(),
      customer_name: Joi.string().required(),
      country: Joi.string().optional(),
      sale_month: Joi.string().optional(),
      sale_quarter: Joi.string().optional(),
    });
  },

  aggreagteSalesData: () => {
    return Joi.object().keys({
      sale_year: Joi.number().optional(),
      geographical_loc: Joi.string().optional(),
      product: Joi.string().optional(),
      product_category: Joi.string().optional(),
      customer_name: Joi.string().optional(),
      country: Joi.string().optional(),
      sale_month: Joi.string().optional(),
      sale_quarter: Joi.string().optional(),
    });
  },

  //   aggregateSalesQuerry: () => {
  //     return Joi.object({
  //       dimensions: Joi.object({
  //         customer_name: Joi.string(),
  //         product: Joi.string(),
  //         product_category: Joi.string(),
  //         geography: Joi.string(),
  //         country: Joi.string(),
  //         year: Joi.number(),
  //         quarter: Joi.string(),
  //         month: Joi.string(),
  //       })
  //         .min(1)
  //         .required(),
  //       measures: Joi.object({
  //         cost_of_sales: Joi.number(),
  //         sales_price: Joi.number(),
  //         sales_units: Joi.number(),
  //         sales_revenue: Joi.number(),
  //         profit_or_loss: Joi.string(),
  //       })
  //         .min(1)
  //         .required(),
  //     });
  //   },

  aggregateSalesQuerry: () => {
    return Joi.object({
      dimensions: Joi.array()
        .items(Joi.string().valid(...validDimensions))
        .required()
        .min(1),
      measures: Joi.array()
        .items(Joi.string().valid(...validMeasures))
        .required()
        .min(1),
    });
  },
};
