import axios from "axios";
import * as yup from 'yup';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type  {CategoryContract}  from "../contracts/CategoryContract";
import { TextField, FormControl, Select, InputLabel, MenuItem, Button, Grid,Snackbar, Alert } from "@mui/material";

export function AddVideo(){
    let navigate = useNavigate();

    const [categories, setCategories] = useState<CategoryContract[]>();
    const [nextVideoId, setNextVideoId] = useState<number| null>(null);

    useEffect(()=>{
      axios.get(`${import.meta.env.VITE_API_URL}/get-videos`)
      .then(response=>{
        const autoId = response.data;
        //
        if(Array.isArray(autoId) && autoId.length>0){
          const lastVideo = autoId.reduce((max,video)=>
            video.video_id > max.video_id ? video :max
          );
          const newId = lastVideo.video_id + 1;
            setNextVideoId(newId);
            formik.setFieldValue("video_id",newId);
        }else{
          //No video in database, so start with 1
          setNextVideoId(1);
        }
      })
    },[])


    const formik = useFormik({ 
        initialValues: {
            video_id :0,
            title: '',
            description:'',
            comment:'',
            likes:null,
            views:null,
            url:'',
            category_id:-1
        },
        validationSchema:yup.object({
          title:yup.string().required("Enter Video Title"),
          description:yup.string().required("Enter Description"),
          comment:yup.string().required("Enter Comments"),
          likes:yup.number().required("Enter Likes"),
          views:yup.number().required("Enter Views"),
          url:yup.string().required("Enter URL"),
          category_id: yup.number().min(1, "Please select a valid category").required("Select Category")
        }),
        onSubmit : (video) => {
             axios.post(`http://127.0.0.1:5050/add-video`, video)
             .then(()=>{
                 console.log('video added');
             })
             setOpen(true); // show snackbar
             setTimeout(() => {
             navigate('/admin-dashboard?refresh:true');// navigate with query to indicate refresh
            }, 1000); // 1 seconds delay
        }
    })

    useEffect(()=>{
        axios.get(`http://127.0.0.1:5050/get-categories`)
        .then(response=> {
             response.data.unshift({category_id:-1, category_name:'Select Category'});
             setCategories(response.data);
        })
    },[])


    const [open, setOpen] = useState(false);
    /*const handelSave =() =>{
      setOpen(true);
    }*/
    const handleClose= ()=>{
      setOpen(false);
    }
    return(
        <div className="container">
            <h2 className="mb-4">Add Video</h2>
             <form onSubmit={formik.handleSubmit} noValidate>
                <Grid container rowSpacing={2} 
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid size={6}>
                    <TextField
                      type="text"
                      name="video_id"
                      value={nextVideoId || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      size="small"
                    />

                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Title"
                      type="text"
                      name="title"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                    <dd className="text-danger text-lg-start" style={{ fontSize: 14 }}>
                {formik.touched.title && formik.errors.title}
              </dd>
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Description"
                      type="text"
                      name="description"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                    <dd className="text-danger text-lg-start" style={{ fontSize: 14 }}>
                {formik.touched.description && formik.errors.description}
              </dd>
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Comment"
                      type="text"
                      name="comment"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                    <dd className="text-danger text-lg-start" style={{ fontSize: 14 }}>
                {formik.touched.comment && formik.errors.comment}
              </dd>
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="URL"
                      type="text"
                      name="url"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                    <dd className="text-danger text-lg-start" style={{ fontSize: 14 }}>
                {formik.touched.url && formik.errors.url}
              </dd>
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Likes"
                      type="number"
                      name="likes"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                    <dd className="text-danger text-lg-start" style={{ fontSize: 14 }}>
                {formik.touched.likes && formik.errors.likes}
              </dd>
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Views"
                      type="number"
                      name="views"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      fullWidth
                      size="small"
                    />
                    <dd className="text-danger text-lg-start" style={{ fontSize: 14 }}>
                { formik.touched.views && formik.errors.views}
              </dd>
                  </Grid>
                  <Grid size={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        name="category_id"
                        onBlur={formik.handleBlur}
                        value={formik.values.category_id}
                        onChange={formik.handleChange}
                      >
                        {
                          categories?.map(category =>
                            <MenuItem key={category.category_id} value={category.category_id} >
                              {category.category_name}
                            </MenuItem>
                          )
                        }
                        
                      </Select>
                    </FormControl>
                    <dd className="text-danger text-lg-start" style={{ fontSize: 14 }}>
                {formik.touched.category_id && formik.errors.category_id}
              </dd>
                  </Grid>
                  <Grid size={12} >
                    <Button type="submit" variant="contained" color="success" sx={{mr:2}} >Add Video</Button>
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
                Video Save Successfully
                </Alert>
                </Snackbar>
             </div>
        </div>
    )
}