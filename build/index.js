"use strict";
function rpcEmcCreateMatch(ctx, logger, nk, payload) {
    if (ctx.userId) {
        var user = nk.usersGetId([ctx.userId])[0];
        logger.info("User " + user.username + " is creating a match.");
        logger.info("SteamId " + user.steamId);
        try {
            var response = Hathora.CreateRoom(logger, nk, "London");
            return JSON.stringify(response);
        }
        catch (error) {
            return JSON.stringify({ error: "Error creating the match: " + error });
        }
    }
}
var HathoraConfig = {
    token: "hathora_org_st_jngkrP7osvQiMIk5lh3b4K4TvusQZfPNwdcFrAMDsmkzVCMOUd_2678cd1f0aaf0063ef1bef68a6859ad4",
    appId: "app-3c0925d5-0aa7-4471-ab6d-85746d5c5367"
};
var Hathora = {
    /**
     * Call the Hathora API to create a room
     * And returns the room id in an object
     * @param logger
     * @param nk
     * @param region
     * @returns
     */
    CreateRoom: function (logger, nk, region) {
        if (region === void 0) { region = "London"; }
        try {
            var response = Hathora.APICall("https://api.hathora.dev/rooms/v2/".concat(HathoraConfig.appId, "/create"), { region: region }, nk, logger);
            logger.info("Hathora room created with id: " + response.roomId);
            return { "roomId": response.roomId };
        }
        catch (error) {
            logger.error('Hathora Create Room error: ', error);
            throw new Error('error: ' + error);
        }
    },
    APICall: function (url, parameters, nk, logger) {
        var method = 'post';
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + HathoraConfig.token
        };
        try {
            var response = nk.httpRequest(url, method, headers, JSON.stringify(parameters));
            logger.info('result is: ', JSON.stringify(response));
            return JSON.parse(response.body);
        }
        catch (error) {
            logger.error('Hathora API call error: ', error);
            throw new Error('error: ' + error);
        }
    }
};
var Helper = {
    UpdateUserMetadata: function (nk, userId, metadata) {
        nk.accountUpdateId(userId, null, null, null, null, null, null, metadata);
    }
};
var InitModule = function (ctx, logger, nk, initializer) {
    logger.info("INIT MODULES CALLED");
    initializer.registerRpc("emc_create_match_rpc", rpcEmcCreateMatch);
};
