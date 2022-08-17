const express = require("express");
const cors = require("cors");
const app = express();
const port = 8888;
const HOST = "0.0.0.0";

const userArray = [{ "userName": "eddie" }, { "userName": "Benny" }];

const nameForSending = {"userName": "eddie"} 

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Balance App");
});

//check if query exists in userArray,  if it does not add it
app.get("/getUserName", (req, res) => {
	const requestedName = req.query.enteredName
	console.log('requests params', requestedName)

	if(userArray.findIndex(item => item.userName === requestedName) == -1) {
		console.log('not found creating new profile for', requestedName)
		const jsonRequstedName = `"${requestedName}"`
		userArray.push({"userName": requestedName})
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
