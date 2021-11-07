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
  const startTime = new Date().getTime();
  let urlsDone = 0;
  const queue = urls.map(async (url) => {
    let hostname;
    let lastHostRequestAt;
    try {
      hostname = new URL(url).hostname;
      lastHostRequestAt = await keyv.get(hostname);
    } catch (e) {
      console.log('> newUrl catch', url, e);
    }
    try {
      console.log('>> test url', url, new Date())
      console.log('>> hostname & time', hostname, lastHostRequestAt)
      if (lastHostRequestAt) {
        const now = new Date().getTime();
        const diffTime = now - lastHostRequestAt;
        if (diffTime < minInterval) {
          const maxTimeLeft = maxInterval - diffTime;
          const minTimeLeft = minInterval - diffTime;
          const timeLeft = random.int(minTimeLeft, maxTimeLeft);
          console.log('>>> wait ', hostname, timeLeft);
          await Timeout.set(timeLeft);
        }
      }

      lastRequestTime = new Date().getTime();
      console.log('>> set host', hostname, lastRequestTime)
      keyv.set(hostname, lastRequestTime, HOST_CACHE_EXPIRATION).then();
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
  });
  await Promise.all(queue);
  const output = { urlsDone, executionTime: (new Date().getTime() - startTime) / 1000 };
  console.log('>> completed', output)
  if (onEnd && typeof onEnd === 'function') {
    onEnd(output);
  }
  return output;
}