const express = require('express');
const fetch = require('node-fetch');
const { response } = require('express');
const app = express();
require('dotenv').config()

app.use(express.static('public'));

app.get('/weather/:latlong', async (req, res) => {
    const latlong = req.params.latlong.split(',');
    console.log(latlong)
    const api_key = process.env.API_KEY
    const lat = latlong[0];
    const long = latlong[1];
    const api_url =`https://api.darksky.net/forecast/${api_key}/${lat},${long}`
    const fetch_respone = await fetch(api_url);
    const json = await fetch_respone.json();
    res.json(json)
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`))

