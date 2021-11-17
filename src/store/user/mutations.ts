import { MutationTree } from 'vuex';
import { IUserState } from './state';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER_INFO = 'SET_USER_INFO';

const mutation: MutationTree<IUserState> = {
  [SET_TOKEN] ( state, payload: string) {
    state.token = payload;
  },

  [SET_USER_INFO] ( state, payload) {
    // state.info = payload
  }
};

export default mutation;
