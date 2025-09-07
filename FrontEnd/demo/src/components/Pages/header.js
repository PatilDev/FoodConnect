import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./header.css";

const Header = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role; // assuming your user object has a role field

  return (
    <div
      className="top-navbar"
      style={{ padding: 20, margin: 5, position: "fixed", width: "100%", zIndex: 1000 }}
    >
      <Nav className="nav-horizontal">
        {/* Pages for all users */}
        <NavItem>
          <NavLink href="/home">Home</NavLink>
        </NavItem>
          {/* Pages only for customers */}
        {role === "ROLE_CUSTOMER" && (
          <>
            <NavItem>
              <NavLink href="/cart">My Cart</NavLink>
            </NavItem>
          </>
        )}
        <NavItem>
          <NavLink href="/user">User Details</NavLink>
        </NavItem>
         <NavItem>
          <NavLink href="/about">About</NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default Header;
