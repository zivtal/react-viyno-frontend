import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import useChangeEffect from "../../../../shared/hooks/useChangeEffect";
import { tryRequire } from "../../../../services/require.service";
import {
  extractConditionKey,
  toKebabCase,
} from "../../../../services/dev.service";

export const MultiSelectFilter = ({ title, query, data, max = 8 }) => {
  const location = useLocation();
  const history = useHistory();
  const filter = useSelector((state) => state.wineModule.filter);
  const queries = new URLSearchParams(location.search);
  const elInput = useRef(null);
  const [dataToShow, setDataToShow] = useState([]);
  const [select, setSelect] = useState([]);

  useChangeEffect(() => {
    const setQuery = (name, value) => {
      if (value) queries.set(name, value);
      else queries.delete(name);
      history.replace({ search: queries.toString() });
    };
    setQuery(extractConditionKey(query)?.key, select.join("|"));
    if (!select.length) setDataToShow(data.slice(0, max));
  }, [select]);

  useEffect(() => {
    const selected = filter[query]?.split("|") || [];
    setSelect(selected);
    const val = select.reduce((result, val) => {
      const extract = data.find(
        (item) => (item.seo || item.name?.toLowerCase()) === val
      );
      if (extract) result.push(extract);
      return result;
    }, []);
    setDataToShow([
      ...new Set([...val, ...data.slice(0, Math.max(0, max - val.length))]),
    ]);
  }, [filter[query]]);

  const toggleSelect = (type) => {
    if (!type) return;
    type = type.toLowerCase();
    if (select.includes(type)) {
      setSelect(select.filter((val) => val !== type));
    } else {
      setSelect([...select, type]);
    }
  };

  const onSearch = ({ target }) => {
    if (!target.value) {
      const show = data.filter(({ name, seo }) =>
        select.includes(seo?.replace("-", " ") || name?.toLowerCase())
      );
      setDataToShow(show.length ? show : data.slice(0, max));
    } else {
      const re = new RegExp(`^(${target.value})`, "gi");
      const notInUse = data.filter(
        ({ name, seo }) =>
          !select.includes(seo) && !select.includes(name?.toLowerCase())
      );
      const result = notInUse.filter(
        ({ name, seo }) => name?.match(re) || seo?.replace("-", " ").match(re)
      );
      {
        const re = new RegExp(`(${target.value})`, "gi");
        result.push(
          ...notInUse.filter(
            ({ name, seo }) =>
              name?.match(re) || seo?.replace("-", " ").match(re)
          )
        );
      }
      setDataToShow(result.slice(0, max));
    }
  };

  const handleKey = ({ key, target }) => {
    if (key === "Enter") {
      const find = target.value.toLowerCase();
      const res =
        data.find(
          ({ name, seo }) =>
            name?.toLowerCase() === find ||
            seo?.replace("-", " ").toLowerCase() === find
        ) || dataToShow[0];
      if (res) {
        toggleSelect(res?.seo || res?.name);
        elInput.current.value = "";
      }
    }
  };

  return data ? (
    <>
      <section className="wine-select-buttons">
        <h2>{title}</h2>
        <div className="quick-filter-search">
          <input
            ref={elInput}
            onKeyPress={handleKey}
            onInput={onSearch}
            spellCheck="false"
          ></input>
        </div>
        {dataToShow.map((item, idx) => {
          const { name, seo, country } = item;
          const key = seo || toKebabCase(name);
          const png =
            tryRequire(
              `imgs/icons/${extractConditionKey(query)?.key}/${key}.png`
            ) || tryRequire(`imgs/icons/country/${toKebabCase(country)}.png`);
          const svg = tryRequire(
            `imgs/icons/${extractConditionKey(query)?.key}/${key}.svg`
          );

          return (
            <button
              key={`BUTTON_${key}${idx}`}
              className={`${
                select.includes(seo || name.toLowerCase())
                  ? "selected bgi"
                  : "bgi"
              }`}
              onClick={() => toggleSelect(seo || name)}
              style={png || svg ? { textAlign: "left" } : {}}
            >
              {png || svg ? (
                <>
                  <img
                    src={png || svg}
                    style={
                      svg
                        ? {
                            background: "rgba(255,255,255,0.7)",
                            padding: "1px",
                          }
                        : {}
                    }
                  />
                  <span>{name}</span>
                </>
              ) : (
                name
              )}
            </button>
          );
        })}
      </section>
    </>
  ) : null;
};
