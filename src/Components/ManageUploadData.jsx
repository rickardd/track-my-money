import { useState, useContext } from "react";
import AppContext from "../app-context";

const METHOD_OVERWRITE = "OVERWRITE";
const METHOD_MERGE = "MERGE";

export function ManageUploadData(props) {
  const { transactions } = useContext(AppContext);
  const { onSubmit } = props;

  const [writeMethod, setWriteMethod] = useState(
    transactions.length ? METHOD_MERGE : METHOD_OVERWRITE
  );

  const handleChange = ({ target: el }) => {
    console.log(el.value);
    setWriteMethod(el.value);
  };

  const handleSharedAccountChange = ({ target: el }) => {
    console.log("shared clicked");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ writeMethod });
  };

  return (
    <form onSubmit={handleSubmit}>
      {!!transactions.length &&
        (() => {
          return (
            <>
              <label className="mr-24">
                Overwrite? &nbsp;
                <input
                  type="radio"
                  name="write-method"
                  value={METHOD_OVERWRITE}
                  checked={writeMethod === METHOD_OVERWRITE}
                  onChange={handleChange}
                />
              </label>
              <label className="mr-24">
                Merge? &nbsp;
                <input
                  type="radio"
                  name="write-method"
                  value={METHOD_MERGE}
                  checked={writeMethod === METHOD_MERGE}
                  onChange={handleChange}
                />
              </label>
            </>
          );
        })()}

      <div>
        <label className="mr-24">
          Shared Account? &nbsp;
          <input
            type="checkbox"
            name="write-method"
            value="rick"
            checked={true}
            onChange={handleSharedAccountChange}
          />
        </label>
      </div>

      <div className="text-right">
        <input type="submit" className="button" value="Go" />
      </div>
    </form>
  );
}
