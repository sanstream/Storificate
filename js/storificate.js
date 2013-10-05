/**
 * @file storificate.js
 * @author Sanne Peters
 * @copyright Sanstream Creations 2013
 */


var Storificate = {};

/**
 * The Book Class.
 */

Storificate.Book = function (bookLocation, currentChapterNumber, currentPageNumber){
    
    this.bookStructure = null;
    this.currentChapter = null;
	this.currentChapterNumber = (typeof this.currentChapterNumber == 'undefined')? 1 : currentChapterNumber;
	this.currentPage = null;
	this.currentPageNumber = (typeof this.currentPageNumber == 'undefined')? 1 : currentPageNumber;

	console.log('initializing the Book.');
	this.bookLocation = bookLocation;

	this.displayArea = document.getElementById('mainDisplayArea');
	this.textView = document.getElementById('textArea');
	this.loadLastPage = false;

	this.loadBook();
};

Storificate.Book.prototype.loadBook = function(){

	var self  = this;

	Storificate.Ajax.json(this.bookLocation, function(json,error) {

		if (error) return console.error(error);
		self.bookStructure = json;

		console.log(self.bookStructure);
		self.loadChapter();
	});
};



/**
 * The loadChapter method of the Book Class.
 * @return {void}
 */
Storificate.Book.prototype.loadChapter = function () {

	var self = this;

	self.currentChapter = self.bookStructure.data[this.currentChapterNumber - 1];

	if(self.loadLastPage) self.currentPageNumber = self.currentChapter.data.length;
	self.loadLastPage = false; // resetting it for future use.
	// load the page that we need:
	self.loadPage((self.currentPageNumber)? self.currentPageNumber : 1);
};

Storificate.Book.prototype.loadPage = function (pageNumber) {

	var self = this;


	console.log(self.bookStructure.meta.directory +"/" + self.currentChapter.meta.directory);

	self.currentPage = new Storificate.Page(self.currentChapter.data[ pageNumber - 1 ],
											this.textView,
											self.bookStructure.meta.directory +"/" + self.currentChapter.meta.directory);
	self.currentPageNumber = pageNumber;
};

Storificate.Book.prototype.goToNextChapter = function () {

	if(this.bookStructure.data.length == this.currentChapterNumber) return 0;
	this.currentChapterNumber += 1;
	this.currentPageNumber = 1;
	this.loadChapter();

};

Storificate.Book.prototype.goToPrevChapter = function () {

	if (this.currentChapterNumber == 1) return 0;
	this.currentChapterNumber -= 1;
	this.loadLastPage = true; // instead of the first when loading a chapter ;) .
	this.loadChapter();
};

Storificate.Book.prototype.goToNextPage = function () {

	var self = this;

	self.currentPageNumber += 1;

	if ( self.currentChapter.data.length  < self.currentPageNumber) {
		// Go to the next Chapter:
		self.goToNextChapter();
	}
	else self.loadPage(self.currentPageNumber);	
};

Storificate.Book.prototype.goToPrevPage = function () {

	var self = this;

	if (self.currentPageNumber == 1) {
		 // Go back to the last page of the previous chapter, because we are at the first page of a chapter.
		 self.goToPrevChapter();
	}
	else{

		self.loadPage( self.currentPageNumber - 1);	
	}
	
};
/**
 * The Page Class.
 */
Storificate.Page = function(pageData, textView, baseFilePath){

	this.baseFilePath = baseFilePath;
	this.pageData = pageData;
	this.textView = textView;

	this.beforeTextShown = null;
	this.duringTextShown = null;
	this.afterTextShown = null;

	this.loadPagelogic();
};

Storificate.Page.prototype.initialize = function () {

	if(this.beforeTextShown && typeof this.beforeTextShown === 'function'){

		this.beforeTextShown();
	}

	this.loadTextView();

	if(this.duringTextShown && typeof this.duringTextShown === 'function'){

		this.duringTextShown();
	}

	if(this.afterTextShown && typeof this.afterTextShown === 'function'){

		this.afterTextShown();
	}
};

/**
 * The loadPagelogic method of the Book Class. This method loads the logic (javascript) associated with a page.
 * All the other resources should be loaded via the page logic file.
 * @return {void}
 */
