const dbrequest = require("../helpers/dbRequest");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const getSummaryWithTags = require("./getSummaryWithTags");
const getSummaryWithDate = require("./getSummaryWithDates");
const getSummaryWithDates = require("./getSummaryWithDates");


const searchReads = (userId, searchPrompt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log(genAI);

      //function declarations
      const getSummaryTagsFunctionDeclaration = {
        name: "getSummaryWithTags",
        description: "Use this when the user asks for specific mindfiles using tags, topics, or keywords like 'AI', 'finance', 'climate' etc. Extract relevant tags and return the summaries that match them.",
        parameters: {
          type: "object",
          properties: {
            tags: {
              type: "array",
              items: { type: "string" },
              description: "List of user-specified tags or topics to filter mindfiles.",
            },
            userId: {
              type: "string",
              description: "Unique identifier for the logged-in user.",
            },
          },
          required: ["tags"],
        },
      };

      const getSummaryDateFunctionDeclaration = {
        name: "getSummaryWithDates",
        description: "Use this when the user mentions time-based filters like 'last week', 'past 3 days', 'January summaries', or an exact date. Calculate the appropriate start and end dates and return relevant mindfiles.",
        parameters: {
          type: "object",
          properties: {
            startDate: {
              type: "string",
              description:
                "Start date for the search in 'YYYY-MM-DD' format, derived from user's request (e.g., 5 days ago).",
            },
            endDate: {
              type: "string",
              description: "End date for the search in 'YYYY-MM-DD' format (usually today, unless specified by user).",
            },
            userId: {
              type: "string",
              description: "Unique identifier for the logged-in user.",
            },
          },
          required: ["startDate", "endDate"],
        },
      };

      // Initializing the model with tools
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        tools: [
          {
            functionDeclarations: [
              getSummaryTagsFunctionDeclaration,
              getSummaryDateFunctionDeclaration
            ],
          },
        ]
      });
      console.log("Model :", model)
      const promptText = searchPrompt;
      console.log("Search prompt : ", promptText)


      const responses = await model.generateContent({
        contents: [{ parts: [{ text: promptText }] }],
      }).catch((err) => console.log(err));

      //console.log(response.response.candidates)
      let response = responses.response
      if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0].functionCall) {
        const functionCall = response.candidates[0].content.parts[0].functionCall;
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);

        let functionResponse;
        if (functionCall.name === "getSummaryWithDates") {
          functionResponse = await getSummaryWithDates(
            userId, functionCall.args.startDate, functionCall.args.endDate
          );
        } else if (functionCall.name === "getSummaryWithTags") {
          functionResponse = await getSummaryWithTags(
            userId, functionCall.args.tags
          );
        }
        resolve(functionResponse)
        //const result = await getCurrentTemperature(functionCall.args);
      } else {
        console.log("No function call found in the response.");
        console.log(response.text);
      }
    } catch (error) {
      reject(error)
    }
  });
};

module.exports = searchReads;
