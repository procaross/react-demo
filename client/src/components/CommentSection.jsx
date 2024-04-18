import React, { useState, useEffect, useContext } from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuth0 } from "@auth0/auth0-react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const CommentSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { userData } = useUser();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/movies/${movieId}/comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    fetchComments();
  }, [movieId]);

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/movies/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.accessToken}`,
        },
        body: JSON.stringify({ content: newComment, userId: userData.id }),
      });

      if (response.ok) {
        const data = await response.json();
        const newCommentData = { ...data, user: userData }
        setComments([...comments, newCommentData]);
        setNewComment('');
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Failed to submit comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.accessToken}`,
        },
        body: JSON.stringify({ userId: userData.id }),
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  return (
    <div>
      <TextField
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{
          mt: 10,
        }}
      />
      <Button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
              sx={{color: 'black', fontWeight: 'bold', fontSize: '20px', mt: 2, mb: 2, width: '100%'}}
      >
        Submit
      </Button>
      <List sx={{ mt: 2 }}>
        {comments.map((comment) => (
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{comment.user.nickname ? comment.user.nickname[0].toUpperCase() : 'U'}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={comment.user.nickname || 'Anonymous'}
              secondary={
                <React.Fragment>
                  <Typography component="span" sx={{fontSize: '20px'}}>
                    {comment.content}
                  </Typography>
                </React.Fragment>
              }
            />
            {userData && comment.user.id === userData.id && (
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <DeleteIcon/>
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CommentSection;