var data = require('./data.js');
var mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');
var mongoURI = require('./../../API_KEYS.js').mongoURI;
mongoose.connect(mongoURI);

var allMarkets = new mongoose.Schema({
  Address: String,
  GoogleLink: String,
  Products: String,
  Schedule: String,
  geometry: {  type: { type: String } , coordinates: { type: [Number] } },
  Name: String  
}); 


        
const Market = mongoose.model('allMarkets', allMarkets);

function convert(markets){
 
  for(var i=0; i < markets.length; i++){
    var string = markets[i]['marketdetails']['GoogleLink'];
    var newString = "";
    var start = string.indexOf("=");
    var end = string.indexOf("(");
    var coordString = string.slice(start+1,end);
    var scissorIndex =coordString.indexOf("-");
    var latitudeWithPercentages = coordString.slice(0,scissorIndex);
    var longitudeWithPercentages = coordString.slice(scissorIndex);
    var percentLatIndex = latitudeWithPercentages.indexOf("%");
    var percentLongIndex = longitudeWithPercentages.indexOf("%");
    var longitude = Number(longitudeWithPercentages.slice(0, percentLongIndex));
    var latitude = Number(latitudeWithPercentages.slice(0,percentLatIndex));
    markets[i]['marketdetails']['geometry'] = { type: "Point" , coordinates: [ longitude, latitude ] }
    if(markets[i]['marketdetails']['Schedule'].includes('<br> <br> <br>')){
      var delIndex = markets[i]['marketdetails']['Schedule'].indexOf("<br> <br> <br>");
      markets[i]['marketdetails']['Schedule']= markets[i]['marketdetails']['Schedule'].slice(0, delIndex-1);
    }
    
    var link = markets[i]['marketdetails']['GoogleLink'];
    link = link.slice(link.indexOf("%22")+3);
    link = link.slice(0, link.indexOf("%22"));
    link = link.split("+").join(" ");
    markets[i]['marketdetails']['Name'] = link;
    
  }

  return markets; 

}

 
var dataz= convert(data);

var newdataz = [];

for(var z=0; z < dataz.length; z++){
  newdataz.push(dataz[z]['marketdetails']);
}


Market.collection.insert(newdataz);
Market.collection.createIndex( { geometry : "2dsphere" } );





