const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser')
const axios = require('axios')
const https = require('https')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const { toIS08601, stringToNumber, toTBA, getStatus } = require('../utils')
const request = require('request')
const csv = require('csvtojson')
require('dotenv').config()

const sheetId = '1wdxIwD0b58znX4UrH6JJh_0IhnZP0YWn23Uqs7lHB6Q'
const doc = new GoogleSpreadsheet(sheetId)

// Get from GOOGLE
doc.useApiKey(process.env.DOC_API_KEY)

class Scraper {
  async getHTML(
    url = 'https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_Philippines'
  ) {
    try {
      const res = await axios(url)
      return cheerio.load(res.data)
    } catch (e) {
      console.log(e)
      throw new Error("Can't fetch url.")
    }
  }

  getFacilities() {
    const data = []
    return new Promise((resolve, reject) => {
      csv()
        .fromStream(
          request.get(
            'https://raw.githubusercontent.com/gigerbytes/ncov-ph-data/master/data/facilities.csv'
          )
        )
        .subscribe(
          json => {
            data.push(json)
          },
          function(e) {
            reject(e)
          },
          function() {
            resolve(
              data.map(i => {
                const clone = { ...i }
                delete clone.dashboard_last_updated
                delete clone.inserted_at
                clone.puis = +i.puis
                clone.confirmed_cases = +i.confirmed_cases
                clone.latitude = +i.latitude
                clone.longitude = +i.longitude
                return clone
              })
            )
          }
        )
    })
  }

  async getCases() {
    try {
      const count = await this.getCasesCount()
      const casesCSV = await this.getCasesCSV()
      const redditCases = await this.getRedditCases()
      const cases = casesCSV.map((i, idx) => {
        return {
          case_no: idx + 1,
          date:
            toTBA(i.date_lab_confirmed) !== 'TBA'
              ? i.date_lab_confirmed.split(' ')[0]
              : 'TBA',
          age: +i.age,
          gender: i.sex.charAt(0),
          nationality: redditCases[idx]
            ? toTBA(redditCases[idx]['Nationality'])
            : 'TBA',
          hospital_admitted_to: toTBA(i.facility),
          travel_history: redditCases[idx]
            ? toTBA(redditCases[idx]['Travel History'])
            : 'TBA',
          status: redditCases[idx]
            ? getStatus(redditCases[idx]['Status'])
            : 'Admitted',
          latitude: toTBA(i.latitude) !== 'TBA' ? +i.latitude : 'TBA',
          longitude: toTBA(i.longitude) !== 'TBA' ? +i.longitude : 'TBA',
          resident_of: redditCases[idx]
            ? toTBA(redditCases[idx]['Resident of'])
            : 'TBA'
        }
      })

      if (count > cases.length) {
        for (let x = cases.length + 1; x <= count; x += 1) {
          cases.push({
            case_no: x,
            date: 'TBA',
            age: 'TBA',
            gender: 'TBA',
            nationality: 'TBA',
            hospital_admitted_to: 'TBA',
            travel_history: 'TBA',
            status: 'Admitted',
            latitude: 'TBA',
            longitude: 'TBA',
            resident_of: 'TBA'
          })
        }
      }

      return cases
    } catch (e) {
      throw new Error(e)
    }
  }

  getCasesCSV() {
    const data = []
    return new Promise((resolve, reject) => {
      csv()
        .fromStream(
          request.get(
            'https://raw.githubusercontent.com/gigerbytes/ncov-ph-data/master/data/cases_ph.csv'
          )
        )
        .subscribe(
          json => {
            data.push(json)
          },
          function(e) {
            reject(e)
          },
          function() {
            resolve(data.reverse())
          }
        )
    })
  }

  async getCasesCount() {
    const $ = await this.getHTML()

    return +$('.infobox tbody tr th:contains("Confirmed cases")')
      .next()
      .text()
      .replace(/\,/g, '')
  }

  async getRedditCases() {
    await doc.loadInfo()

    // Main database from reddit
    const firstSheet = doc.sheetsByIndex[0]

    const rows = await firstSheet.getRows({
      offset: 1
    })

    return rows
  }

  async getCasesOutsidePh() {
    const $ = await this.getHTML()
    cheerioTableparser($)
    const rawData = $('.wikitable')
      .eq(1)
      .parsetable(true, true, true)

    const formattedData = []

    rawData[0].forEach((item, idx) => {
      const skip = [
        0,
        rawData[0].length - 1,
        rawData[0].length - 2,
        rawData[0].length - 3
      ]
      if (skip.includes(idx)) return

      const obj = {
        country_territory_place: item.split('[')[0],
        confirmed: +rawData[1][idx].split('[')[0],
        recovered: +rawData[2][idx].split('[')[0],
        died: +rawData[3][idx].split('[')[0]
      }

      formattedData.push(obj)
    })

    // return formattedData

    return formattedData
  }

  async getLaboratoryStatusOfPatients() {
    const agent = new https.Agent({
      rejectUnauthorized: false
    })
    const res = await axios('https://www.doh.gov.ph/2019-nCov', {
      httpsAgent: agent
    })
    const $ = cheerio.load(res.data)

    const formattedData = {}

    $('table')
      .eq(0)
      .find('tbody tr')
      .each((idx, el) => {
        const td = $(el).children()
        formattedData[
          td
            .eq(0)
            .text()
            .trim()
            .split(' ')
            .join('_')
            .toLowerCase()
        ] = +td
          .eq(1)
          .text()
          .trim()
          .split('(')[0]
          .replace(/\,/g, '')
      })

    return formattedData
  }

  async getLockdowns() {
    const url =
      'https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data/Philippines_coronavirus_quarantines'
    const $ = await this.getHTML(url)
    cheerioTableparser($)
    const rawData = $('.wikitable')
      .first()
      .parsetable(true, true, true)

    const formattedData = []

    rawData[0].forEach((item, idx) => {
      const skipIdx = [
        0,
        1,
        2,
        rawData[0].length - 1,
        rawData[0].length - 2,
        rawData[0].length - 3
      ]
      if (skipIdx.includes(idx)) return

      formattedData.push({
        lgu: item.split('[')[0].trim(),
        region: rawData[1][idx],
        start_date: toIS08601(rawData[2][idx]),
        estimated_population: stringToNumber(rawData[3][idx]),
        cases: +rawData[4][idx] || 0,
        deaths: +rawData[5][idx] || 0,
        recovered: +rawData[6][idx || 0]
      })
    })

    return formattedData
  }
}

module.exports = Scraper
