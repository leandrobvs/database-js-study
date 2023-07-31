class DatabaseError {
  constructor(statement, message) {
    this.message = `No valid command for "${statement}"`;
    return message;
  }
}

class Parser {
  constructor() {
    this.commands = new Map();
    this.commands.set('createTable', /create table (\w+) \((.+)\)/);
    this.commands.set('insert', /insert into (\w+) \((.+)\) values \((.+)\)/);
    this.commands.set('select', /select (.+) from ([a-z]+)(?: where (.+))?/);
    this.commands.set('delete', /delete from ([a-z]+)(?: where (.+))?/);
  }

  parse(statement) {
    for (let [command, regexp] of this.commands) {
      const parsedStatement = statement.match(regexp);
      if (parsedStatement) {
        return {
          command,
          parsedStatement,
        };
      }
    }
  }
}

class Database {
  constructor() {
    this.tables = {};
    this.parser = new Parser();
  }

  createTable(parsedStatement) {
    let [, tableName, columns] = parsedStatement;
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
  }
  insert(parsedStatement) {
    let [, tableName, columns, values] = parsedStatement;
    columns = columns.split(', ');
    values = values.split(', ');

    const row = {};

    for (let i = 0; i < columns.length; i++) {
      row[columns[i]] = values[i];
    }

    this.tables[tableName].data.push(row);
  }
  select(parsedStatement) {
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
  }
  delete(parsedStatement) {
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
  }
  execute(statement) {
    const result = this.parser.parse(statement);

    if (result) {
      return this[result.command](result.parsedStatement);
    }
    throw new DatabaseError(statement);
  }
}

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
