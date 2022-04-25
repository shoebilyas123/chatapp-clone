import React, { Dispatch } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IGlobalState } from "../../Interface/redux";
import { logout } from "../../Store/Actions/auth";

const Home = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const { userInfo } = useSelector((state: IGlobalState) => state.userLogin);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo]);

  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <div>
      <Button onClick={logoutHandler}>Logout</Button>
    </div>
  );
};

export default Home;
