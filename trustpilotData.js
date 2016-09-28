const Trustpilot = require('Trustpilot');
const querystring = require('querystring');

class TrustpilotData {
  constructor (config) {
    if (!config.apiKey) throw new Error('You must provide a valid "apiKey" in the config.json');

    this.api = new Trustpilot(config);
  }

  getListOfBusinessUnits(listOfBusinessUnitIds) {
    let allBusinessUnits = [];
    return this._getBusinessUnits(allBusinessUnits, listOfBusinessUnitIds);
  }

  _getBusinessUnits(allBusinessUnits, listOfBusinessUnitIds) {
    let businessUnitId = listOfBusinessUnitIds.pop();

    return this.api.businessUnit.get(businessUnitId).then((response)=>{
      allBusinessUnits.push(response);
      if (listOfBusinessUnitIds.length) {
        return this._getBusinessUnits(allBusinessUnits, listOfBusinessUnitIds);
      } else {
        return allBusinessUnits;
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  getAllServiceReviewsForAListOfBusinessUnits(listOfBusinessUnits) {
    let allReviews = [];
    return this._getServiceReviewsForABusinessUnit(listOfBusinessUnits, allReviews).then((reviews)=>{
      return reviews;
    });
  }

  _getServiceReviewsForABusinessUnit(listOfBusinessUnits, listOfReviews) {
    let businessUnit = listOfBusinessUnits.pop();
    let businessUnitId = businessUnit.id;

    return this.getAllServiceReviewsForABusinessUnit(businessUnitId).then((response)=>{
      console.log(` - Retrieved all reviews for: ${businessUnit.displayName} (${businessUnitId})`);

      listOfReviews.push(response);
      if (listOfBusinessUnits.length) {
        return this._getServiceReviewsForABusinessUnit(listOfBusinessUnits, listOfReviews);
      } else {
        return listOfReviews;
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  getAllServiceReviewsForABusinessUnit(businessUnitId) {
    let allReviews = [];
    return this._getBusinessUnitServiceReviews(businessUnitId, allReviews);
  }

  _getBusinessUnitServiceReviews(businessUnitId, allReviews, pageNo) {
    let options = {
      perPage: 100,
      page: pageNo || 1
    };

    return this.api.businessUnit.getReviews(businessUnitId, options).then((response)=>{
      let nextPageUri;
      let nextPage;

      if (response.links.length) {
        nextPage = response.links.filter((obj) => { if (obj.rel == 'next-page') {return 1}});
        if (nextPage.length) {
          nextPageUri = nextPage[0].href;
        }
      }

      allReviews = allReviews.concat(response.reviews);

      if (nextPageUri) {
        let qs = querystring.parse(nextPageUri);
        return this._getBusinessUnitServiceReviews(businessUnitId, allReviews, qs.page);
      } else {
        return allReviews;
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
}

module.exports = TrustpilotData;
