"use client";

import { useEffect, useState } from "react";
import { downloadFromS3 } from "../../utils/s3Utils";
import Image from "next/image";
import { handleMigration } from "../../utils/migrate";
import { downloadFromRentred, register } from "../../utils/siaUtils";

export default function Migrate() {
  const [fileList, setFileList] = useState<any[]>([]);
  const [siafiles, setSiaFiles] = useState<any[]>([]);

  useEffect(() => {
    const getS3files = async () => {
      const files = await downloadFromS3();
      setFileList(files);
      const files2 = await downloadFromRentred();
      setSiaFiles(files2);
    };
    getS3files();
  }, []);

  const handleMigrate = async (file: string) => {
    handleMigration(file);
  };

  console.log(siafiles);
  console.log(fileList);

  return (
    <div>
      <h1>File Migration</h1>
      <button onClick={() => register()}>Register</button>
      <h1>S3 files</h1>
      <ul>
        {fileList.map((file) => (
          <li key={file.key}>
            <Image
              src={file.url.split("?")[0]}
              height={300}
              width={300}
              alt="Image from s3"
            />
            <button onClick={() => handleMigrate(file)}>Migrate</button>
          </li>
        ))}
      </ul>
      <h1>Sia files</h1>
      <ul>
        {siafiles.map((file) => (
          <li key={file.name}>
            <Image
              src={file.url}
              height={300}
              width={300}
              alt="Image from s3"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
