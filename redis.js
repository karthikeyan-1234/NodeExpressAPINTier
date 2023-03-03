const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('connect',function(err){
    console.log("Connected to Redis");
})

redisClient.connect();

module.exports = redisClient;