import React, { useEffect, useState } from "react";
import useInfinityScroll from "../../../shared/hooks/useInfinityScroll";
import { useDispatch, useSelector } from "react-redux";
import { WineCardPreview } from "../WineView/components/WinesPreview/WineCardPreview";
import { setWinesFilter, getWines } from "../store/action";
import { WineFilters } from "./components/WineFilters/WineFilters";
import { FilterSelection } from "../../../components/AdvancedSearchFilter/components/FilterSelection/FilterSelection";
import { FilterQuickSort } from "../../../components/AdvancedSearchFilter/components/FilterQuickSort/FilterQuickSort";
import { debounce } from "../../../shared/services/debounce.service";
import { extractConditionKey } from "../../../shared/services/dev.service";
import { Loader } from "../../../components/Loader/Loader";
import "./WineSearch.scss";
import { MainState } from "../../../store/models/store.models";
import { WINE_KEYWORDS, WINES, WINES_FILTER, WINES_SORT } from "../store/types";

interface Props {
  location: any;
}

export const WineSearch = (props: Props) => {
  const dispatch = useDispatch();
  const queries = new URLSearchParams(props.location.search);
  const [isShowFilter, setIsShowFilter] = useState(false);

  const {
    [WINES]: wines,
    [WINES_FILTER]: filter,
    [WINES_SORT]: sort,
    [WINE_KEYWORDS]: keywords,
    loading,
    page,
  } = useSelector((state: MainState) => state.wineModule);

  useInfinityScroll(
    async () => {
      // dispatch(setWinesPagination({ index: page.index + 1 }));
      dispatch(getWines());
    },
    [wines],
    (page?.index || 0) < (page?.total || 0)
  );

  const isFiltered = () => filter && Object.keys(filter).length;

  useEffect(() => {
    if (!keywords) {
      return;
    }

    dispatch(
      setWinesFilter(
        Object.values(keywords.query).reduce(
          (obj, cKey) =>
            (obj = {
              ...obj,
              [cKey]: queries.get(extractConditionKey(cKey)?.key),
            }),
          { ...filter }
        )
      )
    );
  }, [props.location.search]);

  useEffect(() => {
    debounce(
      async () => {
        try {
          setTimeout(() => dispatch(getWines()));
          // window.scrollTo(0, 0);
        } catch {}
      },
      "SEND_GET_REQ",
      100
    );
  }, [filter, sort]);

  return wines && keywords ? (
    <section className="filter-container">
      <div className="control-panel">
        <FilterSelection filter={filter} keywords={keywords} />

        <div className="buttons">
          <button
            onClick={() => setIsShowFilter(true)}
            className={`filter-button bgi ${isFiltered() ? "marked" : ""}`}
          >
            filter
          </button>
          <FilterQuickSort />
        </div>
      </div>
      <div className="wines-filter">
        <nav
          className="filter-menu"
          style={isShowFilter ? { display: "block" } : {}}
        >
          <div className="title">filters</div>
          {/* <ScaleRangeFilter
          title="average rating"
          fromQuery="from"
          toQuery="to"
        /> */}
          <WineFilters keywords={keywords} />
          <div className="apply">
            <button className="bgi" onClick={() => setIsShowFilter(false)}>
              close
            </button>
          </div>
        </nav>
        <div className="wines-result">
          {wines.length ? (
            wines.map((wine, index) => (
              <WineCardPreview wine={wine} key={index} />
            ))
          ) : !loading ? (
            <div>No results</div>
          ) : null}

          <Loader if={loading} type="float-1" size={36} />
        </div>
      </div>
    </section>
  ) : null;
};
