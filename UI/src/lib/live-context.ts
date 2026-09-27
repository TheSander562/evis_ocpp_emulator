import { createContext, useContext } from 'react';
import type { SessionTick } from './socket';

export type Ticks = Record<string, SessionTick>;

export const LiveContext = createContext<Ticks>({});

export const useTick = (chargePointId: string, connectorId: number) =>
  useContext(LiveContext)[`${chargePointId}:${connectorId}`];
