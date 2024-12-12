import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const totalQuestions = 100; // 10 tests x 10 questions
  const correctAnswers = 74;
  const incorrectAnswers = totalQuestions - correctAnswers;

  // Data for the chart
  const data = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        label: "Questions",
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#66BB6A", "#E57373"],
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    cutout: "70%", // Adjust to make it a donut chart
  };

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <h3>MCQ Test Results</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;
