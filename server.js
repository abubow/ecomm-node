var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
  res.redirect("/about");
  res.send("Express http server listening on 8080");
});

app.use(express.static("public"));

// setup http server to listen on HTTP_PORT
app.listen(process.env.PORT || 8080);
