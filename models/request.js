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
    userId,
    communityId,
    category,
    hashtag,
    visibility,
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
    this.userId = userId;
    this.communityId = communityId;
    this.category = category;
    this.hashtag = hashtag;
    this.visibility = visibility;
    this.providedUserId = providedUserId;
    this.requesterUserId = requesterUserId;
    this.createdAt = createdAt;
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
    requesterId,
    userId,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    (this.requesterId = requesterId), (this.userId = userId);
    this.createdAt = createdAt;
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
    userId,
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
    this.userId = userId;
    this.status = status;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.dataStatus = dataStatus;
  }
}

module.exports = { Request, ProvidedUserId, RequesterUserId };
