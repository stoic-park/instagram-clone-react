import React from "react";
import "./Post.css";

import { Avatar } from "@material-ui/core";

function Post(props) {
  console.log(props);
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

      <img className="post_image" src={props.imageUrl}></img>
      {/* image */}

      <h4 className="post_text">
        <strong>{props.username}</strong>
        {props.caption}
      </h4>
      {/* username + caption */}
    </div>
  );
}

export default Post;
