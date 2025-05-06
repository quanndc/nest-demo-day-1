import { DataSource } from "typeorm";

export const getUserRoles = async (dbUser: string, dataSource: DataSource): Promise<string[]> => {
    // 'CALL <procecure_name>'
    try {
      const result = await dataSource.query(
        `SELECT * FROM get_user_roles($1)`,
        [dbUser],
      );
      console.log(result);
      return result[0]?.get_user_roles || [];

    } catch (error) {
      throw new Error(`Failed to fetch roles for user ${dbUser}: ${error.message}`);
    }
  }

  export const getPrivilegesByTableOptimized = async (dbUser: string, tables: string[], dataSource: DataSource): Promise<Record<string, string[]>> => {
    const grantees = await getUserRoles(dbUser, dataSource);
    try {
      const rows = await dataSource.query(
        `SELECT * FROM get_table_privileges($1, $2)`,
        [grantees, tables],
      );
      const tablePrivileges = rows[0].get_table_privileges
      const result: Record<string, string[]> = {};
      tables.forEach(t => result[t] = []);

      for (const row of tablePrivileges) {
        const table = row.table_name;
        const priv = row.privilege_type;
        if (!result[table].includes(priv)) {
          result[table].push(priv);
        }
      }
      return result;
    } catch (error) {
      throw new Error(
        `Failed to fetch table privileges: ${error.message}`,
      );
    }
  }