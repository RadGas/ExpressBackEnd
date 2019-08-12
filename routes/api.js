const express = require("express");
const router = express.Router();
const axios = require("axios");

//holds the information being fetched
let result;

/* Test index */
router.get("/", function(req, res, next) {
  res.send("Obviously you don't belong here");
});

/* 
TODO Unfinished
* only for /city/CITYNAME/gastype
!Gets gas stations based on zipcode
? Be warned this works somehow :)
*/
router.get("/city/:CITY", async function(req, res, next) {
  await getGasStations(req.params.CITY, 0);
  //display response/results to page
  res.send(result);
});

/* 
TODO make gas type checking a method
* only for /zipcode/#/gastype
!Gets gas stations based on zipcode
? Be warned this works somehow :)
*/
router.get("/zipcode/:ZIPCODE/:GASTYPE", async function(req, res, next) {
  // res.send(req.params.ZIPCODE);
  let gasType;
  if (req.params.GASTYPE == "all" || req.params.GASTYPE == 0) {
    gasType = 0;
    // console.log("Do we get hit?");
    // res.send({ status: "There's no 0 fam" });
  } else if (req.params.GASTYPE == "regular" || req.params.GASTYPE == 1) {
    gasType = 1;
  } else if (req.params.GASTYPE == "midgrade" || req.params.GASTYPE == 2) {
    gasType = 2;
  } else if (req.params.GASTYPE == "premium" || req.params.GASTYPE == 3) {
    gasType = 3;
  } else if (req.params.GASTYPE == "diesel" || req.params.GASTYPE == 4) {
    gasType = 4;
  } else {
    res.send({ status: "NEW TYPE OF GAS WOW!?!?!?" });
  }

  await getGasStations(req.params.ZIPCODE, gasType);
  console.log("SHOULD FUCKING WORK with gas types", result);
  res.send(result);
});

/**
 * ! Gets the brands
 * TODO figure out what this actually is getting
 */
router.get("/brands", async function(req, res, next) {
  try {
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/brands`
    );

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poop";
  }
});

/**
 * ! Gets the prices of the gas station
 * About: Gets the prices of the fuel types
 */
router.get("/gasstation/:GASSTATIONID", async function(req, res, next) {
  try {
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=${
        req.params.GASSTATIONID
      }`
    );

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poops";
  }
});

// *helper function to retrieve zipcode or city gas station info
async function getGasStations(ZIPorCITY, GASTYPE) {
  let endpoint = `https://www.gasbuddy.com/assets-v2/api/stations?search=${ZIPorCITY}`;
  if (GASTYPE) {
    endpoint += `&fuel=${GASTYPE}`;
  }
  try {
    const response = await axios.get(endpoint);

    result = response.data;
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poop";
  }
}

module.exports = router;
