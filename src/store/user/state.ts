export interface IUserState {
  token: string;
  info?: User;
}

interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
  avatar: string;
}

function state(): IUserState {
  return {
    token: '',
    info: undefined
  }
};

export default state;
