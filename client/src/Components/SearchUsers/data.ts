import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { IFriends, IGlobalState } from '../../Interface/redux';
import { getAuthConfig } from '../../Utilities/api';

export default () => {
  const { userAccessToken, userInfo, loading } = useSelector(
    (state: IGlobalState) => state.userLogin
  );
  const [userList, setUserList] = React.useState<IFriends[]>([]);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const search = e.target.value;

    if (!search) return;

    try {
      setIsSearching(true);

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
          profilePic: user.profilePic,
        }))
      );
      setIsSearching(false);
    } catch (error) {
      setIsSearching(false);
      console.log(error);
    }
  };

  const state = {
    userList,
    isSearching,
  };

  const reduxState = {
    userInfo,
    loading,
  };

  return { state, reduxState, onSearchChange, setIsSearching, setUserList };
};
