import { describe, it, expect, vi, beforeEach } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import { routes } from '../../router/index';
import PostView from '../PostView.vue';
import { createRouter, createWebHistory, type Router } from 'vue-router';
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

  let router: Router;
  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(import.meta.env.BASE_URL),
      routes: routes,
    });
    // router.push('/');
    // await router.isReady();
  });

  it('first post', async () => {
    router.push({name: 'post', params: {id: 1}});
    await router.isReady();
    const wrapper = mount(PostView, {global: {...mountGlobal, plugins: [router]}});
    wrapper.vm.$router.push({name: 'post', params: {id: 1}});
    await flushPromises();
    expect(wrapper.vm.$router).toBe(router);
    
    expect(wrapper.html()).toMatchSnapshot();
  });
});
