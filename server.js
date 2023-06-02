var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

// Require the store-service module
var storeService = require("./store-service");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Setup a route to redirect the root path to "/about"
app.get("/", (req, res) => {
  res.redirect("/about");
});

// Setup a route to return the about.html file from the views folder
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

// Setup a route to get all items
app.get("/items", (req, res) => {
  storeService
    .getAllItems()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

// Setup a route to get all categories
app.get("/categories", (req, res) => {
  storeService
    .getAllCategories()
    .then((categories) => {
      res.json(categories);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

// Setup a route to get published items
app.get("/shop", (req, res) => {
  console.log("GET /shop");
  storeService
    .getPublishedItems()
    .then((publishedItems) => {
      res.json(publishedItems);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

// Setup a 404 route
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialize the store-service module
storeService
  .initialize()
  .then(() => {
    // Start the server only after successful initialization
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on port " + HTTP_PORT);
    });
  })
  .catch((error) => {
    // Log the error message if initialization fails
    console.error("Error initializing store-service:", error);
  });
