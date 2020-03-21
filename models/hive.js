const mongoose, { Schema } = require("mongoose");

const HiveSchema = new Schema({
	name: String;
	weight: Number;
	time: Date;
});

const Hive = mongoose.model('hive', HiveSchema);

module.exports = Hive;
