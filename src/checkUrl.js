const axios = require('axios');
const userAgents = require('top-user-agents');
const randomItem = require('array-random-item');

module.exports = async function (url, options = {}) {
  const requestConfig = {
    headers: { 'User-Agent': randomItem(userAgents) }
  };
  let start;
  let responseTime;
  let isOK;
  let status;
  try {
    start = new Date().getTime();
    const out = await axios.head(url, requestConfig).then((res) => res);
    responseTime = (new Date().getTime()-start)/1000;
    isOK = out && (out.status === 200 || out.statusText === 'OK');
    status = out.status;
    if (!isOK) {
      start = new Date().getTime();
      await axios.get(url, requestConfig).then((res) => res.data);
      responseTime = (new Date().getTime()-start)/1000;
    }
  } catch (e) {
    responseTime = (new Date().getTime()-start)/1000;
    isOK = false;
    status = e.response.status;
  }
  const output = {
    url,
    status,
    isOK,
    responseTime
  };
  return output;
}