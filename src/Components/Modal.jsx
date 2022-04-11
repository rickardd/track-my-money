import { useState } from "react";
import "./MyModal.scss";

export function Modal(props) {
  const { headLine, paragraph, children } = props;

  const [open, setOpen] = useState(true);
  // Add modal css
  // Take children as markup
  // ask if shared bank account, how many people
  // Aks if overwrite or merge existing transactions
  // "return" user interaction

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={`my-modal ${!open && "hide"}`} role="dialog">
      <article className="my-modal-content">
        <button type="button" onClick={handleClose} className="my-modal-close">
          x
        </button>
        <header className="my-modal-header">
          <h2>{headLine}</h2>
          <p>{paragraph}</p>
        </header>
        <div className="my-modal-body">{children}</div>
      </article>
    </div>
  );
}
