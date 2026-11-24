export function bindPlayground({ button, output, logger, buildReport }) {
  const run = () => {
    const report = buildReport();
    logger.clear();
    logger.log(report);
    output.textContent = report;
  };

  button.addEventListener("click", run);
  return run;
}
