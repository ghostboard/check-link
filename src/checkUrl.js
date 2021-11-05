const axios = require('axios');
const userAgents = require('top-user-agents');
const randomItem = require('array-random-item');

module.exports = async function (url, options = {}) {
  const requestConfig = {
    headers: { 'User-Agent': randomItem(userAgents) },
    timeout: 5 * 1000
  };
  let start;
  let responseTime;
  let isOK;
  let status;
  try {
    start = new Date().getTime();
    const out = await axios.head(url, requestConfig).then((res) => res);
    responseTime = (new Date().getTime() - start) / 1000;
    isOK = out && (out.status === 200 || out.statusText === 'OK');
    status = out.status;
  } catch (e) {
    responseTime = (new Date().getTime() - start) / 1000;
    isOK = false;
    status = e && e.response && e.response.status || 500;
  }
  if (!isOK) {
    try {
      start = new Date().getTime();
      await axios.get(url, requestConfig).then((res) => res.data);
      responseTime = (new Date().getTime() - start) / 1000;
    } catch (e) {
      responseTime = (new Date().getTime() - start) / 1000;
      isOK = e.code === 'ECONNABORTED' || false;
      status = e && e.response && e.response.status || 500;
    }
  }

  const output = {
    url,
    status,
    isOK,
    responseTime
  };
  return output;
}