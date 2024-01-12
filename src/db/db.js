import Dexie from 'dexie';

export const db = new Dexie('gist')

db.version(2).stores({
    gistTable: '&gistId,code,language,description,editTime,tags', // Primary key and indexed props
    // tags: '++tagId,tag'
});