import './AuthLayout.css';

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__panel">
          <div className="auth-card__panel-top">
            <span className="auth-card__logo">🌱 E-Krishi</span>
          </div>

          <div className="auth-card__panel-body">
            <h2 className="auth-card__panel-title">
              Read the soil.<br />Know the crop.
            </h2>
            <p className="auth-card__panel-text">
              Nitrogen, phosphorus, potassium, temperature, humidity, pH and
              rainfall — seven readings in, one confident recommendation out.
            </p>

            <div className="strata-legend">
              <div className="strata-bar">
                <span className="b-npk" />
                <span className="b-temp" />
                <span className="b-humidity" />
                <span className="b-rainfall" />
                <span className="b-ph" />
              </div>
              <div className="strata-legend__labels">
                <span>N·P·K</span>
                <span>Temp</span>
                <span>Humidity</span>
                <span>Rainfall</span>
                <span>pH</span>
              </div>
            </div>
          </div>

          <p className="auth-card__panel-foot">Soil-to-decision, in seconds.</p>
        </div>

        <div className="auth-card__form">
          <div className="auth-card__form-inner">
            <p className="auth-eyebrow">{eyebrow}</p>
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}