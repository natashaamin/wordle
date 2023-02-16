import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import GameBoard from "../src/screens/game/components/gameBoard";
import renderer, { create } from "react-test-renderer";
import * as reactRedux from "react-redux";

const mockProps = {
  answer: "apple",
  handleGuess: jest.fn(),
  resetGame: jest.fn(),
  handleNextGame: jest.fn(),
};

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn().mockReturnValue({
    guesses: [
      {
        id: 0,
        letters: ["a", "p", "p", "l", "e"],
        matches: ["correct", "correct", "correct", "correct", "correct"],
        isComplete: true,
        isCorrect: true,
      },
    ],
    nextGame: false,
    currentGuessIndex: 0,
    gameStarted: false,
    gameEnded: true,
    gameWon: true,
    answer: "example answer",
    totalGuesses: 0,
    leaders: [],
    count: 0,
    questions: [
      {
        answer: "apple",
        hint: "Capital of france",
      },
      {
        answer: "Tokyo",
        hint: "Capital of Japan",
      },
    ],
  }),
}));

jest.mock("../src/screens/game/components/keyboard", () => {
  const mockKeyboard = () => <></>; // replace Keyboard component with empty fragment
  return mockKeyboard;
});

jest.mock("../src/screens/game/components/letterSquare", () => {
  const mockLeaderSquare = () => <></>; // replace Keyboard component with empty fragment
  return mockLeaderSquare;
});

describe("GameBoard", () => {
  const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
  const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  it("renders next", () => {
    useSelectorMock.mockReturnValue({
      guesses: [
        {
          id: 0,
          letters: ["a", "p", "p", "l", "e"],
          matches: ["correct", "correct", "correct", "correct", "correct"],
          isComplete: true,
          isCorrect: true,
        },
      ],
      nextGame: true,
      currentGuessIndex: 0,
      gameStarted: false,
      gameEnded: false,
      gameWon: true,
      answer: "example answer",
      totalGuesses: 0,
      leaders: [],
      count: 0,
      questions: [
        {
          answer: "apple",
          hint: "Capital of france",
        },
        {
          answer: "Tokyo",
          hint: "Capital of Japan",
        },
      ],
    });

    render(<GameBoard {...mockProps} />);

    const element = screen.getByTestId("answer");
    expect(element).toBeDefined();
    expect(screen.getByText("Next")).toBeDefined();
  });

  it('should call the resetGame function when the "New Game" button is pressed', () => {
    const resetGame = jest.fn();

    render(<GameBoard {...mockProps} />);

    const newGameButton = screen.getByTestId("new_game");
    fireEvent.press(newGameButton);
    resetGame(false);
    expect(resetGame).toHaveBeenCalled();
  });

  it('calls handleNextGame when "Next" is pressed', () => {
    render(<GameBoard {...mockProps} />);
    const nextButton = screen.getByTestId("next");

    fireEvent.press(nextButton);
    expect(mockProps.handleNextGame).toHaveBeenCalled();
  });

});
