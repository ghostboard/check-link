const getLinks = require('./getLinks')

describe('getLinks()', () => {
  it('is defined', () => {
    expect(getLinks).toBeDefined();
    expect(typeof getLinks).toEqual('function');
  })

  it('get links array from a url', async () => {
    const URL = 'https://davidburgos.blog/';
    let out;
    let error;
    try {
      out = await getLinks(URL);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(out).toBeDefined();
      expect(out.url).toEqual(URL);
      expect(out.links.length).toBeGreaterThanOrEqual(0);
      expect(out.countLinks).toBeGreaterThan(0);
      expect(out.responseTime).toBeGreaterThan(0);
      expect(out.executionTime).toBeGreaterThan(0);
    }
  });
});