import React from "react";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { File, Paths } from "expo-file-system/next";
export const useDownloadData = (url: string) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<string | undefined>(undefined);
  const [status, setStatus] = React.useState<string | undefined>(undefined);
  const downloadData = async () => {
    setLoading(true);

    try {
      setStatus("creating directory...");
      const dirPath = `${FileSystem.cacheDirectory}wordlist`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (dirInfo.exists) {
        setStatus("directory already exists.Skipping...");
      } else {
        await FileSystem.makeDirectoryAsync(dirPath, {
          intermediates: true,
        });
        setStatus("directory created successfully..");
      }
      const uri = `${dirPath}/wordlist.json`;
      setStatus("downloading file...");
      const output = await FileSystem.downloadAsync(url, uri);
      if (output.status !== 200)
        console.log("download failed with status:" + output.status);
      else {
        console.log("download status:" + output.status);
        setStatus("downloaded successfully");
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileInfo.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        setData(content);
        setLoading(false);
      } else {
        console.log("file not found");
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    downloadData();
  }, [url]);

  return { loading, data, status };
};
