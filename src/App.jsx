import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Start from "./Start";
import Quiz from "./Quiz";

/* https://opentdb.com/api.php?amount=5&category=27 */

export default function App() {
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(false);
  const [quizes, setQuizes] = useState([]);
  const [allQuestion, setAllQuestion] = useState([]);
  const [count, setCount] = useState({
    correct: 0,
    incorrect: 0,
    render: false,
  });

  useEffect(() => {
    if (start) {
      setLoading(true);
      setQuizes([]);
      setAllQuestion([]);
      fetch("https://opentdb.com/api.php?amount=5&category=27")
        .then((res) => res.json())
        .then((data) => {
          setQuizes(data.results);
          setLoading(false);
        });
    }
  }, [start]);

  useEffect(() => {
    for (let i = 0; i < quizes.length; i++) {
      const item = quizes[i];
      const options = [...item.incorrect_answers, item.correct_answer];
      options.sort(() => 0.5 - Math.random());
      const optionWithId = options.map((item) => ({
        id: nanoid(),
        opt: item,
        isClick: false,
      }));

      setAllQuestion((preV) => {
        return [
          ...preV,
          {
            id: nanoid(),
            question: item.question,
            options: optionWithId,
            answer: item.correct_answer,
            choose: "",
            revealAns: false,
          },
        ];
      });
    }
  }, [quizes]);

  //   click function for start
  function handleStart() {
    setStart(true);
  }
  //   click function for option
  function handleClick(e, pro, id) {
    const clikEl = e.target.getAttribute("id");
    const selectEl = e.target.textContent;
    const newQuestion = [...allQuestion];
    const targetQuestion = newQuestion.find((item) => item.id === pro.id);
    targetQuestion.choose = selectEl;
    //
    const allOption = [...targetQuestion.options];
    allOption.forEach((item) => (item.isClick = false));

    const targetOption = allOption.find((item) => item.id === clikEl);
    targetOption.isClick = !targetOption.isClick;

    targetQuestion.options = allOption;

    setAllQuestion(newQuestion);
  }
  //   click function for check answer
  function checkAnswer() {
    if (!reset) {
      const answers = [...allQuestion];
      answers.forEach((item) => {
        item.revealAns = true;
        if (item.answer === item.choose) {
          setCount((preV) => ({ ...preV, correct: preV.correct + 1 }));
        } else {
          setCount((preV) => ({ ...preV, incorrect: preV.incorrect + 1 }));
        }
      });
      setAllQuestion(answers);
      setCount((preV) => ({ ...preV, render: true }));
      setReset(true);
    } else {
      setStart(false);
      setReset(false);
      setQuizes([]);
      setAllQuestion([]);
      setCount({ correct: 0, incorrect: 0, render: false });
    }
  }

  const quizApp = allQuestion.map((quiz) => (
    <Quiz
      key={quiz.id}
      id={quiz.id}
      question={quiz.question}
      options={quiz.options}
      answer={quiz.answer}
      choose={quiz.choose}
      revealAns={quiz.revealAns}
      handleClick={handleClick}
    />
  ));

  /*  */
  return (
    <div className="main">
      {!start && <Start handleStart={handleStart} />}
      {loading && (
        <div className="loading">
          <h1>loading....</h1>
        </div>
      )}
      {start && quizApp}
      {start && (
        <div className="checkBtn">
          {count.render && (
            <p>
              Correct: {count.correct} Incorrect:{count.incorrect}
            </p>
          )}
          {!loading && (
            <button onClick={checkAnswer}>
              {!reset ? "Check Answer" : "Reset"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
