// From https://webpack.js.org/loaders/worker-loader/#loading-without-worker-loader
declare module '*.worker.ts' {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends Worker {
    constructor();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}

export interface TraitItem {
  traitType: string,
  value: string,
}

export interface DataItem {
  token: string;
  token_id: number;
  image: string;
  rarity: number;
  traits: TraitItem[];
}