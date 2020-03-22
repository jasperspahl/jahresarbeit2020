const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const HiveSchema = new Schema({
	name: String,
	data: [{time: Date, weight: Number}]
});

const Hive = mongoose.model("hive", HiveSchema);

module.exports = Hive;
