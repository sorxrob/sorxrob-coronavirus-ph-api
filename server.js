const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const apicache = require('apicache')
const path = require('path')
const Scraper = require('./services/Scraper')
const Checkpoint = require('./services/Checkpoint')

const app = express()
const cache = apicache.middleware

const scrape = new Scraper()
const checkpoint = new Checkpoint()

app.use(morgan('dev'))
app.use(cors())
app.use(cache('2 hours'))

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/README.md', (_, res) => {
  res.sendFile(path.join(__dirname + '/README.md'))
})

// Summary of COVID-19 cases in the Philippines
app.get('/cases', async (req, res) => {
  const data = await scrape.getCases()
  return res.json(data)
})

// Confirmed cases of Filipino nationals outside the Philippines
app.get('/cases-outside-ph', async (_, res) => {
  const data = await scrape.getCasesOutsidePh()
  return res.json(data)
})

// Laboratory Status of Patients in the Philippines
app.get('/test-results', async (_, res) => {
  const data = await scrape.getLaboratoryStatusOfPatients()
  return res.json(data)
})

app.get('/patients-under-investigation', async (_, res) => {
  const data = await scrape.getPatientsUnderInvestigation()
  return res.json(data)
})

// Metro manila community quarantine checkpoints
app.get('/mm-checkpoints', async (_, res) => {
  const data = checkpoint.getAll()
  return res.json(data)
})

app.get('/mm-checkpoints/:id', async (req, res) => {
  try {
    const data = checkpoint.getOne(req.params.id)
    return res.json(data)
  } catch (e) {
    return res.sendStatus(404)
  }
})

// Local government units under partial lockdown
app.get('/lockdowns', async (_, res) => {
  const data = await scrape.getLockdowns()
  return res.json(data)
})

module.exports = app
