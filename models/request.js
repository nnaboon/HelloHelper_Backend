class Request {
  constructor(
    id,
    title,
    location,
    imageUrl,
    description,
    price,
    serviceCharge,
    number,
    payment,
    communityId,
    category,
    hashtag,
    providedUserId,
    requesterUserId,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.id = id;
    this.title = title;
    this.location = location;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.serviceCharge = serviceCharge;
    this.number = number;
    this.payment = payment;
    this.communityId = communityId;
    this.category = category;
    this.hashtag = hashtag;
    this.providedUserId = providedUserId;
    this.requesterUserId = requesterUserId;
    this.createAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.dataStatus = dataStatus;
  }
}

class RequesterUserId {
  constructor(
    userId,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.userId = userId;
    this.createAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.dataStatus = dataStatus;
  }
}

class ProvidedUserId {
  constructor(
    id,
    status,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.id = id;
    this.status = status;
    this.createAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.dataStatus = dataStatus;
  }
}

module.exports = { Request, ProvidedUserId, RequesterUserId };
