/* eslint-disable @typescript-eslint/no-explicit-any */
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import process from "process"

const API_BASE_URL = process.env.REACT_API_BASE_URL;

const socket = io(API_BASE_URL || "http://localhost:3030/"); // Replace with your server URL
const client = new feathers.Feathers() as Record<string, any>; // Get rid of squigly lines (temporary solution). In the future, download types

client.configure(socketio(socket));
client.configure(authentication());
export default client;
