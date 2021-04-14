import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class Api {
  client = new S3Client({
    credentials: {
      accessKeyId: "GET_THIS_FROM_SOMEWHERE",
      secretAccessKey: "GET_THIS_FROM_SOMEWHERE",
    },
    endpoint: "GET_THIS_FROM_SOMEWHERE",
    region: "GET_THIS_FROM_SOMEWHERE",
  });

  listDirectories(Delimiter = "/", Prefix = "") {
    return this.client.send(
      new ListObjectsV2Command({
        Bucket: "bucket1",
        Delimiter,
        Prefix,
      })
    );
  }

  getObjectUrl(key: string) {
    // return key;
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: "bucket1",
        Key: key,
      }),
      {
        expiresIn: 3600,
      }
    );
  }
}

export const api = new Api();
