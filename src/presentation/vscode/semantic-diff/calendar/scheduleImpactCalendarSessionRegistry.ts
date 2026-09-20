import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import type { ScheduleImpactCalendarSessionId } from "./scheduleImpactCalendarTransport";

export type ScheduleImpactCalendarDisplayLanguage = "en" | "ja";

export const normalizeScheduleImpactCalendarLanguage = (
  language: string | undefined,
): ScheduleImpactCalendarDisplayLanguage => {
  const normalized = (language ?? "").toLowerCase();
  if (normalized === "ja" || normalized.startsWith("ja-")) return "ja";
  return "en";
};

export type ScheduleImpactCalendarSession = Readonly<{
  calendarSessionId: ScheduleImpactCalendarSessionId;
  parentSessionId: string;
  actionId: string;
  context: SemanticDiffOutputContext;
  sidecar: SemanticDiffScheduleImpact;
  displayLanguage: ScheduleImpactCalendarDisplayLanguage;
  epoch: number;
  latestRequestId: number;
  disposed: boolean;
}>;

export type ScheduleImpactCalendarSessionHandle = Readonly<{
  calendarSessionId: ScheduleImpactCalendarSessionId;
  sessionId: ScheduleImpactCalendarSessionId;
  parentSessionId: string;
  actionId: string;
  epoch: number;
  context: SemanticDiffOutputContext;
  sidecar: SemanticDiffScheduleImpact;
  displayLanguage: ScheduleImpactCalendarDisplayLanguage;
  reveal(): void;
  dispose(): void;
}>;

export type ScheduleImpactCalendarSessionRegistryDeps = Readonly<{
  sessionIdAllocator?: () => ScheduleImpactCalendarSessionId | string;
  actionIdAllocator?: () => string;
}>;

export type OpenScheduleImpactCalendarSessionInput = Readonly<{
  parentSessionId: string;
  context: SemanticDiffOutputContext;
  sidecar: SemanticDiffScheduleImpact;
  displayLanguage?: string;
  reveal?: () => void;
}>;

type OpenSessionArguments =
  | [input: OpenScheduleImpactCalendarSessionInput]
  | [
      parentSessionId: string,
      context: SemanticDiffOutputContext,
      sidecar: SemanticDiffScheduleImpact,
      displayLanguage?: string,
      reveal?: () => void,
    ];

const sessionPrefix = "sdc-calendar-session-";
const actionPrefix = "sdc-calendar-action-";

const defaultAllocator = (prefix: string): (() => string) => {
  let sequence = 1;
  return () => `${prefix}${sequence++}`;
};

const defaultSessionIdAllocator = defaultAllocator(sessionPrefix);
const defaultActionIdAllocator = defaultAllocator(actionPrefix);

const normalizeOpenSessionInput = (
  args: OpenSessionArguments,
): OpenScheduleImpactCalendarSessionInput => {
  const [inputOrParent, context, sidecar, displayLanguage, reveal] = args;
  return typeof inputOrParent === "string"
    ? {
        parentSessionId: inputOrParent,
        context: context as SemanticDiffOutputContext,
        sidecar: sidecar as SemanticDiffScheduleImpact,
        displayLanguage,
        reveal,
      }
    : inputOrParent;
};

const createSession = (
  input: OpenScheduleImpactCalendarSessionInput,
  allocateSessionId: () => string,
  allocateActionId: () => string,
): MutableSession => ({
  calendarSessionId: allocateSessionId() as ScheduleImpactCalendarSessionId,
  parentSessionId: input.parentSessionId,
  actionId: allocateActionId(),
  context: input.context,
  sidecar: input.sidecar,
  displayLanguage: normalizeScheduleImpactCalendarLanguage(
    input.displayLanguage,
  ),
  epoch: 1,
  latestRequestId: 0,
  disposed: false,
  reveal: input.reveal ?? (() => undefined),
});

const hasLiveSession = (
  session: MutableSession | undefined,
): session is MutableSession => Boolean(session) && !session.disposed;

const hasMatchingEpoch = (
  session: MutableSession,
  epoch: number | undefined,
): boolean => epoch === undefined || session.epoch === epoch;

const hasNewRequest = (session: MutableSession, requestId: number): boolean =>
  Number.isSafeInteger(requestId) && requestId > session.latestRequestId;

const canAcceptRequest = (
  session: MutableSession | undefined,
  requestId: number,
  epoch: number | undefined,
): session is MutableSession =>
  hasLiveSession(session) &&
  hasMatchingEpoch(session, epoch) &&
  hasNewRequest(session, requestId);

export class ScheduleImpactCalendarSessionRegistry {
  private readonly sessions = new Map<
    ScheduleImpactCalendarSessionId,
    MutableSession
  >();
  private readonly parentSessions = new Map<
    string,
    ScheduleImpactCalendarSessionId
  >();
  private readonly allocateSessionId: () => string;
  private readonly allocateActionId: () => string;

  public constructor(deps: ScheduleImpactCalendarSessionRegistryDeps = {}) {
    this.allocateSessionId =
      deps.sessionIdAllocator ?? defaultSessionIdAllocator;
    this.allocateActionId = deps.actionIdAllocator ?? defaultActionIdAllocator;
  }

  public get size(): number {
    return this.sessions.size;
  }

