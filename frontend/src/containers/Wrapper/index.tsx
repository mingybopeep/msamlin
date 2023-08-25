import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { logout } from "../Auth/state";
import store, { RootState } from "../../state";

import styles from "./index.module.css";

const Wrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { id } = useSelector((state: RootState) => state.auth);
  const { pathname } = useLocation();

  const isAuthenticated = !!id;

  const onLogout = () => {
    store.dispatch(logout());
  };

  if (pathname !== "/" && !isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  if (pathname === "/" && isAuthenticated) {
    return <Navigate to={"/secret"} />;
  }

  return (
    <div className={styles.Wrapper}>
      {isAuthenticated && (
        <>
          <nav>
            <button onClick={onLogout}>LOGOUT</button>
          </nav>
        </>
      )}

      <div
        style={{
          height: isAuthenticated ? "calc( 100vh - 80px)" : "100%",
          width: "100%",
          overflow: "scroll",
          marginTop: isAuthenticated ? "80px" : "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
