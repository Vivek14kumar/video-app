import {
  Box, Button, Paper, TextField, Typography, Snackbar, Alert, FormControl, InputLabel, FormHelperText, IconButton, InputAdornment, OutlinedInput
} from '@mui/material';
import { Grid } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import RegImage from '../assets/Imgreg.png';
//import './user-register.css';
import { useState } from 'react';

export function UserRegister() {
  const [userMsg, setUserMsg] = useState('');
  const [userColor, setUserColor] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({ message: '', severity: 'success' as 'success' | 'error' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSnack = (msg: string, severity: 'success' | 'error') => {
    setSnackInfo({ message: msg, severity });
    setSnackOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      user_id: '',
      user_name: '',
      password: '',
      confirm_password: '',
      mobile: '',
      email: ''
    },
    validationSchema: yup.object({
      user_id: yup.string().required('Enter User ID').min(4, 'User ID too short'),
      user_name: yup.string().required('Enter User Name'),
      password: yup
        .string()
        .required('Enter Password')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
          'Must be 6+ chars with upper, lower, number & special char.'
        ),
      confirm_password: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password'),
      mobile: yup.string().required('Enter Mobile No.'),/*.matches(/\+91\d{10}/, 'Invalid Mobile')*/
      email: yup.string().email('Invalid Email').required('Enter Email')
    }),
    onSubmit: (user) => {
      const finalUser = {
        user_id: user.user_id,
        user_name: user.user_name,
        password: user.password,
        mobile: user.mobile,
        email: user.email
      };

      axios.post(`http://127.0.0.1:5050/register-user`, finalUser).then(() => {
         handleSnack('Registered successfully!', 'success');
         setTimeout(() => navigate('/login'), 1500);
      });
    }
  });

  const VerifyUser = (e: any) => {
    axios.get('http://127.0.0.1:5050/get-users').then((res) => {
      const found = res.data.find((u: any) => u.user_id === e.target.value);
      if (found) {
        setUserMsg('User ID already taken');
        setUserColor('red');
      } else {
        setUserMsg('User ID available');
        setUserColor('green');
      }
    });
  };

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ width: '90%', maxWidth: 1000, display: 'flex', borderRadius: 4, overflow: 'hidden', background:'transparent' }}>
        {/* Left Side Image */}
        <Box
          sx={{
            width: '40%',
            backgroundImage: `url(${RegImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'block' }
          }}
        />

        {/* Right Side Form */}
        <Box sx={{ width: { xs: '100%', md: '60%' }, p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Create an Account
          </Typography>

          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={2} >
              <Grid>
                <TextField
                  fullWidth label="User ID" name="user_id" size="small"
                  onChange={formik.handleChange} onKeyUp={VerifyUser} onBlur={formik.handleBlur}
                  error={formik.touched.user_id && Boolean(formik.errors.user_id)}
                  helperText={formik.touched.user_id && formik.errors.user_id}
                />
                <span style={{ color: userColor, fontSize: 14 }}>{userMsg}</span>
              </Grid>

              <Grid>
                <TextField
                  fullWidth label="User Name" name="user_name" size="small"
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.user_name && Boolean(formik.errors.user_name)}
                  helperText={formik.touched.user_name && formik.errors.user_name}
                />
              </Grid>

              <Grid>
                <FormControl fullWidth size="small" variant="outlined" sx={{
                    '& .MuiOutlinedInput-root': {
                      width: '210px', // match TextField small height
                    },
                  }}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText error>{formik.errors.password}</FormHelperText>
                  )}
                </FormControl>

              </Grid>

              <Grid>
                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      width: '210px',
                    },
                  }}
                >
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    label="Confirm Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.confirm_password &&
                      Boolean(formik.errors.confirm_password)
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.confirm_password &&
                    formik.errors.confirm_password && (
                      <FormHelperText error>
                        {formik.errors.confirm_password}
                      </FormHelperText>
                    )}
                </FormControl>

              </Grid>

              <Grid>
                <TextField
                  fullWidth label="Mobile Number" name="mobile" size="small"
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={formik.touched.mobile && formik.errors.mobile}
                />
              </Grid>

              <Grid>
                <TextField
                  fullWidth label="Email" name="email" type="email" size="small"
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              <Grid textAlign="center">
                <Button type="submit" variant="contained" color="info" startIcon={<HowToRegIcon />} sx={{ px: 4 }}>
                  Register
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Already Registered? <Link to="/login">Login</Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>     
        <Alert severity="success"onClose={() => setSnackOpen(false)} 
                variant="filled"
                sx={{ width: '100%' }}>
          {snackInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
