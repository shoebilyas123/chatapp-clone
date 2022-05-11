import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { IFriends, IGlobalState } from '../../Interface/redux';
import { getAuthConfig } from '../../Utilities/api';
const useData = () => {
  const {
    userLogin: { userAccessToken, userInfo, loading, success, error },
    chats,
  } = useSelector((state: IGlobalState) => state);
  const [addUserModal, setAddUserModal] = React.useState(false);

  const toggleAddUser = () => {
    setAddUserModal((prev) => !prev);
  };

  const state = {
    addUserModal,
  };

  const reduxState = {
    userInfo,
    userAccessToken,
    chats,
    loading,
    success,
    error,
  };

  return {
    toggleAddUser,
    state,
    reduxState,
  };
};

export default useData;
