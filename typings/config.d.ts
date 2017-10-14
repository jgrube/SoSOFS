// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: TS definition for config.json

interface Config {
    _comment: string;
    common: {
        _comment?: string;
        dataRoot: string;
        logTarget: "file" | "console";
    };
    server: {
        _comment?: string;
        port: number;
        verbosity?: "trace" | "debug" | "info" | "warn" | "error";
    };
}
