
#FounderShare
The main function of the platform will be to allow business to post virtual gift cards for sale on the platform.  Individual users will be able to browse and buy these gift cards, as well as resell or trade gift cards they own.  Using the mobile layout, users will be able to redeem their gift cards at the business, and the business will be able to process gift card redemption at their point of sale.

##Application setup
-	Nodejs https://nodejs.org/ 
-	MongoDB https://www.mongodb.org/
-	Grunt  http://gruntjs.com/getting-started  
    Run `[sudo] npm install -g grunt-cli `
-	http-server https://www.npmjs.com/package/http-server   
    Run `[sudo] npm install -g http-server`


##Configuration - API

The configuration file is located under `config/default.js`  

- **MONGODB_URL** - The mongodb  url
- **SALT_WORK_FACTOR** - The factor for generating encryption salts.
- **SESSION_TOKEN_DURATION** - The session duration in milliseconds.
- **OFFER_EXPIRATION_DAYS** - The expiration of gift card offers
- **GIFT_EXPIRATION_DAYS** - The expiration of gifted gift card 
- **GIFT_DELIVERED_DAYS** - The time limit for delivering the gifts
- **JOB_GIFTS_INTERVAL** - The interval in milliseconds for expiration and delivered jobs
- **WEB_SERVER_PORT** - The port to listen
- **TWITTER_CONSUMER_KEY** - The twitter consumer key
- **TWITTER_CONSUMER_SECRET** - The twitter consumer secret
- **GEOCODER_PROVIDER** - The geocoder provider
- **GEOCODER_HTTPADAPTER** - The geocoder adapter
- **SMTP_HOST** - The smtp host for email service
- **SMTP_PORT** - The smtp port
- **SMTP_USERNAME** - The smtp username
- **SMTP_PASSWORD** - The smtp password
- **CONFIG_EMAIL** - The email address of email sender
- **SITE_ADMIN_EMAIL** - The admin of the site
- **DESKTOP_APP_URL** - The base URL for desktop application
- **MOBILE_APP_URL** - The base URL for mobile application
- **BRAINTREE_SUBSCRIPTION_PLANID** - The subscription plan id
- **BRAINTREE_MERCHANT_ACCOUNT_ID** - The master account merchant id
- **BRAINTREE_GATEWAY_CONFIG** - The configuration for braintree payments
    - **environment** - The Braintree environment
    - **merchantId** - The Braintree merchant id
    - **publicKey** - The Braintree public key
    - **privateKey** - The Braintree private key
- **AWS** - the aws settings
    - **accessKeyId** -  the access key
    - **secretAccessKey** - the access key
    - **region** - the region
- **AWS_BUCKET_NAME** - the bucket name for photo upload
- **AWS_PHOTOS_PREFIX** - the root directory for photo upload
- **BUSINESS_CONDITION** - the default business conditions 
- **TWILIO_ACCOUNT_SID** - the twilio account sid
- **TWILIO_AUTH_TOKEN** - the twilio authentication token
- **TWILIO_FROM_NUMBER** - the twilio sender phone number
- **IP_LOCATION_CACHE_SECONDS** - Interval in seconds for ip to location cache
- **MOCK_LOCALHOST_IP** - Geolocalization is IP based, but it doesn’t work for localhost IPs. Set this setting to overwrite localhost IP.
- **GIFT_OFFER_DISTANCE_SEARCH_RANGES** - Ranges for gift card offers that are displayed in groups.  
  Each value represents distance in meters.  
  Example for [10000, 50000] settings:  
  There will be 3 groups  
  1st will be in range 0 – 10km  
  2nd will be in range 10km – 50km  
  3rd will be in range 50km – Infinity  
- **ENABLED_PROXY** - True if enable proxy for frontend, mobile and API. For development only.


Copy `config/local.js.sample` to `config/local.js` and fix settings to match your environment.  
You can use default settings if you deploy your app on localhost.

##Configuration - Desktop frontend

The configuration file is located under `app/js/config.js`  

- **SHARE_THIS_PUBLISHER_KEY** - The publisher key for sharethis
- **OAUTH_PUBLIC_KEY** - The public key from https://oauth.io
- **REST_SERVICE_BASE_URL** - The URL for backend API
- **MOBILE_SERVICE_BASE_URL** - The URL for mobile version
- **FRIEND_INVITATION_MESSAGE_TEMPLATE** - The template when inviting the user
- **SESSION_TOKEN_REFRESH_PERIOD** - The session refresh interval in milliseconds
- **FAKE_NONCE** - Set true if set always fake nonce when purchase the shopping cart
- **HOW_IT_WORKS_URL** - The wordpress permalinks for how it works page.
- **PRIVACY_POLICY_URL** - The wordpress permalinks for privacy policy page
- **COPYRIGHT_URL** - The wordpress permalinks for copyright page
- **FAQ_URL** - The wordpress permalinks for FAQ page.
- **BLOG_URL** - The wordpress permalinks for blog page.
- **ABOUT_URL** - The wordpress permalinks for about page.
- **TERMS_AND_CONDITIONS_URL** - The wordpress permalinks for terms and conditions page.
- **LOAD_MORE_ITEM_COUNT** - Load more item configuration value


