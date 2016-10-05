const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');

class ServiceReviewIO {
  constructor (config) {
    if (!config.inputFileName || !config.inputFileName) throw new Error('You must provide a valid "inputFileName" and a valid "outputFileName" in config.json');
    
    this.inputFileName = config.inputFileName;
    this.outputFileName = config.outputFileName;
  }

  prepareFileInput (listOfBusinessUnits, listsOfReviews) {
    let fileInput = [];
    for (let i in listOfBusinessUnits) {
      let businessUnit = listOfBusinessUnits[i];
      let reviews;

      for (let j in listsOfReviews) {
        if (listsOfReviews[j][0] && listsOfReviews[j][0].businessUnit.id === businessUnit.id) {
          reviews = listsOfReviews[j];
          break;
        }
      }

      for (let k in reviews) {
        let lineInput = {};
        lineInput['Domain Url'] = businessUnit.websiteUrl;
        lineInput['Webshop Name'] = businessUnit.displayName;
        lineInput['Business Unit Id'] = businessUnit.id;
        lineInput['Review Id'] = reviews[k].id
        lineInput['Review Created (UTC)'] = reviews[k].createdAt;
        lineInput['Review Consumer User Id'] = reviews[k].consumer.id;
        lineInput['Review Username'] = reviews[k].consumer.displayName;
        // lineInput['Review User Email'] = reviews[k].consumer.email;
        lineInput['Review Title'] = reviews[k].title;
        lineInput['Review Content'] = reviews[k].text;
        lineInput['Review Stars'] = reviews[k].stars;
        // lineInput['Source Of Review'] = reviews[k].
        // lineInput['Reference Id'] = reviews[k].
        lineInput['Company Response'] = reviews[k].companyReply ? reviews[k].companyReply.text : '';
        lineInput['Company Reply Date (UTC)'] = reviews[k].companyReply ? reviews[k].companyReply.createdAt : '';
        lineInput['Review Language'] = reviews[k].language;

        fileInput.push(lineInput);
      }
    }

    return fileInput;
  }

  writeToCsvFile (fileInput) {
    let writer = csvWriter();

    for (let index in fileInput) {
      writer.write(fileInput[index]);
    }

    writer.end();
    writer.pipe(fs.createWriteStream(this.outputFileName, {'flags': 'a'}));
  }

  readInputFile () {
    return new Promise((resolve, reject) => {
      let businessUnitIds = [];
      let lineReader = readline.createInterface({
        input: require('fs').createReadStream(this.inputFileName)
      });

      lineReader.on('line', function (line) {
        businessUnitIds.push(line);
      });

      lineReader.on('close', function() {
        resolve(businessUnitIds);
      })
    });
  }

  clearFileContents (filename) {
    let writer = csvWriter({sendHeaders: false});
    writer.end();
    writer.pipe(fs.createWriteStream(filename));
  }
}

module.exports = ServiceReviewIO;
