import "./Filters.css";
import { Filter } from "./Filter";

import { useContext } from "react";
import AppContext from "../app-context";

export function Filters() {
  const { filters, transactions } = useContext(AppContext);

  return (
    <>
      {transactions.length > 0 && (
        <form>
          {filters.map((f, index) => {
            return <Filter filter={f} key={`filter-fieldset-${index}`} />;
          })}
        </form>
      )}
    </>
  );
}
