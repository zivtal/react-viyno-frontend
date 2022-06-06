import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authService } from "./service/auth.service";
import { setUser } from "./store/actions";
import "./Login.scss";
import { LOGIN, SIGNUP } from "./store/types";
import { MainState } from "../../store/models/store.models";

export const Login = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state: MainState) => state.authModule.user);

  const submit = async () => {
    try {
      const user = isSignUpMode
        ? await authService[SIGNUP]({ username, fullname, password })
        : await authService[LOGIN]({ username, password });
      if (user) {
        dispatch(setUser(user));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) history.goBack();
  }, [user]);

  return (
    <section className="login-section">
      <div className="login">
        <p className="title">Sign up</p>
        <form>
          <input
            placeholder="Enter Username"
            className="username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
          {isSignUpMode ? (
            <input
              placeholder="Enter Full Name"
              className="fullname"
              value={fullname}
              onChange={(ev) => setFullname(ev.target.value)}
            />
          ) : null}
          <div>
            <input
              placeholder="Enter Password"
              autoComplete=""
              type="password"
              className="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <button type="submit" onClick={submit}>
            {isSignUpMode ? "Sign up" : "Log in"}
          </button>
        </form>
        <p className="alternative">OR</p>
        <button className="gmail-login-btn">
          <span></span> Login with Gmail
        </button>
        <hr />
        <ul className="sign-in">
          <li>Can't log in?</li>
          <li onClick={() => setIsSignUpMode(!isSignUpMode)}>
            {isSignUpMode ? "Back" : "Sign up for free"}
          </li>
        </ul>
      </div>
    </section>
  );
};
