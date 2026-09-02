import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: "sleep",
    category: "Sleep & Routine",
    title: "What time do you usually go to sleep?",
    subtitle: "Your sleep schedule can have a big impact on roommate compatibility.",
    options: [
      { value: "early", icon: "🌙", title: "Early Bird", text: "Before 10 PM" },
      { value: "normal", icon: "😴", title: "Regular", text: "10 PM – 12 AM" },
      { value: "late", icon: "🦉", title: "Night Owl", text: "After 12 AM" },
    ],
  },
  {
    id: "cleanliness",
    category: "Cleanliness",
    title: "How clean do you like your living space?",
    subtitle: "Be honest — there is no right or wrong answer!",
    options: [
      { value: "very-clean", icon: "✨", title: "Very Clean", text: "Everything organized" },
      { value: "clean", icon: "🧹", title: "Pretty Clean", text: "Clean but relaxed" },
      { value: "relaxed", icon: "😌", title: "Relaxed", text: "Mess doesn't bother me" },
    ],
  },
  {
    id: "social",
    category: "Social Life",
    title: "How social are you at home?",
    subtitle: "Think about how often you like having people around.",
    options: [
      { value: "quiet", icon: "📚", title: "Quiet", text: "I prefer peaceful evenings" },
      { value: "balanced", icon: "😊", title: "Balanced", text: "A little of both" },
      { value: "social", icon: "🎉", title: "Very Social", text: "I love having friends over" },
    ],
  },
  {
    id: "food",
    category: "Food & Lifestyle",
    title: "What best describes your food habits?",
    subtitle: "This helps us find someone with similar daily habits.",
    options: [
      { value: "cook", icon: "🍳", title: "I Cook", text: "I often prepare meals" },
      { value: "mix", icon: "🥗", title: "Mix of Both", text: "Cook and order food" },
      { value: "order", icon: "🍕", title: "Mostly Order", text: "I usually order food" },
    ],
  },
  {
    id: "study",
    category: "Study & Work",
    title: "What's your preferred study/work environment?",
    subtitle: "Your ideal environment matters when sharing a room or home.",
    options: [
      { value: "silent", icon: "🤫", title: "Very Quiet", text: "I need silence to focus" },
      { value: "music", icon: "🎧", title: "Some Noise", text: "Music is okay" },
      { value: "active", icon: "💻", title: "Active", text: "I don't mind noise" },
    ],
  },
  {
    id: "guests",
    category: "Roommate Preferences",
    title: "How do you feel about having guests over?",
    subtitle: "Let's find someone whose social boundaries match yours.",
    options: [
      { value: "rarely", icon: "🏠", title: "Rarely", text: "I prefer no guests" },
      { value: "sometimes", icon: "🙂", title: "Sometimes", text: "Occasionally is fine" },
      { value: "often", icon: "🥳", title: "Often", text: "I enjoy having guests" },
    ],
  },
];

function Quiz() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState("");

  const question = questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const handleSelect = (value) => {
    setSelected(value);

    setAnswers({
      ...answers,
      [question.id]: value,
    });
  };

  const handleContinue = () => {
    if (!selected) {
      return;
    }

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = questions[currentQuestion + 1];

      setCurrentQuestion(currentQuestion + 1);
      setSelected(answers[nextQuestion.id] || "");
    } else {
      console.log("Quiz Answers:", answers);
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      const previousQuestion = questions[currentQuestion - 1];

      setCurrentQuestion(currentQuestion - 1);
      setSelected(answers[previousQuestion.id] || "");
    }
  };

  return (
    <div className="quiz-page">

      {/* HEADER */}

      <header className="quiz-header">

        <div className="quiz-logo">
          🏠 <span>RoomMate</span> Match
        </div>

        <div className="quiz-progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </div>

      </header>


      {/* PROGRESS BAR */}

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>


      {/* QUIZ CONTENT */}

      <main className="quiz-content">

        <div className="quiz-category">
          {question.category}
        </div>

        <h1>{question.title}</h1>

        <p className="quiz-subtitle">
          {question.subtitle}
        </p>


        {/* OPTIONS */}

        <div className="quiz-options">

          {question.options.map((option) => (

            <button
              key={option.value}
              className={`quiz-option ${
                selected === option.value ? "selected" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >

              <div className="option-icon">
                {option.icon}
              </div>

              <div className="option-text">
                <strong>{option.title}</strong>
                <span>{option.text}</span>
              </div>

              <div className="option-check">
                {selected === option.value ? "✓" : ""}
              </div>

            </button>

          ))}

        </div>


        {/* NAVIGATION */}

        <div className="quiz-navigation">

          <button
            className="back-btn"
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            ← Back
          </button>

          <button
            className={`continue-btn ${
              !selected ? "disabled" : ""
            }`}
            onClick={handleContinue}
            disabled={!selected}
          >
            {currentQuestion === questions.length - 1
              ? "Finish Quiz ❤️"
              : "Continue →"}
          </button>

        </div>


        <div className="quiz-tip">
          💡 <strong>Tip:</strong> Answer honestly to get better roommate matches.
        </div>

      </main>

    </div>
  );
}

export default Quiz;