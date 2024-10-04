import { Input, Space } from "antd";
// import type { GetProps } from 'antd';
import { Menu } from "antd";
import { Link } from "react-router-dom";

// type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

// const suffix = (
//   <AudioOutlined
//     style={{
//       fontSize: 16,
//       color: '#1677ff',
//     }}
//   />
// );

// const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const items = [
  {
    key: "sub1",
    label: <p className="text-white">Navigation One</p>,
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
    label: <p className="text-white">Navigation Two</p>,
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
    label: <p className="text-white">Navigation Three</p>,
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
                className="h-5 w-5"
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <Menu
                className=""
                onClick={onClick}
                style={{
                  width: 220,
                }}
                mode="vertical"
                items={items}
              />
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">ZyroMart</a>

          <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            //   onSearch={onSearch}
          />
        </div>

        <div className="navbar-end">
          <a className="btn">Login</a>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex justify-center bg-black">
        <Menu
          className="flex justify-center bg-black text-white"
          onClick={onClick}
          style={{
            width: 480,
          }}
          mode="horizontal"
          items={items}
        />
      </div>
    </nav>
  );
};

export default Navbar;
