/**
 * @fileOverview handles the JS logic of the first page of the first chapter.
 * @author Sanne Peters sanne@sanstream.nl
 */

var page = new Page(); // automatically loads th logic for the current page.

var pageLogic = {

	initialize: function() {
		// body...
		console.log('page logic for page 1 loaded.');

		//initialize the textview
		// Along the lines of:
		page.loadTextview();
	}
};

pageLogic.initialize();