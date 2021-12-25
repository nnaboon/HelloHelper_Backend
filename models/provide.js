class Provide {
  constructor(
    id,
    title,
    location,
    imageUrl,
    description,
    serviceCharge,
    payment,
    userId,
    communityId,
    category,
    hashtag,
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
    this.serviceCharge = serviceCharge;
    this.payment = payment;
    this.userId = userId;
    this.communityId = communityId;
    this.category = category;
    this.hashtag = hashtag;
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
    status,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.userId = userId;
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

module.exports = { Provide, RequesterUserId };
