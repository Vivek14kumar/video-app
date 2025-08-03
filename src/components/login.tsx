import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useCookies } from "react-cookie";
import { useFormik } from 'formik';
import './login.css'
import filmIcon from '../assets/film-icon.png';
import videoIcon from '../assets/video-icon.png';
import videoIcon1 from '../assets/video-icon2.png';
import image4 from '../assets/img4.png';
import image5 from '../assets/img5.png';

export function Login() {
    const [_cookies, setCookie] = useCookies(['adminid', 'userid']);
    const [loginType, setLoginType] = useState<'admin' | 'user'>('user');
    const [showPassword, setShowPassword] = useState(false);
    let navigate = useNavigate();

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const formik = useFormik({
        initialValues: {
            admin_id: '',
            password: ''
        },
        onSubmit: (login: any) => {
            const url = loginType === 'admin' ? `${import.meta.env.VITE_API_URL}/get-admin` : `${import.meta.env.VITE_API_URL}/get-users`;
            axios.get(url)
                .then(response => {
                    let result = response.data.find((item: any) => (loginType === 'admin' ? item.admin_id : item.user_id) === login.admin_id);
                    if (result) {
                        if (result.password === login.password) {
                            if (loginType === 'admin') {
                                setCookie('adminid', login.admin_id)
                                navigate('/admin-dashboard');
                            } else {
                                setCookie('userid', login.admin_id);
                                navigate('/user-dashboard');
                            }
                        } else {
                            alert('Invalid Password');
                        }
                    } else {
                        alert(`${loginType === 'admin' ? 'Admin' : 'User'} Doesn't Exist`);
                    }
                })
        }
    });

    return (
        <div className='container-fluid'>
            <img src={filmIcon} alt="Film Icon" className='film-icon' />
            <img src={videoIcon} alt="Video Icon" className='video-icon' />
            <img src={videoIcon1} alt="Video Icon" className='video-icon1' />
            <img src={videoIcon1} alt="Video Icon" className='video-icon2' />
            <img src={filmIcon} alt="Film Icon" className='film-icon1' />
            <img src={videoIcon} alt="Video Icon" className='video-icon3' />
            <img src={image4} alt="Image" className='image4' />
            <img src={image5} alt="Image" className='image5' />

            <div className='login-box'>
                <div className="d-flex justify-content-between">
                    <button className="w-100 btn btn-primary rounded-0 rounded-start border-end" onClick={() => setLoginType('user')}>User</button>
                    <button className="w-100 btn btn-primary rounded-0 rounded-end" onClick={() => setLoginType('admin')}>Admin</button>
                </div>
                <h1 className='text-center login-title'>{loginType === 'admin' ? 'Admin Login' : 'User Login'}</h1>

                <form className='text-center p-2' onSubmit={formik.handleSubmit}>
                    <TextField
                        label='Enter User ID'
                        name='admin_id'
                        className='w-100'
                        onChange={formik.handleChange}
                    />
                    <TextField
                        label='Enter Password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        className='w-100 my-4'
                        onChange={formik.handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        variant='contained'
                        color='secondary'
                        type='submit'
                        startIcon={<LoginIcon />}
                        className='w-100'
                    >
                        Login
                    </Button>
                    <div>
                        {loginType === 'user' && (
                            <Link className='create-new-ac' to='/user-register'>Don't have an account? Create now!</Link>
                        )}
                        {loginType === 'admin' && (
                            <Link className="text-decoration-none" to='/'>Back</Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
