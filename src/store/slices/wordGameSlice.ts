import { createAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Animals, Cities, Food } from "../../puzzles";
import { TGuess, TLeaderBoard, TMactchingUsedKey, TQuestions } from "../../types";
import { initialGuesses, initialLeaderBoard } from "../../utils/constants";

interface IGameState {
  answer: string;
  guesses: TGuess[];
  currentGuessIndex: number;
  usedKeys: TMactchingUsedKey;
  gameStarted: boolean;
  gameEnded: boolean;
  gameWon: boolean;
  nextGame: boolean;
  wrongGuessShake: boolean;
  leaders: TLeaderBoard[];
  questions: TQuestions[];
  totalGuesses: any[];
  count: number;
}

const initialState: IGameState = {
  answer: "",
  guesses: [...initialGuesses],
  currentGuessIndex: 0,
  usedKeys: {},
  gameStarted: false,
  gameEnded: false,
  gameWon: false,
  nextGame: false,
  wrongGuessShake: false,
  leaders: [],
  questions: [],
  totalGuesses: [],
  count: 0
};

export const wordGameStateSlice = createSlice({
  name: "wordGameState",
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      state.answer = action.payload;
    },
    setGuesses: (state, action) => {
      state.guesses = action.payload;
      state.totalGuesses.push(...state.guesses)
    },
    setTotalGuesses: (state, action) => {
      state.totalGuesses = action.payload
    },
    setCurrentGuessIndex: (state, action) => {
      state.currentGuessIndex = action.payload;
    },
    setUsedKeys: (state, action) => {
      state.usedKeys = action.payload;
    },
    setGameStarted: (state, action) => {
      state.gameStarted = action.payload;
    },
    setGameEnded: (state, action) => {
      state.gameEnded = action.payload;
    },
    setGameWon: (state, action) => {
      state.gameWon = action.payload;
    },
    setNextGame: (state, action) => {
      state.nextGame = action.payload;
    },
    setWrongGuessShake: (state, action) => {
      state.wrongGuessShake = action.payload;
    },
    setLeaders: (state, action) => {
      const x =  state.leaders.map((item, index) => {
        console.warn(item, "---item")
        console.warn(action.payload, "---payload")
        if (item.id === state.count) {
          for (let index = 0; index < state.leaders.length; index++) {
            if(item.id == state.leaders[index].id)
            {
              state.leaders[index].score = action.payload.score;
            }
            
          }
          
         // return allData;
        }
        //return item;
      });

      console.warn(x, "---what")
      state.leaders.push(action.payload)
    },
    setCount: (state, action) => {
      state.count = action.payload
    },
    setUserOption: (state, action) => {
      const option = action.payload;
      switch (option) {
        case 'city':
          state.questions = Cities
          break;
        case 'food': 
          state.questions = Food;
          break;
        case 'animal':
          state.questions = Animals
          break;
        default:
          break;
      }
    }
  },
});



export const {
  setAnswer,
  setGuesses,
  setCurrentGuessIndex,
  setUsedKeys,
  setGameStarted,
  setGameEnded,
  setGameWon,
  setWrongGuessShake,
  setLeaders,
  setUserOption,
  setNextGame,
  setTotalGuesses,
  setCount
} = wordGameStateSlice.actions;

export const wordGameState = (state: RootState) => state.wordGameState;

export default wordGameStateSlice.reducer;
