import { describe, it, expect, vi, beforeEach } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import { routes } from '../../router/index';
import PostView from '../PostView.vue';
import { createWebHistory } from 'vue-router';
import { createRouterMock, injectRouterMock, type RouterMock, getRouter } from 'vue-router-mock'
import createFetchMock from 'vitest-fetch-mock';
import postData from './PostView.data.json';


const mountGlobal = { stubs: ['FontAwesomeIcon'] };
const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

// mock posts API /api/post/<id>
const postUrlRegex = /\/api\/post\/(\d+)\/?(?:\?.*)?/
fetchMock.doMock((req) => {
  const match = req.url.match(postUrlRegex)
  if (!match || !match[1] || !(match[1] in postData))
    return { status: 404, body: '{}' };
  return { status: 200, body: JSON.stringify(postData[<keyof typeof postData> match[1]]) };
});

describe('PostView', () => {
  const router: RouterMock = createRouterMock({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    spy: {
      create: fn => vi.fn(fn),
      reset: spy => spy.mockReset(),
    },
  });
  beforeEach(() => {
    injectRouterMock(router);
  })

  it('first post', async () => {
    // make sure router mocking worked
    expect(getRouter()).toBe(router);
    
    const wrapper = mount(PostView, {global: mountGlobal});

    router.push({name: 'post', params: {id: 1}});
    router.setParams({id: 1});
    await flushPromises();
    // await wrapper.vm.$nextTick();
    // wrapper.vm.$router
    
    expect(wrapper.html()).toMatchSnapshot();
  });
});
