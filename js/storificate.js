/**
 * @file storificate.js
 * @author Sanne Peters
 * @copyright Sanstream Creations 2013
 */


var Storificate = {};


Storificate.Menu = {

	mainNav: null,

	initialize: function(){

		this.mainNav = $('mainNav');
		if(this.mainNav){

			console.debug(this.mainNav);

		}
	}
};

Storificate.Book = new Class({
    
	chapters: {},
	currentChapter: 0,
	currentPage: 0,
	bookLocation: null,
	currentChapterData: null,
	displayArea: null,
	textView: null,

	initialize: function(bookLocation){

		console.log('initializing the Book.');
		this.bookLocation = bookLocation;

		//this.compileListOfChapters();
		this.loadFirstChapter();
		this.displayArea = $('mainDisplayArea');
		this.textView = $('textView');
	},

	loadFirstChapter: function(){
		this.loadChapter(1);
	},

	loadChapter: function(chapterNumber){

		var self = this;
		Storificate.Ajax.json("Chapters/" + chapterNumber + ".json", function(json,error) {
			
			if (error) return console.error(error);
			self.currentChapterData = json;
			self.currentPage = 1;
			
			self.loadPagelogic();
		});
	},

	loadPagelogic: function(){
		if($('pageLogic'))	$('pageLogic').destroy();

		Asset.javascript(this.bookLocation + "/" + this.currentChapterData[this.currentPage-1].renderLogic,{
			id: "pageLogic"
		});
	},
});

Storificate.Page = new Class({
	// fully dependent on the existence of the global book variable.

	currentChapter: null,
	currentPage: null,
	pageData:null,

	initialize: function(){

		this.currentChapter = book.currentChapter;
		this.currentPage = book.currentPage;
		this.pageData = book.currentChapterData[this.currentPage-1];
	},

	dataChecksOut:function(){
		
		return true;
	},

	loadTextView: function(){
		
		var formattedText = "";

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
		
		textView.getElement('.textArea').innerHTML = formattedText;
	},

	parseMarkdown: function(markdownText){

		return markdownText;
	}

});


Storificate.Ajax = {

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


	json: function(url, callback) {

		this.text(url, "application/json", function(text) {
		  
		  callback(text ? JSON.parse(text) : null);
		});
	},

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


