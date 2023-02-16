import { useAppSelector } from "../../../hooks/storeHooks";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, LogBox } from "react-native";
import { SIZE, HEIGHT, colors } from "../../../utils/constants";
import LetterSquare from "./letterSquare";
import Keyboard from "./keyboard";

interface IGameBoardProps {
  answer: string;
  handleGuess: (keyPressed: string) => void;
  resetGame: (start: boolean) => void;
  handleNextGame: () => void
}

const GameBoard = ({ answer, handleGuess, resetGame, handleNextGame }: IGameBoardProps) => {
  const { guesses, gameEnded, questions, nextGame, gameWon } =
    useAppSelector((state) => state.wordGameState);

    console.log('questions:', questions);

    
  return (
    <View style={styles.board}>
      <View style={styles.blocksContainer}>
        {guesses.map((guess, idx) => (
          <View key="view">
            <View key={idx} style={styles.squareBlock}>
              {guess.letters.map((letter, idx) => {
                return (
                  <LetterSquare
                    key={idx}
                    idx={idx}
                    letter={letter}
                    guess={guess}
                  />
                );
              })}
            </View>
            <Text style={styles.questionText}>
              {questions[guess.id].hint}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.gameResult}>
        {nextGame && !gameEnded && (
          <>
            <Text testID="answer" style={styles.solutionText}>Answer: {answer}</Text>         
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => handleNextGame()}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
              <Text testID="next" style={styles.resetButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {gameEnded && gameWon && (
          <View style={styles.resultContainer}>
            <Text testID="game_won_message" style={styles.resultText}>Congratulations! You've won.</Text>   
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => resetGame(false)}
            >
              <Text testID="new_game" style={styles.resetButtonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        )}
        {gameEnded && !gameWon && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Sorry! You've lose.</Text>   
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => resetGame(false)}
            >
              <Text testID="new_game" style={styles.resetButtonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Keyboard handleGuess={handleGuess} />
    </View>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
  board: {
    width: SIZE,
    height: HEIGHT,
    // backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 2
  },
  squareBlock: {
    width: SIZE * 0.9,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  blocksContainer: {
    width: SIZE * 0.9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  gameResult: {
    width: SIZE,
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  resultContainer: {
    flexDirection: 'column',
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  resetButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 170,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#404040",
  },
  resultText: {
    fontSize: 16,
    color: colors.bg,
    textTransform: "uppercase",
    flex: 2,
    paddingBottom: 30
  },
  resetButtonText: {
    fontSize: 20,
    color: colors.white,
  },
  solutionText: {
    fontSize: 16,
    color: colors.bg,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 16,
    color: colors.bg,
    textTransform: "uppercase",
    marginLeft: 15,
  }
});
