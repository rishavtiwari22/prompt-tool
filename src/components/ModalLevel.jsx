import '../styles/modalLevel.css';
import samples from '../data/modalSamples';
import productImg from '../assets/modallevel/Boximage.jpg';

const ModalLevel = ({ onClose, score = 80, onPlay, level = 1 }) => {
  const sample = samples[level - 1] || samples[0];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-level" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="modal-close"
          aria-label="Close modal"
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="modal-heading">Level Complete!</h2>
        <div className="modal-content">
          <section className="modal-section image-section">
            <img src={productImg} alt="Product" className="product-image" />
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
                />
              </div>
              <div
                className="progress-handle-label"
                style={{ left: `${score}%` }}
              >{score}%</div>
            </div>

            <button className="play-button" onClick={onPlay}>
              <span className="play-label">Play Next {level}</span>
              <img src={sample.playIcon} alt="play" className="play-icon" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModalLevel;