const dbrequest = require("../helpers/dbRequest");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const getSummaryWithKeywords = require("./getSummaryWithTags");
const getSummaryWithDates = require("./getSummaryWithDates");


const searchReads = (userId, searchPrompt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      let sysDate = new Date().toISOString()
      //function declarations
      const getSummaryKeywordFunctionDeclaration = {
        name: "getSummaryWithKeywords",
        description: "If the user asks to see, fetch, list, or recall any summaries, articles, or mindfiles related to a specific topic, tag, or keyword — extract those keywords or tags from the prompt (ignoring case) and return summaries using them. If the user refers to prior reads or articles indirectly using vague terms (e.g. 'those articles about X', 'stuff on Y', 'my reads on Z'), infer the intended topic as a keyword. Do not ignore single-word or generic-sounding keywords like 'white', 'war', 'plan', etc. Always extract the most semantically relevant keywords from the prompt and use them to call this function. Ignore case completely when matching.",
        parameters: {
          type: "object",
          properties: {
            tags: {
              type: "array",
              items: { type: "string" },
              description: "List of user-specified tags or topics to filter mindfiles.",
            }
          },
          required: ["tags"],
        },
      };

      const getSummaryDateFunctionDeclaration = {
        name: "getSummaryWithDates",
        description:
          `The user may reference time using phrases like 'last week', 'past 3 days', 'yesterday', 'this month', 'in January', or exact dates like 'July 5'. Parse these time expressions and return a startDate and endDate in ISO 8601 format. If the user uses vague phrases like 'recent summaries', 'show what I read', or 'my past reads', default to the last 7 days. Always use today's date as the endDate, which is ${sysDate}. Ensure the startDate is also in ISO 8601 format and always starts at T00:00:00.000Z. Be strict: any reference to time means this function must be called.`,
        parameters: {
          type: "object",
          properties: {
            startDate: {
              type: "string",
              description:
                "Start date for the search in ISO 8601 format, parsed from relative or absolute date references in the user’s prompt (e.g., 5 days ago, last week, January 1st).",
            },
            endDate: {
              type: "string",
              description:
                "End date for the search in ISO 8601 format. Default to today's date unless the user specifies a different endpoint.",
            }
          },
          required: ["startDate", "endDate"],
        },
      };


      // Initializing the model with tools
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: [
          {
            functionDeclarations: [
              getSummaryKeywordFunctionDeclaration,
              getSummaryDateFunctionDeclaration
            ],
          },
        ]
      });
      const promptText = searchPrompt;
      // console.log("Search prompt : ", promptText)

      const responses = await model.generateContent({
        contents: [{ parts: [{ text: promptText }] }],
      }).catch((err) => console.log(err));

      let response = responses.response;

      // **ADD THESE LOGS (keep them for now to confirm the fix)**
      // console.log("Full API Response Object (responses):", JSON.stringify(responses, null, 2));
      // console.log("Response object passed to logic (response):", JSON.stringify(response, null, 2)); // New log for clarity
      // console.log("Does response.candidates exist now?", response.candidates !== undefined); // This should be true
      // **END OF NEW LOGS**

      if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0].functionCall) {
        const functionCall = response.candidates[0].content.parts[0].functionCall;
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);

        let functionResponse;
        if (functionCall.name === "getSummaryWithDates") {
          functionResponse = await getSummaryWithDates(
            userId, functionCall.args.startDate, functionCall.args.endDate
          );
        } else if (functionCall.name === "getSummaryWithKeywords") {
          functionResponse = await getSummaryWithKeywords(
            userId, functionCall.args.tags
          );
        }
        // console.log("function response : ", functionResponse)
        resolve(functionResponse)
        //const result = await getCurrentTemperature(functionCall.args);
      } else {
        console.log("No function call found in the response.");
        console.log("response.text", response.text);
      }
    } catch (error) {
      reject(error)
    }
  });
};


// Test runner
// if (require.main === module) {
//   require('dotenv').config(); // Load env vars from .env file
//   const userId = "3VvkLCx13waCcVuqqAyR7b3YG2K2";
//   const searchPrompt = "Show me summaries for articles I read on 11 July";

//   searchReads(userId, searchPrompt)
//     .then((res) => {
//       console.log("Final Result:", res);
//     })
//     .catch((err) => {
//       console.error("Error occurred:", err);
//     });

//   // // Test getSummaryWithTags
//   // console.log("\n--- Testing getSummaryWithTags ---");
//   // getSummaryWithTags(userId, ["Portfolio"])
//   //   .then((res) => {
//   //     console.log("getSummaryWithTags Result:", JSON.stringify(res, null, 2));
//   //   })
//   //   .catch((err) => {
//   //     console.error("Error in getSummaryWithTags:", err);
//   //   });

//   // // Test getSummaryWithDates - Last 7 days
//   // // Use a date calculation for convenience
//   // const today = new Date();
//   // const lastWeek = new Date();
//   // lastWeek.setDate(today.getDate() - 7);

//   // const formatDate = (date) => date.toISOString().split('T')[0]; // YYYY-MM-DD

//   // const startDate = formatDate(lastWeek);
//   // const endDate = formatDate(today);

//   // console.log(`\n--- Testing getSummaryWithDates (from ${startDate} to ${endDate}) ---`);
//   // getSummaryWithDates(userId, startDate, endDate)
//   //   .then((res) => {
//   //     console.log("getSummaryWithDates Result:", JSON.stringify(res, null, 2));
//   //   })
//   //   .catch((err) => {
//   //     console.error("Error in getSummaryWithDates:", err);
//   //   });
// }

module.exports = searchReads;
