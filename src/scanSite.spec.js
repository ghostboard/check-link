const scanSite = require('./scanSite')

describe('scanSite()', () => {
	it('is defined', () => {
    expect(scanSite).toBeDefined();
    expect(typeof scanSite).toEqual('function');
  })

  it('get all links from a url', async () => {
		const URL = 'https://davidburgos.blog/';
		const MAX_PAGES = 2;
    let error;
		let pagesDone = 0;
    try {
			const options = {
				recursive: true,
				maxPages: MAX_PAGES,
				onPageError: (e) => {
					error = e;
				},
				onPageDone: (result) => {
					expect(result.links.length).toBeGreaterThanOrEqual(0);
					expect(result.countLinks).toBeGreaterThan(0);
					expect(result.responseTime).toBeGreaterThan(0);
					expect(result.executionTime).toBeGreaterThan(0);
					expect(pagesDone).toBeGreaterThanOrEqual(0);
					expect(pagesDone).toBeLessThanOrEqual(MAX_PAGES);
					pagesDone += 1;
				},
				onEnd: (result) => {
					expect(result.pages).toBeGreaterThan(0);
					expect(result.executionTime).toBeGreaterThan(0);
				}
			}
      await scanSite(URL, options);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
    }
  });
});