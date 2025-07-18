import './scoreboard.css'

export default function Scoreboard({ score, highScore, gameState, handleReset }) {
    const currentMessage = gameState === 'won' ? 'You Win!' : gameState === 'lost' ? 'Try Again!' : '';
    
    return (
        <div className="scoreboard">
            <p className="score-text">Score: {score}</p>
            <p className="highscore-text">High Score: {highScore}</p>
            <p className="gamestate-text">{currentMessage}</p>
            {gameState !== 'playing' && <button className="reset-button" onClick={handleReset}>Reset</button>}
            
        </div>
    );
}
 