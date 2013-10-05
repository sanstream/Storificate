#The Storificate Framework
A framework for building interactive storylines


##The escense of Storificate

Storificate provides a book-like interface (Chapters with Pages) for a storyline.
In no way does it implement a graphical User Interface nor does it aspire to do that.
It just provides the abstrac logic for having Chapters and pages in a storyline, so you do not have to implement that and can just focus on building your story.

##How is it build?/Can I use it?##
Storificate is written in pure native JavaScript and uses no HTML or CSS. 
That means that it has no dependencies on other libraries and it also behaves nicely along other libraries like jQuery, MooTools, Angular.js or d3.js and even things like PhoneGap!


##Using Storificate

###The data-structure as the basis your story
The framework depends on a JSON data structure which defines the Chapters and all the pages in the chapter. 

> Building such a data-structure might seem like a lot of work, but it just involves a lot of copy-paste work when you have your basis ready.

	
	{
	"meta":{
		"sectionType" : "Book",
		"name": "The little red balloon"
	},
	"data":[
			{
				"meta":{
					"sectionType" : "Chapter",
					"name": "The name of the first Chapter"
				},
				"data":[
					{
						"renderLogic" : "Chapter_1\/Pages\/1\/1.js",
						"textView":{
							"content": 		"Chapter_1\/Pages\/1\/1.md",
							"contentType": 	"file"
						}		
					},

					{
						"renderLogic" : "Chapter_1\/Pages\/2\/2.js",
						"textView":{
							"content": 		"The text of the second page of the first chapter.",
							"contentType": 	"text"
						}		
					},
				]
			}
		]
	}

###Chapters and Pages

A book in Storificate is divided in chapters and pages (just like paper-based ones!). 
Each entity (the book, chapters) are subdivided into a meta set and a data set. The meta servers as a discriptive section for each entity. In the meta section three sections
A page in Storificate is simply a block of text that needs to be shown at one point. This means you could build a simple book with chapters and pages, but that just too simple right!

Storificate gives you the option to do things before, during and after a page is shown. These simple options provide you with the choice to do something arround or related to the current page you are showing, as long as they can, somehow, be defined in JavaScript.

The options can be optionally be defined as callbacks like this:


	book.currentPage.beforeTextShown # function () {

		// do some magic before the text is shown.
	};

	book.currentPage.duringTextShown # function () {

		// do some magic while the text is shown.
	};

	book.currentPage.afterTextShown # function () {

		// do some magic after the text is shown.
	};
	// show the text and run the callbacks above.
	book.currentPage.initialize();

If you do not define them Storificate will think that nothing needs to happen and nothing will happen.


##How to implement it

Include the latest version of showdown and Storificate in the head tag:

	<script type="text/javascript" src="js/showdown.js"></script>
	<script type="text/javascript" src="js/storificate.js"></script>

And when you need it load your book in your JavaScript:
	
	book = new Storificate.Book('book.json');

> Note: Making the instance of Storificate.Book a global is of course a choice that is best made based upon the situation.

Optionally you can load the book to start a certain chapter and a page:
	
	book = new Storificate.Book('book.json', 1, 2); //Open book at chapter 1, page 2.

## Moving between pages and chapters

Finally these methods are needed to move between the pages and chapters:
	
	book.goToNextChapter();
	book.goToPrevChapter();
	book.goToNextPage();
	book.goToPrevPage();

Each method will return true or false if the action is possible. For instance Moving from the first page to the previous page is impossible and the method goToPrevPage() will return false.


