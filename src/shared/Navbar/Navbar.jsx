import { Input, Space, Avatar, Badge } from "antd";
// import type { GetProps } from 'antd';
import { AudioOutlined, MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaPhoneAlt, FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { ClockCircleOutlined } from "@ant-design/icons";

// type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

// const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const items = [
  {
    key: "sub1",
    label: (
      <p className="lg:text-white md:text-white text-black">Navigation One</p>
    ),
    children: [
      {
        key: "1-1",
        // label: "Item 1",
        type: "group",
        children: [
          {
            key: "1",
            label: <Link to="/">Home ZyroMart</Link>,
          },
          {
            key: "2",
            label: "Option 2",
          },
          {
            key: "3",
            label: "Option 3",
          },
          {
            key: "4",
            label: "Option 4",
          },
        ],
      },
    ],
  },
  {
    key: "sub2",
    label: (
      <p className="lg:text-white md:text-white text-black">Navigation Two</p>
    ),
    children: [
      {
        key: "5",
        label: "Option 5",
      },
      {
        key: "6",
        label: "Option 6",
      },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          {
            key: "7",
            label: "Option 7",
          },
          {
            key: "8",
            label: "Option 8",
          },
        ],
      },
    ],
  },
  {
    key: "sub4",
    label: (
      <p className="lg:text-white md:text-white text-black">Navigation Three</p>
    ),
    children: [
      {
        key: "9",
        label: "Option 9",
      },
      {
        key: "10",
        label: "Option 10",
      },
      {
        key: "11",
        label: "Option 11",
      },
      {
        key: "12",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub5",
    label: (
      <p className="lg:text-white md:text-white text-black">Navigation Three</p>
    ),
    children: [
      {
        key: "13",
        label: "Option 9",
      },
      {
        key: "14",
        label: "Option 10",
      },
      {
        key: "15",
        label: "Option 11",
      },
      {
        key: "16",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub6",
    label: (
      <p className="lg:text-white md:text-white text-black">Navigation Three</p>
    ),
    children: [
      {
        key: "17",
        label: "Option 9",
      },
      {
        key: "18",
        label: "Option 10",
      },
      {
        key: "19",
        label: "Option 11",
      },
      {
        key: "20",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub7",
    label: (
      <p className="lg:text-white md:text-white text-black">Navigation Three</p>
    ),
    children: [
      {
        key: "21",
        label: "Option 9",
      },
      {
        key: "22",
        label: "Option 10",
      },
      {
        key: "23",
        label: "Option 11",
      },
      {
        key: "23",
        label: "Option 12",
      },
    ],
  },
];
const onClick = (e) => {
  console.log("click", e);
};

const Navbar = () => {
  return (
    <nav>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow "
            >
              <Menu
                className="bg-white text-black"
                onClick={onClick}
                style={{
                  width: 220,
                }}
                mode="vertical"
                items={items}
              />
            </ul>
          </div>
          <Link className="text-3xl font-bold ps-2 text-white">
            Zyro<span className="text-primary">Mart</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex md:flex justify-center lg:w-[650px] md:w-3/2 lg:-ms-44">
          <Search
            placeholder="Search products"
            allowClear
            enterButton="Search"
            size="large"
            //   onSearch={onSearch}
          />
        </div>

        <div className="navbar-end flex gap-4">
          <Link className="btn text-white hover:bg-primary">
            <FaLocationDot className="text-xl" /> <p>Store Locator</p>
          </Link>
          <Link className="btn text-white text-2xl hover:bg-primary">
            <a href="#">
              <Badge count={5} color="#1E90FF" className="text-white">
                <FaHeart shape="square" className="text-2xl" />
              </Badge>
            </a>
          </Link>
          <Link className="btn text-white text-2xl hover:bg-primary">
            <ShoppingCartOutlined />
          </Link>
          <Link className="btn text-white text-xl hover:bg-primary">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
      </div>

      <Search
        className="lg:hidden md:hidden block px-4 py-4"
        placeholder="Search products"
        allowClear
        enterButton="Search"
        size="large"
        //   onSearch={onSearch}
      />

      <div className="hidden lg:flex justify-start px-4 bg-black text-white">
        <MenuOutlined /> <hr className="border-r-2 h-8 ms-4 my-auto" />
        <Menu
          className="bg-black text-white"
          onClick={onClick}
          style={{
            width: 1080,
          }}
          mode="horizontal"
          items={items}
        />
        <div className="flex justify-center items-center gap-4 font-semibold hover:text-primary">
          <FaPhoneAlt />
          <a href="tel:09727070118">09727-070118</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
