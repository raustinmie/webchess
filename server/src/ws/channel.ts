import { Client } from './client';
import { SendChatRequest, ChatResponse } from './protocol';

export class Channel {
	constructor(private name: string, private clients = new Map<string, Client>()) {}

	addClient(client: Client): void {
		this.clients.set(client.userid, client);
		this.sendToAll({ type: 'chat-join', channel: this.name, username: client.username, userid: client.userid });
	}

	removeClient(client: Client): void {
		this.sendToAll({
			type: 'chat-leave',
			channel: this.name,
			username: client.username,
			userid: client.userid,
		});
		this.clients.delete(client.userid);
	}

	onChat(sender: Client, request: SendChatRequest): void {
		this.sendToAll({
			type: 'chat',
			channel: this.name,
			username: sender.username,
			userid: sender.userid,
			msg: request.msg,
		});
	}

	private sendToAll(response: ChatResponse): void {
		for (const client of this.clients.values()) {
			client.send(response);
		}
	}
}
