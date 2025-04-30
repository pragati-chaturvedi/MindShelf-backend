const getSummary = require('../logic/getSummary.js')
const { failureResponse, successResponse } = require('../helpers/responseSchema')
const statusCodes = require('../helpers/statusCodes.json')


const getSummaryResponse = async (req, res) => {
    try {
        let userId = req.query.userId
        console.log("User : ", userId)

        let summary = await getSummary(userId).catch(error => {
            let failure = failureResponse(error, statusCodes.BAD_REQUEST.statusCode)
            res.status(failure.statusCode).send(failure.body)
        })
        if (summary) {
            let success = successResponse(summary, statusCodes.OK.statusCode)
            res.status(success.statusCode).send(success.body)
        }
    } catch (error) {
        let failure = failureResponse(statusCodes.INTERNAL_SERVER_ERROR.status, error.message, statusCodes.INTERNAL_SERVER_ERROR.statusCode)
        res.status(failure.statusCode).send(failure.body)
    }
}

module.exports = getSummaryResponse