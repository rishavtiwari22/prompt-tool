import '../styles/modalLevel.css';
import samples from '../data/modalSamples';
import playAgainIcon from '../assets/playagain.svg';

const ModalLevel = ({ onClose, score = 80, onPlay, level = 1 }) => {
  const sample = samples[level - 1] || samples[0];
  const targetImage = sample.targetImage || samples[0]?.targetImage;
  const totalLevels = samples.length; // Get total number of levels
  const isLastLevel = level >= totalLevels; // Check if current level is the last one
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-level" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-heading">Level Complete!</h2>
        <div className="modal-content">
          <section className="modal-section image-section">
            <img
              src={targetImage}
              alt={`Level ${level} target preview`}
              className="product-image"
            />
          </section>

          <section className="modal-section stats-section">
            <div className="badges">
              <div className="badge">
                <img src={sample.starImg} alt="Star badge" className="badge-image" />
              </div>
              <div className="badge">
                <p>{sample.message}</p>
              </div>
            </div>

            <div className="progress-container" aria-hidden="false">
                <div className="score-text">Accuracy</div>
              <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={score}>
                <div className="progress-fill" style={{ width: `${score}%` }}></div>
                <div
                  className="progress-handle"
                  style={{ left: `${score}%` }}
                  aria-hidden="true"
                >
                  <span className="progress-handle-percentage">{score}%</span>
                </div>
              </div>
            </div>

            <button className="play-button" onClick={onPlay}>
              <img 
                src={isLastLevel ? playAgainIcon : sample.playIcon} 
                alt={isLastLevel ? "Play Again" : "Play"} 
                className="play-icon" 
              />
              <span className="play-text">
                
                <span className="play-label">
                  {isLastLevel ? 'Play Again' : `Play Level ${level + 1}`}
                </span>
    
              </span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModalLevel;