/** @format */

let searchBy;
let locales;
let filterCondition = /[a-z]/;
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap',
});
// Create a layer group to store markers
var marker;
var Esri_WorldStreetMap = L.tileLayer(
	'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
	{
		attribution:
			'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
	}
);
// const reignYears = {
// 	Ai: [494, 467],
// 	Ding: [508, 494],
// 	Zhao: [540, 508],
// 	Xiang: [571, 540],
// 	Cheng: [589, 571],
// 	Xuan: [607, 589],
// 	Wen: [625, 607],
// 	Xi: [658, 625],
// 	Min: [660, 658],
// 	Zhuang: [692, 660],
// 	Huan: [710, 692],
// 	Yin: [722, 710],
// };
// for (let i = 0; i < reignYears.length; i++) {
// 	year = reignYears[i];
// 	console.log(year);
// }
var map = L.map('map', {
	center: [34.669724, 112.442223],
	zoom: 10,
	layers: [osm],
});
var markerGroup = L.layerGroup().addTo(map);

var baseMaps = {
	OpenStreetMap: osm,
	WorldStreetMap: Esri_WorldStreetMap,
};

// var overlayMaps = {
// 	Chu: Chu,
// };
var layerControl = L.control.layers(baseMaps).addTo(map);

fetch('js/data.json')
	.then((response) => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then((data) => {
		// Process the retrieved JSON data
		// console.log(data);
		locales = data;
		// console.log(locales);
		// Use the retrieved data for further operations (e.g., creating markers on a map)
		sortIndividualLocalesOnLoad = function (data) {
			for (let i = 0; i < data.length; i++) {
				let indexedLocale = data[i];
				// console.log(indexedLocale);
				// console.log(indexedLocale.latitude);
				if (
					indexedLocale.latitude < 42 &&
					indexedLocale.latitude > 27 &&
					indexedLocale.longitude < 123 &&
					indexedLocale.longitude > 99
				) {
					//Here we can create a condition to skip ahead to the next thing if the entry is filtered out.
					marker = L.marker([
						indexedLocale.latitude,
						indexedLocale.longitude,
					]).addTo(markerGroup);
					let indexedLocaleString = JSON.stringify(
						indexedLocale.hanzi +
							'</p><p>' +
							indexedLocale.name +
							'</p><p>' +
							indexedLocale.polity +
							'</p><p>' +
							indexedLocale.entries
					);
					indexedLocaleString = indexedLocaleString.slice(1, -1);
					// console.log(indexedLocaleString);
					marker.bindPopup(indexedLocaleString).openPopup();
				} else {
					// console.log('filter this one out');
				}
			}
		};
		sortIndividualLocalesOnLoad(locales);
	});

retrieveData = function () {
	fetch('js/data.json')
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			// Process the retrieved JSON data
			// console.log(data);
			locales = data;
			// console.log(locales);
			// Use the retrieved data for further operations (e.g., creating markers on a map)
			sortIndividualLocales = function (data) {
				for (let i = 0; i < data.length; i++) {
					let indexedLocale = data[i];
					// console.log(indexedLocale);
					// console.log(indexedLocale.latitude);
					if (
						(searchBy === 'name' &&
							filterCondition.test(indexedLocale.name) &&
							indexedLocale.latitude < 42 &&
							indexedLocale.latitude > 27 &&
							indexedLocale.longitude < 123 &&
							indexedLocale.longitude > 99) ||
						(searchBy === 'polity' &&
							filterCondition.test(indexedLocale.polity) &&
							indexedLocale.latitude < 42 &&
							indexedLocale.latitude > 27 &&
							indexedLocale.longitude < 123 &&
							indexedLocale.longitude > 99) ||
						(searchBy === 'hanzi' &&
							filterCondition.test(indexedLocale.hanzi) &&
							indexedLocale.latitude < 42 &&
							indexedLocale.latitude > 27 &&
							indexedLocale.longitude < 123 &&
							indexedLocale.longitude > 99)
					) {
						//Here we can create a condition to skip ahead to the next thing if the entry is filtered out.
						marker = L.marker([
							indexedLocale.latitude,
							indexedLocale.longitude,
						]).addTo(markerGroup);
						let indexedLocaleString = JSON.stringify(
							indexedLocale.hanzi +
								'</p><p>' +
								indexedLocale.name +
								'</p><p>' +
								indexedLocale.polity +
								'</p><p>' +
								indexedLocale.entries
						);
						indexedLocaleString = indexedLocaleString.slice(1, -1);
						// console.log(indexedLocaleString);
						marker.bindPopup(indexedLocaleString).openPopup();
					} else {
						// console.log('filter this one out');
					}
				}
			};
			sortIndividualLocales(locales);
		});
};

