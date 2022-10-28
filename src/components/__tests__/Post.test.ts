import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import Post from '../Post.vue'
import type { IPost } from '../../api'

const mountGlobal = { stubs: ['FontAwesomeIcon'] };

describe('Post component', () => {
  it('empty post', () => {
    const wrapper = mount(Post, {props: {post: null, gotoPrev: null, gotoNext: null}, global: mountGlobal});
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.text()).toHaveLength(0);
  });

  it('standalone post', () => {
    const postData: IPost = {id: 1, name: 'Test Post', description: 'just a standalone post', file_url: '/image1.png'}
    const wrapper = mount(Post, {props: {post: postData, gotoPrev: null, gotoNext: null}, global: mountGlobal});
    expect(wrapper.get('h1').text()).toEqual(postData.name);
    expect(wrapper.get('.post-image').attributes('src')).toEqual(postData.file_url);
    expect(wrapper.get('p').text()).toEqual(postData.description);
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true]
  ])('post nav buttons (%s, %s)', (left: boolean, right: boolean) => {
    const postData = {id: 1, description: '', file_url: ''};
    const lfn = left? vi.fn() : null;
    const rfn = right? vi.fn() : null;
    const wrapper = mount(Post, {props: {post: postData, gotoPrev: lfn, gotoNext: rfn}, global: mountGlobal});
    expect(wrapper.findAll('.side-navigation')).toHaveLength(+left + +right);
    if (left) {
      expect(wrapper.get('font-awesome-icon-stub[icon~="fa-chevron-left"]'));
      expect(lfn).not.toHaveBeenCalledOnce();
      wrapper.get('.side-navigation-left').trigger('click');
      expect(lfn).toHaveBeenCalledOnce();
    }
    if (right) {
      expect(wrapper.get('font-awesome-icon-stub[icon~="fa-chevron-right"]'));
      expect(rfn).not.toHaveBeenCalledOnce();
      wrapper.get('.side-navigation-right').trigger('click');
      expect(rfn).toHaveBeenCalledOnce();
    }
  });
});
