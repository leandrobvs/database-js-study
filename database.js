function DatabaseError(statement, message) {
  this.message = `No valid command for "${statement}"`;
  return message;
}

const database = {
  tables: {},
  createTable(statement) {
    const regexp = /create table (\w+) \((.+)\)/;
    const parsedStatemant = statement.match(regexp);

    let tableName = parsedStatemant[1];
    let columns = parsedStatemant[2];
    columns = columns.split(', ');

    this.tables[tableName] = {
      columns: {},
      data: [],
    };

    for (let column of columns) {
      column = column.split(' ');

      const name = column[0];
      const type = column[1];

      this.tables[tableName].columns[name] = type;
    }
  },
  insert(statement) {
    const regexp = /insert into (\w+) \((.+)\) values \((.+)\)/;
    const parsedStatemant = statement.match(regexp);

    let tableName = parsedStatemant[1];
    let columns = parsedStatemant[2].split(', ');
    let values = parsedStatemant[3].split(', ');

    const row = {};

    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);
  },
  execute(statement) {
    if (statement.startsWith('create table')) {
      return this.createTable(statement);
    } else if (statement.startsWith('insert')) {
      this.insert(statement);
    } else {
      throw new DatabaseError(statement);
    }
  },
};

try {
  database.execute(
    'create table author (id number, name string, age number, city string, state string, country string)'
  );
  database.execute('insert into author (id, name, age) values (1, Douglas Crockford, 62)');
  database.execute('insert into author (id, name, age) values (2, Linus Torvalds, 47)');
  database.execute('insert into author (id, name, age) values (3, Martin Fowler, 54)');
  console.log(JSON.stringify(database, undefined, ' '));
} catch (e) {
  console.log(e.message);
}
