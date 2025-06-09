import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
// import NotificationCard from '../components/NotificationCard';
import { AuthContext } from '../auth/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  console.log("User => ", user);
  const [posts, setPosts] = useState([]);
//   const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
      try {
        const postRes = await API.get('/posts');
        console.log(posts);
        setPosts(postRes.data);
        console.log(posts);

        // const notifRes = await API.get(`/users/${user.id}/notifications`);
        // setNotifications(notifRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };

  useEffect(() => {
    fetchData();
  }, [user]);
    useEffect(() => {
        console.log('posts state updated →', posts);
    }, [posts]);

  return (
    <div className="home-container">
      <div className="posts-area">
        <h2>Latest Posts</h2>
        <CreatePost onPostCreated={fetchData} />
        {posts.map((post) => (
          <PostCard key={post.posts_id} post={post} />
        ))}
      </div>
      {/* <div className="notifications-area">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <NotificationCard key={n.id} data={n} />
          ))
        )}
      </div> */}
    </div>
  );
};

export default Home;