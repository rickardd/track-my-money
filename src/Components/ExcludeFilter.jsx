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

export function ExcludeFilter(props) {
  const {
    filters,
    setFilters,
    transactions,
    setShowTableId,
    total: allTotal,
    setTableHighlight,
    setCurrentQuery,
    excludeQueries,
    setExcludeQueries,
  } = useContext(AppContext);

  const { filter } = props;

  const { id, title: titleProp, total, queries } = filter;

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
      setExcludeQueries([...excludeQueries, el.value]);
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

  const handleShowTransactions = (e) => {
    setShowTableId(`table-${filter.id}`);
  };

  return (
    <fieldset className="filter filter-exclude">
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
        <div></div>
        <div>
          <button
            type="button"
            onClick={handleShowTransactions}
            disabled={!filter.transactions.length}
          >
            Transactions
          </button>
        </div>
      </div>
      <dl>
        <dt>Excluded</dt>
        <dd className="total-spending">{formatMoney(total)}</dd>
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

export default ExcludeFilter;
