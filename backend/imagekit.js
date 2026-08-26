import "dotenv/config";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_kei8eP9KqwLD4MEel4C66+ZBrVU=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_ATVcIRj1do3mBIiewKqMbvZ3cLE=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/q4tyybyxh/"
});

export default imagekit;