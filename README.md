# Nakama-Hathora Integration Project

This project provides a simple Nakama runtime module written in typescript designed to facilitate the integration and deployment with Hathora Cloud.

The module is located in the `src` directory and features a `create_match_rpc` RPC method that can be invoked from the client. (see `rpc-match.ts` for the RPC method definition).

The `create_match_rpc` method interacts with the Hathora Cloud API's CreateRoom endpoint and returns the newly created room ID to the client.

## Hathora configuration

> You'll need an Hathora account and an application ready to be deployed. 

Update `hathora-config.ts` with your [Hathora API token](https://hathora.dev/docs/guides/generate-developer-token) and your application ID.

## Hathora API calls

You can have a look to `hathora.ts` to see how is made the Hathora API calls. A handy `Hathora.APICall` method can help you to make your own API calls.

## Run the project

You can deploy an empty Nakama instance running this module by installing docker and running the following command:
```
docker compose up --build nakama
```

You can then access the Nakama console at http://localhost:7351

> You may have to call twice `docker compose up --build nakama` to see your changes in the locally deployed Nakama for some reason

## RPC call from the client

Example using the [Nakama .Net Client](https://github.com/heroiclabs/nakama-dotnet) : 

```csharp
// Client creation
var client = new Nakama.Client("http", "127.0.0.1", 7351, "defaultkey");

//You must authenticate before calling the RPC method   
string deviceId = OS.GetUniqueId();
var session = await client.AuthenticateDeviceAsync(deviceId);

//RPC call
string region = "London";
var response = await client.RpcAsync(Instance._session, "create_match_rpc", $"{{\"region\" : \"{region}\"}}");
```

See the [Nakama client libraries doc](https://heroiclabs.com/docs/nakama/client-libraries/) to know more about the Nakama clients.
