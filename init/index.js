const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");
// ✅ Fixed import path

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => { console.log(err) });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// Initialize the database
const initDB = async () => {
  await Listing.deleteMany({}); // ✅ Clears old data
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "67bf51b705b935c7d76f7b49" }))//create new array
  await Listing.insertMany(initData.data); // ✅ initData is a object
  console.log("Data was initialized");
}

initDB();
