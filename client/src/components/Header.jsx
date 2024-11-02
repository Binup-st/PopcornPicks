import { Button, Navbar, TextInput } from "flowbite-react";
import { LuPopcorn, LuSearch } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const path = useLocation();
  return (
    <Navbar className="border-b-2">
      <Link to="/" className="flex whitespace-nowrap self-center">
        <LuPopcorn color="red" className="w-7 h-7 sm:w-9 sm:h-9 " />
        <span className="px-1 pb-1 bg-red-500 rounded-lg text-white text-xl sm:text-2xl font-semibold flex self-center">
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
      <div className="flex gap-2 md:order-2">
        <Button className="w-9 h-9 sm:hidden flex self-center" color="red" pill>
          <LuSearch color="red" />
        </Button>
        <Link to="/signin">
          <Button className="bg-red-500">Sign In</Button>
        </Link>
      </div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={'div'}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/genre"} as={'div'}>
          <Link to="/genre">Genre</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/popular"} as={'div'}>
          <Link to="/popular">Popular</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/latest"} as={'div'}>
          <Link to="/latest">Latest</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
