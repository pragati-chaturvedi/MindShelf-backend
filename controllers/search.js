const search = require('../logic/search.js')
const { failureResponse, successResponse } = require('../helpers/responseSchema')
const statusCodes = require('../helpers/statusCodes.json')


const searchResponse = async (req, res) => {      
    try {
       let userId = req.query.userId
      let prompt= req.body.prompt
        let summary = await search(userId,prompt).catch(error => {
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

module.exports = searchResponse