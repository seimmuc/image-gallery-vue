import type { FetchMock } from "vitest-fetch-mock/types";
import testData from './TestData.json';

const urlRegexApiHome = /^\/api\/home\/?$/;
const urlRegexApiPool = /^\/api\/pool\/([A-Za-z_\-]+)\/?$/;
const urlRegexApiPost = /^\/api\/post\/(\d+)\/?$/;
  
export function startMocking(fetchMock: FetchMock) {
  fetchMock.enableMocks();
  fetchMock.doMock((req) => {
    if (req.url.match(urlRegexApiHome)) {
      return JSON.stringify(testData['home']);
    }
    let match;
    if (match = req.url.match(urlRegexApiPool)) {
      return JSON.stringify(testData.pools[<keyof typeof testData.pools> match[1]]);
    }
    if (match = req.url.match(urlRegexApiPost)) {
      return JSON.stringify(testData.posts[<keyof typeof testData.posts> match[1]]);
    }
    return { status: 404, body: '{}' };
  });
}
export function stopMocking(fetchMock: FetchMock) {
  fetchMock.resetMocks();
  fetchMock.disableMocks();
}
