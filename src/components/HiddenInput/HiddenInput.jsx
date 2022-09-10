import React, { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { wineService } from "../../pages/Wine/service/wine.service";
import { setWineSection } from "../../pages/Wine/store/action";
import ProcessService from "../../shared/services/process.service";
import { GET_WINE_KEYWORDS } from "../../pages/Wine/store/types";

export const HiddenInput = ({
  data,
  input,
  set,
  database,
  placeholder,
  duplicate = true,
  className = "",
}) => {
  const dispatch = useDispatch();
  const [db, setDb] = useState([]);
  const [output, setOutput] = useState(data[input]);
  const [result, setResult] = useState([]);
  const [resSelect, setResSelect] = useState(0);
  const elResults = useRef([]);
  const elInput = useRef(null);

  useEffect(() => setDb(database), [database]);

  useEffect(() => {
    ProcessService.debounce(
      () => {
        const fromDb = db?.find((item) => item.name === output);
        set(fromDb?.seo || output, input);
      },
      `UPDATE_WINE_${input}`,
      250
    );
  }, [output]);

  useLayoutEffect(() => {
    (async () => {
      try {
        const res = await wineService[GET_WINE_KEYWORDS]({
          section: input,
        });
        if (res) {
          dispatch(setWineSection({ [input]: res }));
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const dupCheck = () => {
    if (!elInput.current) return;
    const { value } = elInput.current;
    const re = new RegExp(`^\\s*(${value})*\\s*$`, "gi");
    return !duplicate && db?.filter((value) => value.name.match(re))?.length;
  };

  const SearchResult = ({ el, result, set }) => {
    if (!result?.length || !el.value) return null;
    const top = el.offsetTop + el.clientHeight + 6;
    const style = { top: `${top}px`, width: `${el.clientWidth}px` };
    return (
      <ul className="quick-filter-popup" style={style}>
        {result.map(({ name }, idx) => {
          const re = new RegExp(`(${el.value})`, "gi");
          const title = {
            __html: `${name.replace(re, `<span class="marked">$1</span>`)}`,
          };
          return (
            <li
              key={`RESULT_${idx}`}
              ref={(el) => (elResults.current[idx] = el)}
              onClick={() => set(name)}
              className={`${resSelect === idx ? "selected" : ""}`}
              onMouseOver={() => setResSelect(null)}
              onMouseLeave={() => setResSelect(0)}
              dangerouslySetInnerHTML={title}
            ></li>
          );
        })}
      </ul>
    );
  };

  const onSearch = ({ target }) => {
    setOutput(target.value);
    if (!duplicate || !target.value) {
      setResult([]);
    } else {
      const re = new RegExp(`^(${target.value})`, "gi");
      const result = db?.filter((value) => value.name.match(re)).slice(0, 8);
      setResult(result);
    }
  };

  const handleKey = (ev) => {
    const { key, target } = ev;
    switch (key) {
      case "Enter":
        const re = new RegExp(`^\\s*(${target.value})*\\s*$`, "gi");
        const res =
          db?.find((value) => value.name.match(re))?.name ||
          result[resSelect]?.name;
        if (res) {
          resultClick(res);
        }
        break;
      case "ArrowDown":
        ev.preventDefault();
        setResSelect(resSelect < result.length - 1 ? resSelect + 1 : 0);
        break;
      case "ArrowUp":
        ev.preventDefault();
        setResSelect(!resSelect ? result.length - 1 : resSelect - 1);
        break;
    }
  };

  const resultClick = (value) => {
    setOutput(value || elInput.current.value);
    setResult([]);
  };

  return (
    <>
      <input
        ref={elInput}
        type="text"
        maxLength={255}
        className={`${input}${output === "" ? " empty" : ""}`}
        value={output}
        onChange={onSearch}
        onKeyDown={handleKey}
        onBlur={() =>
          ProcessService.debounce(
            () => resultClick(),
            `CLEAR_VALUE_${input}`,
            250
          )
        }
        placeholder={`Enter ${placeholder}`}
        spellCheck={false}
      />
      {dupCheck() ? <p>duplicated</p> : null}
      <SearchResult el={elInput.current} result={result} set={resultClick} />
    </>
  );
};
