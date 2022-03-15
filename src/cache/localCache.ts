import NodeCache from "node-cache"

export const localCache = new NodeCache({stdTTL: 100, checkperiod: 120})