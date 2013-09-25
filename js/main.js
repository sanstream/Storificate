/**
 * @file main.js
 * @author Sanne Peters
 * @copyright Sanstream Creations 2013
 */

book = null;

console.log((MooTools)? 'Loading MooTools, version '+ MooTools.version : 'MooTools could not be loaded' );

// for Mobile (PhoneGap) Apps:
document.addEventListener("deviceready", function(event){

	// Initialize the Menu:
	Storificate.Menu.initialize();
	// Initialize the Book:
	book = new Storificate.Book('Chapters'); // book is intentionally a global, keep it this way.
}, false);