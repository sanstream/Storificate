/**
 * @file main.js
 * @author Sanne Peters
 * @copyright Sanstream Creations 2013
 */

console.log((MooTools)? 'Loading MooTools, version '+ MooTools.version : 'MooTools could not be loaded' );
console.log((d3)? 'Loading d3, version '+ d3.version : 'd3 could not be loaded' );


$(document).addEvent('domready', function (domreadyevent) {
	// Initialize the Menu:
	Menu.initialize();
	// Initialize the Book:
	book = new Book('Chapters'); // book is intentionally a global, keep it this way.
	
});


var Menu = {

	mainNav: null,

	initialize: function(){

		this.mainNav = $('mainNav');
		if(this.mainNav){

			console.debug(this.mainNav);

		}
	}
};

var Book = new Class({
    
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

		this.currentChapter = 1;
		this.currentChapterData = JSON.decode($('ChapterOne').value);
		this.currentPage = 3;
		this.loadPagelogic();
	},

	loadPagelogic: function(){
		if($('pageLogic')){

			$('pageLogic').destroy();
		}

		Asset.javascript(this.bookLocation + "/" + this.currentChapterData[this.currentPage-1].renderLogic,{
			id: "pageLogic"
		});
	},
});

var Page = new Class({
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



// Wait for device API libraries to load
document.addEventListener("deviceready", function(event){
	


}, false);
