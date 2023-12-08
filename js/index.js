/** @format */


//Map baselayers are all defined here, as are the filter conditions so the user can search locales on the map.
let searchBy;
let locales;
let filterCondition = /[a-z]/;
let rangeHigh = 722;
let rangeLow = 480;
//This is the slider, taken from here https://digital-geography.com/filter-leaflet-maps-slider/
var slidervar = document.getElementById('slider');
var numberFormatter = wNumb({
	postfix: ` BC`,
	decimals: 0,
});
noUiSlider.create(slidervar, {
	connect: true,
	start: [480, 722],
	range: {
		min: 480,
		max: 722,
	},
	tooltips: [numberFormatter, numberFormatter], // Show tooltips for both handles
	format: {
		to: function (value) {
			return Math.round(value); // Round the value to the nearest integer for display
		},
		from: function (value) {
			return value; // Return the raw value when slider changes
		},
	},
	direction: 'rtl',
});

let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
inputNumberMin.addEventListener('change', function () {
	slidervar.noUiSlider.set([this.value, null]);
});
inputNumberMax.addEventListener('change', function () {
	slidervar.noUiSlider.set([null, this.value]);
});

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap',
});

var marker;
var Esri_WorldTerrain = L.tileLayer(
	'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
	{
		attribution:
			'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
		maxZoom: 13,
	}
);
var Esri_WorldPhysical = L.tileLayer(
	'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
	{
		attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
		maxZoom: 8,
	}
);
var USGS_USImagery = L.tileLayer(
	'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
	{
		maxZoom: 20,
		attribution:
			'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
	}
);
var Esri_WorldStreetMap = L.tileLayer(
	'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
	{
		attribution:
			'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
	}
);
var map = L.map('map', {
	center: [34.669724, 112.442223],
	zoom: 10,
	layers: [Esri_WorldPhysical],
});
var markerGroup = L.layerGroup().addTo(map);

var baseMaps = {
	ESRI_Physical: Esri_WorldPhysical,
	ESRI_Terrain: Esri_WorldTerrain,
	OpenStreetMap: osm,
	ESRI_WorldStreetMap: Esri_WorldStreetMap,
	USGS: USGS_USImagery,
};

var layerControl = L.control.layers(baseMaps).addTo(map);
let outScopeSlider;
//This is the bit which initially collects the data from data.json and turns it into markers on the leaflet map, this defines what you see when you first open the main page.
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
					indexedLocale.longitude > 99 &&
					indexedLocale.hanzi != null
				) {
					// var hanziLength = toString(indexedLocale.hanzi);

					// This was a failed attempt to define the labels such that the user only sees Chinese characters, I will attempt to get this bit working at a later date.
					let chineseCharactersRegex =
						/[^\u4E00-\u9FFF\s\d!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g;
					let labelChinese = indexedLocale.hanzi;
					// console.log(labelChinese);
					labelChinese.replace(chineseCharactersRegex, '');
					// let chineseOnlyText = indexedLocale.hanzi
					// 	.match(chineseCharactersRegex)
					// 	.join('');
					//Here we can create a condition to skip ahead to the next thing if the entry is filtered out.
					//This creates the markers and adjusts the size based on the amount of text.
					markerStyle = L.divIcon({
						className: 'custom-marker',
						html: `<div class="marker-text">${indexedLocale.hanzi}</div>`,
						iconSize: [labelChinese * 1.5, labelChinese * 4],
					});
					localeMarker = L.marker(
						[indexedLocale.latitude, indexedLocale.longitude],
						{
							icon: markerStyle,
						}
					).addTo(markerGroup);
					//This defines the popup which you see when you click on a marker.
					let indexedLocaleString = JSON.stringify(
						indexedLocale.hanzi +
							'</p><p>' +
							indexedLocale.name +
							'</p><p>' +
							indexedLocale.polity +
							'</p><p>' +
							indexedLocale.location +
							'</p><p>' +
							indexedLocale.entries
					);
					indexedLocaleString = indexedLocaleString.slice(1, -1);
					// console.log(indexedLocaleString);
					localeMarker.bindPopup(indexedLocaleString).openPopup();
				} else {
					// console.log('filter this one out');
				}
			}
		};
		sortIndividualLocalesOnLoad(locales);
	});
