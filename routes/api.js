const express = require("express");
const router = express.Router();
const axios = require("axios");

//holds the information being fetched
let result;

/* Test index */
router.get("/", function (req, res, next) {
    res.send("Obviously you don't belong here");
    next();
});

/*
* only for /city/
?search=cityName&fuel=#&brandId=#&maxAge=#
!Gets gas stations based on city
? Be warned this works somehow :)
*/
router.get("/city", async function (req, res, next) {
    const {fuel, brandId, search, maxAge} = req.query;
    let gasType = getGasType(fuel, res);
    await getGasStations(
        search,
        gasType,
        brandId,
        maxAge
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
        res.send({status: "NEW TYPE OF GAS WOW!?!?!?"});
    }
    return gasType;
}

/*
* only for /zipcode/#
?fuel=#&brandId=#&maxAge=#
!Gets gas stations based on zipcode
? Be warned this works somehow :)
*/
router.get("/zipcode/:ZIPCODE", async function (req, res) {
    // res.send(req.query);
    const {ZIPCODE} = req.params;
    const {fuel, brandId, maxAge} = req.query;
    let gasType = getGasType(fuel, res);

    await getGasStations(ZIPCODE, gasType, brandId, maxAge);
    console.log("SHOULD WORK with gas types", result);
    res.send(result);
});

/**
 * only for /brands
 * ! Gets a list of brand gas stations
 */
router.get("/brands", async function (req, res, next) {
    let url = "https://www.gasbuddy.com/assets-v2/api/brands";
    const {brandIds} = req.query;
    if (brandIds) {
        url += `?brandIds=${brandIds}`;
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
router.get(
    "/coordinates/",
    async function (req, res, next) {
        // res.send(req.query);
        const {lng, fuel, brandId, maxAge, lat} = req.query;
        let gasType = getGasType(fuel, res);

        await getGasStationsAtCoordinates(
            lat,
            lng,
            gasType,
            brandId,
            maxAge
        );
        // console.log("SHOULD WORK with gas types", result);
        // res.send(result);
        next();
    },
    async function (req, res) {
        const {stations} = result;
        stations.forEach(station => {
            console.log("A station! : " + station.latitude);
            const {lng, lat} = req.query;
            station.miles = distanceInMilesBetweenEarthCoordinates(
                lat,
                lng,
                station.latitude,
                station.longitude
            );
            console.log("This is the current result", result);
        });
        res.send(result);
    }
);

/**
 * ! Gets the price history at city or zip
 */
router.get("/trends/:ZIPorCity", async function (req, res) {
    try {
        const {ZIPorCity} = req.params;
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
 * ! Gets the price history at coordinates
 */
router.get("/trends", async function (req, res, next) {
    try {
        const {lng, lat} = req.query;
        const response = await axios.get(
            `https://www.gasbuddy.com/assets-v2/api/trends?lat=${lat}&lng=${
                lng
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
 * About: Gets the prices of the fuel types
 */
router.get("/gasstation", async function (req, res) {
    try {
        let url = `https://www.gasbuddy.com/assets-v2/api/fuels`;
        const {stationIds, highestPrice} = req.query;
        if (stationIds) {
            url += `?stationIds=${stationIds[0]}`;
        }
        for (let i = 1; i < stationIds.length; i++) {
            url += `&stationIds=${stationIds[i]}`;
        }
        const response = await axios.get(url);
        let amount = highestPrice;
        if (amount) {
            response.data.fuels = response.data.fuels.filter(function (station) {
                const {prices} = station;
                const {price} = prices[0];
                console.log(`price we are comparing ${price}`);
                console.log();
                return price <= amount;
            });
        }
        res.send(response.data);
    } catch (error) {
        console.error(error);
        return "EVERYTHING WENT TO poops";
    }
});

async function addQueries(endpoint, GASTYPE, BRANDID, MAXAGE) {
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

// *helper function to retrieve zipcode or city gas station info
async function getGasStations(ZIPorCITY, GASTYPE, BRANDID, MAXAGE) {
    let endpoint = `https://www.gasbuddy.com/assets-v2/api/stations?search=${ZIPorCITY}`;
    return await addQueries(endpoint, GASTYPE,BRANDID, MAXAGE);
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
    return await addQueries(endpoint, GASTYPE, BRANDID, MAXAGE);
}

// obtained from https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function distanceInMilesBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    let earthRadiusMiles = 3958.756;

    let dLat = degreesToRadians(lat2 - lat1);
    let dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let miles = earthRadiusMiles * c;
    return Math.round(miles * 100) / 100;
}

module.exports = router;
