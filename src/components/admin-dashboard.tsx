import { useCookies } from 'react-cookie';
import type { VideoContract } from "../contracts/VideoContract";
import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import {
  Table, TableBody, TableHead, TableRow, TableCell,
  Card, CardContent, Typography, IconButton, Button,
  TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export function AdminDashboard() {
  const [cookies] = useCookies(['adminid']);
  const [videos, setVideos] = useState<VideoContract[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const navigate = useNavigate();

  const LoadVideos = () => {
    axios.get(`http://127.0.0.1:5050/get-videos`)
      .then(response => setVideos(response.data));
  };

  useEffect(() => {
    if (cookies['adminid'] === undefined) {
      navigate('/login');
    } else {
      LoadVideos();
    }
  }, [location.search]);// <-- Runs again when '?refresh=true' appears

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleVideos = videos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="container-fluid row mb-4 gx-1">
      <section className="col-md-7 ">
        <Card elevation={3} className="" sx={{backgroundColor:'transparent',}}>
          <CardContent>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center align-items-sm-center gap-2 mb-3">
              <Typography variant="h5" fontWeight="bold">Video Management</Typography>
              <Link to="add-video" >
                <Button fullWidth variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>
                  Add Video
                </Button>
              </Link>
            </div>
            <div style={{  overflowY: 'auto', overflowX: 'auto' }}>
            <Table stickyHeader size="small" sx={{ border: '1px solid rgb(253, 251, 251)',height:100,overflowY:"auto"}}>
              <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Preview</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleVideos.map(video => (
                  <TableRow key={video.video_id} hover sx={{ transition: '0.2s', '&:hover': { backgroundColor: '#f1f1f1' } }}>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>
                      <iframe
                        src={video.url}
                        height={90}

                        style={{ borderRadius: '8px' }}
                        title={`preview-${video.video_id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton component={Link} to={`edit-video/${video.video_id}`}>
                        <EditIcon sx={{ color: 'blue' }} />
                      </IconButton>
                      <IconButton component={Link} to={`delete-video/${video.video_id}`}>
                        <DeleteIcon sx={{ color: 'red' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={videos.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={3}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[]}
            />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="col-md-5 mt-4 mt-md-0">
        <Card elevation={3} className="" sx={{backgroundColor:'transparent'}}>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
