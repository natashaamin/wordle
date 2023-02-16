import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import {
  setAnswer,
  setCount,
  setCurrentGuessIndex,
  setGameEnded,
  setGameStarted,
  setGameWon,
  setGuesses,
  setLeaders,
  setNextGame,
  setTotalGuesses,
  setUsedKeys,
  setUserOption,
  setWrongGuessShake,
} from "../../store/slices/wordGameSlice";
import { TGuess, TLeaderBoard, TMatchingStatus } from "../../types";
import { colors, HEIGHT, initialGuesses, SIZE } from "../../utils/constants";
import { Cities, Food, Animals } from "../../puzzles";
import GameBoard from "./components/gameBoard";
import AnimatedLottieView from "lottie-react-native";
import { Formik } from "formik";
import * as yup from "yup";

const HomeScreen = () => {
  const {
    guesses,
    nextGame,
    currentGuessIndex,
    gameStarted,
    gameEnded,
    gameWon,
    answer,
    totalGuesses,
    leaders,
    count
  } = useAppSelector((state) => state.wordGameState);
  const [option, setOption] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showLottie, setShowLottie] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const lottieRef = useRef<AnimatedLottieView>(null);

  const usernameValidationScheme = yup.object().shape({
    username: yup.string().required("Required"),
  });

  const answers = (id: any): string => {
    switch (option.toLowerCase()) {
      case "city":
        return Cities[id].answer;
      case "food":
        return Food[id].answer;
      default:
        return Animals[id].answer;
    }
  };

  const checkGameEnd = () => {
    const attempsCount = totalGuesses.filter((guess: TGuess) => {
      return guess.isComplete;
    }).length;

    const attemptsCorrect = totalGuesses.filter((guess: TGuess) => {
      return guess.isCorrect;
    }).length;

    if (attempsCount === 2 && attemptsCorrect == 2) {
      setShowLottie(true);
      dispatch(setGameEnded(true));
      dispatch(setGameWon(true));
      dispatch(setNextGame(false))
      dispatch(setLeaders({
        id: count,
         name: username,
        score: 100
      }));
    } else if (attempsCount === 2 && attemptsCorrect == 1) {
      dispatch(setGameEnded(true));
      dispatch(setNextGame(false))
      let newUpdate = {
        id: count,
        name: username,
        score: 50
      }
      dispatch(setLeaders(newUpdate));
    } else if (attempsCount === 2 && attemptsCorrect == 0) {
      dispatch(setGameEnded(true));
      dispatch(setNextGame(false))

      let newUpdate = {
        id: count,
        name: username,
        score: 0
      }
      dispatch(setLeaders(newUpdate));
    }
  };

  useEffect(() => {
    checkGameEnd();
  }, [nextGame]);

  useEffect(() => {
    const timer = setTimeout(() => {
      lottieRef.current?.play();
    }, 50);

    return () => {
      clearTimeout(timer);
      setShowLottie(false)
    };
  }, [showLottie]);


  const updateGuess = (keyPressed: string, currentGuess: TGuess) => {
    const currentGuessLetters = [...currentGuess.letters];
    let nextEmptyIndex = currentGuessLetters.findIndex(
      (letter) => letter === ""
    );

    if (nextEmptyIndex === -1) nextEmptyIndex = 5;
    const lastNonEmptyIndex = nextEmptyIndex - 1;
    if (keyPressed !== "<" && keyPressed !== "Enter" && nextEmptyIndex < 5) {
      currentGuessLetters[nextEmptyIndex] = keyPressed;
      const updatedGuess = { ...currentGuess, letters: currentGuessLetters };
      const updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess;
        else return guess;
      });
      dispatch(setGuesses([...updatedGuesses]));
    } else if (keyPressed === "<") {
      currentGuessLetters[lastNonEmptyIndex] = "";
      const updatedGuess = { ...currentGuess, letters: currentGuessLetters };
      const updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess;
        else return guess;
      });
      dispatch(setGuesses([...updatedGuesses]));
    }
  };

  const checkGuess = (currentGuess: TGuess) => {
    const currentGuessedWord = currentGuess.letters.join("");

    if (currentGuessedWord.length === 5) {
      if (currentGuessedWord.toLowerCase() === answer.toLowerCase()) {
        const matches: TMatchingStatus[] = [
          "correct",
          "correct",
          "correct",
          "correct",
          "correct",
        ];
        const updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: true,
        };
        const updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess;
          else return guess;
        });
        dispatch(setGuesses(updatedGuesses));
        setTimeout(() => {
          dispatch(setNextGame(true));
        }, 250 * 6);
      } else {
        const matches: TMatchingStatus[] = [
          "",
          "",
          "",
          "",
          "",
        ];
        const updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: false,
        };
        const updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess;
          else return guess;
        });
        dispatch(setGuesses(updatedGuesses));
        setTimeout(() => {
          dispatch(setNextGame(true));
        }, 250 * 6);


      }
    }
  };

  const handleGuess = (keyPressed: string) => {
    if (!gameEnded) {
      const currentGuess = guesses[currentGuessIndex];
      if (currentGuess) {
        if (keyPressed !== "Enter" && !currentGuess.isComplete) {
          updateGuess(keyPressed, currentGuess);
        } else if (keyPressed === "Enter" && !gameWon) {
          checkGuess(currentGuess);
        }
      }
    }
  };

  const resetGameState = () => {
    dispatch(setGuesses([...initialGuesses]));
  };

  const resetGame = (start: boolean) => {
    dispatch(setUserOption(option.toLowerCase()));
    dispatch(setGameStarted(start));
    resetGameState();
    dispatch(setTotalGuesses([]))
    dispatch(setCurrentGuessIndex(0));
    dispatch(setUsedKeys([]));
    dispatch(setGameWon(false));
    dispatch(setGameEnded(false));
    dispatch(setAnswer(answers(0)));
    gameEnded && dispatch(setCount(count + 1))
  };

  const handleNextGame = () => {
    lottieRef.current?.pause();
    dispatch(setNextGame(false));
    let nextGameGuesses = [
      {
        id: currentGuessIndex + 1,
        letters: ["", "", "", "", ""],
        matches: ["", "", "", "", ""],
        isComplete: false,
        isCorrect: false,
      },
    ];
    dispatch(setGuesses(nextGameGuesses));
    dispatch(setAnswer(answers(currentGuessIndex + 1)));
  };

  if (!gameStarted)
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Formik
          initialValues={{ username: "" }}
          onSubmit={(values) => {
            setUsername(values.username)
            dispatch(
              setLeaders({
                id: count,
                name: values.username,
                 score: 0,
              })
            );
            resetGame(true);
          }}
          validationSchema={usernameValidationScheme}
        >
          {({ handleSubmit, handleChange, handleBlur, errors, values }) => (
            <>
              <View style={styles.centerView}>
                {["City", "Food", "Animal"].map((item, index) => (
                  <>
                    <Pressable
                      key={`${index.toString()}`}
                      style={
                        item === option ? styles.selectedButton : styles.button
                      }
                      onPress={() => setOption(item)}
                    >
                      <Text style={styles.option} key={`text_${index.toString()}`}> {item}</Text>
                    </Pressable>
                  </>
                ))}

                <TextInput
                  onBlur={handleBlur("username")}
                  onChangeText={handleChange("username")}
                  style={styles.textInput}
                  placeholder="Enter your username"
                  value={values.username}
                />
                <TouchableOpacity onPress={() => handleSubmit()}>
                  <Text style={styles.newGameButton}>Start a new game</Text>
                </TouchableOpacity>
                <Text style={styles.error}>{errors.username}</Text>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );

  return (
    <View style={{ position: "relative" }}>
      <GameBoard
        answer={answer}
        handleGuess={handleGuess}
        resetGame={resetGame}
        handleNextGame={handleNextGame}
      />
      {showLottie && (
        <AnimatedLottieView
          ref={lottieRef}
          style={styles.lottieContainer}
          source={require("../../lottie/confetti.json")}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
    width: "100%",
  },
  lottieContainer: {
    width: SIZE,
    height: HEIGHT * 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: "absolute",
    zIndex: 1,
    top: 20,
  },
  centerView: {
    width: "80%",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 40,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  selectedButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 40,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  option: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  textInput: {
    width: 250,
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.white,
    color: colors.white,
    padding: 2,
  },
  newGameButton: {
    backgroundColor: "lightgreen",
    borderRadius: 15,
    marginTop: 25,
    padding: 10,
    alignItems: "center",
  },
  error: {
    color: "red",
    alignSelf: "center",
  },
});
