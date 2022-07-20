import * as R from "ramda";
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

  const a = moment(startDate, "DD MMM YYYY", "en-nz");
  const b = moment(endDate, "DD MMM YYYY", "en-nz");

  return parseFloat(a.diff(b, "weeks"));
};

const countMonths = (transactions) => {
  if (transactions.length <= 1) return 0;
  // We assume transactions are sorted by date.
  const startDate = transactions[0][TRANSACTION_DATE];
  const endDate = transactions[transactions.length - 1][TRANSACTION_DATE];

  const a = moment(startDate, "DD MMM YYYY", "en-nz");
  const b = moment(endDate, "DD MMM YYYY", "en-nz");

  return parseFloat(a.diff(b, "months"));
};

const normalizeDate = (date, inputFormat) => {
  return moment(date, inputFormat, "en-nz").format("D MMM YYYY");
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

const getRelevantTransactions = (excludeQueries, transactions) => {
  return transactions.filter((t) => {
    return !excludeQueries.find((q) => {
      return (
        t[TRANSACTION_TEXT] &&
        t[TRANSACTION_TEXT].toLowerCase().includes(q.toLowerCase())
      );
    });
  });
};

const getTransactionsGroupedByMonth = (transactions) => {
  const labelTranslations = (transactions) => {
    return transactions.map((t) => {
      t.yearMonth = moment(t[TRANSACTION_DATE], "DD MMM YYYY", "en-nz").format(
        "YYYY-MMM"
      );
      return t;
    });
  };

  const groupTranslationsByLabel = (transactions) => {
    let groups = {};
    transactions.forEach((t) => {
      if (!groups[t.yearMonth]) groups[t.yearMonth] = [];

      return groups[t.yearMonth].push(t);
    });
    return groups;
  };

  let labeledTranslations = labelTranslations(transactions);
  let groupedTranslations = groupTranslationsByLabel(labeledTranslations);

  // This array is broken
  // Maybe this should return an object instead.
  // [2021-Nov: Array(15), 2021-Oct: Array(40), 2021-Sep: Array(28), 2021-Aug: Array(36), 2021-Jul: Array(46), …]
  return groupedTranslations;
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
  function remove(key) {
    window.localStorage.removeItem(key);
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
    clear() {
      remove("filters");
      remove("transactions");
    },
    hasRecords() {
      // debugger;
      return !!(pull("transactions") && pull("filters"));
    },
  };
})();

export {
  formatMoney,
  countWeeks,
  countMonths,
  getWeeklyAverage,
  getMonthlyAverage,
  normalizeDate,
  getFilteredTransactions,
  getFilteredTransactionsOther,
  getRelevantTransactions,
  getTransactionsGroupedByMonth,
  countTotal,
  store,
};
