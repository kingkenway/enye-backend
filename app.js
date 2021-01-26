const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const request_ = require('request');
const URL ="https://api.exchangeratesapi.io/latest"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// GET route to fetch currency conversion rates.
app.get("/api/rates", (request, response) => {
	// Make request to the api URL
	request_(URL, function (error, resp, body) {
		// Check if home based currency and the needed currency is given
		if (request.query.base && request.query.currency){
			// Retrieve base currency and the needed currencies.
			const baseCurrency = request.query.base
			const currencies = request.query.currency.split(',')
			
			// Retrieve overall rates and the date.
			const rates = JSON.parse(body)['rates']
			const date = JSON.parse(body)['date']

			// Get base currency rate
			const baseCurrencyRate = (1 / rates[baseCurrency])

			// Initialise the final rate data
			let ratesData = {}

			// Loop through all desired currencies and get the needed rates
			currencies.forEach( (entry) => {
				if(entry == "EUR"){
					ratesData[entry] = parseFloat(baseCurrencyRate.toFixed(10))
				}else{
					ratesData[entry] = parseFloat((rates[entry] * baseCurrencyRate).toFixed(10));
				}
			});

			// Set output parameters
			let finalOutput = {
				base: baseCurrency,
				date,
				rates: ratesData
			}

			// Return json formatted response
			response.json( {"results": finalOutput } );
		}
		
		// If not, return the overall rates with EUR as the base currency
		else{
			response.json( {"results": JSON.parse(body)} );
		}

	});
	
});

// listen for requests :)
const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});