# Notes

## Node.bcrypt.js

The node.bcrypt.js library is a popular library for hashing passwords in Node.js. It is a wrapper around the bcrypt library, which is a C++ implementation of the bcrypt algorithm. The bcrypt algorithm is a password hashing function that is designed to be slow and computationally expensive, making it difficult for attackers to brute-force passwords.

### Salt

Salt rounds are a security feature of the bcrypt algorithm that is used to hash passwords. The salt rounds parameter determines the number of rounds the library should go through to give you a secure hash. Bcrypt uses this value to go through 2^rounds processing iterations. The higher the salt rounds, the more time it will take to generate a secure hash.

The salt is a random string that makes the hash unpredictable. It is added to the password before it is hashed to make it even more unique. The reason for this is that it makes it hard to set up a “rainbow table” to brute-force the passwords, even if the entire database of hashed passwords is stolen.

### Usage

To hash passwords with bycrypt use the bcrypt.hash() function. The function takes two parameters: the password you want to hash and the number of salt rounds you want to use. Increasing the number of salt rounds makes bcrypt.hash() slower, which makes your passwords harder to brute force.

## Lean method

The \_doc property is where Mongoose stores the “raw” value of the document. A document itself has getters/setters, the $\_\_ property, etc. But \_doc is just a Plain Old JavaScript Object representation of the document, with no getters/setters, methods, or anything Mongoose-specific.

lean() method will get a plain JavaScript object instead of a Mongoose document. This will remove the \_doc property from the object

## JWT

JSON web token (JWT), pronounced "jot", is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. Again, JWT is a standard, meaning that all JWTs are tokens, but not all tokens are JWTs.

Because of its relatively small size, a JWT can be sent through a URL, through a POST parameter, or inside an HTTP header, and it is transmitted quickly. A JWT contains all the required information about an entity to avoid querying a database more than once. The recipient of a JWT also does not need to call a server to validate the token.

### JWT secret key

The secret key is used to sign the JWT and verify its authenticity. When you sign a JWT with a secret key, the resulting token includes a signature that can be used to verify that the token was not tampered with. The secret key should be kept secret and not shared with anyone else. If someone else has access to the secret key, they can create their own JWTs that will be accepted by your application.

`process.env.JWT_KEY` is the secret key that was used to sign the JWT. The jwt.verify() function will verify the signature of the token and return the original payload data if the signature is valid.

### Sign

“sign” means that the function is creating a digital signature for the JSON Web Token. The signature is created using a secret key that is known only to the server. The signature can be used to verify that the token was not tampered with and that it was issued by a trusted party.

### Different payloads same secret key

It is okay to have different payloads data signed with the same secret key in JWT. The electronic signature is a mathematical computation applied to the payload of the JWT using a secret key. The purpose is to ensure that the message has not been altered and to recognize the signer to validate the JWT.

The signature will be different for different payloads, even if the change is minimal. Usually are included date claims such as exp and iss that make the token always different.

## Cookie

HTTP cookies are small blocks of data created by a web server while a user is browsing a website and placed on the user's computer or other device by the user's web browser. Cookies are placed on the device used to access a website, and more than one cookie may be placed on a user's device during a session.

`res.clearCookie("accessToken", { sameSite: "none", secure: true })`

`sameSite` This specifies how the cookie should be sent with cross-site requests. Setting it to “none” means that the cookie will be sent with all requests, regardless of the origin. This option is useful for third-party cookies that need to be accessible across different sites.
`secure` This specifies whether the cookie should only be sent over HTTPS connections. Setting it to true means that the cookie will not be sent over insecure HTTP connections. This option is useful for protecting sensitive data in cookies.

The `expires` attribute takes a date in UTC format that specifies when the cookie will expire. The `maxAge` attribute takes a number in seconds that specifies how long the cookie will be valid. For example:

Some cookies may need to be persistent and last for a long time, such as preferences or authentication cookies. Some cookies may need to be temporary and last only for a session, such as shopping cart or tracking cookies. Some general guidelines for choosing an expire date are:

Use a far future date (such as 10 years) for cookies that store user preferences or settings that are unlikely to change.
Use a short or medium duration (such as a few hours or days) for cookies that store information that may change frequently or become outdated, such as product prices or availability.
