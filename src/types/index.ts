export type TGuess = {
    id: number;
    letters: string[];
    matches: TMatchingStatus[];
    isComplete: boolean;
    isCorrect: boolean;
}

export type TMactchingUsedKey = {
    [key: string]: TMatchingStatus;
}

export type TLeaderBoard = {
    id: number;
    name: string;
    score: number;
}

export type TQuestions = {
    answer: string;
    hint: string;
}

export type TMatchingStatus = 'correct' | 'present' | 'absent' | '';