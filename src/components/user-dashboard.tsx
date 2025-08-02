import { useCookies } from 'react-cookie';
import type { VideoContract } from "../contracts/VideoContract";
import { addToSaveList } from "../slicers/video-slicer";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import {
  Card, CardContent, Typography, CardMedia, CardActions,
  Snackbar, Alert, IconButton, Box
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WatchLaterTwoToneIcon from '@mui/icons-material/WatchLaterTwoTone';
import axios from 'axios';
import './hide-scrollbar.css';
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function UserDashboard() {
  const [cookies] = useCookies(['userid']);
  const [videos, setVideos] = useState<VideoContract[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoContract[]>([]);
  const savedVideos = useSelector((state: any) => state.videos);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useQuery();
  const search = query.get("search")?.toLowerCase() || "";
  const category = query.get("category") || "";

  function applyFilters(videos: VideoContract[]) {
     let result = [...videos];

    if (search) {
      result = result.filter(video =>
        video.title.toLowerCase().includes(search)
      );
    }

    if (category && category !== "-1") {
      result = result.filter(video =>
        video.category_id === parseInt(category)
      );
    }

    setFilteredVideos(result);
  }

  function LoadVideos() {
    axios.get(`http://127.0.0.1:5050/get-videos`)
      .then(response => {
        setVideos(response.data);
        applyFilters(response.data);
      });
  }

  useEffect(() => {
    if (cookies['userid'] === undefined) {
      navigate('/login');
    } else {
      LoadVideos();
    }
  }, []);

  useEffect(() => {
    applyFilters(videos);
  }, [search, category]);

  useEffect(() => {
  if (category === "-1") {
    navigate("/user-dashboard", { replace: true });
  }
}, [category, navigate]);

  const handleClose = () => {
    setOpen(false);
  };

  function handleSaveClick(video: VideoContract) {
    const alreadySaved = savedVideos.some((saved: { video_id: number }) => saved.video_id === video.video_id);
    if (!alreadySaved) {
      dispatch(addToSaveList(video));
    } else {
      setOpen(true); // show snackbar
    }
  }

  return (
    <div className="container-fluid px-4 hide-scrollbar " style={{overflowY:'auto', height:'100vh'}}>
      <section className="mt-4 d-flex flex-wrap justify-content-center justify-content-md-start"
  style={{ marginBottom: '100px' }}  >
        {filteredVideos?.map(video =>
          <Card
            key={video.video_id}
            onClick={() => navigate(`/watch/${video.video_id}`)}
            sx={{
              m:1,
              maxWidth: 270,
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: 1,
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 6,
              },
            }}>         
            <CardMedia
              component="iframe"
              src={video.url}
              sx={{
                height: 150,
                width: '100%',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                pointerEvents:'none'
              }}
            />

            <CardContent sx={{ p: 2, pt: 1 }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#212121',
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                {video.title}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  lineHeight: 1.4,
                  mb: 0.5,
                }}
              >
                {video.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <VisibilityIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption">{video.views} views</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ThumbUpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption">{video.likes}</Typography>
                </Box>
              </Box>
            </CardContent>
              
            <CardActions disableSpacing sx={{ justifyContent: 'space-between', px: 1 }}>
              
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveClick(video);
                }}
                sx={{ color: '#1e88e5' }}
              >
                <Typography fontSize={'small'}>Add To Watch Later</Typography>
                <WatchLaterTwoToneIcon  sx={{fontSize:'medium'}} />
              </IconButton>
            </CardActions>
          </Card>
        )}
      </section>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Video already saved
        </Alert>
      </Snackbar>
    </div>
  );
}
