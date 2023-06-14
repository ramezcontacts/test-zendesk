import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {
  const dbconnection = await mysql.createConnection({
    host: "ezcontacts-aurora-db-main-cluster.cluster-cebzbzsayn9o.us-east-1.rds.amazonaws.com",
    database: "production",
    port: 3306,
    user: "vikrant.talwar",
    "timezone": "Z",
    "multipleStatements": true,
    password: "Za3a9ODhn2i/hoBaqFlKONTJhXaCR0JIa9o",
  });
  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
}
