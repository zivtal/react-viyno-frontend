import React, { useState } from "react";
import { useEffect } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { extractConditionKey } from "../../../../services/dev.service";

export const FilterSelection = (props) => {
  const [select, setSelect] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const queries = new URLSearchParams(location.search);

  useEffect(() => {
    const selection = [];
    try {
      Object.keys(props.filter).forEach((ckey) => {
        const key = Object.entries(props.keywords.query)
          .filter((val) => val[1] === ckey)
          .map((val) => val[0])[0];
        const content = props.filter[ckey].split("|");
        content.forEach((filter) => {
          const keyword = props.keywords.data[key].find(
            (val) => val.seo === filter || val.name?.toLowerCase() === filter
          );
          //   Object.keys()
          selection.push({
            ...keyword,
            key,
            condition: ckey,
            query: extractConditionKey(ckey)?.key,
          });
        });
      });
    } catch (err) {}
    setSelect(selection);
  }, [props.filter]);

  const removeFilter = ({ query, seo, name, condition }) => {
    setQuery(
      query,
      props.filter[condition]
        .split("|")
        .filter((val) => val !== (seo || name?.toLowerCase()))
        .join("|")
    );
  };

  const setQuery = (name, value) => {
    if (value) queries.set(name, value);
    else queries.delete(name);
    history.replace({ search: queries.toString() });
  };

  return select.length ? (
    <div className="filtered-by">
      <h1>{props.count} wines found by filtered search:</h1>
      {select.map((selected, idx) => (
        <button
          onClick={() => removeFilter(selected)}
          className="remove-button bgi"
          key={idx}
        >
          {selected.name || selected.seo}
        </button>
      ))}
    </div>
  ) : null;
};
