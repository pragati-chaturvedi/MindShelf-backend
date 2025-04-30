const dbrequest = require("../helpers/dbRequest")

const getSummary = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
        let query =[{$match : {userId:userId}},{$sort:{ timestamp: -1 }} ,  { $limit: 5 }]
        let summaryDetails =  await dbrequest(query,"summaryDetails","aggregate").catch((error) =>
          reject(error)
        );
        console.log(summaryDetails)
        if (summaryDetails.length === 0) {
          reject("No Records Found");
        } else {
          resolve(summaryDetails);
        }
      
    } catch (error) {
      reject("Some Error");
    }}
  )
};

module.exports = getSummary;
