const fs = require("fs");

// Initialize the module data
let items = [];
let categories = [];

// Helper function to read JSON files
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject("Unable to read the file");
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// Initialize the module
function initialize() {
  return new Promise((resolve, reject) => {
    readFile("./data/items.json")
      .then((itemsData) => {
        items = itemsData;
        return readFile("./data/categories.json");
      })
      .then((categoriesData) => {
        categories = categoriesData;
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Get all items
function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No results returned");
    } else {
      resolve(items);
    }
  });
}

// Get published items
function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter((item) => item.published === true);
    if (publishedItems.length === 0) {
      reject("No results returned");
    } else {
      resolve(publishedItems);
    }
  });
}

// Get all categories
function getAllCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("No results returned");
    } else {
      resolve(categories);
    }
  });
}

// Exported functions
module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getAllCategories,
};
