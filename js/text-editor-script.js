/** @format */

//Text editor

const fs = require('fs');

const inputFile = '../people index.txt';
const outputFile = '../people index formatted.txt';

let mergedLines = [];
let prevLineEndedWithPeriod = false;
let prevLineInOrder = false;
const chineseCharacterRegex = RegExp(
	/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/
);

fs.readFile(inputFile, 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}

	const lines = data.split('\n');

	lines.forEach((line, index) => {
		line = line.trim(); // Remove leading/trailing whitespace

		prevLineInOrder = chineseCharacterRegex.test(line);
		console.log(prevLineInOrder);

		if (!prevLineEndedWithPeriod && index > 0 && (prevLineInOrder = true)) {
			mergedLines[mergedLines.length - 1] += line;
		} else {
			mergedLines.push(line);
		}

		prevLineEndedWithPeriod = line.endsWith('.');
	});

	fs.writeFile(outputFile, mergedLines.join('\n'), 'utf8', (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log('File has been modified and saved.');
	});
});
