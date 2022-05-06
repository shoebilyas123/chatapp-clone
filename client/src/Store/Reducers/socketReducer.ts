import { SOCKET_INIT } from '../Constants/socket';

export default (state = {}, action: any) => {
  switch (action.type) {
    case SOCKET_INIT:
      return { ...state, socket: action.payload.token };
    default:
      return { ...state };
  }
};
