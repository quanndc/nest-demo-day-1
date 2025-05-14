export default () => ({
    jwt: {
        secretAccessToken: process.env.SECRET_TOKEN,
        secretAccessTokenExpireIn: process.env.SECRET_TOKEN_EXPIRES_IN as string,
        secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
        secretRefreshTokenExpireIn: process.env.SECRET_REFRESH_TOKEN_EXPIRES_IN as string
    },
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
        ssl: false,
    },
    elastic_search: {
        default_node: process.env.ELASTICSEARCH_URL
    }
})