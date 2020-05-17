// {{{ Imports
const express = require("express");
const mongoose = require("mongoose");
const Hive = require("./models/hive");
// }}}

// configure env with dotenv
require("dotenv").config();

// {{{ load envvars
const port = 5000 || process.env.PORT;
const dbUri = process.env.DATABASE_URI;
const publicDir = false || process.env.PUBLICDIR;
const app = express();


publicDir ? app.use(express.static(publicDir)): console.log("No PUBLICDIR definde in .env") ;
app.use(express.json());
// }}}

// {{{ Route GET/init/:name
// Route /init/:name tests if a beehive with name : :name is in the DB if it finds one it return the objectID else
// it creates one
app.get("/init/:name", (req, res) => {
	Hive.findOne({name: req.params.name}, (err, doc) => {
		if (err){
			console.log(`ERROR @ GET/init/:name : ${err}`);
			res.status(500).send();
		}else if (doc === null) {
			const hive = new Hive({name: req.params.name, data: []});
			hive.save().then(j => res.json({ _id: j._id }));
			console.log(`DB : creating new hive: ${req.params.name}`);
		} else {
			res.json({ _id: doc._id });
			return 1;
		}
	});
});
// }}}

// {{{ Route GET/id/:id
app.get("/id/:id", (req, res) => {
	Hive.findById(req.params.id, (err, doc) => {
		if (err){
			console.log(`ERROR @ GET/id/:id: ${err}`);
			res.status(500).send();
		} else if (!doc) {
			res.status(404).send();
		} else {
			const resontBody = {
				_id: doc._id,
				name: doc.name,
				data: doc.data
			};
			res.send(resontBody);
		}
	});
});
// }}}

// {{{ Route GET/name/:name
app.get("/name/:name", (req, res) => {
	Hive.findOne({name: req.body.name}, (err, doc) => {
		if (err){
			console.log(`ERROR @ GET/id/:id: ${err}`);
			res.status(500).send();
		} else if (doc === null) {
			res.status(404).send();
		} else {
			const resontBody = {
				_id: doc._id,
				name: doc.name,
				data: doc.data
			};
			res.send(resontBody);
		}
	});
});
// }}}

// {{{ Route POST/add
app.post("/add", (req, res) => {
	if (req.body._id && req.body.weight) {
		console.log(`New entry from ${req.body._id}: ${req.body.weight}`);
		Hive.findById(req.body._id, (err, doc) => {
			if(err){
				console.log(`ERROR @ POST/add : ${err}`);
				res.status(500).send();
			} else {
				if (!doc) {
					res.status(404).send();
				}
				doc.data.push({ time: Date.now(), weight: req.body.weight });
				//console.log(doc);

				doc.save((err, doc) => {
					if (err) {
						console.log(`ERROR @ POST/add : ${err}`);
						res.status(500).send();
					} else {
						res.send(doc);
					}
				});
			}
		});
	} else res.status(404).send();
});
// }}}

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true } );

const db = mongoose.connection;
db.on("error", err => console.log(`Connection Error: ${err}`));
db.once("open", ()=> {
	console.log("DB connected");
	app.listen(port, () => console.log(`Server listening on port: ${port}`));
});
// vim:fdm=marker:fdls=0
