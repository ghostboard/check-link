const Timeout = require('await-timeout');
const random = require('random');
const checkUrl = require('./checkUrl');
const Keyv = require('keyv');
const keyv = new Keyv();
const ONE_HOUR = 1 * 60 * 60 * 1000;
const HOST_CACHE_EXPIRATION = ONE_HOUR;

module.exports = async function (urls = [], options = {}) {
  const {
    minInterval = 1000,
    maxInterval = 3000,
    onUrlError,
    onUrlDone,
    onEnd
  } = options;
  const queue = {};
  const startTime = new Date().getTime();
  let urlsDone = 0;
  urls.forEach((url) => {
    let hostname;
    try {
      hostname = new URL(url).hostname;
      if (queue[hostname]) {
        queue[hostname].push(url);
      } else {
        queue[hostname] = [url];
      }
    } catch (e) {
      console.log('> newUrl catch', url, e);
    }
  });
  const promises = Object.keys(queue).map(async (host) => {
    for (const url of queue[host]) {
      let lastHostRequestAt;
      try {
        lastHostRequestAt = await keyv.get(host);
      } catch (e) {
        console.log('> newUrl catch', url, e);
      }
      try {
        if (lastHostRequestAt) {
          const now = new Date().getTime();
          const diffTime = now - lastHostRequestAt;
          if (diffTime < minInterval) {
            const maxTimeLeft = maxInterval - diffTime;
            const minTimeLeft = minInterval - diffTime;
            const timeLeft = random.int(minTimeLeft, maxTimeLeft);
            await Timeout.set(timeLeft);
          }
        }

        lastRequestTime = new Date().getTime();
        await keyv.set(host, lastRequestTime, HOST_CACHE_EXPIRATION);
        const lastOutput = await checkUrl(url, options);
        urlsDone += 1;
        if (onUrlDone && typeof onUrlDone === 'function') {
          onUrlDone(lastOutput);
        }
      } catch (e) {
        if (onUrlError && typeof onUrlError === 'function') {
          onUrlError({ url, error: e });
        }
      }
    }
  });
  await Promise.all(promises);
  const output = { urlsDone, executionTime: (new Date().getTime() - startTime) / 1000 };
  if (onEnd && typeof onEnd === 'function') {
    onEnd(output);
  }
  return output;
}