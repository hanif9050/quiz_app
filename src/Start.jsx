export default function Start(props) {
  return (
    <div className="start">
      <h1>Quizzical</h1>
      <p>Some description if needed</p>
      <button className="startBtn" onClick={props.handleStart}>
        Start Quiz
      </button>
    </div>
  );
}
