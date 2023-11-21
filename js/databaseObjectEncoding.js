/** @format */
// //Connect to the database
// const sqlite3 = require('sqlite3').verbose();
// const dbPath = '"C:Users/naiya/Zuozhuan Map - Beta Version/Database.sqlite"';

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(
	__dirname,
	'../Database.sqlite'
);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('Connected to the database');
	}
});

//Create the objects
const objects = [];

db.all('SELECT * FROM locales_corrected', (err, rows) => {
	if (err) {
		console.error('Error executing query:', err);
	} else {
		rows.forEach((row) => {
			const object = {};
			for (const key in row) {
				if (row.hasOwnProperty(key)) {
					object[key] = row[key];
				}
			}
			objects.push(object);
		});

		// Convert the data into a JSON string
		const object = JSON.stringify(rows, null, 2); // Use null and 2 for pretty formatting

		// Write the data to a file
		fs.writeFile('data.json', object, 'utf8', (err) => {
			if (err) {
				console.error('Error writing file:', err);
			} else {
				console.log('Data written to data.json');
			}
		});
		console.log('objects', objects);
	}
} );
//Close the DB connection
db.close((err) => {
	if (err) {
		console.error('Error closing database:', err);
	} else {
		console.log('Database connection closed.');
	}
} );
