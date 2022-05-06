import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { IFRRequests, IGlobalState } from '../../Interface/redux';
import { getAuthConfig } from '../../Utilities/api';
const useData = () => {
  const {
    userLogin: { userAccessToken, userInfo, loading },
    chatInfo,
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
    chatInfo,
    loading,
  };

  return {
    toggleAddUser,
    state,
    reduxState,
  };
};

export default useData;
