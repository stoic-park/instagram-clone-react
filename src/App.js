import React, { useState, useEffect } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Post from "./Post/Post";
import ImageUpload from "./ImageUpload/ImageUpload";

// firebase
import { db, auth } from "./firebase";
import firebase from "firebase";

// material-ui
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  // 필요한 데이타
  // 1. avatar, username, caption, imageUrl
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // console.log(posts);

  // useEffect로 db데이터 받아오기
  // useEffect..!
  // 컴포넌트가 렌더링 된 이후에 어떤일을 수행할 것인가?
  // 첫번째 렌더링과 이후의 모든 업데이트에서 수행
  // 모든 업데이트? 비효율적이잖아?
  // 그래서 핸들링을 좀 해줘야한다
  // 두번째 인자에 배열을 넘겨주면 랜더링시 변경되지 않는다면 effect를 건너뛴다!
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
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

  // auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        // console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        console.log("no user");
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  // sign-up function
  const signUp = (event) => {
    // 왜 쓰는지 알제?
    event.preventDefault();

    // power simple
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  // sign-in function
  const signIn = (event) => {
    event.preventDefault();

    // power simple.. 더 간단하네?
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      {/* sign up modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                // className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              signUp
            </Button>
          </form>
        </div>
      </Modal>

      {/* sign in modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                // className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              signin
            </Button>
          </form>
        </div>
      </Modal>

      {/* Header */}
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        ></img>

        {/* user의 유무에 따라서 버튼 달리하기 */}
        {user ? (
          // 1줄로 로그아웃..ㄷㄷ
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {/* Posts */}
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              // post={post.post}
            />
          ))}
        </div>
        {/* 이런게 있냐..? */}
        <div className="app_postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CE3gu4ng7LL/?utm_source=ig_web_copy_link"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {/* <h1>hello lama</h1> */}

      {/* ImageUpload */}
      {/* user?.displayName? */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>글을 쓰려면 로그인을 하세요</h3>
      )}
    </div>
  );
}

export default App;
