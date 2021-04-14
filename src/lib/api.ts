import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { VITE_STORJ_ENDPOINT, VITE_STORJ_REGION } = import.meta.env;

export class Api {
  client: S3Client;

  constructor(accessKeyId: string, secretAccessKey: string) {
    this.client = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      endpoint: String(VITE_STORJ_ENDPOINT),
      region: String(VITE_STORJ_REGION),
    });
  }

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
