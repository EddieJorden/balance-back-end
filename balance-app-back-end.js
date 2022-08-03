const express = require('express');
const app = express();
const port = 3000;
const HOST = '0.0.0.0'

app.get('/', (req, res) => {
	res.send('Welcome to Balance App');
})

app.listen(port, () => {
	console.log(`Balance App is listening at ${HOST} : ${port}`);
})
