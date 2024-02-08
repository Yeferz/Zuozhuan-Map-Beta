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
// let ogcKey = 0;
// let yearsArr = [];
// let reignsArr = [];
// let uniqueReignsArr = [];
// function yearsObject(id, years) {
// 	this.id = id;
// 	this.years = years;
// }

let dates = '';
let idLogger = 1;
const query = 'SELECT * FROM locales_corrected';
db.all(query, [], (err, rows) => {
	if (err) {
		console.error(err.message);
		return;
	}

	//Run this bit to clear the values in the years column
	db.run(`UPDATE locales_corrected SET years = NULL;`, (err) => {
		if (err) {
			return console.log(err.message);
		}
		console.log('years set to NULL');
	});
	// Loop through the rows
	for (const row of rows) {
		const stopValue = row.entries; // Replace 'columnName' with the name of your column
		let sliceKeyUpdate;
		// Check if stopValue matches any key in reignYears.
		for (const key in reignYears) {
			const regexPattern = new RegExp( `\\b${ key }\\b` );
			//Turn the reign name into a string
			const keyString = key.toString();
			//Stop at entries and test to see if the reignyears occurs.
			if (regexPattern.test(stopValue)) {
				const mapFilterRegex = new RegExp(`See map [0-9]`);
				const entriesString = stopValue.toString();
				const entriesStringMapRemoved = entriesString.replace(
					mapFilterRegex,
					``
				);
				//Not quite sure what this bit does - need to rerun to check.
				const sliceKey = entriesStringMapRemoved.indexOf(keyString);
				const reignString = entriesStringMapRemoved.slice(
					sliceKey,
					sliceKeyUpdate
				);
				sliceKeyUpdate = sliceKey;
				const wholeIntegerReigns = reignString.replaceAll(/\.\S+(?=\s|$)/g, '');
				const numbersOnly = wholeIntegerReigns.replace(keyString, '');
				const entryNumbers = numbersOnly.split(' ');
				const entryNumbersArr = entryNumbers.map(function (entry) {
					return parseInt(entry);
				});
				function NaNfilter(value, index, array) {
					return value > 0;
				}
				const filteredEntryNumbersArr = entryNumbersArr.filter(NaNfilter);
				const yearNumbers = filteredEntryNumbersArr.map(function (entry) {
					return reignYears[key] - entry;
				});
				const yearsToString = yearNumbers.toString(',');
				const rowNumber = row.ogc_fid;
				function fullEntryString(currentDates) {
					if (rowNumber === idLogger) {
						return currentDates.concat(',', yearsToString);
					} else {
						idLogger++;
						return yearsToString;
					}
				}
				dates = fullEntryString(dates);
				const yearsQuery = `UPDATE locales_corrected SET years='${dates}' WHERE ogc_fid='${rowNumber}'`;
				db.run(yearsQuery, function (err) {
					if (err) {
						console.error('Error updating database:', err.message);
					} else {
						console.log('Database updated successfully');
					}
				});
				console.log(
					stopValue,
					row.ogc_fid,
					// regexPattern,
					// mapFilterRegex,
					// entriesString,
					// entriesStringMapRemoved,
					// sliceKey,
					// keyString,
					// reignString,
					// sliceKeyUpdate,
					// decimalRegex,
					// wholeIntegerReigns,
					// numbersOnly,
					// entryNumbers,
					// entryNumbersArr,
					// filteredEntryNumbersArr,
					reignYears[key],
					// yearNumbers,
					// yearsQuery,
					yearsToString,
					rowNumber,
					dates,
					idLogger
				);
			}
		}
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
