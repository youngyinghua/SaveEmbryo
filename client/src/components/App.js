import { Route, Switch, Redirect } from "react-router";
import "./App.css";
import React, { Component } from "react";
import Expire from "./Expire.component";
import Freeze from "./Freeze.component";
import Header from "./Header.component";
import Modify from "./Modify.component";
import Search from "./Search.component.jsx";
import Signin from "./Signin.component";
import Thaw from "./Thaw.component";
import Backup from "./Backup.compoment";
import CustomRoute from "./CustomRoute.component";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isSignin: false,
      role: "",
    };
  }

  componentDidMount = () => {
    const token = window.sessionStorage.getItem("token");
    if (!token) {
      return (axios.defaults.headers.common["Authorization"] = null);
    }
    /*if setting null does not remove `Authorization` header then try     
      delete axios.defaults.headers.common['Authorization'];
    */
    const role = window.sessionStorage.getItem("role");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    this.setState({
      isSignin: true,
      role: role,
    });
  };

  login = (username, token) => {
    this.setState({
      isSignin: true,
      role: username,
    });
    window.sessionStorage.setItem("token", token);
    window.sessionStorage.setItem("role", username);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  logout = () => {
    this.setState({
      isSignin: false,
      role: "",
    });
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("role");
    axios.defaults.headers.common["Authorization"] = null;
  };

  render() {
    const { isSignin, role } = this.state;

    return (
      <div className="App">
        {isSignin && <Header role={role} logout={this.logout} />}
        <Switch>
          <CustomRoute isSignin={isSignin} exact path="/" component={Search} />
          <CustomRoute
            isSignin={isSignin}
            exact
            path="/expire"
            component={Expire}
          />
          <CustomRoute
            isSignin={isSignin}
            exact
            path="/modify"
            component={Modify}
          />
          <Route
            exact
            path="/signin"
            render={() =>
              isSignin ? <Redirect to="/" /> : <Signin login={this.login} />
            }
          />
          {role === "admin" ? (
            <>
              <Route exact path="/freeze" component={Freeze} />
              <Route exact path="/thaw" component={Thaw} />
              <Route exact path="/backup" component={Backup} />
            </>
          ) : null}
        </Switch>
      </div>
    );
  }
}

export default App;
