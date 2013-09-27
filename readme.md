=The Storificate Framework=
A framework for building interactive storylines


==The escense of Storificate==

Storificate provides a book-like interface (Chapters with Pages) for a storyline.
In no way does it implement a graphical User Interface nor does it aspire to do that.
It just provides the abstrac logic for having Chapters and pages in a storyline, so you do not have to implement that and can just focus on building your story.

==How is it build?/Can I use it?==
Storificate is written in pure native JavaScript and uses no HTML or CSS. 
That means that it has no dependencies on other libraries and it also behaves nicely along other libraries like jQuery, MooTools, Angular.js or d3.js and even things like PhoneGap!


==Using Storificate==

==How does Storificate work?==

===The data-structure as the basis your story===
The framework depends on a JSON data structure which defines the Chapters and all the pages in the chapter. 

"""Building such a data-structure might seem like a lot of work, but it just involves a lot of copy-paste work when you have your basis ready"""

[code]
[
	{
		"renderLogic" : "Chapter_1\/Pages\/1\/1.js",
		"textView":{
			"content": 		"Chapter 1, the beginning",
			"contentType": 	"text"
		}		
	},

	{
		"renderLogic" : "Chapter_1\/Pages\/2\/2.js",
		"textView":{
			"content": 		"Chapter 1, continued",
			"contentType": 	"text"
		}		
	}
]
[/code]

===Chapters===

===Pages===

A page in Storificate is simply a block of text that needs to be shown at one point. This means you could build a simple book with chapters and pages, but that just too simple right!

Storificate gives you the option to do things before, during and after a page is shown. These simple options provide you with the choice to do something arround or related to the current page you are showing, as long as they can be, somehow, be defined in JavaScript.

The options can be optionally be defined as callbacks like this:

[code]
book.currentPage.beforeTextShown = function () {

	// do some magic before the text is shown.
};

book.currentPage.duringTextShown = function () {

	// do some magic while the text is shown.
};

book.currentPage.afterTextShown = function () {

	// do some magic after the text is shown.
};

// show the text and run the callbacks above.
book.currentPage.initialize();
[/code]


==How to implement it==

//instatiation.


