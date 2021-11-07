const scanSite = require('./scanSite')

describe('scanSite()', () => {
	jest.setTimeout(10000);
	it('is defined', () => {
		expect(scanSite).toBeDefined();
		expect(typeof scanSite).toEqual('function');
	})

	it('get all links from a url in recursive mode', async () => {
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

	it('get the error from a link', async () => {
		const URL = 'https://davidburgos.blog/tag/not-found';
		let error;
		try {
			const options = {
				recursive: false,
				onPageError: (e) => {
					expect(e).toBeDefined()
					expect(e.url).toEqual(URL)
					expect(e.error).toBeDefined()
					expect(e.error.response).toBeDefined()
					expect(e.error.response.status).toEqual(404)
				}
			}
			await scanSite(URL, options);
		} catch (e) {
			console.log('>> catch', e);
			error = e;
		} finally {
			expect(error).toBeUndefined();
		}
	})
});