/** @format */

//Text editor

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../Database.sqlite');
const personae = 'personae';
const inputFile = '../people index.txt';
const outputFile = '../people index formatted.txt';

let mergedLines = [];
let prevLineEndedWithPeriod = false;
let prevLineInOrder = false;
let prevLineStartsWithHash = false;
let prevLineStartsWith;
const chineseCharacterRegex = RegExp(
	/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/
);
const numbersRegexp = RegExp(/[0-9]/);

fs.readFile(inputFile, 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}

	const lines = data.split('\n');

	lines.forEach((line, index) => {
		line = line.trim(); // Remove leading/trailing whitespace

		prevLineInOrder = chineseCharacterRegex.test(line);
		const hasNumbers = numbersRegexp.test(line);
		console.log(line, prevLineInOrder, hasNumbers);
		if (
			(!prevLineEndedWithPeriod && index > 0 && !prevLineStartsWithHash) ||
			(prevLineStartsWith !== line[0] && !prevLineStartsWithHash) ||
			(!prevLineInOrder && hasNumbers && !prevLineStartsWithHash)
		) {
			mergedLines[mergedLines.length - 1] += line;
		} else {
			mergedLines.push(line);
		}
		if ((prevLineInOrder = false)) {
			mergedLines.push(line);
		}
		prevLineStartsWithHash = line.startsWith('#');
		prevLineEndedWithPeriod = line.endsWith('.');
		prevLineStartsWith = line.at(0);
		console.log(prevLineStartsWith);
	});

	fs.writeFile(outputFile, mergedLines.join('\n'), 'utf8', (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log('File has been modified and saved.');
	});
});

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
	} else {
		console.log('Connected to the database');
	}
});
db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS ${personae} (
        names TEXT,
        漢字 TEXT,
        details TEXT,
        entries TEXT
    )`);

	const data = fs.readFileSync(outputFile, 'utf-8');
	const lines = data.split('\n');
	const insertStatement = db.prepare(
		`INSERT INTO ${personae} (names, details) VALUES (?, ?)`
	);

	lines.forEach((line) => {
		const lineData = line.split('|');
		const nameData = lineData[0] || '';
		const detailsData = lineData[1] || '';
		insertStatement.run(nameData, detailsData);
	});

	insertStatement.finalize();

	// Close the DB connection outside the forEach loop
	db.close((err) => {
		if (err) {
			console.error('Error closing database:', err);
		} else {
			console.log('Database connection closed.');
		}
	});
});