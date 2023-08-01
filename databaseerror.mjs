export default class DatabaseError {
  constructor(statement, message) {
    this.message = `No valid command for "${statement}"`;
    return message;
  }
}
