import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import { AccountContext } from "../../contexts/AccountContext";

const SidebarContainer = styled.div`
  position: fixed;
  width: 100%;
  z-index: 30;
`;

const Nav = styled.div`
  background: #15171c;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #000000;
    border: 1px solid #555555;
  }
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  margin-right: 60rem;
  color: white;
  cursor: pointer;
  line-height: 4rem;
`;

const Account = styled.div`
  color: white;
  cursor: pointer;
  line-height: 4rem;
  margin-right: 2rem;
`;

const Avatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  margin-right: 0.4rem;
`;

const Logout = styled.span`
  &:hover {
    text-decoration: underline;
  }
`;

const UserDisplayName = styled.span`
  font-weight: 600;
`;

const Sidebar = () => {
  let history = useHistory();
  const [sidebar, setSidebar] = useState(false);
  const userrole = window.localStorage.getItem("user_role");
  const showSidebar = () => setSidebar(!sidebar);

  const { userDisplayName, userAvatar } = useContext(AccountContext);

  const handleGoHome = () => {
    history.push("/quan-ly");
    if (sidebar) showSidebar();
  };

  const handleLogout = () => {
    window.localStorage.setItem("dangnhap", false);
    history.push("/quan-ly");
    window.location.reload();
  };

  return (
    <SidebarContainer>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavIcon to="#">
            <FaIcons.FaBars
              onClick={() => {
                showSidebar();
              }}
            />
          </NavIcon>
          <Title onClick={handleGoHome}>QUẢN LÝ KHÁCH SẠN</Title>
          <Account>
            <Avatar
              onClick={() => {
                if (userrole !== "Admin" && userrole !== "QL") {
                  history.push("/quan-ly/nhan-vien/thong-tin");
                }
              }}
              src={userAvatar}
              alt="avatar"
            />
            <UserDisplayName
              onClick={() => {
                if (userrole !== "Admin" && userrole !== "QL") {
                  history.push("/quan-ly/nhan-vien/thong-tin");
                }
              }}
            >
              {userDisplayName}
            </UserDisplayName>
            &nbsp;
            <Logout onClick={handleLogout}>(Đăng xuất)</Logout>
          </Account>
        </Nav>

        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to="#">
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon>
            {SidebarData.map((item, index) => {
              return item.role.includes(userrole) ? (
                <SubMenu
                  sidebar={showSidebar}
                  status={sidebar}
                  item={item}
                  key={index}
                />
              ) : (
                <div key={index}></div>
              );
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </SidebarContainer>
  );
};

export default Sidebar;
