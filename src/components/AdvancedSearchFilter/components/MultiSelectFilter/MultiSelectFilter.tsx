import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
// @ts-ignore
import useChangeEffect from "../../../../shared/hooks/useChangeEffect";
import { tryRequire } from "../../../../services/require.service";
import {
  extractConditionKey,
  toKebabCase,
} from "../../../../services/dev.service";
import { MainState } from "../../../../store/models/store.models";

interface Props {
  title: string;
  query: string;
  data: any;
  max: number;
}

export const MultiSelectFilter = ({ title, query, data, max = 8 }: Props) => {
  const location = useLocation();
  const history = useHistory();
  const filter = useSelector((state: MainState) => state.wineModule.filter);
  const queries = new URLSearchParams(location.search);
  const elInput = useRef<any>(null);
  const [dataToShow, setDataToShow] = useState<Array<any>>([]);
  const [select, setSelect] = useState<Array<string>>([]);

  useChangeEffect(() => {
    const setQuery = (name: string, value: string) => {
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
    const val = select.reduce((result: Array<any>, val: string) => {
      const extract = data.find(
        (item: any) => (item.seo || item.name?.toLowerCase()) === val
      );
      if (extract) {
        result.push(extract);
      }

      return result;
    }, []);
    setDataToShow([
      ...new Set([...val, ...data.slice(0, Math.max(0, max - val.length))]),
    ]);
  }, [filter[query]]);

  const toggleSelect = (type: string) => {
    if (!type) {
      return;
    }

    type = type.toLowerCase();

    if (select.includes(type)) {
      setSelect(select.filter((val) => val !== type));
    } else {
      setSelect([...select, type]);
    }
  };

  const onSearch = ({ target }: { target: any }) => {
    if (!target.value) {
      const show = data.filter(
        ({ title, value }: { title: string; value: string }) =>
          select.includes(value?.replace("-", " ") || title?.toLowerCase())
      );
      setDataToShow(show.length ? show : data.slice(0, max));
    } else {
      const re = new RegExp(`^(${target.value})`, "gi");
      const notInUse = data.filter(
        ({ title, value }: { title: string; value: string }) =>
          !select.includes(value) && !select.includes(title?.toLowerCase())
      );
      const result = notInUse.filter(
        ({ name, seo }: { name: string; seo: string }) =>
          name?.match(re) || seo?.replace("-", " ").match(re)
      );
      {
        const re = new RegExp(`(${target.value})`, "gi");
        result.push(
          ...notInUse.filter(
            ({ title, value }: { title: string; value: string }) =>
              title?.match(re) || value?.replace("-", " ").match(re)
          )
        );
      }
      setDataToShow(result.slice(0, max));
    }
  };

  const handleKey = ({ key, target }: { key: string; target: any }) => {
    if (key === "Enter") {
      const find = target.value.toLowerCase();
      const res =
        data.find(
          ({ title, value }: { title: string; value: string }) =>
            title?.toLowerCase() === find ||
            value?.replace("-", " ").toLowerCase() === find
        ) || dataToShow[0];
      if (res) {
        toggleSelect(res?.value || res?.title);
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
          const { title, value, country } = item;
          const key = value || toKebabCase(title);
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
                select.includes(value || title?.toLowerCase())
                  ? "selected bgi"
                  : "bgi"
              }`}
              onClick={() => toggleSelect(value || title)}
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
                  <span>{title}</span>
                </>
              ) : (
                title
              )}
            </button>
          );
        })}
      </section>
    </>
  ) : null;
};
