import { useState } from "react";
import "./App.css";

const TeacherGrid22 = () => {
  const categories = [
    "KÖNNTE MAN JEDEN TAG SOCRATESEN.",
    "In Asia",
    "Top 20 in rail transport network size",
    "Flag with only 4 colors",
  ];

  const [selectedCell, setSelectedCell] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(900);
  const [remainingQuestions, setRemainingQuestions] = useState(10);

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      alert(`Richtig! +100 Punkte für: "${categories[selectedCell?.col]}"`);
      setScore(score + 100);
      setRemainingQuestions(remainingQuestions - 1);
      setSelectedCell(null);
      setInputValue("");
    }
  };

  return (
    <div className="app-container">
      <div className="teacher-grid-container">
        <h1>TeacherGrid22</h1>
        
        <div className="score-display">
          <span>Fragen übrig: {remainingQuestions}</span>
          <span>Punkte: {score}</span>
        </div>

        <div className="grid">
          {[0, 1, 2].map((row) => (
            <div key={row} className="grid-row">
              {categories.slice(0, 3).map((category, col) => (
                <div
                  key={col}
                  className="grid-cell"
                  onClick={() => handleCellClick(row, col)}
                >
                </div>
              ))}
            </div>
          ))}
        </div>

        {selectedCell && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>{categories[selectedCell.col]}</h3>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Deine Antwort..."
                autoFocus
              />
              <div className="popup-buttons">
                <button onClick={handleSubmit}>Bestätigen</button>
                <button onClick={() => setSelectedCell(null)}>Abbrechen</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGrid22