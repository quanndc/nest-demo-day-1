import { DataSource } from "typeorm"

const PostgresDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'my_db',
})

const MySqlDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: 'admin',
    password: 'admin',
    database: 'my_db',
})

PostgresDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

MySqlDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export { PostgresDataSource, MySqlDataSource }