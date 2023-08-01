import { Database } from './database.mjs';

let database = new Database();

try {
  database.execute(
    'create table author (id number, name string, age number, city string, state string, country string)'
  );
  database.execute('insert into author (id, name, age) values (1, Douglas Crockford, 62)');
  database.execute('insert into author (id, name, age) values (2, Linus Torvalds, 47)');
  database.execute('insert into author (id, name, age) values (3, Martin Fowler, 54)');
  //database.execute('select name, age from author');
  //database.execute('select name, age from author where id = 1');

  // console.log(

  database.execute('delete from author where id = 2');
  //console.log(JSON.stringify(database, undefined, ' '));
  console.log(JSON.stringify(database.execute('select name, age from author'), undefined, ' '));
} catch (e) {
  console.log(e.message);
}
