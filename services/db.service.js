
const MongoClient = require('mongodb').MongoClient

const config = require('../config')

module.exports = {
    getCollection
}

// Database Name
const dbName = 'contact_db'
var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}










        // const { MongoClient, ServerApiVersion } = require('mongodb');
        // const uri = "mongodb+srv://shani:<eini>@monday.kz6ch.mongodb.net/?retryWrites=true&w=majority";
        // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        // client.connect(err => {
        //     const collection = client.db("test").collection("devices");
        //     // perform actions on the collection object
        //     client.close();
        // });