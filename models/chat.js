class Chat {
  constructor(
    chatId,
    users,
    lastMessage,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.chatId = chatId;
    this.users = users;
    this.lastMessage = lastMessage;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.dataStatus = dataStatus;
  }
}

class User {
  constructor(id, lastMessage) {
    this.id = id;
    this.lastMessage = lastMessage;
  }
}

class Message {
  constructor(id, readStatus, messageText, createdAt, createdBy) {
    this.id = id;
    this.readStatus = readStatus;
    this.messageText = messageText;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

module.exports = { Chat, User, Message };
