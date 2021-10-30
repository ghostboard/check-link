
const Timeout = require('await-timeout');
const random = require('random');
const getLinks = require('./getLinks');

module.exports = async function (url, options = {}) {
    const {
        recursive = false,
        unique = true,
        minInterval = 1000,
        maxInterval = 3000,
        maxPages = false
    } = options;
    let lastRequestTime = new Date().getTime();
    const result = await getLinks(url, options);
    if (!recursive) {
        return result;
    }
    const output = [result];
    const nextPages = [];
    result.links.forEach((link) => {
        const isSameDomain = link.startsWith(url);
        if (isSameDomain) {
            nextPages.push(link);
        }
    });
    for (const page of nextPages) {
        try {
            const now = new Date().getTime();
            const diffTime = now - lastRequestTime;
            if (diffTime < minInterval) {
                const maxTimeLeft = maxInterval - diffTime;
                const minTimeLeft = minInterval - diffTime;
                const timeLeft = random.int(minTimeLeft, maxTimeLeft);
                await Timeout.set(timeLeft);
            }
            lastRequestTime = new Date().getTime();
            const lastOutput = await getLinks(page, options);
            output.push(lastOutput);
            if (maxPages && output.length >= maxPages) {
                return output;
            }
            lastOutput.links.forEach((link) => {
                const isSameDomain = link.startsWith(url);
                const alreadyIncluded = nextPages.includes(link);
                const proceed = isSameDomain && !alreadyIncluded;
                if (proceed) {
                    nextPages.push(link);
                }
            });
        } catch(e) {
            console.error(`Error scraping url=${page}`);
            console.error(e);
        }
    }
    return output;
}