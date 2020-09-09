import React, { useState, useEffect } from "react";
import "./Post.css";

import { Avatar, Input, Button } from "@material-ui/core";
import { db } from "../firebase";
import firebase from "firebase";

function Post(props) {
  // console.log(props);

  // 댓글 기능 추가
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  // console.log(comments);
  // 댓글 받아오기
  // 파이어베이스에서 컬렉션 추가하는것도 신기하넹
  useEffect(() => {
    let unsubscribe;
    if (props.postId) {
      unsubscribe = db
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  // 포스트 함수
  const handlePostComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(props.postId).collection("comments").add({
      comment: comment,
      // username: props.username,
      // 로그인한 유저네임이 들어가야지?
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt="lama"
          src="/static/images/avatar/1.jpg"
        ></Avatar>
        <h3>{props.username}</h3>
      </div>
      {/* header => avatar + username */}

      <img className="post_image" src={props.imageUrl} alt=""></img>
      {/* image */}

      <h4 className="post_text">
        <strong>{props.username}</strong>
        <br />
        {props.caption}
      </h4>
      {/* username + caption */}

      {/* 댓글 */}
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.comment}
          </p>
        ))}
      </div>

      {/* 로그인한 상태에서만 댓글 달수 있게 */}
      {props.user && (
        // {/* 댓글 달기 */}
        <form className="post_commentBox">
          <Input
            className="post_input"
            type="text"
            placeholder="Add a Comment!"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={handlePostComment}
          >
            Post
          </Button>
        </form>
      )}
    </div>
  );
}

export default Post;
