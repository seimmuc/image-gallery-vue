import { describe, it, expect, vi, beforeEach, afterAll, beforeAll, afterEach } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import { routes } from '../../router/index';
import PostView from '../PostView.vue';
import { createWebHistory } from 'vue-router';
import { createRouterMock, injectRouterMock, type RouterMock, getRouter } from 'vue-router-mock'
import createFetchMock from 'vitest-fetch-mock';
import { fetchHome, fetchPool, fetchPost } from '@/api';
import { startMocking, stopMocking } from './TestDataMocker';


describe('PostView', () => {
  const mountGlobal = { stubs: ['FontAwesomeIcon'] };
  const router: RouterMock = createRouterMock({
    history: createWebHistory(),
    routes: routes,
    spy: {
      create: fn => vi.fn(fn),
      reset: spy => spy.mockReset(),
    },
  });
  const fetchMock = createFetchMock(vi);

  beforeAll(() => {
    startMocking(fetchMock);
  });
  afterAll(() => {
    stopMocking(fetchMock);
  });
  
  beforeEach(() => {
    injectRouterMock(router);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('api mocking', async () => {
    // Makes sure the API fetch mock is working. This mostly tests the testing environment rather than production code.
    const home = await fetchHome();
    expect(home?.pools.find(p => p.name == 'all')?.size).toEqual(5);
    expect(home?.pools.find(p => p.name == 'onepostpool')?.posts?.map(p => p.id)).toEqual([4]);
    const poolAll = await fetchPool('all');
    expect(poolAll?.posts?.[2].file_url).toEqual('/images/nameless_image.gif');
    const postNameless = await fetchPost(3);
    expect(postNameless?.name).toBeUndefined();
    expect(postNameless?.pools?.find(p => p.name == 'testpool')).toBeDefined();
    expect((await fetchPool('testpool'))?.posts?.map(p => p.id)).toContain(postNameless?.id);
    expect((await fetchPost(6))?.pools).toHaveLength(0);
    const nlNextId = postNameless?.pools?.find(p => p.name == 'testpool')?.nextid;
    expect(nlNextId).toEqual(5);
    expect((await fetchPost(<number>nlNextId))).toHaveProperty('description', 'last post');
  });

  it('first post', async () => {
    // just a simple post render test

    // make sure router mocking worked
    expect(getRouter()).toBe(router);
    
    const wrapper = mount(PostView, {global: mountGlobal});
    router.push({name: 'post'});
    router.setParams({id: 1});
    await flushPromises();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('navigation buttons', async () => {
    // checks for presense and function of the navigation buttons. Mocked router will prevent actual navigation from happening.
    const buttonsPresent = () => ['left', 'right'].map(s => wrapper.find(`.side-navigation-${s}`).exists());

    const wrapper = mount(PostView, {global: mountGlobal});

    // 1st post (testpool)
    router.setParams({id: 1});
    router.setQuery({pool: 'testpool'});
    await flushPromises();
    expect(buttonsPresent()).toEqual([false, true]);
    wrapper.find('.side-navigation-right').trigger('click');
    expect(router.push).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenLastCalledWith(expect.objectContaining({name: 'post', params: {id: 3}, query: {pool: 'testpool'}}));
    expect(wrapper.html()).toMatchSnapshot();

    // 3rd post (testpool)
    router.setParams({id: 3});
    router.setQuery({pool: 'testpool'});
    await flushPromises();
    expect(buttonsPresent()).toEqual([true, true]);
    wrapper.find('.side-navigation-left').trigger('click');
    expect(router.push).toHaveBeenCalledTimes(2);
    expect(router.push).toHaveBeenLastCalledWith(expect.objectContaining({name: 'post', params: {id: 1}, query: {pool: 'testpool'}}));
    wrapper.find('.side-navigation-right').trigger('click');
    expect(router.push).toHaveBeenCalledTimes(3);
    expect(router.push).toHaveBeenLastCalledWith(expect.objectContaining({name: 'post', params: {id: 5}, query: {pool: 'testpool'}}));
    expect(wrapper.html()).toMatchSnapshot();

    // 5th post (all)
    router.setParams({id: 5});
    router.setQuery({pool: 'all'});
    await flushPromises();
    expect(buttonsPresent()).toEqual([true, false]);
    wrapper.find('.side-navigation-left').trigger('click');
    expect(router.push).toHaveBeenCalledTimes(4);
    expect(router.push).toHaveBeenLastCalledWith(expect.objectContaining({name: 'post', params: {id: 4}, query: {pool: 'all'}}));
    expect(wrapper.html()).toMatchSnapshot();
  });
});
