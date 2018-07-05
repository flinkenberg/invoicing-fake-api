import express from "express";
import bodyParser from "body-parser";
import routes from "./app/routes/routes";
import * as config from "./api-config.json";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app, config);

const server = app.listen(config.port || 3000, () => (
    console.log(`App running on port: ${server.address().port}`)
));