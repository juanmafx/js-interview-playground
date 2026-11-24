import { evenSquares } from "../algorithms/even-squares.js";
import { withRole } from "../objects/with-role.js";

export function buildInterviewReport() {
  const person = { name: "Sam", role: "Frontend Engineer" };
  const updatedPerson = withRole(person, "JavaScript Candidate");

  return [
    "Interview Practice Results:",
    `Even squares: ${evenSquares([1, 2, 3, 4, 5, 6]).join(", ")}`,
    `Original role: ${person.role}`,
    `Updated role: ${updatedPerson.role}`,
  ].join("\n");
}
