import React, { ReactElement, ReactNode } from "react";
import {
  OverlayTrigger,
  Popover as BootstrapPopover,
  Button,
} from "react-bootstrap";

interface IProps {
  title: string | ReactNode;
  content: string | ReactNode;
  icon: string | ReactNode;
  variant?: string;
  placement?: "auto" | "top" | "bottom" | "right" | "left";
  width: string | number;
  className?: string;
}

const Popover: React.FC<IProps> = ({
  title,
  content,
  icon,
  variant = "primary",
  placement = "auto",
  width = "240px",
  className = "",
}) => {
  const popover = (
    <BootstrapPopover style={{ width }}>
      <BootstrapPopover.Header as="h3">{title}</BootstrapPopover.Header>
      <BootstrapPopover.Body className={className}>
        {content}
      </BootstrapPopover.Body>
    </BootstrapPopover>
  );
  return (
    <OverlayTrigger trigger="click" placement={placement} overlay={popover}>
      <Button variant={variant}>{icon}</Button>
    </OverlayTrigger>
  );
};
export default Popover;
