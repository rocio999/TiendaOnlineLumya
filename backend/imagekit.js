
require("dotenv").config();

const ImageKit = require("imagekit");


const imagekit = new ImageKit({
publicKey: "public_kei8eP9KqwLD4MEel4C66+ZBrVU=",
privateKey: "private_ATVcIRj1do3mBIiewKqMbvZ3cLE=",
urlEndpoint: "https://ik.imagekit.io/q4tyybyxh"
});


module.exports = imagekit;