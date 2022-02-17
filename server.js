const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routers/router')
const http = require("http");
const dotenv = require("dotenv");
const app = express()
const logger = require('pino')()




app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    extended: true,
  })
);

dotenv.config({
  path: __dirname + "/.env",
});
  
app.use("/", routes);

const httpServer = http.createServer(app);

httpServer.listen(7000, () => {
  logger.info({
    msg: "Servidor HTTP rodando na porta 7000"
  });
});