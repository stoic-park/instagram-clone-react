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
  console.log(posts);
  // useEffect로 db데이터 받아오기
  // useEffect..!
  // 컴포넌트가 렌더링 된 이후에 어떤일을 수행할 것인가?
  // 첫번째 렌더링과 이후의 모든 업데이트에서 수행
  // 모든 업데이트? 비효율적이잖아?
  // 그래서 핸들링을 좀 해줘야한다
  // 두번째 인자에 배열을 넘겨주면 랜더링시 변경되지 않는다면 effect를 건너뛴다!
  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      // onSnapshot : every time a new post is added!
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
          // caption: doc.data().caption,
          // imageUrl: doc.data().imageUrl,
          // username: doc.data().username,
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
      {posts.map((post) => (
        <Post
          key={post.id}
          username={post.post.username}
          caption={post.post.caption}
          imageUrl={post.post.imageUrl}
          // post={post.post}
        />
      ))}
    </div>
  );
}

export default App;
