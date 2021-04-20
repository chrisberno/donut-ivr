const serverlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const express = require('express');
const cors = require('cors');
const donutTypes = require('./data/types.json');
const donuts = require('./data/donuts.json');

const app = express();

app.use(cors());
app.use(express.static('static'));
app.get('/', (req, res) => {
  res.json({
    hello: 'Welcome to the DonutAPI.',
    apis: [
      {
        api: 'donuts',
        description:
          "Get's all Donuts from the api. Can optionally provide type as a a CSV query param",
      },
      {
        api: 'donuts/:id',
        description: "Get's a donut from the api",
      },
      {
        api: 'types',
        description: "Get's all donut types the api",
      },
    ],
  });
});

app.get('/donuts', (req, res) => {
  const type = req.query.type;
  let ds = donuts;
  if (type) {
    const types = type.split(',');
    ds = ds.filter((donut) =>
      donut.types.reduce((acc, type) => {
        return acc || types.includes(type);
      }, false),
    );
  }
  res.json(ds);
});
app.get('/donuts/:donutId', (req, res) => {
  const donutId = req.params.donutId;
  const donut = donuts.find((donut) => donut.id === donutId);
  res.json(donut || {});
});
app.get('/types', (req, res) => res.json(donutTypes));

app.use(awsServerlessExpressMiddleware.eventContext());

const proxy = serverlessExpress.createServer(app);

exports.handler = async (event, context) => {
  const res = await serverlessExpress.proxy(proxy, event, context, 'PROMISE');

  return res.promise;
};
