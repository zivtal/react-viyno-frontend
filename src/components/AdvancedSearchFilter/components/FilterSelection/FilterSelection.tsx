import React, { useState } from "react";
import { useEffect } from "react";
import { extractConditionKey } from "../../../../services/dev.service";
import {useHistory, useLocation} from 'react-router-dom'
import {BaseFilter} from '../../../../shared/models/base-filter'
import {WineKeywords} from '../../../../pages/Wine/models/wine.model'

interface Props {
  count: number;
  filter: BaseFilter;
  keywords: WineKeywords;
}

interface Selection {
  condition: string;
  key: string;
  name?: string;
  seo?: string;
  query: string;
}

export const FilterSelection = (props: Props) => {
  const [select, setSelect] = useState<Array<Selection>>([]);
  const history = useHistory();
  const location = useLocation();
  const queries = new URLSearchParams(location.search);

  useEffect(() => {
    const selection: Array<Selection> = [];
    try {
      type ObjectKey = keyof typeof props.keywords.data
      Object.keys(props.filter).forEach((conditionKey: string) => {
        const key = Object.entries(props.keywords.query)
          .filter((val) => val[1] === conditionKey)
          .map((val) => val[0])[0];
        const content = props.filter[conditionKey].split("|");
        const objKey = key as ObjectKey;
        content.forEach((filter: string) => {
          const keyword = props.keywords.data[objKey].find(
            (val: any) => val.seo === filter || val.name?.toLowerCase() === filter
          );
          selection.push({
            ...keyword,
            key,
            condition: conditionKey,
            query: extractConditionKey(conditionKey)?.key,
          });
        });
      });
    } catch (err) {}
    setSelect(selection);
  }, [props.filter]);

  const removeFilter = ({ query, seo, name, condition }: Selection) => {
    setQuery(
      query,
      props.filter[condition]
        .split("|")
        .filter((val: string) => val !== (seo || name?.toLowerCase()))
        .join("|")
    );
  };

  const setQuery = (name: string, value: string) => {
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
