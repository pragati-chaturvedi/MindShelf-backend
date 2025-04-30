var MongoClient = require("mongodb").MongoClient;
const dbConnection = require("./dbConnection.js");

// sending request to the database
const dbrequest = async (dataQuery,collectionName,operation) => {
  return new  Promise(async (resolve, reject) => {
    try {
        console.log(dataQuery)
      var dbo = await dbConnection()
      var query = dataQuery
      let data
      switch (operation)
      {
        case 'find':
         data = await dbo.collection(collectionName)[operation](query).toArray();
        break;
        case 'insertOne':
         data = await dbo.collection(collectionName)[operation](query)
        break;
        case 'aggregate':
        data= await dbo.collection(collectionName)[operation](query).toArray();
      }
      
      resolve(data)
    } catch (error) {
      reject("No Records Found");
    }
  });
};

module.exports=dbrequest
