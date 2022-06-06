import React from "react";
import { MultiSelectFilter } from "../../../../../components/AdvancedSearchFilter/components/MultiSelectFilter/MultiSelectFilter";

export const WineFilters = ({ keywords }) => {
  const { data, query } = keywords;
  return Object.keys(keywords.data).map((filter, idx) => (
    <MultiSelectFilter
      key={`WINE_FILTER_${idx}`}
      title={filter}
      query={query[filter]}
      data={data[filter]}
    />
  ));
};
