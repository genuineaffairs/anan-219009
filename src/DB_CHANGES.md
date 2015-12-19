# Database changes in assembly MiscUpdate5 #

To apply the changes to an existing database, please execute the
migration script:

`cd mom_api`
`node migrate/migrate-09.09.js`

## Business

- The field Business#conditions has been removed

## GiftCardOffer

- The field GiftCardOffer#conditions is now of type String (it was [String])

# Database changes in assembly ReleaseFall2015 #

To apply the changes to an existing database, please execute the
migration script:

`cd mom_api`
`node migrate/migrate-09.27.js`

## Users

 - Add signedUpDate
 - Add verifiedDate
 - Add subscribedToNews

## ActionRecord

 - Add amount
 - Add giftCardId
 - Add giftCardOfferId
 - Add target
 - Add experienceRating

## GiftCardOffer

 - Add businessDescription
 
# Database changes in assembly - AUTHENTICATION AND SOCIAL MEDIA INTEGRATION ENHANCEMENT - 2 #

To apply the changes to an existing database, please execute the
migration script:

`cd mom_api && node migrate/migrate-12.15.js`

## User

 - Remove picture
 - Remove isPicturePublic
 - Remove autoShare
 - Add isStopVerificationReminder
 
## SessionToken

  - Add role
  
## Champion

New schema added with following fields

 - picture
 - isPicturePublic
 - autoShare
 - linkedUserId