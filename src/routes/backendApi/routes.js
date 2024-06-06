const express = require('express');
const router = express.Router();
const buisnesslogic = require('./serviceCode.js')

router.get('/testapi', buisnesslogic.fetchAllData);
router.get('/reteriveSalesData', buisnesslogic.retrieveSalesData);
router.get('/getFilterParams', buisnesslogic.getFilteredParams);
router.get('/compareSales', buisnesslogic.compareSalesData);

router.post('/insertData', buisnesslogic.dataInsertion);
router.post('/getAggreagateComb', buisnesslogic.getAggregatedCombForFrontend);

module.exports = router;
