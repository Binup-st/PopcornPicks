import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { LuPopcorn } from "react-icons/lu";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const path = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignout = async ()=>{
    try{
      const res = await fetch('/api/user/signout', {
        method: 'POST'
      })
      const data = await res.json()
      if(!res.ok){
        console.log(data.message)
      }
      else{
        dispatch(signoutSuccess())
        navigate("/authPage")
      }
    }
    catch(err){
      console.log(err.message)
    }
  }

  return (
    <Navbar className="border-b-2">
      <Link to="/" className="flex whitespace-nowrap self-center">
        <LuPopcorn color="red" className="w-7 h-7 sm:w-9 sm:h-9 " />
        <span className="px-1 pb-1 rounded-lg text-white bg-customRed text-xl sm:text-2xl font-semibold flex self-center">
          PICKS
        </span>
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-12 hidden sm:inline mr-2"
          color="gray"
          pill
          onClick={()=>dispatch(toggleTheme())}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                @{currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/authpage">
            <Button className="bg-customRed " color="failure">
              Sign In
            </Button>
          </Link>
        )}
      </div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/mywatchlist"} as={"div"}>
          <Link to="/mywatchlist">My Watchlist</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/popular"} as={"div"}>
          <Link to="/popular">Popular</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/upcoming"} as={"div"}>
          <Link to="/upcoming">Upcoming</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