let inputResult = document.getElementById('searchInput');
let clearResult = document.getElementById('Clear');
console.log(searchBy);
console.log(inputResult);
var searchPolity = document.getElementById('Search');
function setPolity() {
	console.log('Polity filter applied');
	searchBy = document.getElementById('searchBy').value;
	var searchValue = inputResult.value;
	filterCondition = RegExp(searchValue);
	console.log(filterCondition);
	markerGroup.clearLayers();
	retrieveData();
}
function clearPolity() {
	console.log('Polity cleared');
	var searchValue = /[a-z]/;
	filterCondition = RegExp(searchValue);
	console.log(filterCondition);
	searchBy = 'name';
	searchInput.value = '';
	markerGroup.clearLayers();
	retrieveData();
}
searchPolity.addEventListener('click', setPolity);
clearResult.addEventListener('click', clearPolity);
retrieveData();

// Function to remove all markers from the map
// function removeAllMarkers() {
// 	console.log('removeAllMarkersPressed');
// 	// map.remove(marker); // Empty the 'markers' array
// }
// // Function to apply filter for Chu
// var Qi = document.getElementById('Qi');
// function applyFilterQi() {
// 	console.log('Jin filter applied');
// 	filterCondition = /Qi[^n]/;
// 	markerGroup.clearLayers();
// 	retrieveData();
// }
// Qi.addEventListener('click', applyFilterQi);
// var Chu = document.getElementById('Chu');
// function applyFilterChu() {
// 	// Perform actions specific to Option 1
// 	console.log('Chu filter applied');
// 	filterCondition = /Chu/;
// 	markerGroup.clearLayers();

// 	// Add your filtering logic or actions here for Option 1
// }
// Chu.addEventListener('click', applyFilterChu);

// var Jin = document.getElementById('Jin');
// // Function to apply filter for Option 2
// function applyFilterJin() {
// 	console.log('Jin filter applied');
// 	filterCondition = /Jin/;
// 	markerGroup.clearLayers();
// 	retrieveData();
// }
// Jin.addEventListener('click', applyFilterJin);

// Add event listeners to the buttons

// var marker = L.marker( [ 34.669724, 112.442223 ] ).addTo( map );
// marker.bindPopup( '<b>Hello world!</b><br>I am a popup.' ).openPopup();

// var popup = L.popup();

// function onMapClick(e) {
// 	popup
// 		.setLatLng(e.latlng)
// 		.setContent('You clicked the map at ' + e.latlng.toString())
// 		.openOn(map);
// }

// map.on('click', onMapClick);

// const express = require('express');
// const sqlite3 = require( 'sqlite3' ).verbose();
// const path = require('path');
// const app = express();
// const port = 3000;
// const dbPath = path.join(__dirname, '../Database.sqlite');

// const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
// 	if (err) {
// 		console.error('Error opening database:', err.message);
// 	} else {
// 		console.log('Connected to the database');
// 	}
// });

// app.get('/data', (req, res) => {
// 	db.all('SELECT * FROM locales_corrected', (err, rows) => {
// 		if (err) {
// 			res.status(500).json({ error: err.message });
// 			return;
// 		}
// 		res.json({ data: rows });
// 	});
// });

// app.listen(port, () => {
// 	console.log(`Server running on port ${port}`);
// });

// // Create the objects
// const objects = [];

// db.all('SELECT * FROM locales_corrected', (err, rows) => {
// 	if (err) {
// 		console.error('Error executing query:', err);
// 	} else {
// 		rows.forEach((row) => {
// 			const object = {};
// 			for (const key in row) {
// 				if (row.hasOwnProperty(key)) {
// 					object[key] = row[key];
// 				}
// 			}
// 			objects.push(object);
// 		});
// 		console.log('objects', objects);
// 	}
// });
// //Close the DB connection
// db.close((err) => {
// 	if (err) {
// 		console.error('Error closing database:', err);
// 	} else {
// 		console.log('Database connection closed.');
// 	}
// });