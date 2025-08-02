import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import type  {CategoryContract}  from "../contracts/CategoryContract";
import type { VideoContract } from "../contracts/VideoContract";
import { TextField, FormControl, Select, InputLabel, MenuItem, Button, Grid, Snackbar, Alert } from "@mui/material";

export function EditVideo(){
        const id = useParams();

        const [categories, setCategories] = useState<CategoryContract[]>();

       const [videos, setVideos] = useState<VideoContract | null>(null);


        let navigate = useNavigate();

        let params = useParams();

        const [open, setOpen]= useState(false);
        const handleClose = ()=>{
          setOpen(false);
        }

        const formik = useFormik({
  initialValues: {
    video_id: videos?.video_id || 0,
    title: videos?.title || '',
    description: videos?.description || '',
    comment: videos?.comment || '',
    likes: videos?.likes || 0,
    views: videos?.views || 0,
    url: videos?.url || '',
    category_id: videos?.category_id || -1
  },
  enableReinitialize: true,
  onSubmit: (updatedVideo) => {
    axios.put(`http://127.0.0.1:5050/edit-video/${params.id}`, updatedVideo)
      .then(() => {
        setOpen(true);
        setTimeout(() => {
          navigate('/admin-dashboard?refresh=true');
        }, 1000);
      });
  }
});


        function LoadCategories(){
            axios.get(`http://127.0.0.1:5050/get-categories`)
            .then(response=> {
                 response.data.unshift({category_id:-1, category_name:'Select Category'});
                 setCategories(response.data);
            })
        }

        function LoadVideos(){
            axios.get(`http://127.0.0.1:5050/get-video/${params.id}`)
  .then(response => { 
    setVideos(response.data);
  });

        }

    
        useEffect(()=>{
            LoadCategories();
            LoadVideos();
        },[id])
    
    return(
        <div className="container-fluid">
            <h2 className="mb-4">Edit Video</h2>
             <form onSubmit={formik.handleSubmit}>
                <Grid container rowSpacing={2} 
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid size={6}>
                    <TextField
                      value={formik.values.video_id}
                      type="number"
                      name="video_id"
                      fullWidth
                      size="small"
                      disabled
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Title"
                      value={formik.values.title}
                      type="text"
                      name="title"
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Description"
                      value={formik.values.description}
                      type="text"
                      name="description"
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Comments"
                      value={formik.values.comment}
                      type="text"
                      name="comments"
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="URL"
                      value={formik.values.url}
                      type="text"
                      name="url"
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Likes"
                      value={formik.values.likes}
                      type="number"
                      name="likes"
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Views"
                      value={formik.values.views}
                      type="number"
                      name="views"
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        name="category_id"
                        value={formik.values.category_id}
                        onChange={formik.handleChange}
                      >
                        {
                          categories?.map(category =>
                            <MenuItem key={category.category_id} value={category.category_id}>
                              {category.category_name}
                            </MenuItem>
                          )
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <Button type="submit" variant="contained" color="success" sx={{mr:2}}>
                      Update
                    </Button>
                    <Button variant="contained" color="error" onClick={() => navigate('/admin-dashboard')}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
             </form>
             <div>
                 <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                 <Alert
                 onClose={handleClose}
                 severity="success"
                 variant="filled"
                 sx={{ width: '100%' }}>
                 Video Modified Successfully.
                 </Alert>
                 </Snackbar>
              </div>
        </div>
    )
}