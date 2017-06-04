const MAX_COMMANDS_PER_MINUTE_AND_USER = 5;

const verifyCommand = async (redisClient, command, userId) => {
  try {
    const commandUserValue = await redisClient.getAsync(`${userId}-${command}`);

    // if user already has max commands per minute, return false
    if (parseInt(commandUserValue, 10) === MAX_COMMANDS_PER_MINUTE_AND_USER) {
      return false;
    }

    /*
      * else, check existing ttl, and set key again
      * for future reference, redisClient.incr will do what we want,
      * but, if key already expired, it will create one with no expiration time
    */
    const ttlRemaining = await redisClient.ttlAsync(`${userId}-${command}`);

    if (ttlRemaining > 0) {
      const newSet = await redisClient.setAsync(
        `${userId}-${command}`,
        parseInt(commandUserValue, 10) + 1,
        'EX',
        ttlRemaining
      );
      return newSet === 'OK';
    }

    /*
      * create key again
      * ttlReply might be -2, it means key doesn't exist
      * and it could happen if ttl is close to zero.

      * 5 minutes cooldown for each user-command
    */
    const newSet = await redisClient.setAsync(`${userId}-${command}`, 1, 'EX', 60 * 5);
    return newSet === 'OK';
  } catch (error) {
    return false;
  }
};

module.exports = {
  verifyCommand
};
