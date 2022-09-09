import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
// @ts-ignore
import { MainPopupMenu } from "./components/MainPopupMenu/MainPopupMenu";
import { UserPopupMenu } from "../../pages/Login/components/UserPopupMenu/UserPopupMenu";
import {
  CustomInput,
  CustomInputResults,
  CustomInputType,
} from "../CustomInput/CustomInput";
import { wineService } from "../../pages/Wine/service/wine.service";
import { tryRequire } from "../../shared/helpers/require";
import { SEARCH_WINES } from "../../pages/Wine/store/types";

export const mediaQuery = { mobile: 540 };

export function AppHeader(): JSX.Element | null {
  const location = useLocation();
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Array<CustomInputResults>>([]);

  const [popupConfig, setPopupConfig] = useState<any>(0);

  useEffect(() => {
    if (popupConfig) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "initial";
  }, [popupConfig]);

  if (location.pathname === "/login") return null;

  const toggleMenu = (ev: any, type: any): void =>
    popupConfig?.type === type
      ? setPopupConfig(null)
      : setPopupConfig({ target: ev.target, type });

  const onInput = (value: string): void => {
    if (!value) {
      setResults([]);

      return;
    }

    setLoading(true);

    (async () => {
      try {
        const wines = await wineService[SEARCH_WINES]({
          filter: { search: value },
        });

        if (!wines) {
          return;
        }

        setResults(
          wines.data.map((wine) => ({
            text: (wine.winery + " " + wine.name).trim(),
            value: wine,
            imageData: wine.imageData,
          }))
        );

        setLoading(false);
      } catch {}
    })();
  };

  const onSelect = (value: any): void => {
    if (!value) {
      return;
    }

    history.push(`/wine/${value.seo}`, { wine: value });
  };

  return (
    <header className="app-header">
      <div className="logo">
        <img
          src={tryRequire("imgs/logo.png")}
          onClick={() => history.push("/")}
          alt="Viyno"
        />
      </div>

      <div className="control-bar">
        <div className="main-controls">
          <CustomInput
            debounce
            clearable
            type={CustomInputType.SUGGESTIONS}
            loading={loading}
            items={results}
            iconName="search"
            onInput={onInput}
            onSelect={onSelect}
          />

          <div className="side-controls">
            <UserPopupMenu />
          </div>
        </div>

        <MainPopupMenu
          config={popupConfig}
          close={() => setPopupConfig(null)}
        />

        <nav>
          <ul>
            <li className="wines" onClick={(ev) => toggleMenu(ev, "wines")}>
              <img src={tryRequire("imgs/icons/wines.svg")} alt="Wines" />
              <span>wines</span>
            </li>

            <li
              className="pairings"
              onClick={(ev) => toggleMenu(ev, "pairings")}
            >
              <img
                src={tryRequire("imgs/icons/cheese.svg")}
                alt="Food pairings"
              />
              <span>pairings</span>
            </li>

            <li className="grapes" onClick={(ev) => toggleMenu(ev, "grapes")}>
              <img src={tryRequire("imgs/icons/grapes.svg")} alt="grapes" />
              <span>grapes</span>
            </li>

            <li className="regions" onClick={(ev) => toggleMenu(ev, "regions")}>
              <img src={tryRequire("imgs/icons/regions.svg")} alt="regions" />
              <span>regions</span>
            </li>

            {/* <li className="awards">
              <img src={tryRequire("imgs/icons/awards.svg")} alt="awards" />
              <span>awards</span>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
