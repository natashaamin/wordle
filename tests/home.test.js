import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../src/screens/game/index";
import renderer , {create } from "react-test-renderer";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn().mockReturnValue({
    guesses: ["example", "guesses", "array"],
    nextGame: false,
    currentGuessIndex: 0,
    gameStarted: false,
    gameEnded: false,
    gameWon: false,
    answer: "example answer",
    totalGuesses: 0,
    leaders: [],
    count: 0,
  }),
}));

describe("HomeScreen", () => {
  it("renders correctly", () => {
    const tree = renderer.create(HomeScreen).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
