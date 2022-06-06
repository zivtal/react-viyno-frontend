import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../service/auth.service";
import { setUser } from "../../store/actions";
import { OverlayModal } from "../../../../components/OverlayModal/OverlayModal";
import { LOGIN, SIGNUP } from "../../store/types";
import { MainState } from "../../../../store/models/store.models";
import { AuthModel } from "../../models/auth.model";

interface Props {
  isActive: boolean;
  onClose: Function;
  onLogin?: Function;
}

export const QuickLogin = (props: Props): JSX.Element => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginUser, setLoginUser] = useState<AuthModel>({});
  const [isAfterTry, setIsAfterTry] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: MainState) => state.authModule.user);

  useEffect(() => {
    setLoginUser({});
    setIsAfterTry(false);

    props.isActive
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "initial");
  }, [props.isActive]);

  const submit = async () => {
    try {
      const user = isSignUpMode
        ? await authService[SIGNUP](loginUser)
        : await authService[LOGIN](loginUser);

      if (user) {
        dispatch(setUser(user));
        props.onClose(false);
        props.onLogin?.();
        return;
      }

      setIsAfterTry(true);
      console.error("login failed");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    props.onClose();
  }, [user]);

  return (
    <OverlayModal if={props.isActive} onClose={props.onClose}>
      <div
        className="quick-login-popup hover-box"
        onClick={(ev) => ev.stopPropagation()}
      >
        <p className="title">{isSignUpMode ? "Sign up" : "Sign in"}</p>
        <form onSubmit={submit}>
          <input
            placeholder="Enter email address"
            className="username"
            value={loginUser?.username || ""}
            onChange={(ev) =>
              setLoginUser({ ...loginUser, username: ev.target.value })
            }
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          />
          {isSignUpMode ? (
            <input
              placeholder="Enter Full Name"
              className="fullname"
              value={loginUser?.fullname || ""}
              onChange={(ev) =>
                setLoginUser({ ...loginUser, fullname: ev.target.value })
              }
            />
          ) : null}
          <div>
            <input
              placeholder="Enter Password"
              autoComplete=""
              type="password"
              className="password"
              value={loginUser?.password || ""}
              onChange={(ev) =>
                setLoginUser({ ...loginUser, password: ev.target.value })
              }
            />
          </div>
          {isAfterTry ? (
            <p className="warning">Login failed, wrong username or password</p>
          ) : null}
          <button type="submit" onClick={submit}>
            {isSignUpMode ? "Sign up" : "Log in"}
          </button>
        </form>
        {/* <p className="alternative">OR</p>
        <button className="gmail-login-btn">
          <span>{isSignUpMode ? "Sign up" : "AuthModel"} with Gmail</span>
        </button>
        <button className="facebook-login-btn">
          <span>{isSignUpMode ? "Sign up" : "AuthModel"} with Facebook</span>
        </button> */}
        <hr />
        <ul className="sign-in">
          <li>Can't log in?</li>
          <li onClick={() => setIsSignUpMode(!isSignUpMode)}>
            {isSignUpMode ? "Back" : "Sign up for free"}
          </li>
        </ul>
      </div>
    </OverlayModal>
  );
};
