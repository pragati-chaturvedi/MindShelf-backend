const dbrequest = require("../helpers/dbRequest");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const getSummaryWithTags = require("./getSummaryWithTags");
const getSummaryWithDate = require("./getSummaryWithDates");
const getSummaryWithDates = require("./getSummaryWithDates");


const searchReads = (userId,searchPrompt) => {
  return new Promise(async (resolve, reject) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log(genAI);
        console.log(model)
      const promptText = searchPrompt;
      console.log(promptText)
      const getSummaryTagsFunctionDeclaration = {
        name: "getSummaryWithTags",
        description:
          "If the user ask to get past reads or summaries by giving some tags or keywords fetch the appropriate keywords and then call this function",
        parameters: {
          type: "object",
          properties: {
            tags: {
              type: "array",
              items: { type:"string" },
              description: "List of Tags given by user to get summaries.",
            },
            userId: {
              type: "string",
              description: "userId of the logged in User",
            },
          },
          required: ["tags"],
        },
      };

      const getSummaryDateFunctionDeclaration = {
        name: "getSummaryWithDates",
        description:
          "If the user ask to get past reads by mention a time period like last month or last 5 days  call this function count dates from the current date in Y-M-D format and modify arguement as startdate and current Date",
        parameters: {
          type: "object",
          properties: {
            startDate: {
              type: "string",
              description:
                "The date in yyyy-mm-dd format when the search has to be started for example if user says last 5 days so pass the date from the last fifth day",
            },
            endDate: {
              type: "string",
              description:
                "The date in yyyy-mm-dd format, usually it will be the current date but if user user give specific timelines so pass this date accordingly",
            },
            userId: {
              type: "string",
              description: "userId of the logged in User",
            },
          },
          required: ["startDate", "endDate"],
        },
      };
  
     
      const responses =  await model.generateContent({
       
        model:'gemini-2.0-flash',
        contents: [{ parts: [{ text: promptText }] }],
        tools: [ // tools array is directly here
            {
              functionDeclarations: [
                getSummaryTagsFunctionDeclaration,
                getSummaryDateFunctionDeclaration
              ], },
            ]
        
      }).catch((err) => console.log(err));

      //console.log(response.response.candidates)
      let response= responses.response
     if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0].functionCall) {
        const functionCall = response.candidates[0].content.parts[0].functionCall; // Assuming one function call
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
        // In a real app, you would call your actual function here:
        let functionResponse
        if (functionCall.name === "getSummaryWithDates") {
            functionResponse = await getSummaryWithDates(
              userId,functionCall.args.startDate,functionCall.args.startDate   
            );
          } else if (functionCall.name === "getSummaryWithTags") {
            functionResponse = await getSummaryWithTags(
              userId,functionCall.args.tags   
            );}
            resolve(functionResponse)
        //const result = await getCurrentTemperature(functionCall.args);
      } else {
        console.log("No function call found in the response.");
        console.log(response.text);
      }
    } catch (error) {
        reject(error)    }
  });
};

module.exports = searchReads;
