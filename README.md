<a href="https://www.buymeacoffee.com/7eDr4fv" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;" ></a>

# coronavirus-ph (API)

> 🦠 An API for tracking the coronavirus (COVID-19, SARS-CoV-2) outbreak in the Philippines.

![GitHub](https://img.shields.io/github/license/sorxrob/coronavirus-ph-api)
![GitHub repo size](https://img.shields.io/github/repo-size/sorxrob/coronavirus-ph-api?label=size)
![GitHub stars](https://img.shields.io/github/stars/sorxrob/coronavirus-ph-api)
![GitHub forks](https://img.shields.io/github/forks/sorxrob/coronavirus-ph-api)
![GitHub last commit](https://img.shields.io/github/last-commit/sorxrob/coronavirus-ph-api)

## Endpoints

All requests must be made to the base url: `https://coronavirus-ph-api.herokuapp.com` (e.g: https://coronavirus-ph-api.herokuapp.com/cases). You can try them out in your browser to further inspect responses.

Getting total cases:

```http
GET /total
```

```json
{
  "cases": 6459,
  "deaths": 428,
  "recoveries": 613,
  "cases_today": 200,
  "deaths_today": 19,
  "recoveries_today": 41,
  "admitted": 5418,
  "fatality_rate": "6.63%",
  "recovery_rate": "9.49%"
}
```

Getting summary of COVID-19 cases in the Philippines (DOH Data Drop):

```http
GET /doh-data-drop
```

```json
[
  {
    "case_code": "C404174",
    "age": 38,
    "sex": "F",
    "is_admitted": "",
    "date_reported": "2020-01-30",
    "date_died": "",
    "recovered_on": "2020-02-08",
    "region_res": "Negros Oriental",
    "prov_city_res": "Dumaguete City (Capital)",
    "location": "Dumaguete City (Capital), Negros Oriental",
    "latitude": 9.3061758,
    "longitude": 123.3046069
  },
  {...}
]
```

Getting summary of COVID-19 cases in the Philippines:

```http
GET /cases
```

```json
[
  {
    "case_no": "PH00001",
    "sex": "F",
    "age": 38,
    "nationality": "Chinese",
    "residence_in_the_ph": "None",
    "travel_history": "China",
    "date_of_announcement_to_public": "2020-01-30",
    "hospital_admitted_to": "San Lazaro Hospital",
    "status": "Recovered",
    "health_status": "Recovered",
    "location": "Manila City",
    "latitude": 14.61348,
    "longitude": 120.98095,
    "residence_lat": 14.5987266,
    "residence_long": 120.9819909
  },
  {...}
]
```

Getting confirmed cases of Filipino
nationals outside the Philippines by Region:

```http
GET /cases-outside-ph
```

```json
[
  {
    "country_territory_place": "Asia-Pacific",
    "confirmed": 272,
    "recovered": 111,
    "died": 160
  },
  {...}
]
```

Getting list of facitilies

```http
GET /facilities
```

```json
[
  {
    "facility": "Research Institute for Tropical Medicine",
    "puis": 24,
    "confirmed_cases": 9,
    "region": "NCR",
    "latitude": 14.4096347,
    "longitude": 121.0374245
  },
  {...}
]
```

Getting Metro Manila Community Quarantine Checkpoints:

```http
GET /mm-checkpoints
```

```json
[
  {
    "id": 13,
    "district": "NORTHERN POLICE DISTRICT",
    "city": "VALENZUELA CITY",
    "location": "NLEX (ENTRANCE)",
    "type": "EntryExit",
    "lat": 14.768614,
    "lng": 120.967557,
    "description": "Not verified"
  },
  {...}
]
```

Getting a single Metro Manila Community Quarantine Checkpoint:

```http
GET /mm-checkpoints/:id
```

```json
{
	"id": 13,
	"district": "NORTHERN POLICE DISTRICT",
	"city": "VALENZUELA CITY",
	"location": "NLEX (ENTRANCE)",
	"type": "EntryExit",
	"lat": 14.768614,
	"lng": 120.967557,
	"description": "Not verified"
}
```

## Data

All data are programmatically retrieved, re-formatted and stored in the cache for one hour.

- http://tiny.cc/n8nsmz
- https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_Philippines
- https://safetravel.ph
- https://github.com/gigerbytes/ncov-ph-data

## Installation

- `git clone https://github.com/sorxrob/coronavirus-ph-api.git`
- `cd coronavirus-ph-api`
- `cp .env.example .env`
- `npm install`
- `npm start`

## Running / Development

- `npm run dev`
- Visit your app at [http://localhost:3030](http://localhost:3030).

## License & copyright

© Robert C Soriano

Licensed under the [MIT License](LICENSE).
