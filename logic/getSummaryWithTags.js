const dbrequest = require("../helpers/dbRequest")

const getSummaryWithTags = (userId,tags) => {
  return new Promise(async (resolve, reject) => {
    try {
       // let query ={ tag: "BlockChain,Hashing" };
        let query ={ $and:[{userId:userId},{tags: {$in: tags}}]}
        let summaryDetails =  await dbrequest(query,"summaryDetails","find").catch((error) =>
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
    }}
  )
};

module.exports = getSummaryWithTags;
