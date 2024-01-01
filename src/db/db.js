import Dexie from 'dexie';

export const db = new Dexie('gist')

db.version(1).stores({
    gistTable: '&gistId,code,language,description,editTime', // Primary key and indexed props
});