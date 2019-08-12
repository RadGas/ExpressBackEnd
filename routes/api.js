var express = require("express");
var router = express.Router();
const axios = require("axios");

//holds the information being fetched
let result;

/* Test index */
router.get("/", function(req, res, next) {
  res.send("Obviously you don't belong here");
});

/* 
* only for /zipcode/#
!Gets gas stations based on zipcode
? Be warned this works somehow :)
*/
router.get("/zipcode/:ZIPCODE", async function(req, res, next) {
  await getZipCode(req.params.ZIPCODE, 0);
  //TODO do something about profanity later
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SHOULD FUCKING WORK ", result);
  res.send(result);
});

/* 
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

  // Make a request for a user with a given ID
  // res.send(getZipCode(req.params.ZIPCODE));

  //TODO Comment out later
  await getZipCode(req.params.ZIPCODE, gasType);
  console.log("SHOULD FUCKING WORK with gas types", result);
  res.send(result);
  //   next();
});

/**
 * ! Gets the brands
 */
router.get("/brands", async function(req, res, next) {
  try {
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/brands`
    );

    res.send(response.data);
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO SHIT";
  }
});

// *helper function to retrieve zipcode gas info
async function getZipCode(ZIPCODE, GASTYPE) {
  let endpoint = `https://www.gasbuddy.com/assets-v2/api/stations?search=${ZIPCODE}`;
  if (GASTYPE) {
    endpoint += `&fuel=${GASTYPE}`;
  }
  try {
    const response = await axios.get(endpoint);

    result = response.data;
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO SHIT";
  }
}

module.exports = router;
