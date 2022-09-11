import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BaseFilter } from '../../../../shared/interfaces/base-filter';
import { WineKeywords } from '../../../../pages/Wine/models/wine.model';
import { SelectItem } from '../../../../shared/interfaces/select-item';
import { useSelector } from 'react-redux';
import { MainState } from '../../../../store/models/store.models';
import StringService from '../../../../shared/services/string.service';

interface Props {
  filter: BaseFilter;
  keywords: WineKeywords;
}

interface Selection {
  condition: string;
  key: string;
  title?: string;
  value?: string;
  query: string;
}

export const FilterSelection = (props: Props) => {
  const { loading, total } = useSelector((state: MainState) => state.wineModule);
  const [select, setSelect] = useState<Array<Selection>>([]);
  const history = useHistory();
  const location = useLocation();
  const queries = new URLSearchParams(location.search);

  useEffect(() => {
    const selection: Array<Selection> = [];
    try {
      type ObjectKey = keyof typeof props.keywords.data;
      Object.keys(props.filter).forEach((conditionKey: string) => {
        const key = Object.entries(props.keywords.query)
          .filter((val) => val[1] === conditionKey)
          .map((val) => val[0])[0];
        const content = props.filter[conditionKey].split('|');
        const objKey = key as ObjectKey;
        content.forEach((filter: string) => {
          const keyword = (props.keywords.data[objKey] as Array<SelectItem>).find(
            (val: any) => val.value === filter || val.title?.toLowerCase() === filter
          );
          selection.push({
            ...keyword,
            key,
            condition: conditionKey,
            query: StringService.extractConditionKey(conditionKey)?.key,
          });
        });
      });
    } catch (err) {}
    setSelect(selection);
  }, [props.filter]);

  const removeFilter = ({ query, value, title, condition }: Selection) => {
    setQuery(
      query,
      props.filter[condition]
        .split('|')
        .filter((val: string) => val !== (value || title?.toLowerCase()))
        .join('|')
    );
  };

  const setQuery = (name: string, value: string) => {
    if (value) queries.set(name, value);
    else queries.delete(name);
    history.replace({ search: queries.toString() });
  };

  return (
    <div className="filtered-by">
      {!loading && select.length ? <h1>{total} wines found by filtered search:</h1> : null}
      {select.map((selected, idx) => (
        <button onClick={() => removeFilter(selected)} className="remove-button bgi" key={idx}>
          {selected.title || selected.value}
        </button>
      ))}
    </div>
  );
};
