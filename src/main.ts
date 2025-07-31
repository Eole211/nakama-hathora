let InitModule: nkruntime.InitModule =

    function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
        // Register RPCs
        initializer.registerRpc("create_match_rpc", createMatchRpc);
    }