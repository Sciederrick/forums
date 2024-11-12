/* eslint-disable @typescript-eslint/no-explicit-any */
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import config from "./loadConfig";

const socket = io(config.REACT_APP_API_BASE_URL); // Replace with your server URL
const client = new feathers.Feathers() as Record<string, any>; // Get rid of squigly lines (temporary solution). In the future, download types

client.configure(socketio(socket));
client.configure(authentication());
export default client;
