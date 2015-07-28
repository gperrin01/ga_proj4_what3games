This is the final project of my course at General Assembly. 



# The app and the background

I decided to build a simple, potentially addictive mind game, which would let us discover the world, improve our language skills, and compete agains others, while also using the incredible concept built by What3Words (see below)

I discovered a wonderful website called What3Words, which was sponsoring a hackathon I took part in (2015 AnalogFolk hackathon). They divided the whole world into 57 trillion of tiny 3mx3m squares and assigned to each square a unique combination of 3 words. Since it is unique and very precise, the combination allows each square to be easily located. Beyond the fun aspect, it brings tremendous progress to the 4 billion people who are invisible as their country suffer from inaccurate addressing.
http://what3words.com/

# Rules and features

As you explore the world, you are presented with a new series of three words for each location you visit. The game is to make the longest anagram, using only the letters available in those three words.
For instance, if going to the center of London (3 Whitehall), you will see the words "future human foster". With those letters you can build the word "fun", not a highly complex one, but it works.

When you submit your answer a series of check happen to ensure that your words exists (for the moment I use the free Yandex Dictionnary API), that it only uses the letter available in the three words, and that it is not too easy (not either of the three words or their basic plural or singular, longer than 3 characters).
Yandex also gave me a translation of the word, so at the moment each good answer will teach you how to say your word in Italian. I will add a little flag somewhere on the map so that you can change the language to be translated into

If you login, you can then take part in the two games I have developped. Playing games enables you to earn points for each valid answer and to compare your score against all other users. 

Game 1: the Journey challenge

The original idea was to have users play the game while on their bus journey. As they progress through the city and their journey, they reach the same fixed locations (bus stops) and submit their longest anagram at this location. Since one location has a unique combination of three words, it becomes very easy for users to be ranked agains others, not only at this specific location, but also across the whole journey. You could then become the master of the bus route 55!

I started building a static version of the game, where your location is not tracked, and the journey is simulated: as you enter an origin and a destination, your journey from A to B is divided in a number of steps (courtesy of Google Maps API). For you to get to the next step, and eventually to your destination, you simply need to enter a valid answer. As you do, you will see your icon on the map smoothly move from the current step to the next, where the challenge starts again.

As a reward for hard-working users, a completed journey also brings bonus points based on the number of steps in that journey.

The next step in that game is obviously to record the journey in the database so that users can compare scores on a same journey.  This is something I will build later on. My priority for the demo was to have a fully-functioning game.


Game 2: the exploration game

The idea came from one of my classmate after my presenation to the class. It immediately resonated as I found it quite "poetic" and very much in the spirit of discovery that I had in mind.

As you freely browse the world and submit answers, getting three successful answers means you have created a combination of three words. The game will then transport you from your current location to wherever in the world matches these three words. Of course not every combination of three words matches a location, and in this event you will be transported to a random location in the world. From your new location you play again (and earn points) until you reach three succesful answers and get transported again.

I tried to add some smooth animation effects to the map to display the transition (zoom out to see the whole world, see the marker on the map make its way to the new location, zoom in and center the map on the new location). If you know of nicer or easier methods, please do not hesitate to let me know! (the functions are in client/public > i) game.js > Game.teleportFromTo, ii) map.js > Marker.transition, and iii) view.js > View.smoothZoom)


# Development timeframe

We had 10 days to develop the app before the presentation to the class. I was quite happy with with I built in that time, as I was able to show a fully functioning app with the two games and the ranking system.
After this we had two weeks to prepare for the final event of the course, a "meet and greet" day where comapnies came to see our work and discuss job opportunities. During that time we worked on various things, CV, personal website, etc, and of course on improving the final project:

The feedback from the class and teachers was quite positive, and some comments led me to add new features to the app:
- I removed the initial game, whereby you could only move on the map if you typed in a correct word
- I added the "exploration" game. 
Demo-ing the app and talking about it also highlighted various bugs and missing functionalities that I fixed and implemented.

# Next steps and improvements

- Save journeys in the database so that users can really compare their skills
- Have a timeout function that would force users to submit a valid answer within [10] seconds, or else the game moves to the next step of the journey without any points earned.
- Monitor the user's actual physical location and updadte the three words on the map with that specific location.
- Let's be crazy, work with Transport for London so that bus riders find a way to kill time in a fun way which also promotes literacy and discovery of your city.

Translations: first, add a flag to let users change the language to translate their answers to; second, leverage on what3words multi-lingual capabilities so that the game can be played in other languages than English.