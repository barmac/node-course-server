const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'maintenance'
//   });
// });

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  console.log(req);
  console.log(res);
  next();
});

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `request at ${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.send({
    hello: 'Hello Express!',
    tru: true
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'about',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: '400 Bad Request'
  });
});


app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});

app.get(/^\/test\/(\\d+)\/$/, (req, res) => {
  res.send({
    id: req.params[0]
  });
});