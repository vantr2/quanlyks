import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

const SidebarLink = styled.div`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    color: white;
    text-decoration: none;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 3rem;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #632ce4;
    cursor: pointer;
    color: white;
    text-decoration: none;
  }
`;

const SubMenu = ({ item, sidebar, status }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);
  let hi = useHistory();
  return (
    <>
      <SidebarLink
        // onClick={(e) => {
        //   hi.push(item.path);
        // }}
        onClick={(e) => {
          if (item.subNav) {
            showSubnav();
          } else {
            hi.push(item.path);
            if (status) {
              sidebar();
            }
          }
        }}
      >
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink
              to={item.path}
              key={index}
              onClick={() => {
                if (status) {
                  sidebar();
                }
              }}
            >
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
