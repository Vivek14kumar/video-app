import img from '../assets/img.png';
import { Button, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import './video-library-home.css';
import { useNavigate, Link } from 'react-router-dom';

export function VideoLibraryHome() {
  const navigate = useNavigate();

  function handleWatch() {
    navigate('./login');
  }

  return (
    <div className="home-container">
      <div className="home-text">
        <h1 className="home-title">Watch. Learn. Enjoy.</h1>
        <p className="home-subtitle">
          Watch trending clips, tutorials, and entertainment — all in one place.
        </p>

        <div className="">
          <Button
            color="warning"
            variant="contained"
            size="medium"
            startIcon={<MovieIcon />}
            onClick={handleWatch}
            className="watch-btn"
          >
            Watch Now
          </Button>
        </div>

        <Typography variant="body2" sx={{ fontStyle: 'italic',mt:2 }}>
          Don't have an account? <Link to="/user-register">Create now</Link>
        </Typography>
      </div>

      <div className="home-image">
        <img src={img} alt="Banner" />
      </div>
    </div>
  );
}
