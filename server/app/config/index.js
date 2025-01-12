const config = {
    app: {
        port: process.env.PORT || 9000,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/quangbataphuan"
    }
};
module.exports = config;