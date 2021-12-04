const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: 'error'
})

module.exports = client;
