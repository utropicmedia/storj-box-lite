import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface StorjClientOptions {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface ListDirectoriesParams {
  Bucket?: string;
  Delimiter?: string;
  Prefix?: string;
}

const { VITE_STORJ_ENDPOINT, VITE_STORJ_REGION } = import.meta.env;

const DEFAULT_LIST_DIRECTORIES_PARAMS: ListDirectoriesParams = {
  Delimiter: "/",
  Prefix: "/",
};

export class StorjClient {
  private client: S3Client;
  private static classInstance?: StorjClient;

  private constructor({ accessKeyId, secretAccessKey }: StorjClientOptions) {
    this.client = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      endpoint: String(VITE_STORJ_ENDPOINT),
      region: String(VITE_STORJ_REGION),
    });
  }

  static getInstance(options: StorjClientOptions | null | undefined) {
    if (!this.classInstance && options) {
      this.classInstance = new StorjClient(options);
    } else if (!this.classInstance && !options) {
      throw new Error("StorjClientOptions are required");
    }
    return this.classInstance;
  }

  listDirectories(params: ListDirectoriesParams = {}) {
    const Bucket = params.Bucket;
    const Delimiter =
      params.Delimiter || DEFAULT_LIST_DIRECTORIES_PARAMS.Delimiter;
    const Prefix = params.Prefix || DEFAULT_LIST_DIRECTORIES_PARAMS.Delimiter;
    return this.client.send(
      new ListObjectsV2Command({
        Bucket,
        Delimiter,
        Prefix,
      })
    );
  }

  getObjectUrl(Key: string, Bucket: string) {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket,
        Key,
      }),
      {
        expiresIn: 3600,
      }
    );
  }

  listBuckets() {
    return this.client.send(new ListBucketsCommand({}));
  }
}
