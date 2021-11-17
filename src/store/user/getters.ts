import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { IUserState } from './state';

const getters: GetterTree<IUserState, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;
