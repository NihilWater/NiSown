const express = require("express")
const registerRouter = require("./router")
const app = express();

registerRouter(app)
exports.server = app;
