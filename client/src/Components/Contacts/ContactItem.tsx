import React, { Ref } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { IFRRequests } from "../../Interface/redux";
import DefaultAvatar from "../DefaultAvatar";
import { FiMoreVertical } from "react-icons/fi";

interface IProps {
  friend: IFRRequests;
}
const CustomToggle: any = React.forwardRef(
  (
    {
      children,
      onClick,
    }: { children: React.ReactNode; onClick: (e: any) => void },
    ref: Ref<any>
  ) => (
    <a
      href=""
      ref={ref}
      onClick={(e: any) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  )
);

const ContactItem: React.FC<IProps> = ({ friend }) => {
  return (
    <>
      <div className="d-flex align-items-center">
        <DefaultAvatar
          text={friend.name.slice(0, 1).toUpperCase()}
          color={friend.avatarColor || ""}
          width={"3rem"}
          height="3rem"
        />
        <span className="ml-2">
          {friend.name.slice(0, 1).toUpperCase() + friend.name.slice(1)}
        </span>
      </div>
      <Dropdown className="d-inline mx-2">
        <Dropdown.Toggle as={CustomToggle} id="dropdown-autoclose-true">
          <FiMoreVertical />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#">Archive</Dropdown.Item>
          <Dropdown.Item href="#">Delete Chats</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Remove Friend</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default ContactItem;
