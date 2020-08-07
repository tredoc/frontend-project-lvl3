import { promises as fs } from 'fs';
import path from 'path';
import sum from '../src/sum';
import parser from '../src/parser';

const fixturesPath = path.join(__dirname, '__fixtures__');

test('testing parser', async () => {
  const rssFeed = await fs.readFile(path.join(fixturesPath, 'feed.xml'));
  const resultObj = await fs.readFile(path.join(fixturesPath, 'parsedResult.json'));
  expect(parser(rssFeed)).toEqual(JSON.parse(resultObj));
});

test('1 + 2 should return 3', () => {
  expect(sum(1, 2)).toBe(3);
});
