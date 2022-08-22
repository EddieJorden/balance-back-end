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

	const isValidName = (name) => {
		if(requestedName.length < 60 &&
					requestedEmail.length < 60){
						console.log(`${name} passed`)
						return true
					} else return false
	}

	const isValidEmail = (email) => {
		if(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(email)) {
					console.log(`${email} passed`);
					return true;
		} else {
			console.log('email did not pass');
			return false;
		}
	}
	const isNameValid = isValidName(requestedName)

	const isEmailValid = isValidEmail(requestedEmail)

	if(isNameValid && isEmailValid) {
			//if not found create new profile
	if(userArray.findIndex(item => 
		item.userName.toUpperCase() === requestedName.toUpperCase() &&
		item.userEmail.toUpperCase() === requestedEmail.toUpperCase()) == -1
) {
		console.log(`user name: ${requestedName} or email: ${requestedEmail} not found`)
		console.log(`CREATING NEW PROFILE! user name: ${requestedName}, email: ${requestedEmail}`)
		const newUser = {
			userName: requestedName,
			userEmail: requestedEmail,
			userStatus: 'new user'
		}
		userArray.push(newUser)
		res.send(newUser)
		} else {
			console.log(`${requestedName} found`)
			let userIndex = userArray.findIndex(item => item.userName === requestedName)
			let userObject = userArray[userIndex]
			console.log('sending...', userObject)
			const existingUser = {
				userName: userArray[userIndex].userName,
				userEmail: userArray[userIndex].userEmail,
				userStatus: 'existing user'
			}
			res.send(existingUser)
		}
	}
			console.log(`USER ARRAY: `, userArray)
});

app.listen(port, () => {
  console.log(`Balance App is listening at ${HOST} : ${port}`);
});
