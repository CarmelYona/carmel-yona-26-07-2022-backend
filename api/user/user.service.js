
const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            // const decryptMsgs = decryptMsg(user.messege)
            // user.messege = decryptMsgs
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('***********cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        // const decryptMsgs = decryptMsg(user.messege)
        // user.messege = decryptMsgs
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // const hashMsgs = encryptMsg(user.messege)
        const userToSave = {
            _id: ObjectId(user._id),
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            messege: user.messege,
            friendslist: user.friendslist,
            isAdmin: user.isAdmin
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        // const decryptMsgs = decryptMsg(userToSave.messege)
        // userToSave.messege = decryptMsgs
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

function decryptMsg(msgs) {
    console.log('msgs', msgs)
    if (msgs && msgs.length) {
        const decryptMsgs = msgs.map(msg => {
            const decryptMsgTxt = cryptr.decrypt(msg.txt)
            msg.txt = decryptMsgTxt
            return msg
        })
        return decryptMsgs
    } else {
        return msgs
    }
}

function encryptMsg(msgs) {
    console.log('msgs', msgs)
    if (msgs && msgs.length) {
        const encryptMsgs = msgs.map(msg => {
            const encryptMsgTxt = cryptr.encrypt(msg.txt)
            msg.txt = encryptMsgTxt
            return msg
        })
        return encryptMsgs
    } else {
        return msgs
    }
}

async function add(user) {
    try {
        const userToAdd = {
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            messege: [],
            password: user.password,
            friendslist: [],
            isAdmin: false
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    return criteria
}




