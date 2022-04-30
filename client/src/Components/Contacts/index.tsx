import React from "react";
import { ListGroup } from "react-bootstrap";
import { IFRRequests } from "../../Interface/redux";
import ContactItem from "./ContactItem";
interface IProps {
  contacts: IFRRequests[];
}

const Contact: React.FC<IProps> = ({ contacts }) => {
  return (
    <ListGroup className="m-2">
      {contacts.map((ct) => (
        <ListGroup.Item className="d-flex align-items-center justify-content-between">
          <ContactItem friend={ct} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Contact;
