import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  signatureVersion: "v4",
});

const s3 = new AWS.S3();

export const handleS3Delete = (key: string) => {
  console.log("Deleting file...");

  const params = {
    Bucket: "miuve",
    Key: key,
  };
  s3.deleteObject(params, (error) => {
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log("File deleted successfully");
      window.location.reload();
    }
  });
};

export const downloadFromS3 = async (): Promise<any[]> => {
  console.log("Downloading...");
  const params = {
    Bucket: "miuve",
  };

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const fileKeys: any = data.Contents?.map((file) => {
          return {
            key: file.Key,
            url: convertUrlToFile(file.Key),
            body: file,
          };
        });
        resolve(fileKeys);
        console.log("Done Downloading...");
      }
    });
  });
};

export const uploadToS3 = async (selectedFile: File) => {
  console.log("Uploading...");

  const s3 = new AWS.S3();
  if (!selectedFile) {
    return;
  }
  try {
    const params = {
      Bucket: "miuve",
      Key: `${Date.now()}.${selectedFile.name}` || "",
      Body: selectedFile,
    };
    await s3.upload(params).promise();
    console.log("Done Uploading!");
  } catch (err) {
    console.log(err);
  }
};

export const convertUrlToFile = (key: any) => {
  const params = {
    Bucket: "miuve",
    Key: key,
  };
  const signedUrl = s3.getSignedUrl("getObject", params);
  return signedUrl;
};
