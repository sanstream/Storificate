/**
 * @fileOverview handles the JS logic of the first page of the first chapter.
 * @author Sanne Peters sanne@sanstream.nl
 */

var pageLogic = {

	initialize: function() {
		// body...
		console.log('page logic for page 1 loaded.');

		var page = new Page(); // automatically loads th logic for the current page.

		//initialize the textview
		// Along the lines of:
		page.loadTextView();
	}
};

pageLogic.initialize();