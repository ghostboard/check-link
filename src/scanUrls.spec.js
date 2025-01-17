const scanUrls = require('./scanUrls')

describe('scanUrls()', () => {
	jest.setTimeout(15000);

	it('is defined', () => {
		expect(scanUrls).toBeDefined();
		expect(typeof scanUrls).toEqual('function');
	})

	it('check a list with several links of a same url', async () => {
		const URLS = [
			'https://davidburgos.blog/',
			'https://google.com',
			'https://davidburgos.blog/about-me/',
			'https://davidburgos.blog/popular-posts/',
			'https://davidburgos.blog/tag/english/',
			'http://davidburgos.blog'
		];
		let error;
		try {
			const options = {
				onUrlError: (e) => {
					console.log('>> error', e)
					error = e;
				},
				onUrlDone: (out) => {
					expect(URLS.includes(out.url)).toEqual(true);
					expect(out.status).toEqual(200);
					expect(out.isOK).toEqual(true);
					expect(out.responseTime).toBeGreaterThan(0);
				},
				onEnd: (result) => {
					expect(result.urlsDone).toBeGreaterThan(0);
					expect(result.executionTime).toBeGreaterThan(0);
				}
			}
			await scanUrls(URLS, options);
		} catch (e) {
			error = e;
		} finally {
			expect(error).toBeUndefined();
		}
	});
});