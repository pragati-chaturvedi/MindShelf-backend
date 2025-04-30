const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const dbrequest = require("../helpers/dbRequest");
//const createSummary= require("../helpers/createSummaryFile")
const summarize = (resource,userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(resource);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const promptText = `Use this resource link ${resource} and create a summary of it with keywords 
        as searchable tags for the topic of resource. Give response in the form of an object schema:
        {
        "title":Propose a suitable title for summary
        "link": Link given by user,
         "summary": "Detailed Summary of the resource requested",
         "Tags": "Top 5 Searchable Keywords from the content in the form of an array"
        }`;
      const result = await model.generateContent({
        contents: [{ parts: [{ text: promptText }] }],
      });
      const responseAPI = result.response;
      const response= responseAPI.text()
      const parseResponse =  response.replace(/^```json\s*/, '').slice(0,-4)
      const responseFinal = JSON.parse(parseResponse);

    //  const summary = responseFinal.summary
     // let createSummaryResponse =await  createSummary(summary)
    //  console.log(createSummaryResponse)
     // if(createSummaryResponse)
    //    {
      const query = {
        userId: userId,
        title:responseFinal.title,
        tags: responseFinal.Tags,
        summary: responseFinal.summary,
        timestamp: new Date(),
        link:responseFinal.link
      };
      
      let insertSummary = await dbrequest(
        query,
        "summaryDetails",
        "insertOne"
      ).catch((error) => reject(error));

      if (insertSummary.acknowledged == true) {
        resolve(responseFinal);
      } else {
        reject("Summary not uploaded");
      }
    } 
        
    catch (err) {
      reject(err);
    }
  });
};

module.exports = summarize;
