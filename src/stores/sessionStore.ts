import { action, makeObservable, observable } from 'mobx';

// Types
import { SessionData } from 'types/game';

class SessionStore {
  @observable
  isLoading: boolean = false;

  @observable
  sessionId: string | null = localStorage.getItem('sessionId');

  constructor() {
    makeObservable(this);
  }

  @action
  updateData = ({ sessionId, ...session }: Partial<SessionData>): void => {
    this.isLoading = true;

    Object.entries(session).forEach(([key, data]) => {
      this[key as keyof SessionData] = data as never;
    });

    this.isLoading = false;

    if (typeof sessionId !== 'undefined') {
      this.setSessionId(sessionId);
    }
  };

  @action
  setSessionId = (sessionId?: string | null | undefined): void => {
    this.sessionId = sessionId || null;

    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    } else {
      this.clearGame();
    }
  };

  @action
  setGameId = (gameId?: string | null | undefined): void => {
    this.gameId = gameId || null;
  };

  @action
  setTeamName = (teamName?: string | null | undefined): void => {
    this.teamName = teamName || null;

    if (teamName) {
      localStorage.setItem('teamName', teamName);
    } else {
      localStorage.removeItem('teamName');
    }
  };

  @action
  setTeamPoints = (
    teamName: string,
    points: number,
    themeIndex?: number
  ): void => {
    if (this.teamNameAnswers && typeof themeIndex !== undefined) {
      if (themeIndex && themeIndex >= 0) {
        this.teamNameAnswers.themes[themeIndex][teamName].points = points;
      }

      if (themeIndex && themeIndex < 0) {
        this.teamNameAnswers.blitz[teamName].points = points;
      }
    }
  };

  @action
  setCorrectAnswer = (
    teamName: string,
    questionId: number,
    isRightAnswer: boolean,
    isBlitz: boolean,
    points: number,
    themeIndex?: number
  ): void => {
    if (this.teamNameAnswers) {
      const index = (
        isBlitz
          ? this.teamNameAnswers.blitz
          : this.teamNameAnswers.themes[themeIndex || 0]
      )[teamName].answers.findIndex(
        (question) => question.questionId === questionId
      );

      (isBlitz
        ? this.teamNameAnswers.blitz
        : this.teamNameAnswers.themes[themeIndex || 0])[teamName].answers[
        index
      ].isAnswerRight = isRightAnswer;

      (isBlitz
        ? this.teamNameAnswers.blitz
        : this.teamNameAnswers.themes[themeIndex || 0])[teamName].points =
        points;
    }
  };

  @action
  setQuestionStep = (isQuestionStep: boolean) => {
    this.isLocalQuestionStep = isQuestionStep;
  };

  @action
  setIsAnswerDataUpdated = (isAnswerDataUpdated: boolean) => {
    this.isAnswerDataUpdated = isAnswerDataUpdated;
  };

  @action
  clearGame = () => {
    localStorage.removeItem('sessionId');

    this.gameId = null;
    this.sessionId = null;
  };

  @action
  reset = (): void => {
    this.setSessionId();
  };
}

const sessionStore = new SessionStore();

export default sessionStore;
