const fetch = require('node-fetch');
const twilio = require('twilio');
const qs = require('querystring');

const VoiceResponse = twilio.twiml.VoiceResponse;

exports.handler = async () => {

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
    body: `
    <Response>
    <Say>Welcome to the Donut on Demand I V R!</Say>
    </Response>
    `,
  };
};
