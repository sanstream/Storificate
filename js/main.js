/**
 * @file main.js
 * @author Sanne Peters
 * @copyright Sanstream Creations 2013
 */

console.log((MooTools)? 'Loading MooTools, version '+ MooTools.version : 'MooTools could not be loaded' );
console.log((d3)? 'Loading d3, version '+ d3.version : 'd3 could not be loaded' );

// Wait for device API libraries to load
document.addEventListener("deviceready", function(event){

	// Initialize the Menu:
	Storificate.Menu.initialize();
	// Initialize the Book:
	book = new Storificate.Book('Chapters'); // book is intentionally a global, keep it this way.
}, false);
