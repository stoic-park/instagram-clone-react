// https://9e2d2807b5cc.ngrok.io ?
// localhost를 공용ip로 전환시켜주는 서비스
import React, { useState } from "react";
import { Input, Button } from "@material-ui/core";

// firebase
import { storage, db } from "../firebase";
import firebase from "firebase";

// CSS
import "./ImageUpload.css";

function ImageUpload(props) {
  // 스테이트
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  //   console.log(image);

  // 함수
  const handleChange = (e) => {
    //! 여러장의 이미지를 업로드 할 때는?
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // Complete function
        // storage에 제대로 저장이 됐다면 경로 받아오기..!
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: props.username, // props로 받아와야지
            });
            // 완료 후 셋팅
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageupload">
      {/* I want to have */}
      {/* Caption input */}
      {/* File picker */}
      {/* Post button */}

      <progress className="imageupload_progress" value={progress} max="100" />
      <Input
        type="text"
        placeholder="Enter a comment"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <Input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
