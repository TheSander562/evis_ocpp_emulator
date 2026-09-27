import { createContext } from 'react';
import type { SessionTick } from './socket';

export type Ticks = Record<string, SessionTick>;

export const LiveContext = createContext<Ticks>({});
