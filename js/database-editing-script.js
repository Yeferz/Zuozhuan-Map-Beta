/** @format */
/*The aim of this script will be severalfold.
1) To clean excess punctuation.
2) To give locales with unknown locations coordinates based on the mean for the polity with which they are associated. Where there are two or more states, they will be given a location between the means of both.
3) To update the GEOMETRY field based on the new geocoding rules.
*/
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { where } = require('@tensorflow/tfjs');
const dbPath = path.join(__dirname, '../Database.sqlite');
let meanLatLongsArray = [];
//Open the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('Connected to the database');
	}
});
const query = `SELECT * FROM locales_corrected`;
//Run the queries
db.all(query, [], (err, rows) => {
	if (err) {
		console.error(err.message);
		return;
	}
	//This bit of the script aims to take each unique polity and push them to an array, this will be useful later because we will want to assign mean coordinates to each of the categories.
	//We have now isolated all unique polities and pushed them to an array.
	let politiesArray = [];
	let uniquePolitiesArray = new Set();
	for (const row of rows) {
		const stopValue = row.polity;
		const testRegex = RegExp(/\b[A-Z][a-zA-Z]*\b/g);
		if (testRegex.test(stopValue)) {
			const makeBoundaries = stopValue.match(testRegex);
			function location(polity, latitude, longitude) {
				this.polity = polity;
				this.latitude = latitude;
				this.longitude = longitude;
			}
			makeBoundaries.forEach((element) => {
				const polityObject = new location(element, row.latitude, row.longitude);
				politiesArray.push(polityObject);
				// console.log(Object.keys(polityObject));
				uniquePolitiesArray.add(element);
			});
			// console.log(stopValue, testRegex, makeBoundaries);
		}
	}
	//This bit will test all locations and assign them mean coordinates based on the mean for that polity. It loops over the set, and for each value checks against every piece of the
	let totalLatitudes = new Map();
	let totalLongitudes = new Map();
	let latLongTotal = new Map();
	uniquePolitiesArray.forEach((value) => {
		let latitude = 0;
		let longitude = 0;
		let x = 0;
		const loop = value;
		// console.log(loop);
		politiesArray.forEach((value) => {
			let i = 0;
			// console.log(value);
			if (value.polity === loop) {
				latitude = latitude + politiesArray[i].latitude;
				longitude = longitude + politiesArray[i].longitude;
				totalLatitudes.set(loop, latitude);
				totalLongitudes.set(loop, longitude);
				x = x + 1;
				latLongTotal.set(loop, x);
			}
			i += 1;
		});
	});
	//This bit of the codetakes the three maps we just created and finds the matching key pairs, then divides the total coordinates by the number of appearances of the key to give a mean value for each coordinate.
	function meanLatLong(polity, latitude, longitude) {
		this.polity = polity;
		this.latitude = latitude;
		this.longitude = longitude;
	}
	for (let [key, value] of latLongTotal.entries()) {
		const x = value;
		const y = key;
		console.log(value);
		for (let [key, value] of totalLatitudes.entries()) {
			if (key == y) {
				const avgLat = value / x;
				for (let [key, value] of totalLongitudes.entries()) {
					// console.log(key, value);
					if (key == y) {
						const avgLong = value / x;
						const avgObject = new meanLatLong(key, avgLat, avgLong);
						meanLatLongsArray.push(avgObject);
					}
				}
			}
		}
	}
	console.log(
		// politiesArray,
		// uniquePolitiesArray,
		// totalLatitudes,
		// totalLongitudes,
		// latLongTotal,
		meanLatLongsArray
	);
});

//Close the DB connection
db.close((err) => {
	if (err) {
		console.error('Error closing database:', err);
	} else {
		console.log('Database connection closed.');
	}
});
