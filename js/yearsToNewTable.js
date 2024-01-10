/** @format */

'use strict';

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '../Database.sqlite');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('Connected to the database');
	}
});
db.run(
	'CREATE TABLE IF NOT EXISTS separated_years (id INTEGER PRIMARY KEY, year INTEGER, latitude FLOAT, longitude FLOAT)'
);
db.all('SELECT * FROM locales_corrected', (err, rows) => {
	if (err) {
		console.error('Error executing query:', err);
	} else {
		rows.forEach((row) => {
			if (row.years != null) {
				const stopValue = row.years;
				const latitude = row.latitude;
				const longitude = row.longitude;
				const individualYears = stopValue.split(',');
				individualYears.forEach((year) => {
					const query = `INSERT INTO separated_years (year, latitude, longitude) VALUES (${year}, ${latitude}, ${longitude})`;
					console.log(query);
					db.run(query, function (err) {
						if (err) {
							return console.log(err.message);
						}
					});
				});
				console.log(individualYears);
			} else {
				console.log('null value');
			}
		});
	}
});
//Close the DB connection
db.close((err) => {
	if (err) {
		console.error('Error closing database:', err);
	} else {
		console.log('Database connection closed.');
	}
});
