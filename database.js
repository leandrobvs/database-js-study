// Dado o comando:

// <br/>

// ```sql
// create table author (id number, name string, age number, city string, state string, country string)
// ```

// <br/>

// 1. Extraia o nome da tabela e armazene em uma variável chamada "tableName".
// 2. Extraia as colunas da tabela e armazene em uma variável chamada "columns".
// 3. Manipule a variável "columns", separando cada coluna com seu respectivo tipo, em uma string separada.

// <br/>

const command =
  'create table author (id number, name string, age number, city string, state string, country string)';

let regexp = /create table (\w+) \((.+)\)/;
let parsedInfo = regexp.exec(command);

let tableName = parsedInfo[1];
let columns = parsedInfo[2];
columns = columns.split(', ');

console.log(tableName);
console.log(columns);
