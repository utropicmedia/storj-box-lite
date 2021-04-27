import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StorjClient } from "../lib/storjClient";
import { selectSettings } from "../store/settings/settingsSlice";

export default function UploadButton({ onUpload }: any) {
  const [selectedFile, setSelectedFile] = useState(undefined);
  const { settings, loading } = useSelector(selectSettings);

  const handleFileInput = (e: any) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // uploadFile(selectedFile);
    }
  };

  // const uploadFile = (file: any) => {
  //   const doUpload = async (f: any) => {
  //     if (settings && settings.auth) {
  //       const storjClient = StorjClient.getInstance(settings.auth);
  //       console.log("storjClient", storjClient);
  //       if (storjClient) {
  //         console.log("file", f);
  //         const response = await storjClient.uploadFile(f, f.name, "bucket1");
  //         console.log("response", response);
  //         if (onUpload) {
  //           console.log("call onUpload");
  //           onUpload(response);
  //         }
  //         setSelectedFile(null);
  //       }
  //     }
  //   };
  //   doUpload(file);
  // };

  useEffect(() => {
    const doUpload = async (f: any) => {
      console.log("doUpload");
      if (settings && settings.auth) {
        const storjClient = StorjClient.getInstance(settings.auth);
        console.log("storjClient", storjClient);
        if (storjClient) {
          console.log("file", f);
          const response = await storjClient.uploadFile(
            f,
            f.name,
            "bucket1",
            f.type
          );
          console.log("response", response);
          if (onUpload) {
            console.log("call onUpload");
            onUpload(response);
          }
          setSelectedFile(undefined);
        }
      }
    };
    console.log("useEffect", selectedFile, onUpload, settings);
    if (selectedFile && onUpload && settings) {
      doUpload(selectedFile);
    }
  }, [selectedFile, onUpload, settings]);

  return (
    <>
      {!loading && settings && (
        <>
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="-ml-0.5 mr-2">
              <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
            </span>{" "}
            Upload
            <input type="file" onChange={handleFileInput} className="hidden" />
          </label>
        </>
      )}
    </>
  );
}