Storificate.Page.prototype.loadPagelogic = function(){

	var self = this;
	var pageLogicElement = null;
	pageLogicElement = document.getElementById("pageLogic");

	if(pageLogicElement) pageLogicElement.parentNode.removeChild(pageLogicElement);


	if (document.createElement && document.getElementsByTagName) {
        
        var script_tag = document.createElement('script');
        script_tag.setAttribute('type', 'text/javascript')
        script_tag.setAttribute('id', 'pageLogic');
        script_tag.setAttribute('src', self.baseFilePath + "/" + self.pageData.renderLogic);
        document.getElementsByTagName('body')[0].appendChild(script_tag);
    }
};

/**
 * Loads the text for a page. The format of the page is figured out inside the method.
 * @return {void}
 */
Storificate.Page.prototype.loadTextView = function(){
		
	var formattedText = null;

	if(this.pageData.textView !== undefined && 
		this.pageData.textView.contentType !== undefined){

		if(this.pageData.textView.contentType == 'file'){

			// Only markdown texts are supported for now:
			formattedText = this.parseMarkdown(this.pageData.textView.content);
		}
		else if(this.pageData.textView.contentType == 'text'){

				formattedText = this.pageData.textView.content; // Since we expect only simple text with some html formatting.
		}
		else{

			console.error("The contentType property cannot be found as part of:", this.pageData.textView);
		}	
	}
	else{

		console.error("Some properties of this object are incorrectly set:", this.pageData);
	}
	

	console.log(this.pageData);
	this.textView.innerHTML = formattedText;
};

/**
 * Method of the Page Class that handles the parsing of MarkDown text.
 * @param  {string} markdownText string containing the raw MarkDown text.
 * @return {string}              The HTML version of the MarkDown text. 
 */
Storificate.Page.prototype.parseMarkdown = function(markdownFile){

	var html = "";
	var self = this;

	Storificate.Ajax.text(
		self.baseFilePath +  "/" + markdownFile,
		"text/x-markdown",
		function(responseText,error){

			if(error){
			
				console.error(error);
				return 0;
			}
			
			var markdownConverter = new Showdown.converter();
			html = markdownConverter.makeHtml(responseText);
	});

	return html;
};


/**
 * Collection of Different types of Ajax calls.
 * The methods in this Object are direct copies of the ones used in the d3 code written by Mike Bostock.
 * The only thing that was changed was the formatting of the methods.
 * @type {Object}
 */
Storificate.Ajax = {

	/**
	 * Method of the Ajax Object that does the actual AJAX call
	 * @param  {string}   url      Path to the file.
	 * @param  {string}   mime     The mime type of the file.
	 * @param  {Function} callback The Callback to run when the AJAX call is complete.
	 * @return {void}
	 */
	xhr: function(url, mime, callback) {
    
		var req = new XMLHttpRequest;
		
		if (arguments.length < 3)     			callback = mime, mime = null; 
		else if (mime && req.overrideMimeType)  req.overrideMimeType(mime);

		req.open("GET", url, false); // requests are purposely not asynchronous, because in this context it is silly.

		if (mime) req.setRequestHeader("Accept", mime);
		req.onreadystatechange = function() {
		  if (req.readyState === 4) {
		    var s = req.status;
		    callback(!s && req.response || s >= 200 && s < 300 || s === 304 ? req : null);
		  }
		};
		req.send(null);
	},

	/**
	 * Method of the Ajax Object that gets a text.
	 * @param  {string}   url      Path to the file.
	 * @param  {string}   mime     The mime type of the file.
	 * @param  {Function} callback The Callback to run when the AJAX call is complete.
	 * @return {void}
	 */
	text: function(url, mime, callback) {
	
		function ready(req) {
		
			callback(req && req.responseText);
		}
		if (arguments.length < 3) {
		
		  callback = mime;
		  mime = null;
		}
		
		this.xhr(url, mime, ready);
	},

	/**
	 * Method of the Ajax Object that gets a json object from a file
	 * @param  {string}   url      Path to the json file.
	 * @param  {Function} callback The Callback to run when the AJAX call is complete.
	 * @return {void}
	 */
	json: function(url, callback) {

		this.text(url, "application/json", function(text) {
		  
		  callback(text ? JSON.parse(text) : null);
		});
	},

	/**
	 * Method of the Ajax Object that gets HTML from a file
	 * @param  {string}   url      Path to the file.
	 * @param  {Function} callback The Callback to run when the AJAX call is complete.
	 * @return {void}
	 */
	html: function(url, callback) {
		
		this.text(url, "text/html", function(text) {
			
			if (text != null) {
			
				var range = document.createRange();
				range.selectNode(document.body);
				text = range.createContextualFragment(text);
			}
			callback(text);
		});
	}
};