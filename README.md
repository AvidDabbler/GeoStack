# Remix Mapbox Starter Template

Working with mapbox is hard especially in React. But with Remix you have a little bit more control over your data and and when you are loading it onto the map canvas. 

Using the loader function allows you to get the data asyncronously before the page even begins to load on the server. Then the page will render what the server can and will be sent over to the client. Then when your payload from the server is sent to the client the client can begin to load the css and canvas that is needed to initialize the map.

While you can always run your queries and functions for the data that you are loading into the map in the loader function. The preceived load time may be longer because you are taking longer to get to first look. Because of that you can use client side queries that end up taking place when the page first hits the client. So you are loading the data for the map while the canvas is building.