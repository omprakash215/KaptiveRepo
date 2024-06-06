const express = require("express");
const salesData = require("../../../models/salesSchema.js");
const validator = require("./validator.js");

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

const fetchAllData = async (req, res) => {
  const checkDataPresent = await salesData.find({}).limit(1).lean();
  //console.log('====checkDataPresent===', checkDataPresent.length, '=======', checkDataPresent);
  res.send("Fetched complete Data successfully");
};

const dataInsertion = async (req, res) => {
  try {
    const {
      customer_name,
      product,
      product_category,
      sales_price,
      sales_units,
      cost_of_sales,
      geography,
      country,
      year,
      quarter,
      month,
    } = req.body;
    const sales_revenue = sales_price * sales_units;
    const profit_or_loss =
      sales_revenue - cost_of_sales > 0 ? "Profit" : "Loss";
    const data = {
      customer_name,
      product,
      product_category,
      sales_price,
      sales_units,
      sales_revenue,
      cost_of_sales,
      profit_or_loss,
      geography,
      country,
      year,
      quarter,
      month,
    };
    let insertData;
    try {
      insertData = await salesData.insertMany(data);
    } catch (err) {
      console.log("===Error while inserting data====", err);
    }
    return res.status(200).json({
      data: insertData,
      message: "Inserted Successfully",
      statusCode: 200,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ data: null, message: "Insertion Unsuccessful", statusCode: 500 });
  }
};

const retrieveSalesData = async (req, res) => {
  try {
    const validatedQuery = await validator
      .reteriveSalesData()
      .validateAsync(req.query);
    const query = {};
    const fields = [
      "sale_year",
      "geographical_loc",
      "product",
      "customer_name",
      "product_category",
      "country",
      "sale_month",
      "sale_quarter",
    ];
    const dbFields = {
      sale_year: "year",
      geographical_loc: "geography",
      product: "product",
      customer_name: "customer_name",
      product_category: "product_category",
      country: "country",
      sale_month: "month",
      sale_quarter: "quarter",
    };

    fields.forEach((field) => {
      if (validatedQuery[field]) {
        query[dbFields[field]] = validatedQuery[field];
      }
    });
    const salesDatas = await salesData.find(query);

    return res.status(200).json({
      statusCode: 200,
      message: "Fetched Successfully",
      data: salesDatas,
    });
  } catch (validationError) {
    if (validationError.isJoi) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation Failed",
        error: validationError.details,
      });
    }
    console.error("Retrieve Sales Data Error:", validationError);
    return res.status(500).json({
      statusCode: 500,
      message: "Retrieve Unsuccessful",
      error: validationError.message,
    });
  }
};

const getFilteredParams = async (req, res) => {
  try {
    const dimensions = [
      "customer_name",
      "product",
      "product_category",
      "geography",
      "country",
      "year",
      "quarter",
      "month",
    ];
    const measures = [
      "cost_of_sales",
      "sales_price",
      "sales_units",
      "sales_revenue",
      "profit_or_loss",
    ];
    return res.status(200).json({
      statusCode: 200,
      data: { dimensions, measures },
      message: `Filtered Fetched  Successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: `Error while fetching filter: ${err.message}`,
    });
  }
};

// const getAggregateCombData = async (req, res) => {
//   try {
//     const { dimensions, measures } = await validator
//       .aggregateSalesQuerry()
//       .validateAsync(req.body);

//     // At least one dimension and one measure are provided
//     if (dimensions.length === 0 || measures.length === 0) {
//       return res.status(400).json({
//         statusCode: 400,
//         message: "At least one dimension and one measure must be provided",
//       });
//     }
//     const projection = {};
//     dimensions.forEach((dimension) => {
//       projection[dimension] = 1;
//     });
//     measures.forEach((measure) => {
//       projection[measure] = 1;
//     });
//     const salesDatas = await salesData.find({}, projection).lean();
//     return res.status(200).json({
//       statusCode: 200,
//       message: "Fetched Successfully",
//       data: salesDatas,
//     });
//   } catch (error) {
//     if (error.isJoi) {
//       return res.status(400).json({
//         statusCode: 400,
//         message: "Validation Failed",
//         error: error.message,
//       });
//     }
//     console.error("Retrieve Sales Data Error:", error);
//     return res.status(500).json({
//       statusCode: 500,
//       message: "Retrieve Unsuccessful",
//       error: error.message,
//     });
//   }
// };

const getAggregatedCombForFrontend = async (req, res) => {
  try {
    const { dimensions, measures } = await validator
      .aggregateSalesQuerry()
      .validateAsync(req.body);

    // At least one dimension and one measure are provided
    if (dimensions.length === 0 || measures.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "At least one dimension and one measure must be provided",
      });
    }
    const projection = {};
    dimensions.forEach((dimension) => {
      projection[dimension] = 1;
    });
    measures.forEach((measure) => {
      projection[measure] = 1;
    });
    const salesDatas = await salesData.find({}, projection).lean();
    let aggregatedData;
    const groupBy = {};
    dimensions.forEach((dim) => {
      groupBy[dim] = `$${dim}`;
    });

    const aggregations = {};
    measures.forEach((meas) => {
      aggregations[meas] = { $sum: `$${meas}` };
    });

    try {
      aggregatedData = await salesData.aggregate([
        {
          $group: {
            _id: groupBy,
            ...aggregations,
          },
        },
      ]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    aggregatedData.forEach(x => {
      if( x.cost_of_sales && x.sales_revenue && (x.sales_revenue - x.cost_of_sales) > 0){
        x.profit_or_loss = 'Profit';
      }else if (x.cost_of_sales && x.sales_revenue && (x.sales_revenue - x.cost_of_sales) < 0) {
        x.profit_or_loss = 'Loss';
      }else {
        x.profit_or_loss = 'Cant be Identified';
      }
    })
    return res.status(200).json({
      statusCode: 200,
      message: "Fetched Successfully",
      data: aggregatedData,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation Failed",
        error: error.message,
      });
    }
    console.error("Retrieve Sales Data Error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Retrieve Unsuccessful",
      error: error.message,
    });
  }
};

const compareSalesData = async (req, res) => {
  // dimension1 and dimension2 are two types of dimension on which comparision should be done
  // And regarding measures choose any one like sales_unit , sales_revenue, profit_or_loss
  const { dimension1, dimension2, measure_type } = req.query;
  try {
    const comparisonData = await salesData.aggregate([
      {
        $group: {
          _id: {
            dimension1: `$${dimension1}`,
            dimension2: `$${dimension2}`,
          },
          total: { $sum: `$${measure_type}` },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
    res.json(comparisonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchAllData,
  retrieveSalesData,
  dataInsertion,
  //getAggregateCombData,
  getFilteredParams,
  getAggregatedCombForFrontend,
  compareSalesData
};
