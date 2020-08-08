import { promises as fs } from 'fs';
import path from 'path';
import parser from '../src/parser';

const fixturesPath = path.join(__dirname, '__fixtures__');

test('testing parser', async () => {
  const rssFeed = await fs.readFile(path.join(fixturesPath, 'feed.xml'));
  const resultObj = await fs.readFile(path.join(fixturesPath, 'parsedResult.json'));
  expect(parser(rssFeed)).toEqual(JSON.parse(resultObj));
});
