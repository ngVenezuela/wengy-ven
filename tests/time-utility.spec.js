const { generateRandom } = require('../src/time-utility.js');

describe('Time Utility', () => {
  it('generates a random number between a min and max range', () => {
    const random = generateRandom(1, 50);

    expect( random >= 1 && random <= 50 ).toBe(true);
  });
})
