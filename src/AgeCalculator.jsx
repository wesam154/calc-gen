import { useState } from "react";
import "./AgeCalculator.css";

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function AgeCalculator() {
  const [values, setValues] = useState({ day: "", month: "", year: "" });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const { day, month, year } = values;
    const d = Number(day), m = Number(month), y = Number(year);
    const errs = {};
    const today = new Date();

    if (!day) errs.day = "This field is required";
    if (!month) errs.month = "This field is required";
    if (!year) errs.year = "This field is required";

    if (day && (d < 1 || d > 31)) errs.day = "Must be a valid day";
    if (month && (m < 1 || m > 12)) errs.month = "Must be a valid month";
    if (year && y > today.getFullYear()) errs.year = "Must be in the past";

    if (!errs.day && !errs.month && !errs.year) {
      if (d > daysInMonth(m, y)) {
        errs.day = "Must be a valid date";
      } else {
        const birthDate = new Date(y, m - 1, d);
        if (birthDate > today) errs.year = "Must be in the past";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const calculateAge = () => {
    const { day, month, year } = values;
    const d = Number(day), m = Number(month), y = Number(year);
    const today = new Date();
    const birthDate = new Date(y, m - 1, d);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      let prevMonth = today.getMonth() - 1;
      let prevYear = today.getFullYear();
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      days += daysInMonth(prevMonth + 1, prevYear);
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    setResult({ years, months, days });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) calculateAge();
  };

  return (
    <div className="card">
      <form className="inputs-row" onSubmit={handleSubmit}>
        <div className="input-group">
          <label className={errors.day ? "error" : ""}>DAY</label>
          <input
            type="text"
            placeholder="DD"
            value={values.day}
            onChange={handleChange("day")}
            className={errors.day ? "error" : ""}
          />
          {errors.day && <span className="error-msg">{errors.day}</span>}
        </div>

        <div className="input-group">
          <label className={errors.month ? "error" : ""}>MONTH</label>
          <input
            type="text"
            placeholder="MM"
            value={values.month}
            onChange={handleChange("month")}
            className={errors.month ? "error" : ""}
          />
          {errors.month && <span className="error-msg">{errors.month}</span>}
        </div>

        <div className="input-group">
          <label className={errors.year ? "error" : ""}>YEAR</label>
          <input
            type="text"
            placeholder="YYYY"
            value={values.year}
            onChange={handleChange("year")}
            className={errors.year ? "error" : ""}
          />
          {errors.year && <span className="error-msg">{errors.year}</span>}
        </div>
      </form>

      <div className="divider">
        <button className="submit-btn" onClick={handleSubmit}>
          <img src="/icon-arrow.svg" alt="submit" />
        </button>
      </div>

      <div className="result">
        <p>
          <span className="highlight">{result ? result.years : "--"}</span>{" "}
          years
        </p>
        <p>
          <span className="highlight">{result ? result.months : "--"}</span>{" "}
          months
        </p>
        <p>
          <span className="highlight">{result ? result.days : "--"}</span>{" "}
          days
        </p>
      </div>
    </div>
  );
}