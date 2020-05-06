require('dotenv').config();
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const axios = require('axios');
const https = require('https');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const request = require('request');
const csv = require('csvtojson');
const dayjs = require('dayjs');
const paginate = require('paginate-array');

const sheetId = '16g_PUxKYMC0XjeEKF6FPUBq2-pFgmTkHoj5lbVrGLhE';
const doc = new GoogleSpreadsheet(sheetId);

// Get from GOOGLE
doc.useApiKey(process.env.DOC_API_KEY);

class Scraper {
    getFacilities() {
        const data = [];
        return new Promise((resolve, reject) => {
            csv()
            .fromStream(
                request.get(
                    'https://raw.githubusercontent.com/gigerbytes/ncov-ph-data/master/data/facilities.csv'
                )
            )
            .subscribe(
                (json) => {
            data.push(json);
    },
        function (e) {
            reject(e);
        },
        function () {
            resolve(
                data.map((i) => {
                    const clone = { ...i };
            delete clone.dashboard_last_updated;
            delete clone.inserted_at;
            clone.puis = +i.puis;
            clone.confirmed_cases = +i.confirmed_cases;
            clone.latitude = +i.latitude;
            clone.longitude = +i.longitude;
            return clone;
        })
        );
        }
    );
    });
    }

    async getSheetByTitle(title) {
        await doc.loadInfo();

        // Find sheet by title
        const sheetIndex = doc.sheetsByIndex.findIndex((i) => i.title === title);

        if (sheetIndex === -1) {
            throw {
                message: 'Sheet not found',
            };
        }

        const sheet = doc.sheetsByIndex[sheetIndex];

        const rows = await sheet.getRows();
        return rows;
    }

    async getTotalCases() {
        const rows = await this.getSheetByTitle('Historical');

        const reversed = rows.reverse();

        let result;

        for (let x = 0; x < reversed.length; x++) {
            const row = reversed[x];
            const dateRow = dayjs(row['Date']).format('YYYY-MM-DD');

            if (row['Cases']) {
                result = {
                    last_update: dateRow,
                    cases: +row['Cases'],
                    deaths: +row['Deaths'],
                    recoveries: +row['Recoveries'],
                    cases_today: +row['Daily Case Increase'],
                    deaths_today: +row['Daily Death'],
                    recoveries_today: +row['Daily Recovery'],
                    admitted: +row['Admitted'],
                    fatality_rate: row['Fatality Rate'],
                    recovery_rate: row['Recovery Rate'],
                };
                break;
            }
        }

        return result;
    }

    async getHistorical(query) {
        const { page, itemsPerPage = 100, filterBy, filterByValue } = query;
        let rows = (await this.getSheetByTitle('Historical')).sort(
            (a, b) => +new Date(a.Date) - +new Date(b.Date)
    );

        // To-Do
        // Check if filter by is present
        // if (filterBy && filterByValue) {
        // 	rows = rows.filter((i) => i[filterBy] && i[filterBy] === filterByValue);
        // }

        if (page) {
            const paginateCollection = paginate(rows, page, itemsPerPage);
            return {
                ...paginateCollection,
                data: paginateCollection.data.map((row) => {
                const formattedRow = {
                    date: dayjs(row['Date']).format('YYYY-MM-DD'),
                    cases: row['Cases'],
                    deaths: row['Deaths'],
                    recoveries: row['Recoveries'],
                    tests_conducted_pui: row['Tests Conducted PUI'] ? +row['Tests Conducted PUI'] : '',
                    total_tests_conducted: row['Total Tests Conducted'] ? +row['Total Tests Conducted'] : '',
                    daily_case_increase: row['Daily Case Increase'],
                    daily_death: row['Daily Death'],
                    daily_recovery: row['Daily Recovery'],
                    puis: row['PUIs'] ? +row['PUIs'] : '',
                    pums: row['PUMs'] ? +row['PUMs'] : '',
                    admitted: row['Admitted'],
                    fatality_rate: row['Fatality Rate'] ? +row['Fatality Rate'] : '',
                    recovery_rate: row['Recovery Rate'] ? +row['Recovery Rate'] : ''
                };

            return formattedRow;
        }),
        };
        }

        // // Returns all data
        // // This is heavy
        return rows.map((row) => {
            return {
                date: dayjs(row['Date']).format('YYYY-MM-DD'),
                cases: row['Cases'],
                deaths: row['Deaths'],
                recoveries: row['Recoveries'],
                tests_conducted_pui: row['Tests Conducted PUI'] ? +row['Tests Conducted PUI'] : '',
                total_tests_conducted: row['Total Tests Conducted'] ? +row['Total Tests Conducted'] : '',
                daily_case_increase: row['Daily Case Increase'],
                daily_death: row['Daily Death'],
                daily_recovery: row['Daily Recovery'],
                puis: row['PUIs'] ? +row['PUIs'] : '',
                pums: row['PUMs'] ? +row['PUMs'] : '',
                admitted: row['Admitted'],
                fatality_rate: row['Fatality Rate'] ? +row['Fatality Rate'] : '',
                recovery_rate: row['Recovery Rate'] ? +row['Recovery Rate'] : ''
            };
    });
    }

