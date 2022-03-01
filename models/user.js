class User {
  constructor(
    id,
    loginType,
    username,
    email,
    verifiedEmailStatus,
    location,
    imageUrl,
    name,
    address,
    phoneNumber,
    recommend,
    rank,
    rating,
    communityId,
    category,
    requestSum,
    provideSum,
    followerUserId,
    followingUserId,
    provideId,
    requestId,
    createdAt,
    createdBy,
    modifiedAt,
    modifiedBy,
    deletedAt,
    deletedBy,
    dataStatus
  ) {
    this.id = id;
    this.loginType = loginType;
    this.username = username;
    this.email = email;
    this.verifiedEmailStatus = verifiedEmailStatus;
    this.location = location;
    this.imageUrl = imageUrl;
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.recommend = recommend;
    this.rank = rank;
    this.rating = rating;
    this.communityId = communityId;
    this.category = category;
    this.requestSum = requestSum;
    this.provideSum = provideSum;
    this.followerUserId = followerUserId;
    this.followingUserId = followingUserId;
    this.provideId = provideId;
    this.requestId = requestId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.dataStatus = dataStatus;
  }
}

module.exports = User;
