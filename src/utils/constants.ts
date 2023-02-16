import { Dimensions } from "react-native";
import { TGuess, TLeaderBoard } from "../types";

export const { width: SIZE, height: HEIGHT } = Dimensions.get("window");

export const colors = {
  correct: "#6aaa64",
  present: "#c9b458",
  absent: "#282828",
  keyDefault: "#606060",
  white: "#ffffff",
  bg: "#121212",
};

export const initialGuesses: TGuess[] = [
  {
    id: 0,
    letters: ["", "", "", "", ""],
    matches: ["", "", "", "", ""],
    isComplete: false,
    isCorrect: false,
  }
];

export const initialLeaderBoard: TLeaderBoard[] = [
  {
    id: 0,
    name: "",
    score: 100,
  },
];