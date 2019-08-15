const express = require("express");
const router = express.Router();
const axios = require("axios");

//holds the information being fetched
let result;

/* Test index */
router.get("/", function(req, res, next) {
  res.send("Obviously you don't belong here");
  next();
});

/*
* only for /city/CITYNAME/gastype
!Gets gas stations based on city
? Be warned this works somehow :)
*/
router.get("/city/:CITY/:GASTYPE", async function(req, res, next) {
  const { GASTYPE, CITY } = req.params;
  await getGasStations(CITY, gasType, req.query.brandId, req.query.maxAge);
  //display response/results to page
  res.send(result);
  next();
});

/*
 * Helper function to determine gas type
 */
function getGasType(GASTYPE, res) {
  let gasType;
  if (GASTYPE === "all" || GASTYPE === 0) {
    gasType = 0;
    // console.log("Do we get hit?");
    // res.send({ status: "There's no 0 fam" });
  } else if (GASTYPE === "regular" || GASTYPE == 1) {
    gasType = 1;
  } else if (GASTYPE === "midgrade" || GASTYPE == 2) {
    gasType = 2;
  } else if (GASTYPE === "premium" || GASTYPE == 3) {
    gasType = 3;
  } else if (GASTYPE === "diesel" || GASTYPE == 4) {
    gasType = 4;
  } else {
    res.send({ status: "NEW TYPE OF GAS WOW!?!?!?" });
  }
  return gasType;
}

/*
* only for /zipcode/#/gastype
!Gets gas stations based on zipcode
? Be warned this works somehow :)
*/
router.get("/zipcode/:ZIPCODE/:GASTYPE", async function(req, res, next) {
  // res.send(req.query);
  const { ZIPCODE, GASTYPE } = req.params;
  let gasType = getGasType(GASTYPE, res);

  await getGasStations(ZIPCODE, gasType, req.query.brandId, req.query.maxAge);
  console.log("SHOULD WORK with gas types", result);
  res.send(result);
  next();
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
  next();
});

/*
* only for /coordinates/latitude/longitude/gastype
** supports maxAge and brandId queries
!Gets gas stations based on coordinates
? Be warned this works somehow :)
*/
router.get("/coordinates/", async function(req, res, next) {
  // res.send(req.query);
  let gasType = getGasType(req.query.fuel, res);

  await getGasStationsAtCoordinates(
    req.query.lat,
    req.query.lng,
    gasType,
    req.query.brandId,
    req.query.maxAge
  );
  console.log("SHOULD WORK with gas types", result);
  res.send(result);
  next();
});

/**
 * ! Gets the price history at city or zip
 * TODO LOOKINTO
 * ? Unsure if Gets the price history?
 */
router.get("/trends/:ZIPorCity", async function(req, res, next) {
  try {
    const { ZIPorCity } = req.params;
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/trends?search=${ZIPorCity}`
    );

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poop";
  }
  next();
});

/**
 * ! Gets the price history at cordinates
 * TODO LOOKINTO
 * ? Unsure if Gets the price history?
 */
router.get("/trends/:LATITUDE/:LONGITUDE", async function(req, res, next) {
  try {
    const { LATITUDE, LONGITUDE } = req.params;
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/trends?lat=${LATITUDE}&lng=${LONGITUDE}`
    );

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poop";
  }
  next();
});

/**
 * ! Gets the prices of the gas station
 * TODO Learn to deal with this : https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=155065&stationIds=141110&stationIds=136370&stationIds=149485&stationIds=136523&stationIds=150415&stationIds=153804&stationIds=52105&stationIds=153805&stationIds=118970
 * TODO and this https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=52092&stationIds=123210&stationIds=113088&stationIds=137383&stationIds=95618&stationIds=149725&stationIds=52090&stationIds=150088&stationIds=52110&stationIds=148139
 * TODO and this https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=52090&stationIds=52092&stationIds=123210&stationIds=149725&stationIds=52091&stationIds=150088&stationIds=95618&stationIds=137383&stationIds=52098&stationIds=113088
 * About: Gets the prices of the fuel types
 */
router.get("/gasstation/:GASSTATIONID", async function(req, res, next) {
  try {
    const { GASSTATIONID } = req.params;
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=${GASSTATIONID}`
    );

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poops";
  }
  next();
});

// *helper function to retrieve zipcode or city gas station info
async function getGasStations(ZIPorCITY, GASTYPE, BRANDID, MAXAGE) {
  let endpoint = `https://www.gasbuddy.com/assets-v2/api/stations?search=${ZIPorCITY}`;
  if (GASTYPE) {
    endpoint += `&fuel=${GASTYPE}`;
  }
  if (BRANDID) {
    endpoint += `&brandId=${BRANDID}`;
  }
  if (MAXAGE) {
    endpoint += `&maxAge=${MAXAGE}`;
  }
  try {
    const response = await axios.get(endpoint);

    result = response.data;
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poop";
  }
}

// *helper function FOR stations near coordinates to retrieve GAS
async function getGasStationsAtCoordinates(
  LATITUDE,
  LONGITUDE,
  GASTYPE,
  BRANDID,
  MAXAGE
) {
  let endpoint = `https://www.gasbuddy.com/assets-v2/api/stations?lat=${LATITUDE}&lng=${LONGITUDE}`;
  if (GASTYPE) {
    endpoint += `&fuel=${GASTYPE}`;
  }
  if (BRANDID) {
    endpoint += `&brandId=${BRANDID}`;
  }
  if (MAXAGE) {
    endpoint += `&maxAge=${MAXAGE}`;
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
