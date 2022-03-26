import { DB_HOST, DB_PORT, DB_USER, DB_PW } from '@config';

export const dbConnection = `mongodb://${DB_USER?DB_USER + ':' + DB_PW + '@':''}${DB_HOST}:${DB_PORT}`;
