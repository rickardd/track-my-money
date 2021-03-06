import "./App.css";
import "./Components/Filter.css";
import "./Components/Filters.css";
import { useState, useEffect } from "react";
import { AppProvider } from "./app-context";
import { Upload } from "./Components/Upload";
import { Filters } from "./Components/Filters";
import { PieGraphTotal } from "./Components/PieGraphTotal";


import { defaultFilters } from "./Services/defaultFilters";
import { Table } from "./Components/Table";
import {
  formatMoney,
  countTotal,
  getFilteredTransactions,
  getFilteredTransactionsOther,
  getRelevantTransactions,
  store,
} from "./Services/helper";

// ToDo

// - Add ramda with pipes
// - Favicon and logo and name
// - Start page
// - Upload modal
//   - Ask merge with existing transactions or overwrite
//   - Ask if it's a shared account, divide by number of people.
// - Toggle hide main table
// - Add toggle highlight to table-modal
// - Mobile friendly
// - Rename TableOther to remainingTable
// - Make react work with multiple default filters.
// - Graphs
//    - over-all spending
//    - Trend graph for each filter
//    - Install https://recharts.org/en-US/guide/getting-started
//    - Pie graph in header, This requires color coded filters.
//    - Make a year comparison graph like https://recharts.org/en-US/examples/SynchronizedAreaChart
// - Color code filters
// - PWA
// - Add links to the web
// - Delete a filter
// - Add SEO tags

// React refactoring
// - Extend components, e.g otherTable and filterTables could extend from the table component. https://reactjs.org/docs/composition-vs-inheritance.html
// - How to add static and dynamic css-classnames
// - Animations
// - Scope css by components
// - Make a modal of everything e.g button, checkboxes, headlines, text-fields, etc.
// - Create share link with Firebase
// - Design front page similar to https://formidable.com/open-source/victory/

function App() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState([
    defaultFilters[defaultFilters.length - 1],
    defaultFilters[0],
  ]);
  const [total, setTotal] = useState(0);
  const [showTableId, setShowTableId] = useState(null); // Used to open the modal
  const [tableHighlight, setTableHighlight] = useState("");
  const [enableTableHighlight, setEnableTableHighlight] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [persistStore, setPersistStore] = useState(store.hasRecords());
  const [enableTableFiltering, setEnableTableFiltering] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [excludeQueries, setExcludeQueries] = useState([]);

  const data = {
    transactions,
    setTransactions,
    filters,
    setFilters,
    total,
    setTotal,
    showTableId,
    setShowTableId,
    tableHighlight,
    setTableHighlight,
    enableTableHighlight,
    setEnableTableHighlight,
    enableTableFiltering,
    setEnableTableFiltering,
    currentQuery,
    setCurrentQuery,
    excludeQueries,
    setExcludeQueries,
    persistStore,
    setPersistStore,
  };

  useEffect(() => {
    if (store.hasRecords()) {
      if (store.transactions?.length) {
        setTransactions(store.transactions);
      }
      if (store.filters?.length) {
        setFilters(store.filters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (persistStore) {
      store.transactions = transactions;
    }
    updateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  useEffect(() => {
    if (persistStore) {
      store.filters = filters;
    }
    updateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (persistStore) {
      store.filters = filters;
      store.transactions = transactions;
    } else {
      store.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistStore]);

  const updateTotal = () => {
    const relevantTransactions = getRelevantTransactions(
      excludeQueries,
      transactions
    );

    setTotal(countTotal(relevantTransactions));
  };

  const handleAddNewCategory = () => {
    const _filters = [
      ...filters,
      {
        id: `${Math.random()}:${Math.random()}`,
        title: "",
        total: 0,
        queries: [],
        transactions: [],
      },
    ];
    setFilters(_filters);
  };

  return (
    <div className="App">
      <AppProvider value={data}>
        <div>
          {!transactions.length &&
            (() => {
              return (
                <div className="upload-wrapper">
                  <Upload button={false} />
                </div>
              );
            })()}

          {!!transactions.length &&
            (() => {
              return (
                <>
                  <header className="app-header">
                    <div className="header-content">
                      <h3>
                        <span className="mr-24">
                          Total: {formatMoney(total)}
                        </span>
                      </h3>
                      <Upload button={true} />
                      <label className="mr-24">
                        Persist: &nbsp;
                        <input
                          type="checkbox"
                          checked={persistStore}
                          onChange={({ target: el }) =>
                            setPersistStore(el.checked)
                          }
                        />
                      </label>

                      <PieGraphTotal  />
                    </div>
                  </header>
                </>
              );
            })()}

          <div className="layout">
            <div>
              {!!transactions.length &&
                (() => {
                  return (
                    <>
                      <div>
                        <Filters />
                        <div className="flex justify-center">
                          <button
                            onClick={handleAddNewCategory}
                            className="button-circle"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {filters.map((filter, index) => {
                        return (
                          <Table
                            key={`table-id-${filter.id}`}
                            id={`table-${filter.id}`}
                            tableTitle={filter.title}
                            transactions={getFilteredTransactions(
                              filter.queries,
                              transactions
                            )}
                            isModal={true}
                          />
                        );
                      })}
                    </>
                  );
                })()}
            </div>
            {!!transactions.length &&
              (() => {
                return (
                  <div className="layout-table">
                    <Table
                      key={`table-id-other`}
                      tableTitle="Uncategorized transactions"
                      tableParagraph="When this table is empty all transactions has been categories"
                      transactions={getFilteredTransactionsOther(
                        transactions,
                        filters
                      )}
                      isModal={false}
                    />
                  </div>
                );
              })()}
          </div>
        </div>
      </AppProvider>
    </div>
  );
}

export default App;
