const crypto = require("crypto");
const { EJSON } = require('bson');
const secret = "pppppppppppppppppppppppppppppppp";

const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv); 

  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    password: encryptedPassword.toString("hex"),
  };
};

const decrypt = (password, iv) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(secret),
    Buffer.from(iv, "hex") 
  );

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(password, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
};
const data ={ iv: "3d19afb91ed54cdbd63df32e6763b2e2" , passcode: "4a19b9ccc3bdd2ee"}
// const data = '{ "someId": { "$oid": "5ec7cb151a1878fbefce4119" } }'


// const doc = EJSON.parse(data, { relaxed: false });

// console.log(data.iv)



module.exports = { encrypt, decrypt };
