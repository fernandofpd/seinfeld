# Seinfeld actor appearances by season and episodes

## App
* Display list of actors by number of appearances in the series Seinfeld.
* The data is broken down by seasons, which can be expanded to view which episodes the actor is in.
* The list can be sorted by number of appearances and filter by actor name.
* Bubbles represent number of appearances of actor in a season or in total.
* Hovering over a bubble will show the percentage of appearances for the season or in total.
## Data
* The data has been retrieved by crawling IMDB and processed locally.
* The source code for obtaining that data is under `./crawler/main.js`
* To pretend that we're fetching from a public API the data is exposed under `/public/api` 
  as `credits.json` and `series.json` and fetched with the fetched API from the React app.