##Configuration - Mobile frontend
The configuration file is located under `mom_mobile/app/components/config.js`  
- **REST_SERVICE_BASE_URL** - The URL for backend API.
- **OAUTH_PUBLIC_KEY** - The public key from https://oauth.io.
- **PASSWORD_LENGTH** - The minimum length of password - 1.
- **FB_APP_ID** - The app id from https://developers.facebook.com.
- **TWITTER_VIA** - The twitter handle of the organization.
- **MAX_QUANTITY** - Maximum price per transaction.
- **OFFERS_PER_PAGE** - Number of offers get from server per page.
- **OFFERS_HOME_PAGES** - Number of pages to load initially.
- **HISTORY_ITEMS_PER_PAGE** - Number of history records to get in a single api call.
- **HISTORY_HOME_PAGES** - Number of pages of history records to show in the home page.


## Twilio setup
- Create your account in [twilio](https://www.twilio.com/try-twilio).
- Add your sender number (`TWILIO_FROM_NUMBER`) [here](https://www.twilio.com/user/account/phone-numbers/incoming), make sure SMS & MMS are enabled for that number.
- Add and verify your number [here](https://www.twilio.com/user/account/phone-numbers/verified). In try account you may only send SMS to verified numbers.
- Get `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` from [here](https://www.twilio.com/user/account/settings) (`Live` section) and update configuration


## Mailgun setup
- Create your account in [mailgun](https://mailgun.com/signup).
- Click on domain details in [domain list](https://mailgun.com/app/domains/)
- Update configuration `Default SMTP Login` -> `SMTP_USERNAME` and `Default Password` -> `SMTP_PASSWORD`
- Update webhooks [here](https://mailgun.com/app/webhooks)
- Set `Delivered messages` hook to address `http://YOUR_IP:3000/webhook/mailgun/message/delivered`.   
NOTE: You must have a public IP.

##Deployment - API
`npm install`  
`npm start`
`npm run worker` (in new window)

Default port is `3000`

##Deployment - Desktop frontend
`npm install`  
`npm start`

Default port is `3500`


##Deployment - Mobile frontend
`npm install`  
`npm start`

Default port is `3501`

##Proxy PORT
Default proxy port is `5000`  
Use ``http://local.foundershare.com:5000`` for desktop version  
and ``http://local.foundershare.com:5000/mobile/`` for mobile version

##Unit tests & code coverage
**!!Not completed!!**  
Run under api directory  
`grunt`  
Open `coverage/lcov-report/index.html` in browser


##Test data
Run under api directory  
`node test_files/create-data` it will generate new set of random data and override json files under `test_files/data`  
`node test_files/insert-data` it will clear and insert data based on files under `test_files/data`  
`node test_files/create-merchants` it will generate sub merchant accounts in  braintree; use it only once if you change your braintree settings  
`node test_files/oauth` it will create an http server to generate oauth tokens for social networks; use it if you want to test the social login/registration directly via API  
open `http://localhost:5000/<network>` where network can be `facebook`, `twitter`, `linkedin`

##Test accounts
Individual users:
- `user1@domain.com`
- `user2@domain.com`  

Business owners:
- `admin@b1.com`
- `admin@b2.com`
- `admin@b3.com`  
...  
- `admin@b10.com`

Business employees:
- `user1@b1.com`
- `user2@b1.com`
- `user1@b2.com`
- `user2@b2.com`  
...
- `user1@b10.com`
- `user2@b10.com`

Platform admin:
- `superuser@domain.com`

Businesses 1-9 are verified.  
Business 10 is not verified.  
Password for all accounts is `password`

##Postman
- Use packaged version https://chrome.google.com/webstore/detail/postman-rest-client-packa/fhbjgbiflinjbdggehcddcbncdddomop
- Load `Mom-and-Pop.json.postman_collection` to postman
- Execute `node postman/generate-env.js` inside the `mom_api` directory to generate environment settings
- Load environment settings `Mom-and-Pop.postman_environment`
- Change `ACCESS_TOKEN` to your token from social network if want to login/register via social network
- Default environment settings contain many sample access tokens. 










