/** @format */



var map = L.map( 'map' ).setView( [ 34.669724, 112.442223 ], 10 );
	L.tileLayer(
		'https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=Suo6om3gY8XYXnDiI1sh',
		{
			maxZoom: 13,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}
).addTo( map );

let locales;
fetch('js/data.json')
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			// Process the retrieved JSON data
			console.log( data );
			locales = data;
			console.log( locales );
			// Use the retrieved data for further operations (e.g., creating markers on a map)
			sortIndividualLocales = function ( data )
			{
				for ( let i = 0; i < data.length; i++ )
				{
					let indexedLocale = data[ i ];
					console.log( indexedLocale );
					console.log( indexedLocale.latitude );
					var marker = L.marker( [ indexedLocale.latitude, indexedLocale.longitude ] ).addTo( map );
					let indexedLocaleString = JSON.stringify(
						indexedLocale.hanzi +
							'</p><p>' +
							indexedLocale.name +
							'</p><p>' +
							indexedLocale.polity +
							'</p><p>' +
							indexedLocale.entries
					);
					indexedLocaleString = indexedLocaleString.slice( 1, -1 );
					console.log( indexedLocaleString );
					marker.bindPopup(indexedLocaleString).openPopup();
	}
};
sortIndividualLocales(locales);
} );
		
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
