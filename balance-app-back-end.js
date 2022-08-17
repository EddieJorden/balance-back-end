const express = require("express");
const cors = require("cors");
const app = express();
const port = 8888;
const HOST = "0.0.0.0";

const userArray = [{ "name": "eddie" }, { "name": "Benny" }];

const nameForSending = {"userName": "eddie"} 

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Balance App");
});

//check if query exists in userArray,  if it does not add it
app.get("/getUserName", (req, res) => {
	userArray.forEach((userObject) => {
		if(userObject.name === req.query.enteredName) {
			console.log('user found ', userObject)
			res.send(userObject)
		} else {
			console.log('name not found')
			console.log('name entered = ', req.query.enteredName)
		}
	})
});

app.listen(port, () => {
  console.log(`Balance App is listening at ${HOST} : ${port}`);
});
