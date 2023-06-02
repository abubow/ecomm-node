var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

// Serve static files from the "public" directory
app.use(express.static("public"));

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
  res.redirect("/about");
});

// setup a route to return the about.html file from the views folder
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, () => {
  console.log("Express http server listening on port " + HTTP_PORT);
});
