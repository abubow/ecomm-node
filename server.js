var express = require('express');
var app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route: "/"
app.get('/', (req, res) => {
  res.redirect('/about');
});

// Route: "/about"
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express http server listening on port ${port}`);
});


// var express = require("express");
// var app = express();
// var HTTP_PORT = process.env.PORT || 8080;

// // setup a 'route' to listen on the default url path
// app.get("/", (req, res) => {
//     res.redirect("/about"); 
//   res.send(
//     "Express http server listening on 8080"
//   );
// });

// app.use(express.static('public')); 

// // setup http server to listen on HTTP_PORT
// app.listen(process.env.PORT || 8080);