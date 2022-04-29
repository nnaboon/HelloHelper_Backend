class Order {
  constructor(
    id,
    chatId,
    orderReferenceType,
    orderReferenceId,
    title,
    location,
    description,
    number,
    price,
    serviceCharge,
    rating,
    requesterRating,
    receiver,
    requesterUserId,
    providerUserId,
    payment,
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
    this.chatId = chatId;
    this.orderReferenceType = orderReferenceType;
    this.orderReferenceId = orderReferenceId;
    this.title = title;
    this.location = location;
    this.description = description;
    this.number = number;
    this.price = price;
    this.serviceCharge = serviceCharge;
    this.rating = rating;
    this.requesterRating = requesterRating;
    this.receiver = receiver;
    this.requesterUserId = requesterUserId;
    this.providerUserId = providerUserId;
    this.payment = payment;
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

module.exports = { Order };
