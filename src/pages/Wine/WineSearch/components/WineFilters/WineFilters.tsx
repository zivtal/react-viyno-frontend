import React from "react";
import { MultiSelectFilter } from "../../../../../components/AdvancedSearchFilter/components/MultiSelectFilter/MultiSelectFilter";
import { WineKeywords } from "../../../models/wine.model";

interface Props {
  keywords: WineKeywords;
}

export const WineFilters = (props: Props): JSX.Element => {
  const { data, query } = props.keywords;

  const jsxElements = Object.keys(props.keywords.data).map(
    (filter: string, index: number) => {
      type ObjectKey = keyof typeof props.keywords.data;

      return (
        <MultiSelectFilter
          key={index}
          title={filter}
          query={query[filter]}
          data={data[filter as ObjectKey]}
        />
      );
    }
  );

  return <>{jsxElements}</>;
};
