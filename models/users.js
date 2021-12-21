class User {
  constructor(
    id,
    loginType,
    username,
    email,
    verifiedEmailStatus,
    location,
    imageUrl,
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
    this.createAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.dataStatus = dataStatus;
  }
}
module.exports = User;

// userId (string)
//       loginType (int) //ดูว่า login จากไหน (facebook หรือ email)
//       username (string)
//       email (string)
//       verifiedEmailStatus (string)
//       location (object) //สถานที่ให้ความช่วยเหลือ
//         {lat (double), long (double}
//       +location
//         >locationKey
//            lat (double) //latitude
//            long (double) //longitude
//       imageUrl (string)
//       address (string)
//       phoneNumber (string)
//       recommend (boolean) //user เป็น user ที่ได้รับการแนะนำหรือไม่
//       rank (string) //เก็บ rank ที่ user คนนั้นอยู่ (platinum, diamond, gold, silver, classic)
//       rating (double) //คะแนนของผู้ใช้งานนี้
//       communityId[] (string) //เก็บ id ชุมชนความช่วยเหลือของฉันเอาไว้
//       category[] (string) //หมวดหมู่ที่ยินดีให้ความช่วยเหลือ
//       requestSum (int) //จำนวนการขอความช่วยเหลือทั้งหมดของฉัน
//       provideSum (int) //จำนวนการให้ความช่วยเหลือทั้งหมดของฉัน
//       followingUserId[] (string) //เก็บ userId ของ following
//       followerUserId[] (string) //เก็บ userId ของ follower
//       provideId[] (string) //เก็บ provideid รายการให้ความช่วยเหลือของฉันเอาไว้
//       requestId[] (string) //เก็บ requestid รายการขอความช่วยเหลือของฉันเอาไว้
//       createdAt (timestamp)
//       modifiedAt (timestamp)
//       deletedAt (timestamp)
//       deletedBy (string)
//       dataStatus (string) //เก็บสถานะของข้อมูล document นี้
