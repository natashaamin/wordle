import { TGuess } from "../../../types";
import React, { useEffect } from "react";
import { StyleSheet, Vibration, Text } from "react-native";
import { useAppSelector } from "../../../hooks/storeHooks";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { colors, SIZE } from "../../../utils/constants";

interface ILetterSquareProps {
  guess: TGuess;
  letter: string;
  idx: number;
}

const LetterSquare = ({ guess, letter, idx }: ILetterSquareProps) => {
  const { currentGuessIndex, wrongGuessShake } = useAppSelector(
    (state) => state.wordGameState
  );

  const scale = useSharedValue(1);
  const rotateDegree = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const matchStatus = guess.matches[idx];

  function matchColor() {
    "worklet";
    switch (matchStatus) {
      case "correct":
        return colors.correct;
      case "present":
        return colors.present;
      case "absent":
        return colors.absent;
      case "":
        return colors.keyDefault;
      default:
        return colors.keyDefault;
    }
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateY: `${rotateDegree.value}deg` },
        { translateX: shakeX.value },
      ],
    };
  });

  useEffect(() => {
    if (letter !== "" && matchStatus === "") {
      scale.value = withTiming(1.2, {
        duration: 50,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      scale.value = withDelay(50, withTiming(1));
    }
    if (matchStatus !== "") {
      rotateDegree.value = withDelay(
        250 * idx,
        withTiming(90, {
          duration: 250,
        })
      );
      rotateDegree.value = withDelay(
        250 * (idx + 1),
        withTiming(0, {
          duration: 250,
        })
      );
    }
  }, [letter, matchStatus]);

  useEffect(() => {
    if (wrongGuessShake && currentGuessIndex === guess.id) {
      for (let i = 1; i < 6; i++) {
        shakeX.value = withDelay(
          10 * i,
          withTiming(-5, {
            duration: 15,
            easing: Easing.linear,
          })
        );
        shakeX.value = withDelay(
          20 * i,
          withTiming(6, {
            duration: 30,
            easing: Easing.linear,
          })
        );
        shakeX.value = withDelay(
          30 * i,
          withTiming(-8, {
            duration: 45,
            easing: Easing.linear,
          })
        );
        shakeX.value = withDelay(
          40 * i,
          withTiming(0, {
            duration: 60,
            easing: Easing.linear,
          })
        );
      }
    }
  }, [wrongGuessShake]);

  return (
    <Animated.View
      key={idx}
      style={[
        {
          ...styles.square,
          backgroundColor: matchColor(),
          borderWidth: guess.isComplete ? 0 : 1,
        },
        animatedStyles,
      ]}
    >
      <Text
        style={{
          ...styles.letter,
          color: colors.white,
        }}
      >
        {letter}
      </Text>
    </Animated.View>
  );
};
export default LetterSquare;

const styles = StyleSheet.create({
  square: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: SIZE / 6.5,
    height: SIZE / 6.5,
    borderRadius: 10,
  },
  letter: {
    fontSize: SIZE / 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
