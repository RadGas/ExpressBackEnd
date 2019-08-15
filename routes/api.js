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
* only for /city/
?search=cityName&fuel=#&brandId=#&maxAge=#
!Gets gas stations based on city
? Be warned this works somehow :)
*/
router.get("/city", async function(req, res, next) {
  let gasType = getGasType(req.query.fuel, res);
  await getGasStations(
    req.query.search,
    gasType,
    req.query.brandId,
    req.query.maxAge
  );
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
* only for /zipcode/#
?fuel=#&brandId=#&maxAge=#
!Gets gas stations based on zipcode
? Be warned this works somehow :)
*/
router.get("/zipcode/:ZIPCODE", async function(req, res, next) {
  // res.send(req.query);
  const { ZIPCODE } = req.params;
  let gasType = getGasType(req.query.fuel, res);

  await getGasStations(ZIPCODE, gasType, req.query.brandId, req.query.maxAge);
  console.log("SHOULD WORK with gas types", result);
  res.send(result);
});

/**
 * only for /brands
 * ! Gets a list of brand gas stations
 */
router.get("/brands", async function(req, res, next) {
  let url = "https://www.gasbuddy.com/assets-v2/api/brands";
  if (req.query.brandIds) {
    url += `?brandIds=${req.query.brandIds}`;
  }
  try {
    const response = await axios.get(url);

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poop";
  }
  next();
});

/*
* only for /coordinates
?lat=#&lng=#&brandId=#&maxAge=#
** supports maxAge and brandId queries
!Gets gas stations based on coordinates
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
});

/** Gets gas price history
 * Gets the trends for coordinates
 * * for /trends
 * ?lat=#&lng=#
 * ! Gets the price history at cordinates
 * TODO LOOKINTO
 * ? Unsure if Gets the price history?
 */
router.get("/trends", async function(req, res, next) {
  try {
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/trends?lat=${req.query.lat}&lng=${
        req.query.lng
      }`
    );

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poop";
  }
  next();
});

/**
 * for /gasstation
 * ?stationIds..=#&highestPrice=#
 * ! Gets the prices of the gas station
 * TODO Learn to deal with this : https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=155065&stationIds=141110&stationIds=136370&stationIds=149485&stationIds=136523&stationIds=150415&stationIds=153804&stationIds=52105&stationIds=153805&stationIds=118970
 * TODO and this https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=52092&stationIds=123210&stationIds=113088&stationIds=137383&stationIds=95618&stationIds=149725&stationIds=52090&stationIds=150088&stationIds=52110&stationIds=148139
 * TODO and this https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=52090&stationIds=52092&stationIds=123210&stationIds=149725&stationIds=52091&stationIds=150088&stationIds=95618&stationIds=137383&stationIds=52098&stationIds=113088
 * About: Gets the prices of the fuel types
 */
router.get("/gasstation", async function(req, res, next) {
  try {
    let amountOfStations = 0;
    let url = `https://www.gasbuddy.com/assets-v2/api/fuels`;
    if (req.query.stationIds) {
      amountOfStations = req.query.stationIds;
      url += `?stationIds=${req.query.stationIds[0]}`;
    }
    for (i = 1; i < req.query.stationIds.length; i++) {
      url += `&stationIds=${req.query.stationIds[i]}`;
    }
    const response = await axios.get(url);
    if ((amount = req.query.highestPrice)) {
      response.data.fuels = response.data.fuels.filter(function(station) {
        console.log("price we are comparing " + station.prices[0].price);
        console.log();
        return station.prices[0].price <= amount;
      });
    }
    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO poops";
  }
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

// obtained from https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function distanceInMilesBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusMiles = 3958.756;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

module.exports = router;
