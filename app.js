const path = require('path');
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const port = process.env.PORT || 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Serving on port ${port}!`);
});