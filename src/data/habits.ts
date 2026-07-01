import { Habit } from "../types/habit";

export const habits: Habit[] = [
  {
    id: "study",
    name: "Study",
    category: "career",
    frequency: "daily",
    target: 20,
    unit: "minutes",
    points: 5,
    streak: true,
    active: true,
  },

  {
    id: "walk",
    name: "Walk",
    category: "fitness",
    frequency: "daily",
    target: 10000,
    unit: "steps",
    points: 5,
    streak: true,
    active: true,
  },
];