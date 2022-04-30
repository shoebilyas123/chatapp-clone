import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { IFRRequests, IGlobalState } from "../../Interface/redux";
import { getAuthConfig } from "../../Utilities/api";
const useData = () => {
  const { userAccessToken, userInfo } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
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
  };

  return {
    toggleAddUser,
    state,
    reduxState,
  };
};

export default useData;
