export const shared = 'Some shared variable';

export enum ActionTypes {
  SORT_BY_ID,
  SORT_BY_RARITY,
  FETCH
}

export interface ApeWorkerMsg<T> {
  type: ActionTypes;
  payload: T;
}