    async getHistorical(query) {
        const { page, itemsPerPage = 100, filterBy, filterByValue } = query;
        let rows = (await this.getSheetByTitle('Historical')).sort(
            (a, b) => +new Date(a.Date) - +new Date(b.Date)
    );

        // To-Do
        // Check if filter by is present
        // if (filterBy && filterByValue) {
        // 	rows = rows.filter((i) => i[filterBy] && i[filterBy] === filterByValue);
        // }

        if (page) {
            const paginateCollection = paginate(rows, page, itemsPerPage);
            return {
                ...paginateCollection,
                data: paginateCollection.data.map((row) => {
                const formattedRow = {
                    date: dayjs(row['Date']).format('YYYY-MM-DD'),
                    cases: row['Cases'],
                    deaths: row['Deaths'],
                    recoveries: row['Recoveries'],
                    tests_conducted_pui: row['Tests Conducted PUI'] ? +row['Tests Conducted PUI'] : '',
                    total_tests_conducted: row['Total Tests Conducted'] ? +row['Total Tests Conducted'] : '',
                    daily_case_increase: row['Daily Case Increase'],
                    daily_death: row['Daily Death'],
                    daily_recovery: row['Daily Recovery'],
                    puis: row['PUIs'] ? +row['PUIs'] : '',
                    pums: row['PUMs'] ? +row['PUMs'] : '',
                    admitted: row['Admitted'],
                    fatality_rate: row['Fatality Rate'] ? +row['Fatality Rate'] : '',
                    recovery_rate: row['Recovery Rate'] ? +row['Recovery Rate'] : ''
                };

            return formattedRow;
        }),
        };
        }

        // // Returns all data
        // // This is heavy
        return rows.map((row) => {
            return {
                date: dayjs(row['Date']).format('YYYY-MM-DD'),
                cases: row['Cases'],
                deaths: row['Deaths'],
                recoveries: row['Recoveries'],
                tests_conducted_pui: row['Tests Conducted PUI'] ? +row['Tests Conducted PUI'] : '',
                total_tests_conducted: row['Total Tests Conducted'] ? +row['Total Tests Conducted'] : '',
                daily_case_increase: row['Daily Case Increase'],
                daily_death: row['Daily Death'],
                daily_recovery: row['Daily Recovery'],
                puis: row['PUIs'] ? +row['PUIs'] : '',
                pums: row['PUMs'] ? +row['PUMs'] : '',
                admitted: row['Admitted'],
                fatality_rate: row['Fatality Rate'] ? +row['Fatality Rate'] : '',
                recovery_rate: row['Recovery Rate'] ? +row['Recovery Rate'] : ''
            };
    });
    }

    async getDOHDataDrop(query) {
        const { page, itemsPerPage = 100, filterBy, filterByValue } = query;
        let rows = (await this.getSheetByTitle('DOH Data Drop')).sort(
            (a, b) => +new Date(a.DateRepConf) - +new Date(b.DateRepConf)
    );

        // To-Do
        // Check if filter by is present
        // if (filterBy && filterByValue) {
        // 	rows = rows.filter((i) => i[filterBy] && i[filterBy] === filterByValue);
        // }

        if (page) {
            const paginateCollection = paginate(rows, page, itemsPerPage);
            return {
                ...paginateCollection,
                data: paginateCollection.data.map((row) => {
                const formattedRow = {
                    case_code: row['CaseCode'],
                    age: row['Age'] ? +row['Age'] : '',
                    sex: row['Sex'] ? row['Sex'].charAt(0) : '',
                    is_admitted: row['Admitted'],
                    date_reported: dayjs(row['DateRepConf']).format('YYYY-MM-DD'),
                    date_died: row['DateDied']
                        ? dayjs(row['DateDied']).format('YYYY-MM-DD')
                        : '',
                    recovered_on: row['DateRecover']
                        ? dayjs(row['DateRecover']).format('YYYY-MM-DD')
                        : '',
                    region_res: row['RegionRes'],
                    prov_city_res: row['ProvCityRes'],
                    location: row['Location'],
                    latitude: row['Latitude'] ? +row['Latitude'] : '',
                    longitude: row['Longitude'] ? +row['Longitude'] : '',
                };

            return formattedRow;
        }),
        };
        }

        // // Returns all data
        // // This is heavy
        return rows.map((row) => {
            return {
                case_code: row['CaseCode'],
                age: row['Age'] ? +row['Age'] : '',
                sex: row['Sex'] ? row['Sex'].charAt(0) : '',
                is_admitted: row['Admitted'],
                date_reported: dayjs(row['DateRepConf']).format('YYYY-MM-DD'),
                date_died: row['DateDied']
                    ? dayjs(row['DateDied']).format('YYYY-MM-DD')
                    : '',
                recovered_on: row['DateRecover']
                    ? dayjs(row['DateRecover']).format('YYYY-MM-DD')
                    : '',
                region_res: row['RegionRes'],
                prov_city_res: row['ProvCityRes'],
                location: row['Location'],
                latitude: row['Latitude'] ? +row['Latitude'] : '',
                longitude: row['Longitude'] ? +row['Longitude'] : '',
            };
    });
    }

