# Remix Mapbox Starter Template

## ⚠️ Work in Progress Use at your own risk ⚠️

Currently this is a repo that is meant to hold the findings of working with geospatial applications on the Remix stack. Current issues that are being worked through revolve around the issues with working with the style of fetching and revalidation of data. This is not always wanted on the geospatial stack since a lot of the queries that are executed are intensive and would punish the user for revalidation for items that are probably not updated.

The result at the moment is to still make use the of the js fetch function when you are fetching data and do this function on "client side" after the map is loaded. Since a solution for holding the data has not been found for storing and caching large amounts of geojson has been found currently.

Working with mapbox is hard especially in React. But with Remix you have a little bit more control over your data and and when you are loading it onto the map canvas.

Using the loader function allows you to get the data asyncronously before the page even begins to load on the server. Then the page will render what the server can and will be sent over to the client. Then when your payload from the server is sent to the client the client can begin to load the css and canvas that is needed to initialize the map.

While you can always run your queries and functions for the data that you are loading into the map in the loader function. The preceived load time may be longer because you are taking longer to get to first look. Because of that you can use client side queries that end up taking place when the page first hits the client. So you are loading the data for the map while the canvas is building.

# Docker

In order to just keep this simple what I have done is use the Supabase Docker image of Postgres. This should have everything that you need out of the box to get postgres with postgis up and running.

In order to get this started for the first time you will need to run docker compose in the root dir.

`docker-compose up -d`

## Database

So the database management situation here is a little chaotic at the moment. Currently no ORM fully supports geom type in Postgres, but the work around at the moment is to write it manually with a postgis query manaully. **If you know a better way to do this I would love to learn**.

Prisma is what I am using to manage the database schema and then I am using Drizzle to query out the data. The reason for this is that Prisma does not actually preform joins it actually creates and performs multiple queries and then mashes them together, reducing peformance. However Drizzle's ability to manage the database is somewhat limited at the moment. Another reason that I chose to use Drizzle is that with Drizzle you are not required to have a "hard" join so you can simply compare string values rather than relying on data perfectly matching up based on schema declarations.

