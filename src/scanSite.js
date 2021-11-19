const Timeout = require('await-timeout');
const random = require('random');
const getLinks = require('./getLinks');

module.exports = async function (url, options = {}) {
    const {
        recursive = false,
        minInterval = 1000,
        maxInterval = 3000,
        maxPages = false,
	      maxMinutes = false,
        onPageDone,
        onPageError,
        onEnd
    } = options;
    const startTime = new Date().getTime();
    let pages = 0;
    let lastRequestTime = new Date().getTime();
    let result;
    try {
        result = await getLinks(url, options);
    } catch (e) {
        if (onPageError && typeof onPageError === 'function') {
            onPageError({ url, error: e });
        }
    }
    if (!recursive) {
        if (onPageDone && typeof onPageDone === 'function') {
            onPageDone(result);
        }
        if (onEnd && typeof onEnd === 'function') {
            onEnd({ pages, executionTime: (new Date().getTime() - startTime) / 1000 });
        }
    }
    const nextPages = [];
    result && result.links.forEach((link) => {
        const isSameDomain = link.startsWith(url);
        if (isSameDomain) {
            nextPages.push({ page: url, link });
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
            const lastOutput = await getLinks(page.link, options);
            pages += 1;
            if (onPageDone && typeof onPageDone === 'function') {
                onPageDone(lastOutput);
            }
						const executionTime = (new Date().getTime() - startTime) / 1000;
						const doneDueMaxPages = maxPages && pages >= maxPages;
						const doneDueTime = maxMinutes && executionTime/60 >= maxMinutes;
						const mustEndNow = doneDueMaxPages || doneDueTime;
            if (mustEndNow) {
                if (onEnd && typeof onEnd === 'function') {
                    return onEnd({ pages, executionTime });
                }
            }
            lastOutput.links.forEach((link) => {
                const isSameDomain = link.startsWith(url);
                const alreadyIncluded = nextPages.includes(link);
                const proceed = isSameDomain && !alreadyIncluded;
                if (proceed) {
                    nextPages.push({ page: page.link, link });
                }
            });
        } catch (e) {
            if (onPageError && typeof onPageError === 'function') {
                onPageError({ page: page.page, url: page.link, error: e });
            }
        }
    }
    const output = { pages, executionTime: (new Date().getTime() - startTime) / 1000 };
    if (onEnd && typeof onEnd === 'function') {
        onEnd(output);
    }
    return output;
}