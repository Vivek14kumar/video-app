// components/SavedDrawer.tsx
import { Drawer, Button, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { deleteFromSaveList, clearSaveList } from "../slicers/video-slicer";
import { useNavigate } from "react-router-dom";

interface SavedDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function SavedDrawer({ open, onClose }: SavedDrawerProps) {
  const dispatch = useDispatch();
  const savedVideos = useSelector((state: any) => state.videos);
  const savedCount = useSelector((state: any) => state.videosCount);
  const navigate = useNavigate();
  
  const handleDelete = (video_id: number) => {
    dispatch(deleteFromSaveList(video_id));
  };

  const handleClearAll = () => {
    dispatch(clearSaveList());
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 350 }, padding: 2 } }} // responsive
    >
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0"> Saved Videos ({savedCount})</h5>
          {savedCount > 0 && (
            <IconButton onClick={handleClearAll} color="error" title="Clear All">
              <ClearAllIcon />
            </IconButton>
          )}
        </div>

        {savedCount === 0 ? (
          <p>No videos saved.</p>
        ) : (
          savedVideos.map((video: any, index: number) => (
            <div key={index} className="mb-3 border rounded p-2 bg-light"
              onClick={() => {navigate(`/watch/${video.video_id}`);onClose();}}
            >
              <div className="d-flex justify-content-between align-items-start">
                <p className="fw-bold mb-1">{video.title}</p>
                <IconButton onClick={() => handleDelete(video.video_id)} size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
              <iframe
                src={video.url}
                width="100%"
                height="150"
                style={{ borderRadius: '6px', pointerEvents: 'none'}}
                frameBorder="0"
              ></iframe>
            </div>
          ))
        )}

        <Button variant="outlined" color="error" onClick={onClose} fullWidth>
          Close
        </Button>
      </div>
    </Drawer>
  );
}
