/** @format */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const yearsColumn = 'years';
const reignYears = {
	Ai: 494,
	Ding: 508,
	Zhao: 540,
	Xiang: 571,
	Cheng: 589,
	Xuan: 607,
	Wen: 625,
	Xi: 658,
	Min: 660,
	Zhuang: 692,
	Huan: 710,
	Yin: 722,
};

const dbPath = path.join(__dirname, '../Database.sqlite');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('Connected to the database');
	}
});
// const createYears = `ALTER TABLE locales_corrected ADD ${yearsColumn} VARCHAR;`;
// const removeYears = `ALTER TABLE locales_corrected DROP COLUMN ${yearsColumn};`;
// db.all(removeYears);
// db.all(createYears);
let ogcKey = 0;
let yearsArr = [];
let reignsArr = [];
let uniqueReignsArr = [];
function yearsObject(id, years) {
	this.id = id;
	this.years = years;
}
let idRef;
// Perform a query to select rows from a table
const query = 'SELECT * FROM locales_corrected';
db.all(query, [], (err, rows) => {
	if (err) {
		console.error(err.message);
		return;
	}
	// Loop through the rows
	for (const row of rows) {
		const stopValue = row.entries; // Replace 'columnName' with the name of your column

		// Check if stopValue matches any key in reignYears
		for (const key in reignYears) {
			const regexPattern = new RegExp(`\\b${key}\\b`);
			if (regexPattern.test(stopValue)) {
				const intValue = parseInt(stopValue.match(/\d+/)[0]);
				const result = reignYears[key] - intValue;
				// console.log(
				// 	`Entry: ${stopValue}, Matched Key: ${key}, Result: ${result}`
				// );
				// console.log(row.ogc_fid);
				if (row.ogc_fid > ogcKey) {
					ogcKey++;
					yearsArr = [];
				}
				yearsArr.push(result);
				// console.log(ogcKey);
				const yearsArrString = yearsArr.toString();
				// console.log(yearsArr);
				// console.log(yearsArrString);
				// yearsArrString.push( yearsObject );
				const reignObject = new yearsObject(row.ogc_fid, yearsArrString);
				reignsArr.push(reignObject);
				// console.log(reignsArr);
				// const pushQuery = `SELECT ogc_fid, years FROM locales_corrected CASE WHEN ogc_fid = ${row.ogc_fid} THEN INSERT INTO locales_corrected (years) VALUES ${result}`;
				// const pushQuery = `WHERE ogc_fid LIKE ${row.ogc_fid} INSERT INTO locales_corrected (years) VALUES (${result})`;
			}
		}
	}
	// Loop through the rows
	// for (const row of rows) {
	// 	const stopValue = row.entries; // Replace 'columnName' with the name of your column
	// 	if (stopValue.match(reignYears)) {
	// 		const matches = stopValue.match(reignYears);
	// 		console.log(`break`, matches);
	// 		const reignBreak = /;/;
	// 		const reignString = String(matches.input);
	// 		const reign = reignString.split(reignBreak);
	// 		const stringRegex = /[a-z]/;
	// 		const discreetEntry = / /;
	// 		let reignMatch;

	// 		const integerRegex = '.';
	// 		const reignIntegers = reign.forEach((entry) => {
	// 			entry.slice(discreetEntry);
	// 		});
	// 		// reignIntegers();
	// 		console.log(reign);
	// 		console.log(reignString);
	// 		// console.log(reignIntegers);
	// 		// const assignedReign = /n+[a-z]/;
	// 		reign.forEach((discreetEntry) => {
	// 			// const assignedReign = reign.match(reignYears);
	// 			// const specificReign = reignYears.match(assignedReign);
	// 			if (discreetEntry.match(stringRegex)) {
	// 				// console.log(`discreet entry`, discreetEntry);
	// 				splitDiscreetEntry = discreetEntry.split(' ');
	// 				reignYearsRegexp = RegExp(reignYears);
	// 				splitDiscreetEntry.sort();
	// 				console.log(splitDiscreetEntry);
	// 				const integerFinder = /.[*]/;
	// 				splitDiscreetEntry.forEach((entry) => {
	// 					const dotIndex = entry.indexOf('.');
	// 					console.log(dotIndex);
	// 					if (dotIndex > 0) {
	// 						const splitDiscreetEntry2 = entry.slice(dotIndex);
	// 						return splitDiscreetEntry2;
	// 					}
	// 					console.log(splitDiscreetEntry2);
	// 				});
	// 				console.log(splitDiscreetEntry, 2);
	// 				// }
	// 			} else {
	// 			}
	// 		});
	// 	} else {
	// 		console.log(`skip`);
	// 	}
	// }
	// console.log(reignsArr);
	const reversedReignsArr = reignsArr.reverse();
	const filteredReignsArray = [];
	cutdownReigns = function (arr) {
		arr.forEach((element) => {
			if (element.id === idRef) {
				idRef = element.id;
			} else {
				filteredReignsArray.push(element);
				idRef = element.id;
			}
		});
	};
	cutdownReigns(reversedReignsArr);
	// console.log(filteredReignsArray);
	for (const row of rows) {
		const stopValue = row.ogc_fid;
		console.log(stopValue);
		updateFunction = function (arr) {
			arr.forEach((element) => {
				if (element.id === stopValue) {
					const yearsQuery = `UPDATE locales_corrected SET years = '${element.years}' WHERE ogc_fid = ${stopValue}`;
					console.log(yearsQuery);
					db.run(yearsQuery, function (err) {
						if (err) {
							console.error(err.message);
						} else {
							console.log(`Row ${row} updated successfully`);
						}
					});
				}
			});
		};
		updateFunction(filteredReignsArray);
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
