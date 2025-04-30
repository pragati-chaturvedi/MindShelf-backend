const fs = require("node:fs");
const { Guid } = require('js-guid');


const createSummaryFile = (summary) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userId = 103;
      const folderName = `../backend/SummaryFile/${userId}`;
      console.log(folderName)
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
      let fileName= Guid.newGuid()
     var txtFile = `../backend/SummaryFile/${userId}/${fileName}.txt`
     fs.writeFile(txtFile, summary, err => {
        if (err) {
          reject(err);
        } else {
            resolve(txtFile);
        }
    })

    } catch (err) {
      reject(err)
    }
  });
};

// createSummaryFile("AYush")
module.exports=createSummaryFile