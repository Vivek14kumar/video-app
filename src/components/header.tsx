// components/Header.tsx
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Button, IconButton, FormControl, InputLabel, Select, MenuItem,
  Paper, InputBase, useTheme
} from "@mui/material";
import { useState, useEffect } from "react";
import './header.css';
import axios from 'axios';
import { useSelector } from "react-redux";
import { styled } from '@mui/material/styles';
import type { CategoryContract } from "../contracts/CategoryContract";
import Badge, { badgeClasses } from '@mui/material/Badge';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SearchIcon from '@mui/icons-material/Search';
import { SavedDrawer } from "./SavedDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/logo.png';

export function Header() {
  const [cookies, , removeCookie] = useCookies(['adminid', 'userid']);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryContract[]>();
  const savedCount = useSelector((state: any) => state.videosCount);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSignout() {
    if (cookies.adminid) removeCookie('adminid');
    if (cookies.userid) removeCookie('userid');
    navigate('/');
  }

  function LoadCategories() {
    axios.get(`http://127.0.0.1:5050/get-categories`)
      .then(response => {
        response.data.unshift({ category_id: -1, category_name: 'All' });
        setCategories(response.data);
      });
  }

  useEffect(() => {
    LoadCategories();
  }, []);

  const CountBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
    }
  `;

  return (
    <header className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center p-3 ">

        {/* Logo / Title */}
        <div>
          
          <h3 className="text-primary fw-bold m-0 videolib"><img src={logo} alt="Logo" style={{width:'40px'}} /> Video Library</h3>
        </div>

        {/* Mobile: Hamburger + Watch Later */}
        <div className="d-md-none d-flex align-items-center gap-2">
          {/* Watch Later Icon */}
          {cookies.userid && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <CountBadge badgeContent={savedCount} color="error" overlap="circular">
                <SubscriptionsIcon sx={{ color: 'black', fontSize: 26 }} />
              </CountBadge>
            </IconButton>
          )}

          {/* Hamburger Icon */}
          <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>


        {/* Desktop Search */}
        {cookies.userid && (
          <div className="d-flex align-items-center gap-3 header-search-container my-2 mx-3">
            <Paper
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams();
                if (searchText.trim() !== "") params.set("search", searchText.trim());
                if (selectedCategory !== "-1") params.set("category", selectedCategory);
                navigate(params.toString() ? `/user-dashboard?${params}` : "/user-dashboard");
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                width: 500,
                borderRadius: 2,
                backgroundColor: "transparent",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 90, flexBasis: "40%", flexShrink: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setSelectedCategory(newCategory);
                    const params = new URLSearchParams();
                    if (searchText.trim() !== "") params.set("search", searchText.trim());
                    if (newCategory !== "-1") params.set("category", newCategory);
                    navigate(params.toString() ? `/user-dashboard?${params}` : "/user-dashboard");
                  }}
                  sx={{ '& fieldset': { border: 'none' } }}
                >
                  {categories?.map((category) => (
                    <MenuItem key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <InputBase
                sx={{ flex: 1 }}
                placeholder="Search video..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: 1, color: theme.palette.primary.main }}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>
        )}
       
        {/* Desktop Right Buttons */}
        <div className="d-none d-md-flex align-items-center gap-4">
          <div>
            {(cookies.adminid || cookies.userid) ? (
              <>
                {cookies.adminid && (
                  <Link className="text-decoration-none fw-medium text-dark" to="/admin-dashboard">{cookies.adminid}</Link>
                )}
                {cookies.userid && (
                  <Link className="text-decoration-none fw-medium text-dark" to="/user-dashboard">{cookies.userid}</Link>
                )}
              </>
            ) : (
              <Link className="text-decoration-none fw-medium text-dark" to="/">Home</Link>
            )}
          </div>

          <div>
            {cookies.userid ? (
              <div className="position-relative text-center">
                <IconButton onClick={() => setDrawerOpen(true)}>
                  <SubscriptionsIcon sx={{ color: 'black', fontSize: 26 }} />
                  <CountBadge badgeContent={savedCount} color="error" overlap="circular" />
                  <span className="text-secondary" style={{
                    fontSize: 8,
                    lineHeight: 1,
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: 32,
                    left: 0,
                  }}>
                    WATCH LATER
                  </span>
                </IconButton>
              </div>
            ) : cookies.adminid ? (
    <Link className="text-decoration-none fw-medium text-dark" to="/login">
      
    </Link>
  ) : (
    <Link className="text-decoration-none fw-medium text-dark" to="/login">
      Login
    </Link>
  )}
          </div>

          <div>
            {(cookies.adminid || cookies.userid) ? (
              <Button variant="outlined" color="error" size="small" onClick={handleSignout}>
                Log Out
              </Button>
            ) : (
              <Link className="text-decoration-none fw-medium text-dark" to="/user-register">Register</Link>
            )}
          </div>
        </div>
      </div>
            
      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown d-md-none w-100 px-3 pb-3">
          <div className="d-flex flex-column gap-3">
            
            {cookies.userid && (
              <Link className="text-decoration-none text-dark fw-medium" to="/user-dashboard" onClick={() => setMobileMenuOpen(false)}>{cookies.userid}</Link>
            )}
            {cookies.adminid && (
              <Link className="text-decoration-none text-dark fw-medium" to="/user-dashboard" onClick={() => setMobileMenuOpen(false)}>{cookies.adminid}</Link>
            )}
            {(cookies.userid||cookies.adminid) ? null : (
              <> 
              <Link className="text-decoration-none text-dark fw-medium" to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link className="text-decoration-none text-dark fw-medium" to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </>
              
            )}
            {(cookies.userid || cookies.adminid) ? (
              <Button variant="outlined" color="error" size="small" onClick={() => { handleSignout(); setMobileMenuOpen(false); }}>
                Log Out
              </Button>
            ) : (
              <Link className="text-decoration-none text-dark fw-medium" to="/user-register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            )}
          </div>
        </div>
      )}

      <SavedDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
