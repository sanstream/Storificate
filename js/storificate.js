/**
 * @file storificate.js
 * @author Sanne Peters
 * @copyright Sanstream Creations 2013
 */


var Storificate = {};


Storificate.Menu = {

	mainNav: null,

	initialize: function(){

		this.mainNav = document.getElementById('mainNav');
		if(this.mainNav){

			console.debug(this.mainNav);

		}
	}
};

/**
 * The Book Class.
 */

Storificate.Book = function (bookLocation){
    
	this.chapters = {};
	this.currentChapter = null;
	this.currentPage = null;
	this.currentChapterData = null;

	console.log('initializing the Book.');
	this.bookLocation = bookLocation;

	//this.compileListOfChapters();
	this.loadChapter(1);
	this.displayArea = document.getElementById('mainDisplayArea');
	this.textView = document.getElementById('textView');
};

/**
 * The loadChapter method of the Book Class.
 * @param  {integer} chapterNumber The number of the chapter that needs to be loaded
 * @return {void}
 */
Storificate.Book.prototype.loadChapter = function (chapterNumber){

	var self = this;
	Storificate.Ajax.json("Chapters/" + chapterNumber + ".json", function(json,error) {
		
		if (error) return console.error(error);
		self.currentChapterData = json;
		
		self.currentPage = new Storificate.Page(self.currentChapterData[0]);
	});
};

/**
 * The Page Class.
 */
Storificate.Page = function(pageData){

	this.pageData = pageData;

	this.loadPagelogic();
	this.loadTextView();
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
        script_tag.setAttribute('type', 'text/javascript');
        script_tag.setAttribute('id', 'pageLogic');
        script_tag.setAttribute('src',"Chapters/" + self.pageData.renderLogic);
        document.getElementsByTagName('body')[0].appendChild(script_tag);
    }
};

/**
 * Loads the text for a page. The format of the page is figured out inside the method.
 * @return {void}
 */
Storificate.Page.prototype.loadTextView = function(){
		
	var formattedText = "Test";

	if(this.dataChecksOut){

		if(this.pageData.textView.contentType == undefined ||
			this.pageData.textView.contentType == null ||
			this.pageData.textView.contentType == 'markdown'){

				formattedText = this.parseMarkdown(this.pageData.textView.content);
		}
		else if(this.pageData.textView.contentType == 'text'){

				formattedText = this.pageData.textView.content; // Since we expect only simple text with some html formatting.
		}
		else{
	
			console.error("Well, ain't got a clue what data format we're dealing with.");
		}
	}

	textView.getElementsByClassName('textArea')[0].innerHTML = formattedText;
};

/**
 * Method of the Page Class that handles the parsing of MarkDown text.
 * @param  {string} markdownText string containing the raw MarkDown text.
 * @return {string}              The HTML version of the MarkDown text. 
 */
Storificate.Page.prototype.parseMarkdown = function(markdownText){

		return markdownText;
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

		req.open("GET", url, true);

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