const scanSite = require('./scanSite')

describe('scanSite()', () => {
  it('is defined', () => {
    expect(scanSite).toBeDefined();
    expect(typeof scanSite).toEqual('function');
  })

  it('get all links from a url', async () => {
    const URL = 'https://davidburgos.blog/';
    let out;
    let error;
    try {
      out = await scanSite(URL, { recursive: true, maxPages: 2 });
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(out).toBeDefined();
      expect(Array.isArray(out)).toEqual(true);
      expect(out.length).toBeGreaterThan(0);
      expect(out[0].url).toEqual(URL);
      expect(out[0].links.length).toBeGreaterThanOrEqual(0);
      expect(out[0].countLinks).toBeGreaterThan(0);
      expect(out[0].responseTime).toBeGreaterThan(0);
      expect(out[0].executionTime).toBeGreaterThan(0);
    }
  });
});