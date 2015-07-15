What is stopping anyone from doing curl? put requests from terminal to users/their_own_auth_token and add lots of points??

*******
Struggles and Learning points
*******

CAllback functions to "wait" until the API replied

Integrating Devise with a non-Rails client: need to better understnad devise. Create specific routes which will be triggered from the client browser. Create my own Registrations and SessionsController, inheriting from the Devise Controllers but building on them
Learning about JS-cookies to manage auth_token and tell devise it is safe  (explain better!!)
Tweaking Rspec so that it can simulate a Devise login!

the power of TDD when building complex methods
  - not sure about what will happen in the code
  - tbh not sure about functionality you want

*******
QUESTIONS
*******
What do i use for the server?????  Is it Rails, plus routes in rails which trigger _Rendering from client folder?
where do i put my stylesheets and views and stuff?
Will devise create views and i'm screwed cause my views are not in rails?


*******
TESTING
*******
done() for asynchronous support
Jasmine Spy to mock API result

*******
MAP
*******
Set multiple markers: use setTimeout so they dont drop all at the same time
https://developers.google.com/maps/documentation/javascript/examples/marker-animations-iteration
at the top ideas to check if user is on a mobile and resize the map
https://developers.google.com/maps/documentation/javascript/basics
to choose where the map and the navigation controls will be on the page
https://developers.google.com/maps/documentation/javascript/controls
GMAP direction by bus => needs API key
https://developers.google.com/maps/documentation/directions/



*******
IF USING RAILS DB
*******
for joint table based on 2 existing models
rails generate migration CreateJoinTableStudentTeacher student teacher

jQ session to intereact between Devise and my Views
https://github.com/AlexChittock/JQuery-Session-Plugin

Rails javascript_tag to create a script


*******
DICO
*******

http://dictionary.cambridge.org/learnenglish/results.asp?searchword=SEARCH_PHRASE&dict=L
https://www.google.com/#q=define+love
equest URL:http://google-dictionary.so8848.com/meaning?word=seriously
Request Method:GET

PEARSON
developers.pearson.com

REALLY improve the game: http://wordnet.princeton.edu/ for Synonyms and relations between words

Yandex translate
key=trnsl.1.1.20150703T111847Z.50bb7b40984bcbfe.c87f5b960dc2613c413df68cdced5360645c6f81
2.8. 
User shall include reference to the Yandex technology in the description of the software application, in the respective help topic, on the official website of the software application, as well as on all pages/screens where the dictionary articles received by means of the Service are used, strictly over or under the dictionary articles, in format of the following text: “Powered by Yandex.Dictionary” with the clickable hyperlink to the page http://api.yandex.com/dictionary. The font size of this reference shall not be less than the size of the main text font, and its color shall not differ from the color of the main text font.

The Merriam-Webster Dictionary API is free as long as it is for non-commercial use, usage does not exceed 1000 queries per day per API key, and use is limited to two reference APIs.
http://www.dictionaryapi.com/