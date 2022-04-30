import "./Filters.css";
import { Filter } from "./Filter";
import { ExcludeFilter } from "./ExcludeFilter";
import { Graph } from "./Graph";

import { useContext } from "react";
import AppContext from "../app-context";

export function Filters() {
  const { filters, transactions } = useContext(AppContext);

  return (
    <>
      {transactions.length > 0 && (
        <form>
          {filters.map((f, index) => {
            if (f.exclude) {
              return (
                <ExcludeFilter filter={f} key={`filter-fieldset-${index}`} />
              );
            } else {
              return (
                <>
                  <Filter filter={f} key={`filter-fieldset-${index}`} />
                  <Graph filter={f} key={`graph-${index}`} />
                </>
              );
            }
          })}
        </form>
      )}
    </>
  );
}
