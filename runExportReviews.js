"use strict";

const ServiceReviewIO = require('./serviceReviewIO.js');
const TrustpilotData = require('./trustpilotData.js');
const config = require('./config.json');
const serviceReviewIO = new ServiceReviewIO(config);
const trustpilotData = new TrustpilotData(config);

let businessUnits;

serviceReviewIO.clearFileContents(config.outputFileName);

serviceReviewIO.readInputFile().then((businessUnitIds) => {
  console.log(`\nReading file: "${config.inputFileName}".`);
  console.log(`\nThere are ${businessUnitIds.length} business-units in the input file.`);
  console.log(`\nStarting to fetch reviews now ...`);
  
  return trustpilotData.getListOfBusinessUnits(businessUnitIds)
}).then((listOfBusinessUnits) => {
  businessUnits = listOfBusinessUnits.map((x)=>{return x}); // taking a copy of the returned array.
  return trustpilotData.getAllServiceReviewsForAListOfBusinessUnits(listOfBusinessUnits);
}).then((listOfReviews)=>{
  console.log(`\nWriting reviews to csv-file.`);

  let fileInput = serviceReviewIO.prepareFileInput(businessUnits, listOfReviews);
  serviceReviewIO.writeToCsvFile(fileInput);

  console.log(`\nDONE!! Finished exporting service reviews for all business-units into file: "${config.outputFileName}"\n`);
}).catch((error) => {
  let errorObj = {};
  if (error.statusCode) {
    errorObj['statusCode'] = error.statusCode;
    errorObj['name'] = error.name;
    errorObj['message'] = error.message;
  } else {
    if (error.name) { errorObj['name'] = error.name; }
    if (error.message) { errorObj['message'] = error.message; }
    if (error.error && error.error.code) { errorObj['code'] = error.error.code; }
  }
  console.log(errorObj);
});
