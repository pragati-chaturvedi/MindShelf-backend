const dbrequest = require("../helpers/dbRequest")

const getSummaryWithDates = (userId, startdate, endDate) => {
  return new Promise(async (resolve, reject) => {
    try {

      let query = { $and: [{ userId: userId }, { timestamp: { $gte: new Date(startdate), $lte: new Date(endDate) } }] }
      let summaryDetails = await dbrequest(query, "summaryDetails", "find").catch((error) =>
        reject(error)
      );
      console.log(summaryDetails)
      if (summaryDetails.length === 0) {
        reject("No Records");
      } else {
        resolve(summaryDetails);
      }

    } catch (error) {
      reject("Some Error");
    }
  }
  )
};

module.exports = getSummaryWithDates;
