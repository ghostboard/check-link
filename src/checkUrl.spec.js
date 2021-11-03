const checkUrl = require('./checkUrl')

describe('checkUrl()', () => {
  it('is defined', () => {
    expect(checkUrl).toBeDefined();
    expect(typeof checkUrl).toEqual('function');
  })

  it('check a valid url', async () => {
    const URL = 'https://davidburgos.blog/';
    let out;
    let error;
    try {
      out = await checkUrl(URL);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(out).toBeDefined();
      expect(out.url).toEqual(URL);
      expect(out.status).toEqual(200);
      expect(out.isOK).toEqual(true);
      expect(out.responseTime).toBeGreaterThan(0);
    }
  });

  it('check a not found url', async () => {
    const URL = 'https://davidburgos.blog/not-found';
    let out;
    let error;
    try {
      out = await checkUrl(URL);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(out).toBeDefined();
      expect(out.url).toEqual(URL);
      expect(out.status).toEqual(404);
      expect(out.isOK).toEqual(false);
      expect(out.responseTime).toBeGreaterThan(0);
    }
  });

	it('check a not found url', async () => {
		const URL = 'https://glasslytics.com/';
		let out;
		let error;
		try {
			out = await checkUrl(URL);
		} catch (e) {
			error = e;
		} finally {
			expect(error).toBeUndefined();
			expect(out).toBeDefined();
			expect(out.url).toEqual(URL);
			expect(out.status).toEqual(500);
			expect(out.isOK).toEqual(false);
			expect(out.responseTime).toBeGreaterThan(0);
		}
	});
});