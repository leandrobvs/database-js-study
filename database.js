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
  execute(statement) {
    if (statement.startsWith('create table')) {
      return this.createTable(statement);
    }
  },
};

database.execute(
  'create table author (id number, name string, age number, city string, state string, country string)'
);

console.log(JSON.stringify(database, undefined, ' '));
