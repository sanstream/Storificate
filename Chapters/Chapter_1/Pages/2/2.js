/**
 * @fileOverview handles the JS logic of the second page of the first chapter.
 * @author Sanne Peters sanne@sanstream.nl
 */

book.currentPage.beforeTextShown = function () {
	
};

book.currentPage.duringTextShown = function () {

	$('textArea').innerHTML = book.currentPage.pageText;
};

book.currentPage.initialize();
