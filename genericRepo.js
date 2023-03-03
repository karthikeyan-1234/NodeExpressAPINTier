const sql = require('mssql/msnodesqlv8');

class GenericRepository {
  constructor(tableName,dbName) {
    this.tableName = tableName;
    this.dbName = dbName;

    // create a new SQL Server connection pool
    this.pool = new sql.ConnectionPool({
        server: '(localdb)\\MyInstance',
        database:  dbName,//'BusinessDB',
        options: {
            trustedconnection:  true,
            enableArithAbort:  true
          }
    });

    // connect to the SQL Server instance
    this.pool.connect();
  }

  async getAll() {
    try {
      const result = await this.pool.request().query(`SELECT * FROM ${this.tableName}`);
      return result.recordset;
    } catch (error) {
      console.log("Error in Generic Repo : getALL")
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await this.pool.request().input('id', sql.Int, id).query(`SELECT * FROM ${this.tableName} WHERE id = @id`);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async create(entity) {
    try {
      const keys = Object.keys(entity).join(', ');
      const values = Object.values(entity);

      const result = await this.pool.request().input('keys', sql.NVarChar, keys).input('values', sql.NVarChar, values).query(`INSERT INTO ${this.tableName} (${keys}) OUTPUT INSERTED.* VALUES (${values.map((_, i) => `@${i + 1}`).join(', ')})`);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id, entity) {
    try {
      const keys = Object.keys(entity);
      const values = Object.values(entity);

      const updates = keys.map((key, i) => `${key} = @${i + 1}`).join(', ');

      const result = await this.pool.request().input('id', sql.Int, id).input('updates', sql.NVarChar, updates).input('values', sql.NVarChar, values).query(`UPDATE ${this.tableName} SET ${updates} OUTPUT INSERTED.* WHERE id = @id`);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await this.pool.request().input('id', sql.Int, id).query(`DELETE FROM ${this.tableName} OUTPUT DELETED.* WHERE id = @id`);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GenericRepository;
