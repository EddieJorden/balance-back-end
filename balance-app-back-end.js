const express = require('express');
const app = express();
const port = 3000;
const HOST = '0.0.0.0'

app.get('/', (req, res) => {
	res.send('Hello World sah');
})

app.listen(port, () => {
	console.log(`listening at ${HOST}:${port}`);
})
