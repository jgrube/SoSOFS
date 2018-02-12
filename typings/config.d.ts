/**
 * TS definition for config.json
 * @module config.d.ts
 * @author John Grube <johnegrube@gmail.com>
 * @see https://github.com/jgrube/SoSOFS#readme
 */

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
