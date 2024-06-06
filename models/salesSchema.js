const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  customer_name: String,
  product: String,
  product_category: String,
  sales_price: Number,
  sales_units: Number,
  sales_revenue: Number,  // can be removed and checked inside code directly
  cost_of_sales: Number,
  profit_or_loss: String,  // can also be manages at code level directly
  geography: String,
  country: String,
  year: Number,
  quarter: String,
  month: String,
});

const salesData = mongoose.model('sales', salesSchema);
module.exports = salesData;
