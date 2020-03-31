# coronavirus-ph (API)

> 🦠A simple and fast (< 200ms) api for tracking the coronavirus (COVID-19, SARS-CoV-2) outbreak in the Philippines.

![GitHub](https://img.shields.io/github/license/sorxrob/coronavirus-ph-api)
![GitHub repo size](https://img.shields.io/github/repo-size/sorxrob/coronavirus-ph-api?label=size)
![GitHub stars](https://img.shields.io/github/stars/sorxrob/coronavirus-ph-api)
![GitHub forks](https://img.shields.io/github/forks/sorxrob/coronavirus-ph-api)
![GitHub last commit](https://img.shields.io/github/last-commit/sorxrob/coronavirus-ph-api)

## Endpoints

All requests must be made to the base url: `https://coronavirus-ph-api.herokuapp.com` (e.g: https://coronavirus-ph-api.herokuapp.com/cases). You can try them out in your browser to further inspect responses.

Getting summary of COVID-19 cases in the Philippines:

```http
GET /cases
```

```json
[
  {
    "case_no": 1,
    "date": "2020-01-30",
    "age": 38,
    "gender": "F",
    "nationality": "Chinese",
    "hospital_admitted_to": "San Lazaro Hospital",
    "travel_history": "Yes",
    "status": "Recovered",
    "latitude": 14.613754,
    "longitude": 120.98081499999999,
    "resident_of": "Wuhan, China"
  },
  {...}
]

```

Getting confirmed cases of Filipino
nationals outside the Philippines:

```http
GET /cases-outside-ph
```

```json
[
  {
    "country_territory_place": "Diamond Princess",
    "confirmed": 80,
    "recovered": 70,
    "died": 0
  },
  {...}
]
```

Getting list of facitilies

```http
GET /facitilies
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

Getting Laboratory Status of Patients in the Philippines

```http
GET /test-results
```

```json
{
  "confirmed_cases": 636,
  "cases_tested_negative": 728,
  "cases_pending_test_results": 595
}
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

Getting Local government units under partial lockdown:

```http
GET /lockdowns
```

```json
[
  {
    "lgu": "Ilocos Norte",
    "region": "I",
    "start_date": "2020-03-14",
    "estimated_population": 593081,
    "cases": 0,
    "deaths": 0,
    "recovered": 0
  },
  {...}
]
```

## Data

All data are programmatically retrieved, re-formatted and stored in the cache for one hour.

- [Cases from r/Coronavirus_PH spreadsheet](https://www.reddit.com/r/Coronavirus_PH/comments/fehzke/ph_covid19_case_database_is_now_live/)
- [Wikipedia](https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_Philippines)
- [Metro Manila community quarantine checkpoints](https://safetravel.ph)
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

## Testing

- `npm test`

## In the Wild

A list of public websites that are using this API

- https://zntp.github.io/covidcase
- https://covid19ph-update.netlify.com
- https://covid19.nextvation.com
- https://www.facebook.com/dubrechi/posts/3417813594901888
- https://techron.info
- https://alexisrequerman.github.io/covid19ph
- http://www.armilwebdev.com/coronavirus
- https://ncov.gundamserver.com

## Other apps

I also launched a [coronavirus tracking website](https://the2019ncov.com) and open-sourced it!

## Donate

<a href="https://www.buymeacoffee.com/7eDr4fv" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;" ></a>

## License & copyright

© Robert C Soriano

Licensed under the [MIT License](LICENSE).
