# export-service-reviews

This app is written for NodeJS (tested with 6.6.0)

##First
Run `npm install`

##Setup
`config.json` should contain:

* an `apiKey` for the public Trustpilot API.
* an `inputFileName` for the input file.
* an `outputFileName` for the output (csv) file.

##Running the app
run `node runExportReviews.js`

## How it works
The app looks for an input file with business unit ids separated by newlines. (input file name can be found in `config.json`)

Foreach business unit id it fetches all the service reviews.

Once all business units' service reviews are fetched, they are written into an output file (output file name can be found in `config.json`)

###Output example
```
Reading file: "business-units.txt".

There are 2 business-units in the input file.

Starting to fetch reviews now ...
 - Retrieved all reviews for: Bundingo   (xxxxxxxxxxxxxxxxxxxxxxxx)
 - Retrieved all reviews for: Trustpilot (xxxxxxxxxxxxxxxxxxxxxxxx)

Writing reviews to csv-file ...

DONE!! Finished exporting service reviews for all business-units into file: "exported-service-reviews.csv"
```

##Api key
This application only works if you have a valid apiKey for the Trustpilot API.
