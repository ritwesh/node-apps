// const fetch = require('node-fetch')
const crypto = require('crypto')

exports.handler = async (req, context) => {

  var response

  console.log(req.body)
  console.log(req.headers)

  // construct the message string
  const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`

  const hashForVerify = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(message).digest('hex')

  // hash the message string with your Webhook Secret Token and prepend the version semantic
  const signature = `v0=${hashForVerify}`

  // you validating the request came from Zoom https://marketplace.zoom.us/docs/api-reference/webhook-reference#notification-structure
  if (req.headers['x-zm-signature'] === signature) {

    // Zoom validating you control the webhook endpoint https://marketplace.zoom.us/docs/api-reference/webhook-reference#validate-webhook-endpoint
    if(req.body.event === 'endpoint.url_validation') {
      const hashForValidate = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(req.body.payload.plainToken).digest('hex')

      response = {
        message: {
          plainToken: req.body.payload.plainToken,
          encryptedToken: hashForValidate
        },
        status: 200
      }

      return response;
      // console.log(response.message)
      
      // res.status(response.status)
      // res.json(response.message)
    } else {
      response = { message: 'Authorized request to Webhook Sample Node.js.', status: 200 }
      return response;
      
      // console.log(response.message)
      
      // res.status(response.status)
      // res.json(response)
      
      // business logic here, example make API request to Zoom or 3rd party
      
    }
  } else {
    
    response = { message: 'Unauthorized request to Webhook Sample Node.js.', status: 401 }
    return response;

    // console.log(response.message)

    // res.status(response.status)
    // res.json(response)
  }
};