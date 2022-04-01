import "./App.css";
import "./Components/Filter.css";
import "./Components/Filters.css";
import { useState, useEffect } from "react";
import { AppProvider } from "./app-context";
import { Upload } from "./Components/Upload";
import { Filters } from "./Components/Filters";
import { defaultFilters } from "./Services/defaultFilters";
import { Table } from "./Components/Table";
import {
  formatMoney,
  countTotal,
  getFilteredTransactions,
  getFilteredTransactionsOther,
  store,
} from "./Services/helper";

// ToDo
// - Prevent transactions appearing in multiple categories
// - Graph or over all spending
// - Trend graph for each filter showing if expenses has gone up or down over time.
// - Color code filters
// - Toggle hide main table
// - Add option to filter remaining transactions
// - Add toggle highlight to table-modal

function App() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState([defaultFilters[0]]);
  const [total, setTotal] = useState(0);
  const [showTableId, setShowTableId] = useState(null); // Used to open the modal
  const [tableHighlight, setTableHighlight] = useState("");
  const [enableTableHighlight, setEnableTableHighlight] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [persistStore, setPersistStore] = useState(false);

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
  };

  useEffect(() => {
    if (persistStore) {
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
    setTotal(countTotal(transactions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  useEffect(() => {
    if (filters.length) {
      store.filters = filters;
    }
  }, [filters]);

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
                  <header>
                    <div className="header-content">
                      <h3>
                        <span className="mr-24">
                          Total: {formatMoney(total)}
                        </span>
                      </h3>
                      <button onClick={handleAddNewCategory}>
                        Add Category
                      </button>
                      <button
                        onClick={() =>
                          setEnableTableHighlight(!enableTableHighlight)
                        }
                      >
                        {enableTableHighlight ? "Disable" : "Enable"} Highlight
                      </button>

                      <Upload button={true} />
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
                      <Filters />
                      {filters.map((filter, index) => {
                        return (
                          <Table
                            key={`table-id-${filter.id}`}
                            id={`table-${filter.id}`}
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
            <div className="layout-table">
              {!!transactions.length &&
                (() => {
                  return (
                    <Table
                      key={`table-id-other`}
                      tableTitle=""
                      transactions={getFilteredTransactionsOther(
                        transactions,
                        filters
                      )}
                      isModal={false}
                    />
                  );
                })()}
            </div>
          </div>
        </div>
      </AppProvider>
    </div>
  );
}

export default App;
