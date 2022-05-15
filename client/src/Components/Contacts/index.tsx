import React from 'react';
import { Dropdown, ListGroup } from 'react-bootstrap';
import { IFriends } from '../../Interface/redux';
import DefaultAvatar from '../DefaultAvatar';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import ContactItem from './ContactItem';
interface IProps {
  contacts: IFriends[];
}

const Contact: React.FC<IProps> = ({ contacts }) => {
  return (
    <ListGroup className="m-2">
      {contacts.length > 0 &&
        contacts.map((ct) => <ContactItem friend={ct} key={ct._id} />)}
    </ListGroup>
  );
};

export default Contact;
