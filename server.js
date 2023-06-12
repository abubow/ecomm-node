var express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "difa9bzwr",
  api_key: "261662171674338",
  api_secret: "KIIZuhN8Nw0_DEJySWmeuv2IOFM",
});

const upload = multer();

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
  const { category, minDate } = req.query;

  if (category) {
    storeService
      .getItemsByCategory(category)
      .then((items) => {
        res.json(items);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } else if (minDate) {
    storeService
      .getItemsByMinDate(minDate)
      .then((items) => {
        res.json(items);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } else {
    storeService
      .getAllItems()
      .then((items) => {
        res.json(items);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  }
});


app.get("/item/:value", (req, res) => {
  const itemId = req.params.value;
  console.log(itemId);
  storeService
    .getItemById(itemId)
    .then((item) => {
      res.json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

app.get("/items/add", (req, res) => {
  res.sendFile(__dirname + "/views/addItem.html");
});

app.post("/items/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req)
      .then((uploaded) => {
        processItem(uploaded.url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        processItem(error.url);
      });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;

    storeService
      .addItem(req.body)
      .then((item) => {
        res.redirect("/items");
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        res.status(500).json({ error: error });
      });
  }
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
