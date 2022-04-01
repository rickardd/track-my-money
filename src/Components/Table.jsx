import { useContext } from "react";
import AppContext from "../app-context";

import {
  TRANSACTION_DATE,
  TRANSACTION_TEXT,
  TRANSACTION_VALUE,
} from "../settings.js";

export function Table(props) {
  const {
    tableTitle,
    setShowTableId,
    total,
    showTableId,
    tableHighlight,
    enableTableHighlight,
    enableTableFiltering,
    currentQuery,
  } = useContext(AppContext);

  const { id, isModal, transactions } = props;

  const handleClose = () => {
    setShowTableId(null);
  };

  const getWrapperClass = () => {
    let wrapperClass =
      showTableId === id && showTableId !== null ? "open-modal" : "hide";

    return isModal ? wrapperClass : null;
  };

  const getHighlightedText = (text, highlight) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { backgroundColor: "#feabff" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  };

  const getStatement = (data) => {
    if (enableTableHighlight) {
      return getHighlightedText(data[TRANSACTION_TEXT], tableHighlight);
    }
    return data[TRANSACTION_TEXT];
  };

  const getTransactions = () => {
    if (enableTableFiltering) {
      return transactions.filter((t) => {
        return t[TRANSACTION_TEXT].toLowerCase().includes(
          currentQuery.toLowerCase()
        );
      });
    }
    return transactions;
  };

  return (
    <div className={getWrapperClass()}>
      {tableTitle &&
        (() => {
          return (
            <h3 style={{ marginBottom: "6px" }}>
              {tableTitle} - ${total}
            </h3>
          );
        })()}

      <button
        type="button"
        onClick={handleClose}
        className={isModal ? null : "hide"}
      >
        Close
      </button>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Statement</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {getTransactions().map((data, index) => {
            return (
              <tr key={`tr-${index}`}>
                <td>{data[TRANSACTION_DATE]}</td>
                <td>{getStatement(data)}</td>
                <td>{data[TRANSACTION_VALUE]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
