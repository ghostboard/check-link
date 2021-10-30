const axios = require('axios');
const cheerio = require('cheerio');
const userAgents = require('top-user-agents');
const randomItem = require('array-random-item');

module.exports = async function (url, options = {}) {
  const {
    unique = true
  } = options;
  const requestConfig = {
    headers: { 'User-Agent': randomItem(userAgents) }
  };
  const start = new Date().getTime();
  const html = await axios.get(url, requestConfig).then((res) => res.data);
  const responseTime = (new Date().getTime()-start)/1000;
  const $ = cheerio.load(html);
  const anchors = $('a[href]');
  const links = [];
  const countLinks = anchors.length;
  $(anchors).each(function (i, link) {
    const href = $(link).attr('href');
    const fullPath = new URL(href, url).href;
    const isDifferent = url !== fullPath;
    const addLink = isDifferent && (!unique || (unique && !links.includes(fullPath)));
    if (addLink) {
      links.push(fullPath);
    }
  });
  const output = {
    url,
    links,
    countLinks,
    responseTime,
    executionTime: (new Date().getTime()-start)/1000
  };
  return output;
}