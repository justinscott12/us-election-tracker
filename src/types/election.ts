/** Map state fill: undecided | dem | rep | demLead | repLead | split | highlight */
export type StateFill =
  | "undecided"
  | "dem"
  | "rep"
  | "demLead"
  | "repLead"
  | "split"
  | "highlight";

/** State code (e.g. FL, TX) -> fill for the map */
export type StateMap = Record<string, StateFill>;

export type TabId = "notable-races" | "state-of-nation";

/** Office category for filtering notable races and state-of-nation sections */
export type OfficeTabId = "presidential" | "governor" | "congress";

/** Per-state percentage results (demPct + repPct typically sum to &lt; 100 due to others) */
export interface StateResult {
  demPct: number;
  repPct: number;
  /** Raw vote count for Dem candidate in this state (optional) */
  demVotes?: number;
  /** Raw vote count for Rep candidate in this state (optional) */
  repVotes?: number;
  /** Call status for this state (optional; when absent, no status shown) */
  status?: RaceStatus;
  /** Estimated share of votes counted (0–100) for this state */
  votesCountedPct?: number;
}

export interface PresidentialResult {
  demName: string;
  repName: string;
  /** Optional image URL for Dem candidate (shown next to name in State of Nation) */
  demImageUrl?: string;
  /** Optional image URL for Rep candidate (shown next to name in State of Nation) */
  repImageUrl?: string;
  demEV: number;
  repEV: number;
  /** National popular vote count (Dem candidate) */
  demPopularVote?: number;
  /** National popular vote count (Rep candidate) */
  repPopularVote?: number;
  /** Total popular vote (all candidates); when set, % shown is share of total so dem % + rep % &lt; 100% */
  totalPopularVote?: number;
  /** State code -> fill for map */
  stateFills: StateMap;
  /** State code -> vote percentages for clickable map popup */
  stateResults?: Record<string, StateResult>;
  lastUpdated?: string;
}

export interface GovernorRace {
  state: string;
  stateCode: string;
  winner?: string;
  party?: "D" | "R";
  status: "upcoming" | "too-early" | "too-close" | "called";
  note?: string;
}

export interface CongressSummary {
  senateDem: number;
  senateRep: number;
  senateInd?: number;
  houseDem: number;
  houseRep: number;
  lastUpdated?: string;
}

export interface StateOfNation {
  presidential: PresidentialResult;
  governors: GovernorRace[];
  congress: CongressSummary;
}

/** Race call status */
export type RaceStatus = "too-early" | "too-close" | "runoff" | "called" | "final";

export interface NotableRaceResult {
  name: string;
  party?: string;
  pct?: number;
  votes?: number;
  ev?: number;
  winner?: boolean;
}

export interface NotableRace {
  id: string;
  title: string;
  date: string;
  type: "primary" | "general" | "special";
  /** Office category for tab filtering: presidential, governor, or congress */
  office?: OfficeTabId;
  state?: string;
  /** Two-letter state code (e.g. SC) for map highlight; derived from state if omitted */
  stateCode?: string;
  /** Why this race matters / what to watch (shown when race is opened) */
  significance?: string;
  /** Call status: too early to call, too close, called, or final */
  status?: RaceStatus;
  /** Estimated share of votes counted (0–100) */
  votesCountedPct?: number;
  /** Candidate results; winner should have winner: true for checkmark */
  results?: NotableRaceResult[];
  /** ISO timestamp when this race was last updated (set by PATCH); shown as "Updated 3:45 PM" */
  lastUpdated?: string;
}

export interface ElectionData {
  /** Which tab to show by default (e.g. "notable-races" during primaries, "state-of-nation" on election night) */
  defaultTab: TabId;
  /** When true, show the Live Results link in the nav (e.g. on election day or close to it) */
  showLiveResults?: boolean;
  stateOfNation: StateOfNation;
  notableRaces: NotableRace[];
}

/** One notable race result update per request. Only result-related fields. */
export interface NotableRaceResultUpdate {
  name: string;
  party?: string;
  pct?: number;
  votes?: number;
  winner?: boolean;
}

/** Update a single notable race by id. Only status, votesCountedPct, and results. */
export interface NotableRaceUpdate {
  id: string;
  status?: RaceStatus;
  votesCountedPct?: number;
  results?: NotableRaceResultUpdate[];
}

/** Update a single state's presidential result. Only result-related fields. */
export interface PresidentialStateUpdate {
  stateCode: string;
  stateFill?: StateFill;
  stateResult?: Partial<StateResult>;
}

/** PATCH body: exactly one of notableRace or presidentialState. One election per request. */
export type ElectionResultUpdate =
  | { notableRace: NotableRaceUpdate }
  | { presidentialState: PresidentialStateUpdate };
