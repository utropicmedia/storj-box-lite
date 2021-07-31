import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectRequest,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileWithPath } from "file-selector";

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

  createFolder(bucket: string, name: string, prefix: string | undefined) {
    const params: PutObjectRequest = {
      Bucket: bucket,
      ContentLength: 0,
      Key: `${prefix ? `${prefix}/` : ""}${name}/`,
    };
    const cmd = new PutObjectCommand(params);
    return this.client.send(cmd);
  }

  deleteFile(Bucket: string, Key: string) {
    return this.client.send(new DeleteObjectCommand({ Key, Bucket }));
  }

  async deleteFolder(Bucket: string, Key: string) {
    const objects = await this.listDirectories({
      Bucket,
      Prefix: Key,
    });
    const Objects =
      objects && objects.Contents && objects.Contents.length > 0
        ? objects.Contents.map((c) => ({ Key: c.Key }))
        : [];
    return this.client.send(
      new DeleteObjectsCommand({ Delete: { Objects }, Bucket })
    );
  }

  getObjectUrl(Bucket: string, Key: string) {
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket, Key }), {
      expiresIn: 3600,
    });
  }

  listDirectories(params: ListDirectoriesParams = {}) {
    // If the last character in the prefix is not a slash, we need to add one
    const options = {
      Bucket: params.Bucket,
      ...(params.Delimiter
        ? { Delimiter: params.Delimiter }
        : { Delimiter: DEFAULT_LIST_DIRECTORIES_PARAMS.Delimiter }),
      ...(params.Prefix && {
        Prefix:
          params.Prefix.slice(-1) === "/" ? params.Prefix : `${params.Prefix}/`,
      }),
    };
    return this.client.send(new ListObjectsV2Command(options));
  }

  listBuckets() {
    return this.client.send(new ListBucketsCommand({}));
  }

  async uploadFiles({
    files,
    bucket,
    prefix,
  }: {
    files: FileWithPath[];
    bucket: string;
    prefix: string | undefined;
  }) {
    const promises = files.map(async (file) => {
      const Key = `${prefix}/${(file.path ? file.path : file.name).replace(
        /^\//g,
        ""
      )}`.replace(/^\//g, "");
      const params: PutObjectRequest = {
        Body: file,
        Bucket: bucket,
        Key,
        ContentType: file.type,
      };
      const cmd = new PutObjectCommand(params);
      const r = await this.client.send(cmd);
      return r;
    });
    const response = await Promise.all(promises);
    return response;
  }
}
