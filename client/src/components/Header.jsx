import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { LuPopcorn, LuSearch } from "react-icons/lu";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

export default function Header() {
  const path = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  return (
    <Navbar className="border-b-2">
      <Link to="/" className="flex whitespace-nowrap self-center">
        <LuPopcorn color="red" className="w-7 h-7 sm:w-9 sm:h-9 " />
        <span className="px-1 pb-1 rounded-lg text-white bg-customRed text-xl sm:text-2xl font-semibold flex self-center">
          PICKS
        </span>
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={LuSearch}
          className="hidden sm:inline"
        />
      </form>
      <Button className="w-9 h-9 sm:hidden flex self-center" pill>
        <LuSearch color="red" />
      </Button>
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
            <Dropdown.Item>Sign Out</Dropdown.Item>
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
        <Navbar.Link active={path === "/genre"} as={"div"}>
          <Link to="/genre">Genre</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/popular"} as={"div"}>
          <Link to="/popular">Popular</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/latest"} as={"div"}>
          <Link to="/latest">Latest</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
