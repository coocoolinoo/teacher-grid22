import React, { useState, useEffect } from 'react';
import './App.css';
import GewinnerImage from './assets/Gewinner.jpeg';
import VerliererImage from './assets/Verlierer.jpeg';
import teachersData from './teachers.json';
import eigenschaftenData from './eigenschaften.json';
import HTLLogo from './assets/HTLLOGO.png';

interface Teacher {
  id: number;
  name: string;
  kuerzel: string;
  eigenschaften: {
    [key: string]: any;
  };
}

interface Eigenschaft {
  anzeige: string;
  key: string;
  wert: any;
  kategorie: string;
}

const App: React.FC = () => {
  const [teachers] = useState<Teacher[]>(teachersData);
  const [eigenschaften] = useState<Eigenschaft[]>(eigenschaftenData);
  const [horizontalEigenschaften, setHorizontalEigenschaften] = useState<Eigenschaft[]>([]);
  const [verticalEigenschaften, setVerticalEigenschaften] = useState<Eigenschaft[]>([]);
  const [grid, setGrid] = useState<(Teacher | null)[][]>([[null, null, null], [null, null, null], [null, null, null]]);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Update theme when dark mode changes
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const horizontal = eigenschaftenData
      .filter(e => e.kategorie === 'horizontal')
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const vertical = eigenschaftenData
      .filter(e => e.kategorie === 'vertikal')
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setHorizontalEigenschaften(horizontal);
    setVerticalEigenschaften(vertical);
  }, []);

  const checkTeacherProperties = (teacher: Teacher, row: number, col: number): boolean => {
    const horizontalEig = horizontalEigenschaften[row];
    const verticalEig = verticalEigenschaften[col];
    return teacher.eigenschaften[horizontalEig.key] === horizontalEig.wert && 
           teacher.eigenschaften[verticalEig.key] === verticalEig.wert;
  };

  const showTeacherInputDialog = (row: number, col: number) => {
    return new Promise<Teacher | null>((resolve) => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
      
      const modalContent = document.createElement('div');
      modalContent.style.backgroundColor = 'white';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '8px';
      modalContent.style.width = '300px';
      
      const input = document.createElement('input');
      input.style.width = '100%';
      input.style.padding = '10px';
      input.style.marginBottom = '10px';
      input.placeholder = 'Lehrer-Kürzel eingeben';
      
      const suggestionsDiv = document.createElement('div');
      suggestionsDiv.style.maxHeight = '200px';
      suggestionsDiv.style.overflowY = 'auto';
      suggestionsDiv.style.marginBottom = '10px';
      
      const button = document.createElement('button');
      button.textContent = 'Bestätigen';
      button.style.padding = '8px 16px';
      
      modalContent.appendChild(input);
      modalContent.appendChild(suggestionsDiv);
      modalContent.appendChild(button);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      input.focus();
      
      const updateSuggestions = () => {
        const inputValue = input.value.trim().toUpperCase();
        const matchedTeachers = teachers.filter(t => 
          t.kuerzel.toUpperCase().includes(inputValue) || 
          t.name.toUpperCase().includes(inputValue)
        ).slice(0, 5);
        
        suggestionsDiv.innerHTML = '';
        
        matchedTeachers.forEach(teacher => {
          const suggestion = document.createElement('div');
          suggestion.style.padding = '8px';
          suggestion.style.cursor = 'pointer';
          suggestion.style.borderBottom = '1px solid #eee';
          suggestion.innerHTML = `<strong>${teacher.kuerzel}</strong> - ${teacher.name}`;
          
          suggestion.addEventListener('click', () => {
            resolve(teacher);
            document.body.removeChild(modal);
          });
          
          suggestionsDiv.appendChild(suggestion);
        });
      };
      
      input.addEventListener('input', updateSuggestions);
      
      button.addEventListener('click', () => {
        const inputValue = input.value.trim().toUpperCase();
        const teacher = teachers.find(t => t.kuerzel.toUpperCase() === inputValue);
        resolve(teacher || null);
        document.body.removeChild(modal);
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          resolve(null);
          document.body.removeChild(modal);
        }
      });
    });
  };

  const handleCellClick = async (row: number, col: number) => {
    if (gameOver || gameWon || grid[row][col] !== null) return;
    
    const guessedTeacher = await showTeacherInputDialog(row, col);
    
    if (!guessedTeacher) return;
    
    const isCorrect = checkTeacherProperties(guessedTeacher, row, col);
    
    if (isCorrect) {
      const newGrid = [...grid];
      newGrid[row][col] = guessedTeacher;
      setGrid(newGrid);
      
      if (newGrid.flat().every(cell => cell !== null)) {
        setGameWon(true);
      }
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      
      if (newAttempts <= 0) {
        setGameOver(true);
      } else {
        alert(`Falsch! ${guessedTeacher.name} passt nicht hier. Noch ${newAttempts} Versuche übrig.`);
      }
    }
  };

  const resetGame = () => {
    const horizontal = eigenschaftenData
      .filter(e => e.kategorie === 'horizontal')
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const vertical = eigenschaftenData
      .filter(e => e.kategorie === 'vertikal')
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setHorizontalEigenschaften(horizontal);
    setVerticalEigenschaften(vertical);
    setGrid([[null, null, null], [null, null, null], [null, null, null]]);
    setAttemptsLeft(5);
    setGameOver(false);
    setGameWon(false);
  };

  if (horizontalEigenschaften.length === 0 || verticalEigenschaften.length === 0) {
    return <div>Laden...</div>;
  }

 return (
    <div id="root">
      <header className="app-header">
  <img src={HTLLogo} alt="HTL Logo" className="htl-logo" />
  <h1>HTL DonauGrid</h1>
  <button 
    onClick={() => setIsDarkMode(!isDarkMode)}
    className="theme-toggle"
    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
  >
    {isDarkMode ? '☀️' : '🌙'}
  </button>
</header>


      <main className="game-container">
        {gameOver || gameWon ? (
          <div className="result-screen">
            <h2 className="result-title">
              {gameWon ? 'Du bist der Beste!' : 'Arbeite weiter an dir!'}
            </h2>
            <img 
              src={gameWon ? GewinnerImage : VerliererImage} 
              alt={gameWon ? "Gewinner" : "Verlierer"}
              className="result-image"
            />
            <button 
              onClick={resetGame}
              className="new-game-btn"
            >
              Neues Spiel
            </button>
          </div>
        ) : (
          <>
            <div className="attempts-counter">
              Versuche übrig: {attemptsLeft}
            </div>
            
            <div className="grid-container">
              <div className="grid-corner"></div>
              
              {verticalEigenschaften.map((eig, col) => (
                <div key={col} className="grid-header">
                  {eig.anzeige}
                </div>
              ))}
              
              {horizontalEigenschaften.map((eig, row) => (
                <React.Fragment key={row}>
                  <div className="grid-row-label">
                    {eig.anzeige}
                  </div>
                  
                  {[0, 1, 2].map((col) => (
                    <button
                      key={col}
                      className={`grid-cell ${grid[row][col] ? 'correct' : 'empty'}`}
                      onClick={() => handleCellClick(row, col)}
                      disabled={grid[row][col] !== null}
                    >
                      {grid[row][col] ? (
                        <>
                          <div className="teacher-code">
                            {grid[row][col]?.kuerzel}
                          </div>
                          <div className="teacher-name">
                            {grid[row][col]?.name.split(' ')[0]}
                          </div>
                        </>
                      ) : null}
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </main>

      {!gameOver && !gameWon && (
        <footer className="footer">
          <button 
            onClick={resetGame}
            className="new-game-btn"
          >
            Neues Spiel
          </button>
        </footer>
      )}
    </div>
  );
};

export default App;