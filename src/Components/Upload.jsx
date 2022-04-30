import { useContext } from "react";
import moment from "moment";
import AppContext from "../app-context";
import {
  SUPPORTED_BANKS,
  bank,
  BANKS,
  KIWI_BANK,
  ASB_BANK,
  WESTPAC_BANK,
  ANZ_BANK,
  TRANSACTION_VALUE,
  TRANSACTION_DATE,
} from "../settings.js";

import { normalizeDate } from "../Services/helper";

export function Upload(props) {
  const { setTransactions } = useContext(AppContext);
  const { button } = props;

  const getCsvHeader = (data) => {
    return data.trim().split("\n")[0];
  };

  const guessBankByCsvHeader = (header) => {
    if (BANKS.ASB_BANK.HEADER_REGEX.test(header)) {
      return ASB_BANK;
    } else if (BANKS.KIWI_BANK.HEADER_REGEX.test(header)) {
      return KIWI_BANK;
    } else if (BANKS.WESTPAC_BANK.HEADER_REGEX.test(header)) {
      return WESTPAC_BANK;
    } else if (BANKS.ANZ_BANK.HEADER_REGEX.test(header)) {
      return ANZ_BANK;
    }
  };

  const convertToJson = (data) => {
    let arr = [];

    data
      .trim()
      .split("\n")
      .forEach((row) => {
        arr.push(row.split(","));
      });

    let removeHeader = true;

    if (removeHeader) {
      arr.shift();
    }

    return arr;
  };

  const getExpenses = (transactions) => {
    return transactions.filter(
      (transaction) => transaction[TRANSACTION_VALUE] < 0
    );
  };

  const normalizeJson = (json, bankId) => {
    if (bankId === KIWI_BANK) {
      return json.map((row) => [
        normalizeDate(
          row[BANKS[bankId].COLUMNS.TRANSACTION_DATE],
          BANKS[bankId].DATE_FORMAT
        ),
        row[bank(bankId).TRANSACTION_TEXT],
        parseFloat(row[bank(bankId).TRANSACTION_VALUE]),
      ]);
    }
    if (bankId === ASB_BANK) {
      return json.map((row) => [
        normalizeDate(
          row[BANKS[bankId].COLUMNS.TRANSACTION_DATE],
          BANKS[bankId].DATE_FORMAT
        ),
        `
          ${row[bank(bankId).TRANSACTION_PAYEE]}: 
          ${row[bank(bankId).TRANSACTION_TEXT]}
        `,
        parseFloat(row[bank(bankId).TRANSACTION_VALUE]),
      ]);
    }
    if (bankId === WESTPAC_BANK) {
      return json.map((row) => [
        normalizeDate(
          row[BANKS[bankId].COLUMNS.TRANSACTION_DATE],
          BANKS[bankId].DATE_FORMAT
        ),
        `
          ${row[BANKS[bankId].COLUMNS.TRANSACTION_OTHER_PARTY]}:
          [${row[BANKS[bankId].COLUMNS.TRANSACTION_DESCRIPTION]}]
          (${row[BANKS[bankId].COLUMNS.TRANSACTION_PARTICULARS]})
        `,
        parseFloat(row[BANKS[bankId].COLUMNS.TRANSACTION_VALUE]),
      ]);
    }
    if (bankId === ANZ_BANK) {
      return json.map((row) => [
        normalizeDate(
          row[BANKS[bankId].COLUMNS.TRANSACTION_DATE],
          BANKS[bankId].DATE_FORMAT
        ),
        `
          ${row[BANKS[bankId].COLUMNS.TRANSACTION_TYPE]}:
          [${row[BANKS[bankId].COLUMNS.TRANSACTION_DETAILS]}]
          (${row[BANKS[bankId].COLUMNS.TRANSACTION_CODE]})
        `,
        parseFloat(row[BANKS[bankId].COLUMNS.TRANSACTION_VALUE]),
      ]);
    }
  };

  const sortTransactions = (transactions) => {
    if (transactions <= 1) return transactions;
    const firstDate = moment(transactions[0][TRANSACTION_DATE], "DD MMM YYYY");
    const lastDate = moment(transactions[1][TRANSACTION_DATE], "DD MMM YYYY");

    return moment(firstDate).isBefore(lastDate)
      ? transactions
      : transactions.reverse();
  };

  const onFileChange = ({ target: el }) => {
    const reader = new FileReader();

    reader.readAsText(el.files[0]);

    reader.onload = () => {
      try {
        const csvHeader = getCsvHeader(reader.result);
        const bankId = guessBankByCsvHeader(csvHeader);
        const transactionsJson = convertToJson(reader.result);
        let transactions = normalizeJson(transactionsJson, bankId);
        transactions = sortTransactions(transactions);
        transactions = getExpenses(transactions);
        setTransactions(transactions);
      } catch (error) {
        const currentBankSupport = SUPPORTED_BANKS.join(", ")
          .replaceAll("_", " ")
          .toLowerCase();
        alert(
          `Something went wrong while parsing the CSV file. \n  - Is your bank supported? Currently supported banks are\n    -  ${currentBankSupport}. \n  - Check the file and try again. \n`
        );
      }
    };

    reader.onerror = () => {
      console.error(reader.error);
    };
  };

  return (
    <div>
      <input
        type="file"
        name="upload"
        defaultValue=""
        data-button={button}
        onChange={onFileChange}
      />
    </div>
  );
}

export default Upload;
