import { useContext } from "react";
import AppContext from "../app-context";
// import {  } from "../Services/helper";
import { getFilteredTransactions } from "../Services/helper";

import {
  formatMoney,
  countWeeks,
  countMonths,
  getWeeklyAverage,
  getMonthlyAverage,
  countTotal,
} from "../Services/helper";
import "./Filter.css";
import { useState } from "react";

// function useForceUpdate() {
//   const [value, setValue] = useState(0); // integer state
//   return () => setValue((value) => value + 1); // update the state to force render
// }

export function Filter(props) {
  // const forceUpdate = useForceUpdate();

  const {
    filters,
    setFilters,
    transactions,
    setShowTableId,
    total: allTotal,
    setTableHighlight,
  } = useContext(AppContext);

  const { filter } = props;

  const {
    id,
    title: titleProp,
    total,
    queries,
    durationWeeks,
    durationMonths,
    weeklyAverage,
    monthlyAverage,
  } = filter;

  const [query, setQuery] = useState("");
  const [title, setTitle] = useState(titleProp);
  const [isValidQuery, setIsValidQuery] = useState(true);

  // useEffect(() => {
  //   console.log("Filters, UseEffect", filters, filter);
  //   // forceUpdate();
  // }, filters);

  // useEffect(() => {
  //   console.log("Filter, UseEffect", filters, filter);
  //   // forceUpdate();
  // }, filter);

  const updateFilters = (filter) => {
    const index = filters.findIndex((f) => f.id === id);
    const newFilters = [...filters];
    newFilters[index] = filter;
    setFilters(newFilters);
    console.log("Update Filter", filters, newFilters);
  };

  const updateFilter = (options) => {
    const filteredTransactions = [
      ...getFilteredTransactions(filter.queries, transactions),
    ];

    // Should this maybe use getFilteredTransactionsOther instead?
    // Do we want to filter the remaining?
    // This might depend on what the user wants.
    // Should e.g TV be able to be in both categories entertainment and Tech?
    // Prob not, this could look like you spend more then you do.

    if (filteredTransactions.length) {
      var total = countTotal(filteredTransactions);
      var durationWeeks = countWeeks(filteredTransactions);
      var durationMonths = countMonths(filteredTransactions);
      var weeklyAverage = getWeeklyAverage(durationWeeks, total);
      var monthlyAverage = getMonthlyAverage(durationMonths, total);
    }

    const newQueries =
      options && options.newQueries ? options.newQueries : [query, ...queries];

    const newFilter = {
      ...filter,
      total,
      queries: newQueries,
      durationWeeks,
      durationMonths,
      weeklyAverage,
      monthlyAverage,
      transactions: filteredTransactions,
    };

    // console.log(newFilter);

    updateFilters(newFilter);
  };

  const handleAddQuery = ({ target: el, key }) => {
    if (key === "Enter") {
      const filteredTransactions = getFilteredTransactions(
        [query],
        transactions // This should filter on remaining transactions. This should prevent the user to add pointless queries as well as duplicated queries.
      );

      if (!filteredTransactions.length) {
        console.log("HANDLE THIS::: No query match!!!");
        setIsValidQuery(false);
        return;
      }

      setQuery("");
      setIsValidQuery(true);
      updateFilter();
    }
  };

  const handleQuery = ({ target: el, key }) => {
    setQuery(el.value);
    setTableHighlight(el.value);
  };

  const handleTitleKeyDown = ({ target: el }) => {
    setTitle(el.value);
    console.log(title);
    const newFilter = { ...filter, title };
    updateFilters(newFilter);
  };

  const handleTagClick = ({ target: el }) => {
    // debugger;
    const newQueries = queries.filter((q) => q !== el.innerHTML);
    updateFilter({ newQueries });
  };

  const getPercentage = () => {
    if (total === 0) return 0;
    return ((total / allTotal) * 100).toFixed(1);
  };

  const handleShowTransactions = (e) => {
    setShowTableId(`table-${filter.id}`);
  };

  return (
    <fieldset>
      <div className="filter-header">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleKeyDown}
          />
        </div>
        <div>
          <div className="bar-label">
            <strong>{getPercentage()}%</strong>
          </div>
          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: `${getPercentage()}%` }}
            ></div>
          </div>
        </div>
        <div>
          <button type="button" onClick={handleShowTransactions}>
            Transactions
          </button>
        </div>
      </div>
      <dl>
        <dt>Time span</dt>
        <dd>
          {durationWeeks} weeks or {durationMonths} months
        </dd>
        <dt>Total spending</dt>
        <dd>{formatMoney(total)}</dd>
        <dt>Avg weekly</dt>
        <dd>{formatMoney(weeklyAverage)}</dd>
        <dt>Avg monthly</dt>
        <dd>{formatMoney(monthlyAverage)}</dd>
      </dl>
      <div>
        <input
          key={`filter-query-${filter.id}`}
          type="text"
          name={`filter-${filter.id}`}
          value={query}
          placeholder="Add query"
          onKeyDown={handleAddQuery}
          onChange={handleQuery}
          autoComplete="off"
          className={isValidQuery ? "" : "invalid"}
        />
        {filter.queries.map((query, index) => {
          return (
            <button
              className="tag"
              key={`filter-query-${filter.id}-${index}`}
              onClick={handleTagClick}
              type="button"
            >
              {query}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default Filter;
