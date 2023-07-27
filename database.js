function DatabaseError(statement, message) {
  this.message = `No valid command for "${statement}"`;
  return message;
}

const database = {
  tables: {},
  createTable(statement) {
    const regexp = /create table (\w+) \((.+)\)/;
    const parsedStatemant = statement.match(regexp);

    let [, tableName, columns] = parsedStatemant;
    columns = columns.split(', ');

    this.tables[tableName] = {
      columns: {},
      data: [],
    };

    for (let column of columns) {
      column = column.split(' ');
      const [name, type] = column;
      this.tables[tableName].columns[name] = type;
    }
  },
  insert(statement) {
    const regexp = /insert into (\w+) \((.+)\) values \((.+)\)/;
    const parsedStatemant = statement.match(regexp);

    let [, tableName, columns, values] = parsedStatemant;
    columns = columns.split(', ');
    values = values.split(', ');

    const row = {};

    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);
  },
  select(statement) {
    const regexp = /select (.+) from ([a-z]+)(?: where (.+))?/;
    const parsedStatement = statement.match(regexp);

    let [, columns, tableName, whereClause] = parsedStatement;
    columns = columns.split(', ');
    let rows = this.tables[tableName].data;

    if (whereClause) {
      whereClause = whereClause.split(' = ');
      let [columnWhere, valueWhere] = whereClause;
      rows = rows.filter(row => {
        return row[columnWhere] === valueWhere;
      });
    }

    rows = rows.map(row => {
      let selectedRow = {};
      columns.forEach(function (column) {
        selectedRow[column] = row[column];
      });
      return selectedRow;
    });

    return rows;
  },
  delete(statement) {
    const regexp = /delete from ([a-z]+)(?: where (.+))?/;
    const parsedStatement = statement.match(regexp);
    let [, tableName, whereClause] = parsedStatement;

    if (whereClause) {
      whereClause = whereClause.split(' = ');
      let [columnWhere, valueWhere] = whereClause;

      this.tables[tableName].data = this.tables[tableName].data.filter(row => {
        return row[columnWhere] !== valueWhere;
      });
    } else {
      this.tables[tableName].data = [];
    }
  },
  execute(statement) {
    if (statement.startsWith('create table')) {
      return this.createTable(statement);
    } else if (statement.startsWith('insert')) {
      return this.insert(statement);
    } else if (statement.startsWith('select')) {
      return this.select(statement);
    } else if (statement.startsWith('delete')) {
      return this.delete(statement);
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
  //database.execute('select name, age from author');
  //database.execute('select name, age from author where id = 1');

  // console.log(

  database.execute('delete from author where id = 2');
  //console.log(JSON.stringify(database, undefined, ' '));
  console.log(JSON.stringify(database.execute('select name, age from author'), undefined, ' '));
} catch (e) {
  console.log(e.message);
}
