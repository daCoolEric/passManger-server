// crypto module
const crypto = require("crypto");


const encrypt = (data) => {
    const algorithm = "aes-256-cbc"; 

    // generate 16 bytes of random data
    const initVector = Buffer.from(crypto.randomBytes(16));

    // secret key generate 32 bytes of random data
    const Securitykey = Buffer.from(crypto.randomBytes(32));

    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

    // encrypt the message
    // input encoding
    // output encoding
    let encryptedData = cipher.update(data, "utf-8", "hex");

    encryptedData += cipher.final("hex");
    // console.log("Encrypted message: " + encryptedData);
    const obj = {
        EncryptedData : encryptedData,
        iv: initVector.toString('hex'),
        sk: Securitykey.toString('hex'),
        
    }

    // console.log(obj);

    return obj;

    

}

//  encrypt("Eric is a man");





const decrypt = (obj) => {
    // algorithm
    const algorithm = "aes-256-cbc"; 

    // the decipher function
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(obj.sk, "hex"), Buffer.from(obj.iv, "hex"));

    let decryptedData = decipher.update(Buffer.from(obj.EncryptedData, "hex"), "utf-8");

    decryptedData += decipher.final("utf8"); 

    // console.log( decryptedData);
    const decryptedObj = {
        id: obj.id,
        data: decryptedData,

    }
    console.log(decryptedObj);
    return decryptedObj;

}

// decrypt();

module.exports = { encrypt, decrypt };

