export default function Quiz(props) {
  const { question, options, handleClick, id, revealAns, answer, choose } =
    props;

  const optionQ = options.map((option) => (
    <p
      className={option.isClick ? "selected" : ""}
      id={option.id}
      key={option.id}
      onClick={(e) => handleClick(e, props, id)}
    >
      {option.opt}
    </p>
  ));

  const reveal = options.map((option) => {
    const styles = {
      background:
        option.opt === answer ? "green" : option.opt === choose ? "red" : "",
    };
    return (
      <p key={option.id} style={styles}>
        {option.opt}
      </p>
    );
  });
  const styles = {
    display: revealAns ? "none" : "",
  };

  return (
    <div className="quiz">
      <h3>{question}?</h3>
      <div className="quiz--option">
        {!revealAns && optionQ}
        {revealAns && reveal}
      </div>
    </div>
  );
}
