import React, { useState, useEffect } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Post from "./Post/Post";

// firebase
import { db } from "./firebase";
import firebase from "firebase";

function App() {
  // 필요한 데이타
  // 1. avatar, username, caption, imageUrl
  const [posts, setPosts] = useState([]);

  // useEffect로 db데이터 받아오기
  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          caption: doc.data().caption,
          imageUrl: doc.data().imageUrl,
          username: doc.data().username,
        }))
      );
    });
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        ></img>
      </div>

      <h1>hello lama</h1>

      {/* Posts */}
      {/* ex */}
      {/* {projects.map(project => (
            <ProjectList key={project.id} project={project} /> */}
      {posts.map((post) => (
        <Post
          key={post.username}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
