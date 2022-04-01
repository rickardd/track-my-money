import moment from "moment";
import {
  TRANSACTION_DATE,
  TRANSACTION_TEXT,
  TRANSACTION_VALUE,
} from "../settings";

const formatMoney = (value) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(value);
};

const countWeeks = (transactions) => {
  // We assume transactions are sorted by date.
  if (transactions.length <= 1) return 0;

  const startDate = transactions[0][TRANSACTION_DATE];
  const endDate = transactions[transactions.length - 1][TRANSACTION_DATE];

  const a = moment.utc(startDate);
  const b = moment.utc(endDate);

  return parseFloat(b.diff(a, "weeks"));
};

const countMonths = (transactions) => {
  if (transactions.length <= 1) return 0;
  // We assume transactions are sorted by date.
  const startDate = transactions[0][TRANSACTION_DATE];
  const endDate = transactions[transactions.length - 1][TRANSACTION_DATE];

  const a = moment.utc(startDate);
  const b = moment.utc(endDate);

  return parseFloat(b.diff(a, "months"));
};

const getWeeklyAverage = (weeks, total) => {
  return weeks ? parseFloat((parseInt(total, 10) / weeks).toFixed(2)) : 0;
};

const getMonthlyAverage = (months, total) => {
  return months ? parseFloat((parseInt(total, 10) / months).toFixed(2)) : 0;
};

const getFilteredTransactions = (queries, transactions) => {
  return transactions.filter((t) => {
    return queries.find((q) => {
      return (
        t[TRANSACTION_TEXT] &&
        t[TRANSACTION_TEXT].toLowerCase().includes(q.toLowerCase())
      );
    });
  });
};

const getFilteredTransactionsOther = (transactions, filters) => {
  const allQueries = filters.flatMap((f) => f.queries);

  return transactions.filter((t) => {
    return !allQueries.find((q) => {
      return (
        t[TRANSACTION_TEXT] &&
        t[TRANSACTION_TEXT].toLowerCase().includes(q.toLowerCase())
      );
    });
  });
};

const countTotal = (transactions) => {
  if (!transactions) {
    return 0;
  }

  const total = transactions
    .map((t) => Math.abs(t[TRANSACTION_VALUE]))
    .reduce((prev, curr) => {
      return curr ? prev + curr : prev;
    }, 0)
    .toFixed(2);

  return parseFloat(total);
};

// Usage e.g store.transactions or store.transactions = "my value"
const store = (function store() {
  function push(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }
  function pull(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  return {
    get filters() {
      return pull("filters");
    },
    set filters(filters) {
      push("filters", filters);
    },
    get transactions() {
      return pull("transactions");
    },
    set transactions(transactions) {
      push("transactions", transactions);
    },
  };
})();

export {
  formatMoney,
  countWeeks,
  countMonths,
  getWeeklyAverage,
  getMonthlyAverage,
  getFilteredTransactions,
  getFilteredTransactionsOther,
  countTotal,
  store,
};
