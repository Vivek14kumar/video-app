import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { VideoContract } from '../contracts/VideoContract';

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import.meta.env.VITE_API_URL

export function VideoPlayerPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoContract | null>(null);
  const [allVideos, setAllVideos] = useState<VideoContract[]>([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number>(video?.likes || 0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(isSmallScreen);
  
  useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_URL}/get-video/${videoId}`).then(res => {
    console.log("Video fetched:", res.data); // ← confirm it's correct
    if (res.data && res.data.video_id) {
      setVideo(res.data);
      setLikes(res.data.likes);
    }
  });

  axios.get(`${import.meta.env.VITE_API_URL}/get-videos`).then(res =>
    setAllVideos(res.data)
  );

  setLiked(false);
}, [videoId]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/like/${video?.video_id}`);
      setLikes(prev => prev + 1);
      setLiked(true);
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: '100%',
        minHeight: '100vh',
      }}
    >
      {/* Left: Main Video */}
      {video && (
        <Box
          sx={{
            flex: 2,
            p: { xs: 1, md: 2 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Iframe Wrapper */}
        <Box 
          sx={{ position:'relative', width: '100%', paddingTop: '56.25%', mb: 1}}>
          <Box
            component="iframe"
            src={`${video.url.split('?')[0]}?autoplay=1&mute=1`}

            title={video.title}
            allowFullScreen
            sx={{
              position: 'absolute',
              top: -22,
              left: 0,
              width: '100%',
              height: '98%',
              border: 'none',
              borderRadius: '10px',
            }}
            />
          </Box>

          {/* Title and Like Button */}
        <Box
          sx={{
            mt: -4.9,
            px: { xs: 1, md: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#212121',
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {video.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleLike} disabled={liked}>
              {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            </IconButton>
            <Typography variant="body2">{likes}</Typography>
          </Box>
        </Box>
        </Box>
      )}

      {/* Right: Scrollable Sidebar */}
      <Box
        sx={{
          flex: 1,
          px: { xs: 1, md: 2 },
          pb: { xs: 2 },
          borderLeft: { md: '1px solid #ccc' },
          borderTop: { xs: '1px solid #ccc', md: 'none' },
          overflowY: 'auto',
          maxHeight: { xs: 'auto', md: '100vh' },
        }}
      >
        {allVideos.map(v => (
          <Card
            key={v.video_id}
            sx={{
              cursor: 'pointer',
              backgroundColor: '#e8eaf6',
              mb: 2,
              boxShadow: 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3,
              },
            }}
            onClick={() => navigate(`/watch/${v.video_id}`)}
          >
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                src={v.url}
                title={v.title}
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  pointerEvents: 'none',
                }}
              />
            </Box>
            <CardContent>
              <Typography variant="subtitle2" noWrap>
                {v.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
