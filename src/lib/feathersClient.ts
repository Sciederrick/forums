import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";

const socket = io("http://localhost:3030"); // Replace with your server URL
const client = new feathers.Feathers();

client.configure(socketio(socket));
client.configure(authentication());
export default client;