    async getCases(query) {
        const { page, itemsPerPage = 100 } = query;
        let rows = (await this.getSheetByTitle('Cases')).sort(
            (a, b) =>
        +new Date(a['Date of Announcement to the Public']) -
        +new Date(b['Date of Announcement to the Public'])
    );

        if (page) {
            const paginateCollection = paginate(rows, page, itemsPerPage);
            return {
                ...paginateCollection,
                data: paginateCollection.data.map((row) => {
                return {
                    case_no: row['Case No.'],
                    sex: row['Sex'] ? row['Sex'].charAt(0) : '',
                    age: row['Age'] ? +row['Age'] : '',
                    nationality: row['Nationality'],
                    residence_in_the_ph: row['Residence in the Philippines'],
                    travel_history: row['Travel History'],
                    date_of_announcement_to_public: dayjs(
                        row['Date of Announcement to the Public']
                    ).format('YYYY-MM-DD'),
                    hospital_admitted_to: row['Admission / Consultation'],
                    status: row['Status'],
                    health_status: row['Health Status'],
                    location: row['Location'],
                    latitude: row['Latitude'] ? +row['Latitude'] : '',
                    longitude: row['Longitude'] ? +row['Longitude'] : '',
                    residence_lat: row['Residence Lat'] ? +row['Residence Lat'] : '',
                    residence_long: row['Residence Long'] ? +row['Residence Long'] : '',
                };
        }),
        };
        }

        return rows.map((row) => {
            return {
                case_no: row['Case No.'],
                sex: row['Sex'] ? row['Sex'].charAt(0) : '',
                age: row['Age'] ? +row['Age'] : '',
                nationality: row['Nationality'],
                residence_in_the_ph: row['Residence in the Philippines'],
                travel_history: row['Travel History'],
                date_of_announcement_to_public: dayjs(
                    row['Date of Announcement to the Public']
                ).format('YYYY-MM-DD'),
                hospital_admitted_to: row['Admission / Consultation'],
                status: row['Status'],
                health_status: row['Health Status'],
                location: row['Location'],
                latitude: row['Latitude'] ? +row['Latitude'] : '',
                longitude: row['Longitude'] ? +row['Longitude'] : '',
                residence_lat: row['Residence Lat'] ? +row['Residence Lat'] : '',
                residence_long: row['Residence Long'] ? +row['Residence Long'] : '',
            };
    });
    }

    async getCasesOutsidePh() {
        const res = await axios(
            'https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_Philippines'
        );
        const $ = cheerio.load(res.data);
        cheerioTableparser($);
        const rawData = $('.wikitable').eq(1).parsetable(true, true, true);

        const formattedData = [];

        rawData[0].forEach((item, idx) => {
            const skip = [
                0,
                rawData[0].length - 1,
                rawData[0].length - 2,
                rawData[0].length - 3,
            ];
        if (skip.includes(idx)) return;

        const obj = {
            country_territory_place: item.split('[')[0],
            confirmed: +rawData[1][idx].split('[')[0],
            recovered: +rawData[2][idx].split('[')[0],
            died: +rawData[3][idx].split('[')[0],
        };

        formattedData.push(obj);
    });

        return formattedData;
    }

    async getLaboratoryStatusOfPatients() {
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });
        const res = await axios('https://www.doh.gov.ph/2019-nCov', {
            httpsAgent: agent,
        });
        const $ = cheerio.load(res.data);

        const formattedData = {};

        $('table')
            .eq(0)
            .find('tbody tr')
            .each((idx, el) => {
            const td = $(el).children();
        formattedData[
            td.eq(0).text().trim().split(' ').join('_').toLowerCase()
            ] = +td.eq(1).text().trim().split('(')[0].replace(/\,/g, '');
    });

        return formattedData;
    }
}

module.exports = Scraper;
