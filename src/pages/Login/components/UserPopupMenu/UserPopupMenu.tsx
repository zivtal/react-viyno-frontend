import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../service/auth.service";
import { setUser } from "../../store/actions";
import { QuickLogin } from "../QuickLogin/QuickLogin";
import { tryRequire } from "../../../../services/require.service";
import { getImgSrcFromBase64 } from "../../../../services/media/media.service";
import { LOGOUT } from "../../store/types";
import { MainState } from "../../../../store/models/store.models";

interface QuickMenuProps {
  el: any;
  isActive: boolean;
  onClose: Function;
}

export const UserPopupMenu = () => {
  const rtl = document.dir === "rtl";
  const dispatch = useDispatch();
  const user = useSelector((state: MainState) => state.authModule.user);
  const elProfile = useRef<any>(null);
  const [isActive, setIsActive] = useState(false);

  const logout = async () => {
    await authService[LOGOUT]();
    dispatch(setUser(null));
  };

  const QuickMenu = (props: QuickMenuProps) => {
    if (!props.el) {
      return null;
    }

    const top = props.el.offsetTop + props.el.clientHeight + 8;
    const left = props.el.offsetLeft;
    const right = window.innerWidth - props.el.offsetLeft - 32;
    const height = document.documentElement.scrollHeight;
    const style = rtl
      ? {
          top: `${top}px`,
          left: `${left}px`,
        }
      : {
          top: `${top}px`,
          right: `${right}px`,
        };
    return isActive ? (
      <div
        className="background-dimm"
        style={{ height: height + "px" }}
        onClick={() => props.onClose?.()}
      >
        <div
          className="user-quick-menu hover-box"
          style={style}
          onClick={() => props.onClose?.()}
        >
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    ) : null;
  };

  useEffect(() => {
    if (isActive) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "initial";
  }, [isActive]);

  return (
    <>
      <img
        ref={elProfile}
        className="login"
        src={
          getImgSrcFromBase64(user?.imageData, user?.imageType) ||
          tryRequire("imgs/icons/user-profile.svg")
        }
        onClick={() => setIsActive(!isActive)}
        style={isActive ? { position: "relative", zIndex: 100 } : {}}
        alt="User profile"
      />
      <QuickMenu
        isActive={isActive && !!user}
        el={elProfile.current}
        onClose={() => setIsActive(false)}
      />
      <QuickLogin
        isActive={isActive && !user}
        onClose={() => setIsActive(false)}
      />
    </>
  );
};
