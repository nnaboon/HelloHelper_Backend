class Community {
  constructor(
    id,
    communityCode,
    communityName,
    imageUrl,
    location,
    description,
    joinedRequestUserId,
    member,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.id = id;
    this.communityCode = communityCode;
    this.communityName = communityName;
    this.imageUrl = imageUrl;
    this.location = location;
    this.description = description;
    this.joinedRequestUserId = joinedRequestUserId;
    this.member = member;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.dataStatus = dataStatus;
  }
}

class Member {
  constructor(
    id,
    userId,
    status,
    role,
    requestSum,
    provideSum,
    joinedAt,
    leavedAt
  ) {
    this.id = id;
    this.userId = userId;
    this.status = status;
    this.role = role;
    this.requestSum = requestSum;
    this.provideSum = provideSum;
    this.joinedAt = joinedAt;
    this.leavedAt = leavedAt;
  }
}

class JoinedRequest {
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

module.exports = { Community, Member, JoinedRequest };
