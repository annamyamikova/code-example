import dayjs from 'dayjs';
import React, { FC, useState, useEffect, useRef } from 'react';

interface IProps {
  seconds: number;
  timerEndTime: string | null;
  timerPausedTime: string | null;
  isTimerFinished: boolean;
  setSeconds?: (value: number | ((prevVal: number) => number)) => void;
}

const Timer: FC<IProps> = ({
  seconds: defaultSeconds,
  timerEndTime,
  timerPausedTime,
  isTimerFinished,
  setSeconds,
}) => {
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(defaultSeconds);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerFinished) {
      setRemainingSeconds(0);
    }

    if (timerPausedTime) {
      setRemainingSeconds(
        Math.max(
          0,
          dayjs(timerEndTime).diff(timerPausedTime || dayjs(), 'seconds')
        )
      );
    }

    if (
      timerEndTime &&
      dayjs(timerEndTime).diff(dayjs(), 'seconds') > 0 &&
      !timerPausedTime &&
      !isTimerFinished
    ) {
      const calculateTime = () => {
        const seconds = dayjs(timerEndTime).diff(dayjs(), 'seconds');

        if (typeof setSeconds === 'function') {
          setSeconds(Math.max(seconds, 0));
        }

        if (seconds <= 0) {
          if (interval.current) {
            clearInterval(interval.current);
          }

          return;
        }

        setRemainingSeconds(seconds);
      };

      calculateTime();

      interval.current = setInterval(calculateTime, 1000);
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [timerEndTime, timerPausedTime, isTimerFinished]);

  return <span>{remainingSeconds}</span>;
};

export default Timer;
