export class Invocation {
	/**
	 * 私聊
	 * 群聊
	 * 重连
	 * 心跳
	 */
	private type: string;
	private message: Message;

	constructor(type: string, message: Message) {
		this.type = type;
		this.message = message;
	}
}

export class Message {
	public content: string;
	public user: User;
	public receiveUserId: string;
	public sessionId: string;
	public sendTime: string | undefined;

	constructor(
		content: string,
		user: User,
		receiveId: string,
		sessionId: string
	) {
		this.content = content;
		this.user = user;
		this.receiveUserId = receiveId;
		this.sessionId = sessionId;
	}
}

export class User {
	private id: string;
	private name: string;
	private avatar: string;

	constructor(id: string, name: string, avatar: string) {
		this.id = id;
		this.name = name;
		this.avatar = avatar;
	}
}
