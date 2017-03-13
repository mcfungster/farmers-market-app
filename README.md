# City Sprouts
Where are the closest farmers' markets?!?!?

## Team
- Kevin Fung
- RJ Mohammad
- Peter Schussheim

## Table of Contents
1. Usage
2. Requirements
3. Development
  * Installing dependencies
4. Roadmap
5. Contributing
6. Notes
7. License

## Usage
City Sprouts is a website where you can enter an address and a radius and it will give you the location to all the farmer's markets and the products and schedule provided at that market in the area!

## Requirements
* Node 6.x.x
* MongoDB 3.x
  * mlabs account (free tier)
* google developers console
  * google maps API
  * google autocomplete


## Development
1. Create `API_KEYS.js` file with `google API key` and `mongoURI`.
2. Create `.env` file in project root with twillio keys.

### Installing Dependencies
`$ npm install` or `yarn`
`$ gulp start`


## Running tests
1. `npm start`

2. `npm test`

## Roadmap

### Features
- Improved product filtering functionality
  * Better visualization
- Filter by schedule
- Calendar view of farmers markets schedules from search results
- Google Maps Marker Features
  * Label markers with corresponding result index
  * Ability to select results from list and highlight associated marker on map
  * Improved autocentering and zooming functionality
    * When a new set of results is populated the map should auto center and zoom as closely in on the results as possible

### Performance
- Improved autocomplete reliability
- Move product category parsing to the server side

### Data
- Update data using more recent 2016 government data
- Increase database size to include farmers markets from other major cities
  * Examples
    * Los Angeles
    * Portland
    * Chicago
    * Boston
    * San Francisco
    * Washington D.C.
    * etc.

## Contributing
View the [contribution document](./CONTRIBUTING.md)

## Notes
If you would like to create your own mongoDB, please visit the [README](./Database_Data/README.md) in Database_Data directory for instructions on how you can populate your own mongoDB.

## License
[The MIT License](https://opensource.org/licenses/MIT)
