import DatabaseError from './databaseerror.mjs';
import Parser from './parser.mjs';

export class Database {
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
