import { useContext } from "react";
import AppContext from "../app-context";

export function Upload(props) {
  const { setTransactions } = useContext(AppContext);
  const { button } = props;

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

  const onFileChange = ({ target: el }) => {
    //   const { onFileChange } = this.props;

    const reader = new FileReader();

    reader.readAsText(el.files[0]);

    reader.onload = () => {
      try {
        const transactions = convertToJson(reader.result);
        // onFileChange(transactions);
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
      {/* <input type="button" defaultValue="Submit" onClick={this.onSubmit} /> */}
    </div>
  );
}

export default Upload;
