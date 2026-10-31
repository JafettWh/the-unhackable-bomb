import { useState, useEffect, useRef } from 'react';
import { BombContext, BombRules } from '../core/BombContext';
import { BaseModule } from '../modules/BaseModule';
import { BombStatus, StrategyType } from '../types';

function rulesAreEqual(left: BombRules, right: BombRules): boolean {
  return left.initialTimeSeconds === right.initialTimeSeconds
    && left.maxStrikes === right.maxStrikes
    && left.criticalTimeThresholdSeconds === right.criticalTimeThresholdSeconds
    && left.criticalTimeSpeedMultiplier === right.criticalTimeSpeedMultiplier
    && left.strikePenalties.length === right.strikePenalties.length
    && left.strikePenalties.every((penalty, index) =>
      penalty.timePenaltySeconds === right.strikePenalties[index]?.timePenaltySeconds
      && penalty.speedMultiplier === right.strikePenalties[index]?.speedMultiplier
    );
}

export function useBombContext() {
  const bombRef = useRef<BombContext | null>(null);

  if (!bombRef.current) {
    bombRef.current = new BombContext();
  }

  const bomb = bombRef.current;

  const [status, setStatus] = useState<BombStatus>(bomb.getStatus());
  const [remainingSeconds, setRemainingSeconds] = useState<number>(bomb.getRemainingSeconds());
  const [strikes, setStrikes] = useState<number>(bomb.getStrikes());
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(bomb.getSpeedMultiplier());
  const [strategy, setStrategy] = useState<StrategyType>(bomb.getStrategy().type);
  const [modules, setModules] = useState<BaseModule[]>(bomb.getAllModules());
  const [logs, setLogs] = useState(bomb.getLogs());
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(bomb.getIsAdminUnlocked());
  const [isOverrideUnlocked, setIsOverrideUnlocked] = useState<boolean>(bomb.getIsOverrideUnlocked());
  const [rules, setRules] = useState<BombRules>(bomb.getRules());
  const [tickCounter, setTickCounter] = useState<number>(0);

  useEffect(() => {
    // Suscribir listener de cambios
    const unsubscribe = bomb.subscribe(() => {
      setStatus(bomb.getStatus());
      setRemainingSeconds(bomb.getRemainingSeconds());
      setStrikes(bomb.getStrikes());
      setSpeedMultiplier(bomb.getSpeedMultiplier());
      setStrategy(bomb.getStrategy().type);
      setModules([...bomb.getAllModules()]);
      setLogs(bomb.getLogs());
      setIsAdminUnlocked(bomb.getIsAdminUnlocked());
      setIsOverrideUnlocked(bomb.getIsOverrideUnlocked());
      const currentRules = bomb.getRules();
      setRules((previousRules) =>
        rulesAreEqual(previousRules, currentRules) ? previousRules : currentRules
      );
      setTickCounter((prev) => prev + 1);
    });

    return () => {
      unsubscribe();
      bomb.stopTimer();
    };
  }, [bomb]);

  const startBomb = () => {
    bomb.startBomb();
  };

  const reset = (toStandby: boolean = false) => {
    bomb.reset(undefined, !toStandby);
  };

  return {
    bomb,
    status,
    remainingSeconds,
    strikes,
    speedMultiplier,
    strategy,
    modules,
    logs,
    isAdminUnlocked,
    isOverrideUnlocked,
    rules,
    tickCounter,
    startBomb,
    reset,
  };
}
