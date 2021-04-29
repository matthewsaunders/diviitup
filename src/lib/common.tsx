export const EXTENSION_ID = 'smatt-lab.divi-it-up';
export const FIELD_BASE = 'vote';
export const VOTING_OPTIONS = {
  WANT: 10,
  NEUTRAL: 20,
  PASS: 30
}

export type Vote = {
  id: string;
  name: string;
  avatar: string;
  vote: number;
}