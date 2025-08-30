"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv = require("dotenv");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
dotenv.config();
var Port = process.env.PORT || 3000;
app.listen(Port, function () {
    console.log("Server is running on port ".concat(Port));
});
