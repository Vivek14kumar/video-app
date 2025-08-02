import { BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import { Header } from "./components/header";
//import { Login }  from './components/login'
import { Login } from './components/login'
//import { UserLogin } from "./components/user-login";
import { VideoLibraryHome } from './components/video-library-home'
import { AdminDashboard } from "./components/admin-dashboard";
import { UserRegister } from "./components/user-register";
import { UserDashboard } from "./components/user-dashboard";
import { AddVideo } from "./components/add-video";
import { EditVideo } from "./components/edit-video";
import { DeleteVideo } from "./components/delete-video";
import { VideoPlayerPage } from "./components/videoPlayerPage";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Header/>
      <section>
        <Routes>
          <Route path='/' element={<VideoLibraryHome/>}/>
          {/*<Route path="login" element={<Login/>}/>*/}
          <Route path='login' element={<Login/>}/>
          {/*<Route path="user-login" element={<UserLogin/>}/>*/}
          <Route path="admin-dashboard" element={<AdminDashboard/>}>
            <Route path="add-video" element={<AddVideo/>}/>
            <Route path="edit-video/:id" element={<EditVideo/>}/>
            <Route path="delete-video/:id" element={<DeleteVideo/>}/>
          </Route>
          <Route path="user-dashboard" element={<UserDashboard/>}/>
          <Route path="user-register" element={<UserRegister/>}/>
          <Route path="/watch/:videoId" element={<VideoPlayerPage />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />

        </Routes>
      </section>
      </BrowserRouter>    
    </div>
  )
}

export default App
