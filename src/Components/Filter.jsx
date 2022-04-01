import "./Filter.css";
import { useContext, useEffect } from "react";
import AppContext from "../app-context";
import {
  getFilteredTransactions,
  getFilteredTransactionsOther,
} from "../Services/helper";

import {
  formatMoney,
  countWeeks,
  countMonths,
  getWeeklyAverage,
  getMonthlyAverage,
  countTotal,
} from "../Services/helper";
import { useState } from "react";

export function Filter(props) {
  const {
    filters,
    setFilters,
    transactions,
    setShowTableId,
    total: allTotal,
    setTableHighlight,
    setCurrentQuery,
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

  let _queries = queries; // Hack: As states seems to be updated in the next cycle I've used a simple variable as it's updates straight away.

  const [query, setQuery] = useState("");
  const [title, setTitle] = useState(titleProp);
  const [isValidQuery, setIsValidQuery] = useState(true);

  useEffect(() => {
    updateFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilters = (filter) => {
    const index = filters.findIndex((f) => f.id === id);
    const newFilters = [...filters];
    newFilters[index] = filter;
    setFilters(newFilters);
  };

  /** options will be merged with filter e.g option param {total: 10} will set the filter.total to 10 */
  const updateFilter = (options = {}) => {
    const filteredTransactions = [
      ...getFilteredTransactions(_queries, transactions),
    ];

    // Should this maybe use getFilteredTransactionsOther instead?
    // Do we want to filter the remaining?
    // This might depend on what the user wants.
    // Should e.g TV be able to be in both categories entertainment and Tech?
    // Prob not, this could look like you spend more then you do.

    const total = countTotal(filteredTransactions);
    const durationWeeks = countWeeks(filteredTransactions);
    const durationMonths = countMonths(filteredTransactions);
    const weeklyAverage = getWeeklyAverage(durationWeeks, total);
    const monthlyAverage = getMonthlyAverage(durationMonths, total);

    const newFilter = {
      ...filter,
      ...options,
      queries: _queries,
      total,
      durationWeeks,
      durationMonths,
      weeklyAverage,
      monthlyAverage,
      transactions: filteredTransactions,
    };

    updateFilters(newFilter);
  };

  const handleAddQuery = ({ target: el, key }) => {
    if (key === "Enter") {
      const remainingTransactions = getFilteredTransactionsOther(
        transactions,
        filters
      );
      const filteredTransactions = getFilteredTransactions(
        [query],
        remainingTransactions
      );

      if (!filteredTransactions.length) {
        console.log("HANDLE THIS::: No query match!!!");
        setIsValidQuery(false);
        return;
      }

      _queries = [query, ...queries];
      updateFilter({ queries: [query, ...queries] });
      setQuery("");
      setCurrentQuery("");
      setIsValidQuery(true);
    }
  };

  const handleQuery = ({ target: el, key }) => {
    setQuery(el.value);
    setTableHighlight(el.value);
    setCurrentQuery(el.value);
  };

  const handleTitleKeyDown = ({ target: el }) => {
    setTitle(el.value);
    const newFilter = { ...filter, title };
    updateFilters(newFilter);
  };

  const handleTagClick = ({ target: el }) => {
    const newQueries = queries.filter((q) => q !== el.innerHTML);
    _queries = newQueries; // hack
    updateFilter({ queries: newQueries });
  };

  const getPercentage = () => {
    if (total === 0) return 0;
    return ((total / allTotal) * 100).toFixed(1);
  };

  const handleShowTransactions = (e) => {
    setShowTableId(`table-${filter.id}`);
  };

  return (
    <fieldset className="filter">
      <div className="filter-header">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleKeyDown}
            className="mr-16"
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
        <dt>Total spending</dt>
        <dd className="total-spending">{formatMoney(total)}</dd>
        <dt>Time span</dt>
        <dd>
          {durationWeeks} weeks or {durationMonths} months
        </dd>
        <dt>Avg weekly</dt>
        <dd>{weeklyAverage > 0 ? formatMoney(weeklyAverage) : "N/A"}</dd>
        <dt>Avg monthly</dt>
        <dd>{monthlyAverage > 0 ? formatMoney(monthlyAverage) : "N/A"}</dd>
      </dl>
      <div className="query-container">
        <input
          key={`filter-query-${filter.id}`}
          type="text"
          name={`filter-${filter.id}`}
          value={query}
          placeholder="Add query"
          onKeyDown={handleAddQuery}
          onChange={handleQuery}
          autoComplete="off"
          className={isValidQuery ? "mr-16" : "invalid mr-16"}
        />
        <div>
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
      </div>
    </fieldset>
  );
}

export default Filter;
