import React, { useContext } from "react";
import LoginBackEnd from "../components/login/LoginBackEnd";
import MenuQuanLy from "./backend/MenuQuanLy";
import { AccountContext } from "../contexts/AccountContext";

const BackEnd = () => {
  const { signedIn } = useContext(AccountContext);

  if (signedIn === "true") {
    // da dang nhap
    return (
      <>
        <MenuQuanLy />
      </>
    );
  } else if (signedIn === "false") {
    //chua dang nhap
    return (
      <>
        <LoginBackEnd />
      </>
    );
  }
};

export default BackEnd;
