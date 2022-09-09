import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { mediaQuery } from "../../AppHeader";
import { tryRequire } from "../../../../shared/helpers/require";
import { toKebabCase } from "../../../../shared/services/dev.service";
import { MainState } from "../../../../store/models/store.models";
import { WINE_KEYWORDS } from "../../../../pages/Wine/store/types";

export function MainPopupMenu(props) {
  const rtl = document.dir === "rtl";
  const { config, close } = props;
  const history = useHistory();
  const el = useRef(null);
  const { [WINE_KEYWORDS]: keywords } = useSelector(
    (state: MainState) => state.wineModule
  );
  const [tables, setTables] = useState({});

  const _generateMenu = (data, section, add, folder) => {
    folder ??= `imgs/icons/${section}`;
    const res = [
      ...data.slice(0, 10).map(({ title, value, country }) => {
        return {
          title,
          img:
            tryRequire(`${folder}/${value || toKebabCase(title)}.svg`) ||
            tryRequire(`${folder}/${toKebabCase(country)}.svg`) ||
            tryRequire(`${folder}/${toKebabCase(country)}.png`),
          value: value || toKebabCase(title),
          path: `/wine?${section}=${value || toKebabCase(title)}`,
          ...add,
        };
      }),
    ];
    return res;
  };

  useEffect(() => {
    if (!keywords) {
      return;
    }

    setTables({
      wines: [
        [
          {
            title: "Red",
            path: "/wine?type=red",
            img: tryRequire("imgs/icons/type/red.svg"),
            isBold: true,
          },
          ..._generateMenu(
            keywords.data.wineStyles
              .filter(({ type }) => type === "red")
              .slice(0, 10),
            "style",
            {},
            "imgs/icons/country"
          ),
        ],
        [
          {
            title: "White",
            path: "/wine?type=white",
            img: tryRequire("imgs/icons/type/white.svg"),
            isBold: true,
          },
          ..._generateMenu(
            keywords.data.wineStyles
              .filter(({ type }) => type === "white")
              .slice(0, 10),
            "style",
            {},
            "imgs/icons/country"
          ),
        ],
        _generateMenu(
          keywords.data.wineType.filter(
            ({ name }) => name !== "red" && name !== "white"
          ),
          "type",
          { isBold: true }
        ),
      ],
      grapes: [
        _generateMenu(keywords.data.grapes.slice(0, 10), "grapes"),
        _generateMenu(keywords.data.grapes.slice(10, 20), "grapes"),
        _generateMenu(keywords.data.grapes.slice(20, 30), "grapes"),
      ],
      pairings: [
        _generateMenu(keywords.data.foodPairings.slice(0, 10), "pairings"),
        _generateMenu(keywords.data.foodPairings.slice(10, 20), "pairings"),
        _generateMenu(keywords.data.foodPairings.slice(20, 30), "pairings"),
      ],
      regions: [
        _generateMenu(
          keywords.data.regions.slice(0, 10),
          "region",
          {},
          "imgs/icons/country"
        ),
        _generateMenu(
          keywords.data.regions.slice(10, 20),
          "region",
          {},
          "imgs/icons/country"
        ),
      ],
    });
  }, [keywords]);

  if (!config) {
    return null;
  }

  const isMobile = window.innerWidth < mediaQuery.mobile;

  const top = () =>
    isMobile ? 0 : config.target.offsetTop + config.target.clientHeight + 8;
  const left = () => {
    if (isMobile) return 0;
    if (config.target.offsetLeft + el.current?.clientWidth > window.innerWidth)
      return (
        config.target.offsetLeft +
        config.target.clientWidth -
        el.current?.clientWidth
      );
    return config.target.offsetLeft - 20;
  };
  const right = () =>
    isMobile
      ? 0
      : window.innerWidth -
        (config.target.offsetLeft + config.target.clientWidth + 20);

  const tableRender = () => {
    return tables[config.type].map((data, idx1) => {
      return data.length > 0 ? (
        <ul key={"MENU_" + idx1}>
          {data.map((cell, idx2) => {
            return (
              <li
                className={cell.isBold ? `bold` : ""}
                key={"SUBMENU_" + idx1 + "_" + idx2}
                onClick={() => {
                  history.push(cell.path);
                  close?.();
                }}
              >
                {cell.img ? <img src={cell.img} /> : null}
                <span>{cell.title}</span>
              </li>
            );
          })}
        </ul>
      ) : null;
    });
  };

  const position = rtl
    ? { top: `${top()}px`, right: `${right()}px` }
    : { top: `${top()}px`, left: `${left()}px` };

  return (
    <div className="background-dimm" onClick={close}>
      {/*<OverlayModal if={true} onClose={() => close?.()}>*/}
      <div className="popup-menu hover-box" style={position}>
        {tableRender("wines")}
      </div>
      {/*</OverlayModal>*/}
    </div>
  );
}
