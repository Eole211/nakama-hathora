# Base Nakama project to handle Hathora deployment

A simple typescript module is located in `src`, with a registered `create_match_rpc` RPC method wich can be called from the client (see `rpc-match.ts` for the rpc definition).

This Rpc will call the `CreateRoom` method from the Hathora Cloud API and will return the created room id.

## Hathora configuration

You'll need an Hathora account and an application ready to be deployed. 

Modify `hathora-config.ts` with your [Hathora API token](https://hathora.dev/docs/guides/generate-developer-token) and your Hathora app id.

## Hathora API calls

You can have a look to `hathora.ts` to see how is made the Hathora API calls. An handy `Hathora.APICall` method can help you to make your own API calls.

## Run the project

You can deploy a Nakama instance running the module by installing docker and running the following command:
```
docker compose up --build nakama
```

You can then access the Nakama console at http://localhost:7351

> You may have to call twice `docker compose up --build nakama` to see your changes in the locally deployed Nakama for some reason

## Rpc call from the client

Example using the [Nakama .Net Client](https://github.com/heroiclabs/nakama-dotnet) : 

```csharp
// Client creation
var client = new Nakama.Client("http", "127.0.0.1", 7351, "defaultkey");

//You must authentificate before calling the Rpc method   
string deviceId = OS.GetUniqueId();
var session = await client.AuthenticateDeviceAsync(deviceId);

//Rpc call
string region = "London";
var response = await client.RpcAsync(Instance._session, "create_match_rpc", $"{{\"region\" : \"{region}\"}}");
```

See the [Nakama client libraries doc](https://heroiclabs.com/docs/nakama/client-libraries/) to know more about the Nakama Client.