  public open(
    input: OpenScheduleImpactCalendarSessionInput,
  ): ScheduleImpactCalendarSessionHandle;
  public open(
    parentSessionId: string,
    context: SemanticDiffOutputContext,
    sidecar: SemanticDiffScheduleImpact,
    displayLanguage?: string,
    reveal?: () => void,
  ): ScheduleImpactCalendarSessionHandle;
  public open(
    ...args: OpenSessionArguments
  ): ScheduleImpactCalendarSessionHandle {
    const input = normalizeOpenSessionInput(args);
    const currentId = this.parentSessions.get(input.parentSessionId);
    const current = currentId ? this.sessions.get(currentId) : undefined;
    if (current && !current.disposed) {
      current.reveal = input.reveal ?? current.reveal;
      current.reveal();
      return this.toHandle(current);
    }
    if (currentId) this.remove(currentId);

    const session = createSession(
      input,
      this.allocateSessionId,
      this.allocateActionId,
    );
    const sessionId = session.calendarSessionId;
    this.sessions.set(sessionId, session);
    this.parentSessions.set(input.parentSessionId, sessionId);
    return this.toHandle(session);
  }

  public resolve(
    sessionId: ScheduleImpactCalendarSessionId | string,
  ): ScheduleImpactCalendarSession | undefined {
    const session = this.sessions.get(
      sessionId as ScheduleImpactCalendarSessionId,
    );
    return session && !session.disposed ? this.snapshot(session) : undefined;
  }

  public resolveForParent(
    parentSessionId: string,
  ): ScheduleImpactCalendarSession | undefined {
    const id = this.parentSessions.get(parentSessionId);
    return id ? this.resolve(id) : undefined;
  }

  public isCurrent(
    sessionId: ScheduleImpactCalendarSessionId | string,
    epoch: number,
  ): boolean {
    const session = this.sessions.get(
      sessionId as ScheduleImpactCalendarSessionId,
    );
    return (
      session !== undefined && !session.disposed && session.epoch === epoch
    );
  }

  public acceptRequest(
    sessionId: ScheduleImpactCalendarSessionId | string,
    requestId: number,
    epoch?: number,
  ): boolean {
    const session = this.sessions.get(
      sessionId as ScheduleImpactCalendarSessionId,
    );
    if (!canAcceptRequest(session, requestId, epoch)) return false;
    session.latestRequestId = requestId;
    return true;
  }

  public close(
    sessionId: ScheduleImpactCalendarSessionId | string,
    expectedEpoch?: number,
  ): boolean {
    const session = this.sessions.get(
      sessionId as ScheduleImpactCalendarSessionId,
    );
    if (
      !session ||
      session.disposed ||
      (expectedEpoch !== undefined && session.epoch !== expectedEpoch)
    ) {
      return false;
    }
    const childDisposer = session.childDisposer;
    session.childDisposer = undefined;
    session.disposed = true;
    session.epoch += 1;
    this.remove(session.calendarSessionId);
    childDisposer?.();
    return true;
  }

  public registerChildDisposer(
    sessionId: ScheduleImpactCalendarSessionId | string,
    disposer: () => void,
  ): boolean {
    const session = this.sessions.get(
      sessionId as ScheduleImpactCalendarSessionId,
    );
    if (!session || session.disposed || session.childDisposer) return false;
    session.childDisposer = disposer;
    return true;
  }

  public releaseParent(parentSessionId: string): number {
    const id = this.parentSessions.get(parentSessionId);
    if (!id) return 0;
    const session = this.sessions.get(id);
    if (!session) {
      this.parentSessions.delete(parentSessionId);
      return 0;
    }
    const childDisposer = session.childDisposer;
    session.childDisposer = undefined;
    session.disposed = true;
    session.epoch += 1;
    this.remove(id);
    childDisposer?.();
    return 1;
  }

  public clear(): void {
    const childDisposers: (() => void)[] = [];
    for (const session of this.sessions.values()) {
      if (session.childDisposer) childDisposers.push(session.childDisposer);
      session.childDisposer = undefined;
      session.disposed = true;
      session.epoch += 1;
    }
    this.sessions.clear();
    this.parentSessions.clear();
    childDisposers.forEach((disposer) => disposer());
  }

  private remove(sessionId: ScheduleImpactCalendarSessionId): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    this.sessions.delete(sessionId);
    if (this.parentSessions.get(session.parentSessionId) === sessionId) {
      this.parentSessions.delete(session.parentSessionId);
    }
  }

  private snapshot(session: MutableSession): ScheduleImpactCalendarSession {
    return {
      calendarSessionId: session.calendarSessionId,
      parentSessionId: session.parentSessionId,
      actionId: session.actionId,
      context: session.context,
      sidecar: session.sidecar,
      displayLanguage: session.displayLanguage,
      epoch: session.epoch,
      latestRequestId: session.latestRequestId,
      disposed: session.disposed,
    };
  }

  private toHandle(
    session: MutableSession,
  ): ScheduleImpactCalendarSessionHandle {
    const close = (): void => {
      this.close(session.calendarSessionId, session.epoch);
    };
    return {
      calendarSessionId: session.calendarSessionId,
      sessionId: session.calendarSessionId,
      parentSessionId: session.parentSessionId,
      actionId: session.actionId,
      epoch: session.epoch,
      context: session.context,
      sidecar: session.sidecar,
      displayLanguage: session.displayLanguage,
      reveal: () => session.reveal(),
      dispose: close,
    };
  }
}

type MutableSession = {
  calendarSessionId: ScheduleImpactCalendarSessionId;
  parentSessionId: string;
  actionId: string;
  context: SemanticDiffOutputContext;
  sidecar: SemanticDiffScheduleImpact;
  displayLanguage: ScheduleImpactCalendarDisplayLanguage;
  epoch: number;
  latestRequestId: number;
  disposed: boolean;
  reveal: () => void;
  childDisposer?: () => void;
};

export const createScheduleImpactCalendarSessionRegistry = (
  deps: ScheduleImpactCalendarSessionRegistryDeps = {},
): ScheduleImpactCalendarSessionRegistry =>
  new ScheduleImpactCalendarSessionRegistry(deps);
