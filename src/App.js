import "./App.css";
import "./Components/Filter.css";
import "./Components/Filters.css";
import { useState, useEffect } from "react";
import { AppProvider } from "./app-context";
import { Upload } from "./Components/Upload";
import { Filters } from "./Components/Filters";
import { Table } from "./Components/Table";
import {
  formatMoney,
  countTotal,
  getFilteredTransactions,
  getFilteredTransactionsOther,
} from "./Services/helper";

// ToDo
// - Updating filter is a step behind.
// - Prevent transactions appearing in multiple categories
// - Save to local storage
// - Graph or over all spending
// - Trend graph for each filter showing if expenses has gone up or down over time.
// - Color code filters
// - Toggle hide main table
// - Add toggle highlight to table-modal

function App() {
  const defaultFilter = {
    id: `${Math.random()}:${Math.random()}`,
    title: "Groceries",
    total: 0,
    queries: ["new world", "countdown", "four square", "pak n save"],
    transactions: [],
  };

  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState([defaultFilter]);
  const [total, setTotal] = useState(0);
  const [showTableId, setShowTableId] = useState(null); // Used to open the modal
  const [tableHighlight, setTableHighlight] = useState("");
  const [enableTableHighlight, setEnableTableHighlight] = useState(false);

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
    setTotal(countTotal(transactions));
  }, [transactions]);

  // useEffect(() => {
  //   console.log("App", filters);
  // });

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
        <div className="App">
          <div>
            <div className="upload-wrapper">
              <Upload />
            </div>

            {transactions.length &&
              (() => {
                return (
                  <>
                    <h3 className="color-white">
                      <span className="mr-24">Total: {formatMoney(total)}</span>
                      <button onClick={handleAddNewCategory} className="mr-24">
                        Add Category
                      </button>
                      <button
                        onClick={() =>
                          setEnableTableHighlight(!enableTableHighlight)
                        }
                      >
                        {enableTableHighlight ? "Disable" : "Enable"} Highlight
                      </button>
                    </h3>
                  </>
                );
              })()}

            <div className="layout">
              <div>
                {transactions.length &&
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
                {transactions.length &&
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
        </div>
      </AppProvider>
    </div>
  );
}

export default App;
