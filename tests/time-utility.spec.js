const { generateRandom } = require('./../src/utils/time.js');

describe('Time Utility', () => {
  it('generates a random number between a min and max range', () => {
    const random = generateRandom(0, 50);

    expect(random >= 0 && random <= 50).toBe(true);
  });
});
