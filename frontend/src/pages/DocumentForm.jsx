import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const DocumentForm = () => {

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("txt");
  const { user } = useAuth();


  //   const submitForm = async (e) => {

  //     e.preventDefault();

  //     const formData = new FormData();

  //     formData.append("name",name);
  //     formData.append("fileType",fileType);
  //     formData.append("uploadedBy","Admin");
  //     formData.append("file",file);

  //     try{

  //       await axios.post(
  //         "http://localhost:3001/admin/createDocument",
  //         formData
  //       );

  //       alert("Document Uploaded");

  //     }catch(err){
  //       console.log(err);
  //     }

  //   };
  const submitForm = async (e) => {

    e.preventDefault();

    const userId = user?.id || user?._id;
    if (!userId) {
      alert("You must be logged in to upload a document");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("fileType", fileType);
    formData.append("uploadedBy", userId);
    formData.append("file", file);

    try {

      await axios.post(
        "http://localhost:3001/admin/createDocument",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Document Uploaded");

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <div>

      <h2>Upload Document</h2>

      <form onSubmit={submitForm}>

        <div>
          <input
            type="text"
            placeholder="Document Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

        <div>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >

            <option value="txt">TXT</option>
            <option value="ppt">PPT</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>

          </select>
        </div>

        <br />

        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <br />

        <button type="submit">
          Upload
        </button>

      </form>

    </div>

  );
};