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
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [userList, setUserList] = React.useState<IFRRequests[]>([]);

  const toggleAddUser = () => {
    setAddUserModal((prev) => !prev);
  };

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setIsSearching(true);
      const search = e.target.value;

      const config = getAuthConfig({ token: userAccessToken });

      const { data } = await axios.get(
        `/api/v1/users?search=${search}&forFR=true`,
        config
      );

      setUserList(
        data.map((user: any) => ({
          name: user.name,
          email: user.email,
          _id: user._id,
          avatarColor: user.avatarColor,
        }))
      );
      setIsSearching(false);
    } catch (error) {
      setIsSearching(false);
      console.log(error);
    }
  };

  const state = {
    isSearching,
    userList,
    addUserModal,
  };

  const reduxState = {
    userInfo,
    userAccessToken,
  };

  return {
    toggleAddUser,
    setIsSearching,
    onSearchChange,
    state,
    reduxState,
  };
};

export default useData;
