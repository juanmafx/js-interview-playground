import { buildInterviewReport } from "/shared/reports/interview-report.js";
import { bindPlayground } from "./playground.js";

bindPlayground({
  button: document.getElementById("run-btn"),
  output: document.getElementById("output"),
  logger: console,
  buildReport: buildInterviewReport,
});
