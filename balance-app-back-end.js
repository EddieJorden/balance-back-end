const express = require("express");
const cors = require("cors");
const pool = require("./database")

const app = express();
const port = 8888;
const HOST = "0.0.0.0";

const userArray = [];

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Welcome to Balance App");
});

//get a user 

//create a user
app.post("/user", async(req, res) => {
	try {
		const { userName } = req.body;
		const newUser = await pool.query("INSERT INTO userProfile (description) VALUES ($1) RETURNING *",
		[userName]
		);
		res.json(newUser)
	} catch (err) {
		console.error({error: err.message})
	}
})

//update user

//delete user



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

	if(isNameValid && isEmailValid && requestedName !== "user name" && requestedEmail !== "mail@email.com") {
			//if not found create new profile
		// userArray.filter(profile => profile.userName === requestedName)

	if(userArray.findIndex(item => 
		item.userName.toUpperCase() === requestedName.toUpperCase() &&
		item.userEmail.toUpperCase() === requestedEmail.toUpperCase()) == -1
) {
		console.log(`user name: ${requestedName} or email: ${requestedEmail} not found`)
		console.log(`CREATING NEW PROFILE! user name: ${requestedName}, email: ${requestedEmail}`)
		const newUser = {
			userName: requestedName,
			userEmail: requestedEmail,
			userTasks: [],
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
				userStatus: 'existing user',
				userTasks: 'test task'
			}
			res.send(existingUser)
		}
	}
			console.log(`USER ARRAY: `, userArray)
});

app.post('/createNewTask', (req, res) => {
	// find user
	console.log('req.query', req.query)
	console.log('userArray', userArray)
	const userName = req.query.enteredProfileName;
	const userEmail = req.query.enteredProfileEmail;
	const enteredTask = req.query.enteredTask
	if(userArray.length > 0) {
		userArray.forEach(user => {
			if(user.userName === userName && user.userEmail === userEmail) {
				console.log('user name and email match! new task added')
				user.userTasks.push(enteredTask)
				res.send(user)
			} else {
				console.log('user name or email do not match! unable to add task')
				res.send('user not found')
			}
		})
	} else {
		res.send('user not found')
	}
})

app.listen(port, () => {
  console.log(`Balance App is listening at ${HOST} : ${port}`);
});
