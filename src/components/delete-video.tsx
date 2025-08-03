import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { VideoContract } from "../contracts/VideoContract";
import { Typography, Button, Box, Snackbar, Alert } from "@mui/material";
import.meta.env.VITE_API_URL

export function DeleteVideo() {
  const { id } = useParams();
  const [video, setVideo] = useState<VideoContract | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/get-video/${id}`)
        .then(response => setVideo(response.data))
        .catch(error => {
          console.error("Failed to fetch video", error);
          navigate('/admin-dashboard');
        });
    }
  }, [id]);

  const handleDeleteClick = () => {
    axios.delete(`${import.meta.env.VITE_API_URL}/delete-video/${id}`)
      .then(() => {
        setOpen(true);
        setTimeout(() => {
          navigate('/admin-dashboard?refresh=true');
        }, 1000);
      })
      .catch(err => console.error("Delete failed", err));
  };

  if (!video) return <div>Loading...</div>; // Wait until video is loaded

  return (
    <div className="container-fluid">
      <Typography variant="h5" fontWeight="bold" gutterBottom color="error">
        Delete Video
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Are you sure you want to delete the video?
      </Typography>

      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">Title:</Typography>
        <Typography variant="body1" fontWeight="bold">{video.title}</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        {video.url ? (
          <iframe
            src={video.url}
            width="100%"
            height="200"
            style={{ borderRadius: '8px' }}
            title="video-preview"
          ></iframe>
        ) : (
          <Typography variant="body2" color="text.secondary">No preview available</Typography>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" color="error" onClick={handleDeleteClick}>
          Yes, Delete
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/admin-dashboard">
          Cancel
        </Button>
      </Box>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Video Deleted
        </Alert>
      </Snackbar>
    </div>
  );
}
