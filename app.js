const express = require('express');
//const expressLayouts = require('express-layouts')

const app = express();
app.set('view engine', 'ejs');

//render ui
app.get('/', (req, res) => {
    res.render('index')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`))

