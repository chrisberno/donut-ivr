const fetch = require('node-fetch');
const twilio = require('twilio');
const qs = require('querystring');

const VoiceResponse = twilio.twiml.VoiceResponse;

exports.handler = async (event) => {
  const { Digits } = qs.parse(event.body);

  console.log({ Digits });

  const types = await fetch('http://localhost:3000/types').then((res) =>
    res.json(),
  );

  const selectedType = types[Digits - 1];

  if (!selectedType) {
    console.error('oops');
  }

  const donuts = await fetch(
    `http://localhost:3000/donuts?type=${selectedType}`,
  ).then((res) => res.json());

  const remainingTypes = new Set();
  donuts.forEach((donut) => {
    donut.types.forEach((dType) => {
      if (dType !== selectedType) {
        remainingTypes.add(dType);
      }
    });
  });

  console.log([...remainingTypes]);

  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: `/.netlify/functions/step-three?type=${selectedType}`,
  });

  gather.say(
    'That sounds delicious. Do you want to further refine your donut match?',
  );

  [...remainingTypes].forEach((donutType, index) => {
    gather.say(`Press ${index + 1} for ${donutType}`);
  });

  gather.say('If you’re happy with your donut type, press 0');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
    body: twiml.toString(),
  };
};
