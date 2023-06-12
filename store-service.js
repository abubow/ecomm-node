const fs = require("fs");

// Initialize the module data
let items = [];
let categories = [];

// Helper function to read JSON files
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject("Unable to read the file: " + filePath + "");
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


function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredItems = [];
    
    for (let i=0; i<items.length; i++) {
      if (items[i].category == category) {
        filteredItems.push(items[i]);
      }
    }
    if (filteredItems.length === 0) {
      reject("No results returned");
    } else {
      resolve(filteredItems);
    }
  });
}


function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const filteredItems = items.filter(
      (item) => new Date(item.postDate) >= new Date(minDateStr)
    );
    if (filteredItems.length === 0) {
      reject("No results returned");
    } else {
      resolve(filteredItems);
    }
  });
}

function getItemById(id) {
  return new Promise((resolve, reject) => {
    let foundItem;
    for (let i = 0; i <items.length; i++) {
      if (items[i].id == id) {
        foundItem = items[i]
      }
    }
    if (!foundItem) {
      reject("No result returned");
    } else {
      resolve(foundItem);
    }
  });
}

// Get published items
function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = [];
    for (let i = 0; i < items.length; i++){
      if (items[i].published === true){
        publishedItems.push(items[i])
      }
    }
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

// Add item
function addItem(itemData) {
  return new Promise((resolve, reject) => {
    if (itemData.published === undefined) {
      itemData.published = false;
    } else {
      itemData.published = true;
    }

    itemData.id = items.length + 1;

    items.push(itemData);
    resolve(itemData);
  });
}

// Exported functions
module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getAllCategories,
  addItem,
  getItemById,
  getItemsByMinDate,
  getItemsByCategory
};
