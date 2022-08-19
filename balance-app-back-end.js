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

//check if query exists in userArray,  and returns or creates new user and returns
app.get("/getUserProfile", (req, res) => {
	const requestedName = req.query.enteredProfileName
	const requestedEmail = req.query.enteredProfileEmail
	console.log('requests params name ', requestedName)
	console.log('requests params email ', requestedEmail)

	if(userArray.findIndex(item => item.userName === requestedName) == -1) {
		console.log('not found creating new profile for', requestedName)
		const jsonRequstedName = `"${requestedName}"`
		userArray.push({"userName": requestedName, "userEmail": requestedEmail})
		const newUser = userArray[userArray.length - 1]
		res.send(newUser)
	} else {
		console.log('found')
		console.log(userArray.findIndex(item => item.userName === requestedName))
		let userIndex = userArray.findIndex(item => item.userName === requestedName)
		let userObject = {
			"userName": userArray[userIndex].userName
		}
		console.log(userObject)
		res.send(userObject)
	}
	console.log(userArray)
});

app.listen(port, () => {
  console.log(`Balance App is listening at ${HOST} : ${port}`);
});
