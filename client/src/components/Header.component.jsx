import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Header.style.css";
import logo from "../assets/embryo-logo.png";

const Header = ({ role, logout }) => (
  <>
    <div className="header">
      <div className="logo">
        <div className="letters">EmbCry</div>
        <img src={logo} alt="embryo" className="image" />
      </div>
      <div className="menu">
        <div className="menu-left">
          <Link className="link" to="/">
            検索
          </Link>
          {role === "admin" ? (
            <>
              {" "}
              <div>|</div>
              <Link className="link" to="/freeze">
                凍結
              </Link>
              <div>|</div>
              <Link className="link" to="/thaw">
                融解
              </Link>{" "}
            </>
          ) : null}
          <div>|</div>
          <Link className="link" to="/expire">
            期限
          </Link>
          <div>|</div>
          <Link className="link" to="/modify">
            修正
          </Link>
          {role === "admin" ? (
            <>
              <div>|</div>
              <Link className="link" to="/backup">
                Backup
              </Link>
            </>
          ) : null}
        </div>
        <div className="menu-right">
          <Link className="link" to="/signin" onClick={logout}>
            Logout
          </Link>
        </div>
      </div>
    </div>
    <hr />
  </>
);

export default withRouter(Header);
