import "./MyModal.scss";

export function Modal(props) {
  const { headLine, paragraph, children } = props;
  // Add modal css
  // Take children as markup
  // ask if shared bank account, how many people
  // Aks if overwrite or merge existing transactions
  // "return" user interaction
  return (
    <article className="my-modal" role="dialog">
      <header>
        <h2>{headLine}</h2>
        <p>{paragraph}</p>
      </header>
      <div>{children}</div>
    </article>
  );
}
