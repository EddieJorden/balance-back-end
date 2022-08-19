const express = require("express");
const cors = require("cors");
const app = express();
const port = 8888;
const HOST = "0.0.0.0";

const userArray = [];

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Balance App");
});

//If name exists in users returns user profile else craetes new user and returns user profile.
app.get("/getUserProfile", (req, res) => {
	const requestedName = req.query.enteredProfileName
	const requestedEmail = req.query.enteredProfileEmail
	console.log({requestedName})
	console.log({requestedEmail})

	if(userArray.findIndex(item => item.userName === requestedName) == -1) {
		console.log(`user name: ${requestedName} not found creating new profile for user name: `, requestedName)
		userArray.push({"userName": requestedName, "userEmail": requestedEmail})
		const newUser = userArray[userArray.length - 1]
		res.send(newUser)
	} else {
		console.log(`${requestedName} found`)
		let userIndex = userArray.findIndex(item => item.userName === requestedName)
		let userObject = userArray[userIndex]
		console.log('sending', userObject)
		res.send(userObject)
	}
	console.log(userArray)
});

app.listen(port, () => {
  console.log(`Balance App is listening at ${HOST} : ${port}`);
});
