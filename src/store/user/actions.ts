import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { IUserState } from './state';

const actions: ActionTree<IUserState, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;
