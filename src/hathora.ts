
const Hathora = {

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
    CreateRoom(logger: nkruntime.Logger, nk: nkruntime.Nakama, region: string): { roomId: string } {
        try {
            const response = Hathora.APICall(nk, `https://api.hathora.dev/rooms/v2/${HathoraConfig.appId}/create`, { region }, 201) as any;
            logger.info("Hathora room created with id: " + response.roomId);
            return { "roomId": response.roomId };
        } catch (error: any) {
            logger.error('Hathora Create Room error: ', error);
            throw new Error('Hathora Create Room error :' + (error as Error).message);
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
    APICall: (nk: nkruntime.Nakama, url: string, parameters: Object = {}, validCode: Number = 200) => {
        // prepare the headers : json + authorization header with the token
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + HathoraConfig.token
        };
        // make the http request, and throw corresponding errors if any
        const method: nkruntime.RequestMethod = 'post';
        let response: nkruntime.HttpResponse;
        try {
            response = nk.httpRequest(url, method, headers, JSON.stringify(parameters));
        }
        catch (error) {
            throw new Error('Hathora API Call error: ' + error);
        }
        // check the HTTP response code to see if valid, otherwise throw an error
        if (response.code == validCode) {
            return JSON.parse(response.body);
        } else {
            throw new Error(`Hathora API Call Error - code ${response.code}: ' + ${response.body}`);
        }
    }
};