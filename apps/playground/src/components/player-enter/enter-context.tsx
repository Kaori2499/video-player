import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import type { PlayerPageEnterDialValues } from "./dialkit";
import { playerEnterRowStyle, playerEnterTotalDurationMs } from "./enter-style";

type PlayerEnterContextValue = {
  values: PlayerPageEnterDialValues;
  epoch: number;
  enterDone: boolean;
};

const PlayerEnterContext = createContext<PlayerEnterContextValue | null>(null);

export function PlayerEnterProvider({
  values,
  epoch,
  children,
}: {
  values: PlayerPageEnterDialValues;
  epoch: number;
  children: ReactNode;
}) {
  const [enterDone, setEnterDone] = useState(!values.enabled);

  useEffect(() => {
    if (!values.enabled) {
      setEnterDone(true);
      return;
    }

    setEnterDone(false);
    const totalMs = playerEnterTotalDurationMs(
      values.staggerMs,
      values.durationMs,
    );
    const timeoutId = window.setTimeout(() => setEnterDone(true), totalMs);
    return () => window.clearTimeout(timeoutId);
  }, [epoch, values.durationMs, values.enabled, values.staggerMs]);

  return (
    <PlayerEnterContext.Provider value={{ values, epoch, enterDone }}>
      {children}
    </PlayerEnterContext.Provider>
  );
}

export function PlayerEnterRow({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(PlayerEnterContext);
  if (!context) {
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return children;
  }

  const { values, epoch, enterDone } = context;
  const skip = !values.enabled || enterDone;
  const [visible, setVisible] = useState(skip);

  useLayoutEffect(() => {
    if (skip) {
      setVisible(true);
      return;
    }

    setVisible(false);
    let frameA = 0;
    let frameB = 0;
    frameA = requestAnimationFrame(() => {
      frameB = requestAnimationFrame(() => setVisible(true));
    });

    return () => {
      cancelAnimationFrame(frameA);
      cancelAnimationFrame(frameB);
    };
  }, [skip, epoch, index]);

  if (skip) {
    if (className) {
      return <div className={className}>{children}</div>;
    }
    return children;
  }

  const delayMs = index * values.staggerMs;

  return (
    <div
      className={className}
      style={playerEnterRowStyle(
        visible,
        values.durationMs,
        delayMs,
        values.maxBlurPx,
        values.translateYRem,
      )}
    >
      {children}
    </div>
  );
}
