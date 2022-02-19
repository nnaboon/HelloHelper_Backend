class Provide {
  constructor(
    id,
    title,
    location,
    imageUrl,
    description,
    rating,
    provideSum,
    serviceCharge,
    payment,
    userId,
    communityId,
    category,
    hashtag,
    requesterUserId,
    visibility,
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
    this.provideSum = provideSum;
    this.rating = rating;
    this.serviceCharge = serviceCharge;
    this.payment = payment;
    this.userId = userId;
    this.communityId = communityId;
    this.category = category;
    this.hashtag = hashtag;
    this.requesterUserId = requesterUserId;
    this.visibility = visibility;
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
    userId,
    status,
    createddAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
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

module.exports = { Provide, RequesterUserId };
