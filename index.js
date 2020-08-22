/** @format */

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const userController = require("./controllers/userController").userController;
const cors = require("cors");
const { serverConfig } = require("./config/config");
const requestResponseHandler = require("./services/requestResponseHandler");
const PORT = serverConfig.PORT;
// express app initialised
var app = express();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
const userRouter = express.Router();

// enable cors request from browser
app.use(cors());

//body parser to retrieve data from form body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", requestResponseHandler.verifyClient);

app.use("/api/v1/user", userRouter);
userController(userRouter);

// Success Response
app.use(requestResponseHandler.handleResponse);

//404 error handling
app.use(requestResponseHandler.handle404);

// Generic Error Handling
app.use(requestResponseHandler.handleError);

app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server running on ${PORT} port`);
	}
});
