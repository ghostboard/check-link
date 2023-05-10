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
	let redirectsCount = 0;
	let redirectedUrl;
  try {
    start = new Date().getTime();
    const out = await axios.head(url, requestConfig);
		redirectsCount = out?.request?._redirectable?._redirectCount;
		redirectedUrl = out?.request?._redirectable?._currentUrl;
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
      const out = await axios.get(url, requestConfig);
	    redirectsCount = out?.request?._redirectable?._redirectCount;
	    redirectedUrl = out?.request?._redirectable?._currentUrl;
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
	if (redirectsCount > 0) {
		output.redirectsCount = redirectsCount;
		output.redirectedUrl = redirectedUrl;
	}
  return output;
}