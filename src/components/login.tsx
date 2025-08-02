import axios from "axios"
import { Link } from 'react-router-dom'
import { useState } from "react";
import { Button, TextField } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import { useCookies } from "react-cookie";
import './login.css'
import filmIcon from '../assets/film-icon.png';
import videoIcon from '../assets/video-icon.png';
import videoIcon1 from '../assets/video-icon2.png';
import image4 from '../assets/img4.png';
import image5 from '../assets/img5.png';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

export function Login(){
    const [_cookies, setCookie] = useCookies(['adminid','userid']);
    const[loginType, setLoginType] = useState<'admin' |'user'>('user');
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            admin_id:'',
            password:''
        },
        onSubmit : (login:any)=>{
            const url = loginType === 'admin'?`http://127.0.0.1:5050/get-admin`:`http://127.0.0.1:5050/get-users`;
             axios.get(url)
             .then(response=> {
                 let result = response.data.find((item:any)=>(loginType==='admin'? item.admin_id : item.user_id) === login.admin_id);
                 if(result){
                     if(result.password===login.password) {
                        if(loginType==='admin'){
                            setCookie('adminid',login.admin_id)
                            navigate('/admin-dashboard');
                        }else{
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
    })
    return(
        <div className='container-fluid '>
            <img src={filmIcon} alt="Film Icon" className='film-icon' />
            <img src={videoIcon} alt="Film Icon" className='video-icon' />
            <img src={videoIcon1} alt="Film Icon" className='video-icon1' />
            <img src={videoIcon1} alt="Film Icon" className='video-icon2' />
            <img src={filmIcon} alt="Film Icon" className='film-icon1' />
            <img src={videoIcon} alt="Film Icon" className='video-icon3' />
            <img src={image4} alt="Image" className='image4' />
            <img src={image5} alt="Image" className='image5'/>


            <div className='login-box'>
                <div className="d-flex justify-content-between">
                    <button className="w-100 btn btn-primary rounded-0 rounded-start border-end" onClick={() => setLoginType('user')}>User</button>
                    <button className="w-100 btn btn-primary rounded-0 rounded-end" onClick={() => setLoginType('admin')}>Admin</button>
                </div>
                <h1 className='text-center login-title'>{loginType === 'admin' ? 'Admin Login' : 'User Login'}</h1>

                <form className='text-center p-2' onSubmit={formik.handleSubmit}>
                    <TextField label='Enter User Id' name='admin_id' className='w-100' onChange={formik.handleChange}/>
                    <TextField label='Enter Password' type='password' name='password' className='w-100 my-4 ' onChange={formik.handleChange}/>
                    <Button variant='contained' color='secondary' type='submit' startIcon={<LoginIcon/>} className='w-100'>Login</Button>
                    <div >
                        {loginType === 'user'&&(
                            <Link className='create-new-ac' to='/user-register'>Don't have an account? Create now !</Link>
                        )}
                        {loginType === 'admin'&&(
                            <Link className="text-decoration-none" to='/'> Back</Link>
                        )}
                    </div>
                                        
                </form>
            </div>
        </div>
    )
}