// console.log(outScopeSlider);
//This is the same function as earlier but this time filtered with the user defined search term.
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
							indexedLocale.longitude > 99 &&
							indexedLocale.hanzi != null &&
							indexedLocale.years >= rangeLow &&
							indexedLocale.years <= rangeHigh) ||
						(searchBy === 'polity' &&
							filterCondition.test(indexedLocale.polity) &&
							indexedLocale.latitude < 42 &&
							indexedLocale.latitude > 27 &&
							indexedLocale.longitude < 123 &&
							indexedLocale.longitude > 99 &&
							indexedLocale.hanzi != null &&
							indexedLocale.years >= rangeLow &&
							indexedLocale.years <= rangeHigh) ||
						(searchBy === 'hanzi' &&
							filterCondition.test(indexedLocale.hanzi) &&
							indexedLocale.latitude < 42 &&
							indexedLocale.latitude > 27 &&
							indexedLocale.longitude < 123 &&
							indexedLocale.longitude > 99 &&
							indexedLocale.hanzi != null &&
							indexedLocale.years >= rangeLow &&
							indexedLocale.years <= rangeHigh)
					) {
						let chineseCharactersRegex =
							/[^\u4E00-\u9FFF\s\d!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g;
						let labelChinese = indexedLocale.hanzi;
						// console.log(labelChinese);
						labelChinese.replace(chineseCharactersRegex, '');
						// let chineseOnlyText = indexedLocale.hanzi
						// 	.match(chineseCharactersRegex)
						// 	.join('');
						//Here we can create a condition to skip ahead to the next thing if the entry is filtered out.
						markerStyle = L.divIcon({
							className: 'custom-marker',
							html: `<div class="marker-text">${indexedLocale.hanzi}</div>`,
							iconSize: [labelChinese * 1.5, labelChinese * 4],
						});
						localeMarker = L.marker(
							[indexedLocale.latitude, indexedLocale.longitude],
							{
								icon: markerStyle,
							}
						).addTo(markerGroup);
						let indexedLocaleString = JSON.stringify(
							indexedLocale.hanzi +
								'</p><p>' +
								indexedLocale.name +
								'</p><p>' +
								indexedLocale.polity +
								'</p><p>' +
								indexedLocale.location +
								'</p><p>' +
								indexedLocale.entries
						);
						indexedLocaleString = indexedLocaleString.slice(1, -1);
						// console.log(indexedLocaleString);
						localeMarker.bindPopup(indexedLocaleString).openPopup();
					} else {
						// console.log('filter this one out');
					}
				}
			};
			sortIndividualLocales(locales);
		});
};

//This is where the search terms are implemented and the function called which implements the user's search
let inputResult = document.getElementById('searchInput');
let clearResult = document.getElementById('Clear');
// console.log(searchBy);
// console.log(inputResult.value);
var searchPolity = document.getElementById('Search');
function setPolity() {
	// console.log('Polity filter applied');
	searchBy = document.getElementById('searchBy').value;
	var searchValue = inputResult.value;
	filterCondition = RegExp(searchValue);
	// console.log(filterCondition);
	markerGroup.clearLayers();
	retrieveData();
}
//This function clears the search and reverts to the initial map state
function clearPolity() {
	// console.log('Polity cleared');
	var searchValue = /[a-z]/;
	filterCondition = RegExp(searchValue);
	// console.log(filterCondition);
	searchBy = 'name';
	searchInput.value = '';
	markerGroup.clearLayers();
	retrieveData();
}
function dateFilter() {
	// Extracted from your code
	var searchValue = inputResult.value;
	filterCondition = RegExp(searchValue);
	console.log(`dates changed to ${rangeHigh}BC - ${rangeLow}BC`);

	// Ensure the correct range values are used here
	markerGroup.clearLayers();
	retrieveData();
}

slidervar.noUiSlider.on('update', function (values, handle) {
	//handle = 0 if min-slider is moved and handle = 1 if max slider is moved
	if (handle == 0) {
		document.getElementById('input-number-min').value = values[0];
		// console.log(`input no min changed to ${values[0]}`);
		rangeLow = Math.round(values[0]);
	} else {
		document.getElementById('input-number-max').value = values[1];
		// console.log(`input no max changed to ${values[1]}`);
		rangeHigh = Math.round(values[1]);
	}
	//we will definitely do more here...wait
});
searchPolity.addEventListener('click', setPolity);
clearResult.addEventListener('click', clearPolity);
// retrieveData();

//These are some buttons which I wrote but decided not to include, in future I might re-implement them so I've left the code commented out.

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