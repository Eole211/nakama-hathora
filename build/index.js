"use strict";
var HathoraConfig = {
    /**
     * Hathora API Token
     * */
    token: "yourathoraapitoken",
    /**
     * Hathora App ID
     */
    appId: "yourathoraappid",
    /**
     * Put it to false if you don't want to send the full Hathora error messages to the client
     */
    sendFullErrorToClient: true,
};
var Hathora = {
    /**
     * Call the Hathora API to create a room in the region in parameter
     * region must be formatted with only the first letter in uppercase
     * And returns the room id in an object
     * (See https://hathora.dev/api#tag/RoomV2/operation/CreateRoom )
     * @param logger
     * @param nk
     * @param region
     * @returns
     */
    CreateRoom: function (logger, nk, region) {
        try {
            var response = Hathora.APICall(nk, "https://api.hathora.dev/rooms/v2/".concat(HathoraConfig.appId, "/create"), { region: region }, 201);
            logger.info("Hathora room created with id: " + response.roomId);
            return { "roomId": response.roomId };
        }
        catch (error) {
            logger.error('Hathora Create Room error: ', error);
            throw new Error('Hathora Create Room error :' + error.message);
        }
    },
    /**
     * Make a call to the Hathora Cloud API, using the hathora token specified in hathora-config.ts
     * @param url
     * @param parameters
     * @param nk
     * @param logger
     * @returns
     */
    APICall: function (nk, url, parameters, validCode) {
        if (parameters === void 0) { parameters = {}; }
        if (validCode === void 0) { validCode = 200; }
        // prepare the headers : json + authorization header with the token
        var headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + HathoraConfig.token
        };
        // make the http request, and throw corresponding errors if any
        var method = 'post';
        var response;
        try {
            response = nk.httpRequest(url, method, headers, JSON.stringify(parameters));
        }
        catch (error) {
            throw new Error('Hathora API Call error: ' + error);
        }
        // check the HTTP response code to see if valid, otherwise throw an error
        if (response.code == validCode) {
            return JSON.parse(response.body);
        }
        else {
            throw new Error("Hathora API Call Error - code ".concat(response.code, ": ' + ").concat(response.body));
        }
    }
};
var InitModule = function (ctx, logger, nk, initializer) {
    // Register RPCs
    initializer.registerRpc("create_match_rpc", createMatchRpc);
};
/* File for Match Rpc Methods
 * All rpc methods are regisered in `main.ts`
*/
/**
 * RPC : Starts a match in the specified region
 * @param ctx
 * @param logger
 * @param nk
 * @param payload : stringified JSON object, with an optional region parameter : {region:"London"}
 * @returns - the corresponding room id { roomId : "xxxx"}, or an error message { error : "error message"}, in a stringified JSON
 */
function createMatchRpc(ctx, logger, nk, payload) {
    if (ctx.userId) {
        // fetch the user
        var user = nk.usersGetId([ctx.userId])[0];
        // Here we can add some validation before creating the match 
        // for example checking if the user has a not empty steamId to see if they're authentificated with steam
        // fetch the region from the payload
        var region = "London";
        try {
            var parsedPayload = JSON.parse(payload);
            if (parsedPayload.region) {
                region = parsedPayload.region;
            }
        }
        catch (e) { }
        logger.info("User " + user.username + " is creating a match in region " + region);
        // Create the match by creating a new Hathora room for the game
        // and returns the corresponding room id if they're is no error
        try {
            var response = Hathora.CreateRoom(logger, nk, region);
            return JSON.stringify(response);
        }
        catch (error) {
            var errorMessage = "Error creating the match";
            if (HathoraConfig.sendFullErrorToClient) {
                return JSON.stringify({ "error": errorMessage + ":" + error.message });
            }
            else {
                return JSON.stringify({ "error": errorMessage });
            }
        }
    }
    else {
        return JSON.stringify({ "error": "User not authenticated" });
    }
}
