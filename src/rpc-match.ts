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
function createMatchRpc(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    if (ctx.userId) {
        // fetch the user
        var user = nk.usersGetId([ctx.userId])[0];
        // Here we can add some validation before creating the match 
        // for example checking if the user has a not empty steamId to see if they're authentificated with steam

        // fetch the region from the payload
        let region = "London";
        try {
            const parsedPayload = JSON.parse(payload);
            if (parsedPayload.region) {
                region = parsedPayload.region;
            }
        }
        catch (e) { }
        logger.info("User " + user.username + " is creating a match in region " + region);

        // Create the match by creating a new Hathora room for the game
        // and returns the corresponding room id if they're is no error
        try {
            const response = Hathora.CreateRoom(logger, nk, region);
            return JSON.stringify(response);
        }
        catch (error) {
            const errorMessage = "Error creating the match";
            if (HathoraConfig.sendFullErrorToClient) {
                return JSON.stringify({ "error": errorMessage + ":" + (error as Error).message });
            } else {
                return JSON.stringify({ "error": errorMessage });
            }
        }
    } else {
        return JSON.stringify({ "error": "User not authenticated" });
    }
}