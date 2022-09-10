import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRef } from "react";
import { wineService } from "../../../service/wine.service";
import { toKebabCase } from "../../../../../shared/services/dev.service";
import { GET_WINE_KEYWORDS } from "../../../store/types";
import DebounceService from "../../../../../shared/services/debounce.service";

export const EditMultiSelect = ({
  data,
  input,
  set,
  className,
  placeholder,
}) => {
  const elInput = useRef(null);
  const [db, setDb] = useState(null);
  const [output, setOutput] = useState(
    data[input]
      ?.split("|")
      .filter((val) => val)
      .map((seo) => db?.find((db) => db.seo === seo)?.name || seo)
  );
  const [select, setSelect] = useState(0);
  const [dataToShow, setDataToShow] = useState([]);

  useLayoutEffect(() => {
    if (db) return;
    (async () => {
      const res = await wineService[GET_WINE_KEYWORDS]({ section: input });
      if (res) {
        setDb(res);
        setOutput(res.find((db) => db.seo === data[input])?.name || output);
      }
    })();
  }, []);

  useEffect(() => {
    setOutput(
      data[input]
        ?.split("|")
        .filter((val) => val)
        .map((seo) => db?.find((db) => db.seo === seo)?.name || seo)
    );
  }, [data[input]]);

  useEffect(() => {
    DebounceService.set(
      () => {
        const save = output
          ?.map((name) => db?.find((db) => db.name === name)?.seo || name)
          .join("|");
        if (data[input] !== save) {
          set(save, input);
        }
        if (!elInput.current?.value) {
          setDataToShow(output);
        }
      },
      `UPDATE_WINE_${input}`,
      1000
    );
  }, [output]);

  const toggleSelect = (type) => {
    if (!type) return;
    if (output?.includes(type)) {
      setOutput(output.filter((val) => val !== type));
    } else {
      setOutput([...output, type]);
      elInput.current.value = "";
    }
  };

  const onSearch = ({ target }) => {
    if (!target.value) return;
    const re = new RegExp(`^(${target.value})`, "gi");
    const result = db
      ?.filter(({ name }) => !output?.includes(name))
      ?.filter(({ name }) => name?.match(re))
      ?.slice(0, 8);
    setDataToShow(result);
  };

  const handleKey = (ev) => {
    const { key, target } = ev;

    switch (key) {
      case "Enter":
        ev.preventDefault();
        const find = target.value.toLowerCase();
        const res =
          db?.find(({ name }) => name?.toLowerCase() === find) ||
          dataToShow[select];
        if (res) {
          toggleSelect(res.name);
          elInput.current.value = "";
        }
        break;
      case "ArrowUp":
        ev.preventDefault();
        setSelect(!select ? dataToShow.length - 1 : select - 1);
        break;
      case "ArrowDown":
        ev.preventDefault();
        setSelect(select < dataToShow.length - 1 ? select + 1 : 0);
        break;
      default:
        break;
    }
  };

  return db ? (
    <>
      <input
        ref={elInput}
        onKeyDown={handleKey}
        onInput={onSearch}
        spellCheck="false"
        placeholder={placeholder}
        onBlur={() =>
          DebounceService.set(
            () => {
              elInput.current.value = "";
              setDataToShow(output);
            },
            `CLEAR_VALUE_${input}`,
            250
          )
        }
        className={`${input} ${className || ""}${
          !output?.length ? " empty" : ""
        }`}
      ></input>
      <section className="wine-select-buttons">
        {dataToShow?.map((item, idx) => {
          const { name, seo } = item;
          const key = seo || toKebabCase(name || item);
          return (
            <button
              key={`BUTTON_${key}${idx}`}
              className={`${
                output?.includes(name || item) ? "selected bgi" : "bgi"
              }${select === idx ? " selected" : ""}${
                output?.includes(name || item) ? " added" : ""
              }`}
              onClick={() => toggleSelect(name || item)}
            >
              {name || item}
            </button>
          );
        })}
      </section>
    </>
  ) : null;
};
