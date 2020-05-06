const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apicache = require('apicache');
const path = require('path');
const Scraper = require('./services/Scraper');
const Checkpoint = require('./services/Checkpoint');

const app = express();
const cache = apicache.middleware;

const scrape = new Scraper();
const checkpoint = new Checkpoint();

app.use(morgan('dev'));
app.use(cors());
app.use(cache('5 hours'));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/README.md', (_, res) => {
  res.sendFile(path.join(__dirname + '/README.md'));
});

app.get('/total', async (req, res) => {
  try {
    const data = await scrape.getTotalCases();
    return res.json({
      success: true,
      source: 'https://tiny.cc/n8nsmz',
      data,
    });
  } catch (e) {
    return res.json({
      sucess: false,
      message: e.message,
    });
  }
});

app.get('/cases', async (req, res) => {
  try {
    const data = await scrape.getCases(req.query);
    return res.json({
      success: true,
      source: 'https://tiny.cc/n8nsmz',
      data,
    });
  } catch (e) {
    return res.json({
      sucess: false,
      message: e.message,
    });
  }
});

app.get('/historical', async (req, res) => {
    try {
        const data = await scrape.getHistorical(req.query);
return res.json({
    success: true,
    source: 'https://tiny.cc/n8nsmz',
    data,
});
} catch (e) {
    console.log(e);
    return res.json({
        sucess: false,
        message: e.message,
    });
}
});

app.get('/doh-data-drop', async (req, res) => {
  try {
    const data = await scrape.getDOHDataDrop(req.query);
    return res.json({
      success: true,
      source: 'https://tiny.cc/n8nsmz',
      data,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      sucess: false,
      message: e.message,
    });
  }
});

app.get('/facilities', async (_, res) => {
  try {
    const data = await scrape.getFacilities();
    return res.json({
      success: true,
      source: 'https://github.com/gigerbytes/ncov-ph-data',
      info: 'DOH updated their covid tracker. Data incomplete.',
      data,
    });
  } catch (e) {
    return res.json({
      sucess: false,
      message: e.message,
    });
  }
});

// Confirmed cases of Filipino nationals outside the Philippines
app.get('/cases-outside-ph', async (_, res) => {
  try {
    const data = await scrape.getCasesOutsidePh();
    return res.json({
      success: true,
      source:
        'https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_Philippines',
      data,
    });
  } catch (e) {
    return res.json({
      sucess: false,
      message: e.message,
    });
  }
});

// Metro manila community quarantine checkpoints
app.get('/mm-checkpoints', async (_, res) => {
  try {
    const data = checkpoint.getAll();
    return res.json({
      success: true,
      source: 'https://safetravel.ph',
      data,
    });
  } catch (e) {
    return res.json({
      sucess: false,
      message: e.message,
    });
  }
});

app.get('/mm-checkpoints/:id', async (req, res) => {
  try {
    const data = checkpoint.getOne(req.params.id);
    return res.json({
      success: true,
      source: 'https://safetravel.ph',
      data,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: 'Not found',
    });
  }
});

module.exports = app;
