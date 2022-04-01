import { useContext } from "react";
import AppContext from "../app-context";
import { bank, BANKS, KIWI_BANK, ASB_BANK } from "../settings.js";

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

  const normalizeJson = (json, bankId) => {
    if (bankId === KIWI_BANK) {
      return json.map((row) => [
        row[bank(bankId).TRANSACTION_DATE],
        row[bank(bankId).TRANSACTION_TEXT],
        row[bank(bankId).TRANSACTION_VALUE],
      ]);
    }
    if (bankId === ASB_BANK) {
      return json.map((row) => [
        row[bank(bankId).TRANSACTION_DATE],
        `
          ${row[bank(bankId).TRANSACTION_PAYEE]}: 
          ${row[bank(bankId).TRANSACTION_TEXT]}
        `,
        row[bank(bankId).TRANSACTION_VALUE],
      ]);
    }
  };

  const onFileChange = ({ target: el }) => {
    //   const { onFileChange } = this.props;

    const reader = new FileReader();

    reader.readAsText(el.files[0]);

    reader.onload = () => {
      try {
        const csvHeader = getCsvHeader(reader.result);
        const bankId = guessBankByCsvHeader(csvHeader);
        const transactionsJson = convertToJson(reader.result);
        const transactions = normalizeJson(transactionsJson, bankId);
        setTransactions(transactions);
      } catch (error) {
        alert(
          "Something went wrong while parsing the csv file. Check the file and try again."
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
