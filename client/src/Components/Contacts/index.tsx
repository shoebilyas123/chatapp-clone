import React from "react";
import { Dropdown, ListGroup } from "react-bootstrap";
import { IFRRequests } from "../../Interface/redux";
import DefaultAvatar from "../DefaultAvatar";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import ContactItem from "./ContactItem";
interface IProps {
  contacts: IFRRequests[];
}

const Contact: React.FC<IProps> = ({ contacts }) => {
  return (
    <ListGroup className="m-2">
      {contacts.map((ct) => (
        <ListGroup.Item className="d-flex align-items-center justify-content-between shadow-sm">
          <ContactItem friend={ct} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Contact;
