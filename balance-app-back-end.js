const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require('dotenv').config();
const dbConfig = require("./config")


const app = express();
const port = process.env.PORT || 8888;
const HOST = "0.0.0.0";

const userArray = [];

const corsOptions = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req,res) => {
  res.send("Welcome to Balance App");
});

const db = mysql.createConnection({
	host: dbConfig.host,
	port: dbConfig.port,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
})

db.connect((err) => {
	if (err) {
		console.log(err.message)
		return;
	}
	console.log("database connected.")
})

app.post("/adduser", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const addUserQuery = `
    INSERT INTO users (username, email)
    SELECT * FROM (SELECT ?, ?) AS tmp
    WHERE NOT EXISTS (
        SELECT email FROM users WHERE email = ?
    ) LIMIT 1;
  `;

  db.query(addUserQuery, [username, email, email], (error, result) => {
    if (error) throw error;
    if (result.affectedRows > 0) {
      res.send({message: "User added successfully", user: {username, email}});
    } else {
      res.send({message: "User already exists", user: {username, email}});
    }
  });
});

app.post('/user', async (req, res) => {
    try {
        const { name, email, tasks, user_status } = req.body;
        const result = await db.query(`INSERT INTO user_profiles (name, email, tasks, user_status) VALUES ($1, $2, $3, $4)`, [name, email, tasks, user_status]);
				const check = await db.query(`SELECT * FROM user_profiles WHERE name = $1`, [name]);
        console.log(check.rows);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.get('/user', async (req, res) => {
  try {
    const { name, email } = req.query;

    const result = await db.query(`SELECT * FROM user_profiles WHERE name = $1 and email = $2`, [name, email]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.patch('/user/task', async (req, res) => {
  try {
    const { name, email, task } = req.body;
		const taskJson = JSON.stringify(task);
		console.log('taskJson', taskJson)

    const result = await db.query(`UPDATE user_profiles SET tasks = jsonb_set(tasks, '{task1}', to_jsonb($1), true) WHERE name = $2 and email = $3`, [taskJson, name, email]);
    if (result.rowCount > 0) {
      res.status(200).json({ status: 'success', message: 'Task added' });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
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
		if(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i.test(email)) {
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
				userTasks: userArray[userIndex].userTasks
			}
			res.send(existingUser)
		}
	}
			console.log(`USER ARRAY: `, userArray)
});



app.post('/createNewTask', (req, res) => {
	// find user
	console.log('req.query', req.query)
	const userName = req.query.enteredProfileName;
	const userEmail = req.query.enteredProfileEmail;
	const enteredTask = req.query.enteredTask
	if(userArray.length === 0) res.send('user not found')
	if(userArray.length > 0) {
		userArray.forEach(user => {
			if(user.userName === userName && user.userEmail === userEmail) {
				console.log('user name and email match! new task added')
				user.userTasks.push(enteredTask)
				console.log('user', user)
				res.send(user)
			} else {
				console.log('user name or email do not match! unable to add task')
				res.send('user not found')
			}
		})
	}
})

// const express = require('express');
const request = require('request');

app.get('/fetch-chatgpt-response', (req, res) => {
  // Get the prompt from the query parameters
  const prompt = req.query.prompt;
	const apiKey = process.env.API_KEY;

	console.log(prompt)
  // Make a request to the chatgpt endpoint with the prompt
  request.post('https://api.openai.com/v1/completions', {
    json: {
      prompt: prompt,
			model: "text-davinci-003",
			max_tokens: 2048
    },
    headers: {
      'Authorization': 'Bearer ' + apiKey
    }
  }, (error, response, body) => {
    if (error) {
			console.log('Error:', error);
      // Return an error response if there was a problem with the request
      res.status(500).send({ error: error });
    } else {
      // Return the response from chatgpt
			console.log('body', body)
      res.send(body);
    }
  });
});

app.listen(port, () => {
  console.log(`Balance App is listening at ${HOST} : ${port}`);
});
