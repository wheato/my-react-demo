// Needed to declare this as a module. Also shows that imports
// function normally in workers.
import { shared, ApeWorkerMsg, ActionTypes } from './shared';
import { DataItem } from '../typings';

const ctx: Worker = self as unknown as Worker;

const source: DataItem[] = [];

async function fetchData(payload: string) {
  const resp = await fetch(payload).then(res => res.json());
  const { list } = resp.data;
  source.push(...list);
  ctx.postMessage({
    type: 'tsData',
    payload: list,
  });
}

function sortById() {
  const sorted = source.sort((a, b) => a.token_id - b.token_id);
  ctx.postMessage({
    type: 'tsData',
    payload: sorted,
  });
}

function sortByRarity() {
  const sorted = source.sort((a, b) => a.rarity - b.rarity);
  ctx.postMessage({
    type: 'tsData',
    payload: sorted,
  });
}

ctx.addEventListener('message', ({ data }: MessageEvent<ApeWorkerMsg<any>>) => {
  const { type: actionType, payload } = data;
  switch (actionType) {
    case ActionTypes.FETCH:
      fetchData(payload);
      return;
    case ActionTypes.SORT_BY_ID:
      sortById();
      return;
    case ActionTypes.SORT_BY_RARITY:
      sortByRarity();
      return;
  }
});
