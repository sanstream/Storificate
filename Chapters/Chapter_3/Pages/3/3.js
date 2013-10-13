book.currentPage.beforeTextShown = function () {
	
};

book.currentPage.duringTextShown = function () {

	$('textArea').innerHTML = book.currentPage.pageText;
};

book.currentPage.initialize();
