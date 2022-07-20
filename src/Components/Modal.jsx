import "./Modal.scss";

export function Modal(props) {
  const { headLine, paragraph, children, close, onClose } = props;

  return (
    <div className={`my-modal ${close && "hide"}`} role="dialog">
      <article className="my-modal-content">
        <button
          type="button"
          onClick={() => onClose()}
          className="my-modal-close"
        >
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
