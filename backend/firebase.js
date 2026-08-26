import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const serviceAccount = {
  type: "service_account",
  project_id: "lumya-cd461",
  private_key_id: "7a3ad4cc666523bc226ee0186ae072d91f884303",
  private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDiPZq15WQPUjDv\ng4KFIq4OLStRV4WKe+MxmbES96DLotVWSBoqbXcvzbgvDeV6LahvZUVG48XGfOqC\nsPisNpwIIlYM+QMZIbDZxVpKp7FbOOiZA7W9ygVhHNfSmiPpx1OXvXMgKbxyzlec\nmKWBAogd9DM6PL9PSNbi//xge/FF3B9+V5f7NRbZ2oNuUt4QxgISspjuwp+fFsXt\nfuHmuITc/RbYiqr2oce9vdqUrO91uCJ214VIa6e4E5ZxriEJePrnN4G8guRgkUIv\nbfdfMDFd73G4VJzjfpK229Wnd9RIIlVe6x2g57zXEVxiWQCkMYfMGIn6Z3XciGYE\n17IkqhI/AgMBAAECggEAajn5r+luo2D4mCU7/e4MIpzjx3QcQCsuQEZFJb4+cg7Z\nM4N0QbKXMUta7UENm+HfQbqfngrpfGp/o/CbOiUD+y/ADqRG56BxjLbEz+PP+yCL\n2fird1rpTrE/xuNX9HcCUW+DJDlkgdVPvrfPkfUR21qjSPdn7j6povkF03mujhlM\nQ8i9hjC1F0iSfvey8l6hQ+H3XhYGP1Zsjl8Ht9RsjtcOrJaI9UC+GtjVL8iabE0z\nO/o7CAc04XRphJP/ABsIde3gT1CG2fdoQd7lRiQJ/1LGbA+3UZM+S69lPm4g923y\n0m6aR4jG6nuYIGT/SwMsBx4wE30WoqhAxbtikUuEmQKBgQD6kNJDYbbGFk6No4QN\n4w8DtWxfSYaV6F5ztSlVZ60VU+9Itn/m81mt89Ww2ftnSBpoXPaInQCCTolwRmaE\nC8m6YxxjgVrk3vX6I4omy3R4IWcySl+I77irwFU+mGSnuodJBeZuFaQOqq85UlMk\nwB8aMFHEfYd7f+TOxfky8TpmdwKBgQDnJbn/eNeRU5dkjmL+oiov1vKUed/xl8Qs\Sy5XzFwVsj8UsEB82978iXg3kU5orXi553OA+HzDYSJ2/fKBWVSmMRV/ETDBywol\n2wmFa2CkTDZFSaigwFNQ8sr7/brjupoNTjIGTTSX9ExRhsXU1gM0DoYh4aVyJpJ/\nzCoOIoJ8eQKBgEfR9QLtYjdbM37zzKkyWR5mBT820wXrCg++cK+TPRBs85xy+yxW\nunDbAHhlsuMCztb1NpEn93piSpDNDRtySYtMV1nKPSR3KChfwXynOqYoZO0MVl/o\3pUUVxrPEaLmG1r5/ve06kZt9DXI/B3/l6qpCPb6SDhFC2+dXXWVoXi3AoGAUEcI\n/xIQBBf9B15wQTE+55iGbUyam0RzTFLcCIAgJyTdxaik7PhLzHdN+jaL/czpld8t\nfUhPxGdy2dK+q2/D92gqqBPnVBbZMmaNOvoc+VLCsnOvjgzdosp/9t6bTsYbBK34\nr7mWn4OoEdR11sJxIF4+9Xtxw2BkFuBoZrpTiTkCgYBNWTQtFsrN2KgJFnx5ZCk1\201cgXyjZAzhrvs7aKxLHmeWYasaBLe5jslrHfGUkiLhmQJ9zRRc6fBr9cO436RQ\CXIs49DpPydSWdUqA1AyS6BxcYaTL3wroxFwPCoFTZNFNyFjVMEm4U3T+C+nMjWh\nxKp/+eJKvt847E1YoxRaRg==\n-----END PRIVATE KEY-----`,
  client_email: "firebase-adminsdk-fbsvc@lumya-cd461.iam.gserviceaccount.com",
  client_id: "111195338689004031790",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40lumya-cd461.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export { db, FieldValue };