const { failureResponse, successResponse } = require('../helpers/responseSchema')
const statusCodes = require('../helpers/statusCodes.json')
const summarize = require('../logic/summarize.js')

const summarizeResponse = async (req, res) => {
    try {
        let resource = req.body.resource
        let userId= req.query.userId
        let summary = await summarize(resource,userId)
        //.catch(error => {
        //     let failure = failureResponse(statusCodes.BAD_REQUEST.status, error, statusCodes.BAD_REQUEST.statusCode)
        //    res.status(failure.statusCode).send(failure.body)
        //  })
        if (summary) {
            res.send(summary)
            //      let success = successResponse(summary, statusCodes.OK.statusCode)
            //      res.status(success.statusCode).send(success.body)
        }
    } catch (error) {
        console.log(error)
        // let failure = failureResponse(statusCodes.INTERNAL_SERVER_ERROR.status, error.message, statusCodes.INTERNAL_SERVER_ERROR.statusCode)
        //res.status(failure.statusCode).send(failure.body)
    }
}

module.exports = summarizeResponse