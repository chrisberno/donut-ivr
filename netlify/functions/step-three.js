const fetch = require('node-fetch');
const twilio = require('twilio');
const qs = require('querystring');

const VoiceResponse = twilio.twiml.VoiceResponse;

exports.handler = async (event) => {
  const { Digits, From: toNumber, To: fromNumber } = qs.parse(event.body);
  const { type: firstType } = event.queryStringParameters;

  console.log({ Digits });

  const types = await fetch('http://localhost:3000/types').then((res) =>
    res.json(),
  );

  const secondType = types[Digits - 1];

  if (!secondType) {
    console.error('oops');
  }

  const donuts = await fetch(
    `http://localhost:3000/donuts?type=${firstType},${secondType}`,
  ).then((res) => res.json());

  const donut = donuts[0];

  const msg = `Your dream donut is a ${donut.title}.`;

  const twiml = new VoiceResponse();

  twiml.say(`${msg} We will text you this information for posterity.`);

  // TODO send SMS
  const client = twilio();

  client.messages.create({
    to: toNumber,
    from: fromNumber,
    body: `${msg} ${donut.url}`,
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
    body: twiml.toString(),
  };
};
