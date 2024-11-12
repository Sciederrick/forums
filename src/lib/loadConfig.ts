import config from "./../config.json";
const forumsConfig =
    config.environment === "production"
        ? config.production
        : config.development;

export default forumsConfig;