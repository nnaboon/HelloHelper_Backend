class Chat {
  constructor(
    id,
    user,
    message,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.id = id;
    this.user = user;
    this.message = message;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
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
  constructor(id, sentAt, userId, readStatus, readAt, messageText) {
    this.id = id;
    this.sentAt = sentAt;
    this.userId = userId;
    this.readStatus = readStatus;
    this.readAt = readAt;
    this.messageText = messageText;
  }
}

module.exports = { Chat, User, Message };
