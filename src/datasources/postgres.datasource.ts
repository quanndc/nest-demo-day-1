// import configuration from "src/config/configuration"
// import { DataSource } from "typeorm"
// // import 'dotenv/config'

// const PostgresDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: configuration().database.username,
//     password: configuration().database.password,
//     database: 'my_db',
// })

// PostgresDataSource.initialize()
//     .then(() => {
//         console.log("Data Source has been initialized!")
//     })
//     .catch((err) => {
//         console.error("Error during Data Source initialization", err)
//     })

// export  { PostgresDataSource }