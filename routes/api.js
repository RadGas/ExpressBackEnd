var express = require("express");
var router = express.Router();
const axios = require("axios");

//holds the information being fetched
let result;

/* Test index */
router.get("/", function(req, res, next) {
  res.send("Obviously you don't belove here");
});

/* 
!Gets gas stations based on zipcode
? Be warned this works somehow :)
*/
router.get("/zipcode/:ZIPCODE", async function(req, res, next) {
  //   res.send(req.params.ZIPCODE);
  // Make a request for a user with a given ID
  //   res.send(getZipCode(req.params.ZIPCODE));
  await getZipCode(req.params.ZIPCODE);
  console.log("SHOULD FUCKING WORK ", result);
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
async function getZipCode(ZIPCODE) {
  try {
    const response = await axios.get(
      `https://www.gasbuddy.com/assets-v2/api/stations?search=${ZIPCODE}&fuel=1`
    );

    console.log(response.data);
    result = response.data;
  } catch (error) {
    console.error(error);
    return "EVERYTHING WENT TO SHIT";
  }
}

module.exports = router;
