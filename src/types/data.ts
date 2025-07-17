
export interface Goal {
  exercise: number;
  sleep: number;
  calories: number;
}

export interface DailyStats {
  exercise?: number;
  sleep?: number | { value: string };
  nutrition?: number;
  weight?: number | { value: string };
}

export interface Stats {
  [dateKey: string]: DailyStats;
}

export interface DecryptedStats {
    [dateKey: string]: {
        exercise?: number;
        sleep?: number;
        nutrition?: number;
        weight?: number;
    }
}


export interface UserData {
  goals: Goal;
  stats: Stats;
  passwordHash: string;
}
