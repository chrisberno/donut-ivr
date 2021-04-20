const fetch = require('node-fetch');
const twilio = require('twilio');
const qs = require('querystring');

const VoiceResponse = twilio.twiml.VoiceResponse;

exports.handler = async (event) => {
  const types = await fetch(`${process.env.URL}/types`).then((res) =>
    res.json(),
  );

  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: '/.netlify/functions/step-two',
  });

  gather.say('Please choose from one of the following options.');

  types.forEach((donutType, index) => {
    gather.say(`Press ${index + 1} for ${donutType}`);
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
    body: twiml.toString(),
  };
};
