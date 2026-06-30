import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import '../components/Landing.css';

export default function Landing() {
  return (
    <main className="landing">
      <PublicNavbar />

      <section className="hero">
        <div>
          <p className="hero__eyebrow">Smart crop planning</p>
          <h1 className="hero__title">E-Krishi crop recommendation</h1>
          <p className="hero__subtitle">
            Turn soil nutrients, pH, rainfall, humidity, and temperature into a
            practical crop suggestion for your field.
          </p>
        </div>

        <div className="hero__strata" aria-hidden="true">
          <div className="strata-bar">
            <span className="b-rainfall" />
            <span className="b-humidity" />
            <span className="b-temp" />
            <span className="b-ph" />
            <span className="b-npk" />
          </div>
        </div>
      </section>

      <section id="preview" className="preview">
        <div className="preview__intro">
          <p className="section-eyebrow">Recommendation preview</p>
          <h2 className="section-title">Know what to plant next</h2>
          <p className="section-text">
            Submit field readings in the dashboard and keep a history of your
            predictions for future planning.
          </p>
        </div>

        <div className="preview__panel">
          <div className="preview__form" aria-label="Sample soil readings">
            <div className="preview__field">
              <span>Nitrogen</span>
              <strong>72</strong>
            </div>
            <div className="preview__field">
              <span>Phosphorus</span>
              <strong>38</strong>
            </div>
            <div className="preview__field">
              <span>Potassium</span>
              <strong>41</strong>
            </div>
            <div className="preview__field">
              <span>pH</span>
              <strong>6.7</strong>
            </div>
            <div className="preview__field">
              <span>Humidity</span>
              <strong>64%</strong>
            </div>
            <div className="preview__field">
              <span>Rainfall</span>
              <strong>120 mm</strong>
            </div>
          </div>

          <div className="preview__result">
            <div className="preview__result-card">
              <p className="section-eyebrow">Suggested crop</p>
              <h3 className="preview__result-crop">Rice</h3>
              <p className="preview__hint">
                Create an account to run recommendations with your own data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <p className="section-eyebrow">Features</p>
        <h2 className="section-title">Built for quick farm decisions</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-card__chip b-npk" />
            <h3 className="feature-card__title">Soil inputs</h3>
            <p className="feature-card__text">
              Capture NPK, pH, rainfall, temperature, and humidity in one flow.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-card__chip b-humidity" />
            <h3 className="feature-card__title">Weather context</h3>
            <p className="feature-card__text">
              Use current weather values to speed up recommendations.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-card__chip b-rainfall" />
            <h3 className="feature-card__title">Saved history</h3>
            <p className="feature-card__text">
              Review past predictions and compare crop suggestions over time.
            </p>
          </article>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <p className="section-eyebrow">How it works</p>
        <h2 className="section-title">Simple steps to get started</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-card__number">1</div>
            <h3 className="step-card__title">Create Account</h3>
            <p className="step-card__text">
              Sign up with your email to start managing your crop recommendations.
            </p>
          </div>
          <div className="step-card">
            <div className="step-card__number">2</div>
            <h3 className="step-card__title">Enter Soil Data</h3>
            <p className="step-card__text">
              Input your soil's Nitrogen, Phosphorus, Potassium levels and pH value.
            </p>
          </div>
          <div className="step-card">
            <div className="step-card__number">3</div>
            <h3 className="step-card__title">Add Weather Info</h3>
            <p className="step-card__text">
              Provide temperature, humidity, and rainfall data for accuracy.
            </p>
          </div>
          <div className="step-card">
            <div className="step-card__number">4</div>
            <h3 className="step-card__title">Get Recommendation</h3>
            <p className="step-card__text">
              Receive an AI-powered crop suggestion with confidence score.
            </p>
          </div>
          <div className="step-card">
            <div className="step-card__number">5</div>
            <h3 className="step-card__title">Track History</h3>
            <p className="step-card__text">
              Keep a history of all your predictions for future reference.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="footer__brand">E-Krishi</p>
        <p className="footer__text">
          Sign up, enter soil readings, and get a crop recommendation.
        </p>
      </footer>
    </main>
  );
}
