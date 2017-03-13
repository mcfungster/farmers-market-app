# Instructions for Populating Database

## Note:
All the data in our MongoDB lies in the `Database_Data` directory. The steps taken to populate the MongoDB are listed below. All scripts used for fetching, parsing, and populating data are within this directory as well. All scripts in this directory should be run only once, since the USDA is unlikely to update its data anytime soon.

1. Generate array of [NYC zip codes](./zipCodesNYC.js)
2. Make API calls to USDA farmer's markets to grab all farmers markets based on zip code and store them as [json files](./realData_allMarkets)
3. Iterate through all farmer's markets and collect all market IDs, and store as an array
4. Retrieve [individual farmer's market data](./fetchIndividualMarketData.js) and store as json object in [realData_MarketsData](./realData_MarketsData)
5. Parse all individual market data and populate database with the script in [Data_Import_Function](./Data_Import_Function)
