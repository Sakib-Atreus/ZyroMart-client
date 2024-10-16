import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import { Cascader, Input, Select, Space } from "antd";
import "./Phones.css";

const { Option } = Select;

const Phones = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 my-8">
      <Breadcrumb
        className="my-6"
        separator=">"
        items={[
          {
            title: (
              <Link to="/" className="text-md font-semibold">
                Home
              </Link>
            ),
          },
          {
            title: (
              <p to="/" className="text-md font-semibold text-primary">
                Phones
              </p>
            ),
          },
        ]}
      />
      <div className="lg:flex md:flex grid grid-cols-4 gap-2 text-sm font-normal my-8">
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Samsung
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Huawei
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Xiaomi
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          OnePlus
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Oppo
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Motorola
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Vivo
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Realme
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Wacom
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Nokia
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Nothing
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          iPhone
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Tecno
        </Link>
        <Link
          to="/"
          className=" text-[#292D32] border border-[#c6c7c9] px-3 py-1 rounded-full"
        >
          Honor
        </Link>
      </div>
      <div className="flex border-t border-gray-300">
        {/* Sidebar */}
        <div className="w-1/5 p-4 border-r border-gray-300 lg:pe-8 lg:pt-8 md:pe-8 md:pt-8">
          {/* Price Filter */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Price</h2>
            <Slider
              range
              defaultValue={[7999, 299999]}
              min={7999}
              max={299999}
              className="custom-slider"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>Min: 7,999</span>
              <span>Max: 2,99,999</span>
            </div>
          </div>

          {/* Other Filters */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Color</h2>
            {/* Add color checkboxes */}
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">Red</span>
              </label>
            </div>
            {/* Repeat for other colors */}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold">RAM</h2>
            {/* Add RAM checkboxes */}
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">4 GB</span>
              </label>
            </div>
            {/* Repeat for other RAM options */}
          </div>
          {/* Repeat for ROM and Storage */}
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-4 lg:ps-8 lg:pt-8 md:ps-8 md:pt-8">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Phones</h2>
              <h3 className="text-sm">201 items found in Phones</h3>
            </div>
            <div className="text-sm text-left">
              <Select
                placeholder="Sort by" // Display the placeholder
                className="custom-select" // Add a custom class
                dropdownClassName="custom-dropdown" // Custom dropdown class
                style={{ width: 200 }} // Width of the Select component
                dropdownStyle={{ width: 200 }} // Set the width of the dropdown
                bordered={false} // Remove border
              >
                <Option value="new-arrivals">New Arrivals</Option>
                <Option value="price-low-high">Price Low to High</Option>
                <Option value="price-high-low">Price High to Low</Option>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 text-center">
            {/* Product Card */}
            <Link to="/phones/new">
            <div className="shadow-xl bg-white pb-2">
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/product/20220405_1649146951_699542.png"
                alt="Product Image"
              />
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/brand/20191204_1575461019_541440.png"
                alt="brand icon"
                className="w-14 h-8 mx-auto"
              />
              <h3 className="text-md font-semibold">Redmi Note 11S</h3>
              <p className="text-orange-600 font-bold my-2">Tk. 27,999</p>
              <p className="text-sm text-gray-500">No Review Yet</p>
            </div></Link>
            <div className="shadow-xl bg-white pb-2">
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1719983159812679.jpeg"
                alt="Product Image"
              />
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/brand/20191202_1575290973_740323.jpeg"
                alt="brand icon"
                className="w-14 h-8 mx-auto"
              />
              <h3 className="text-md font-semibold">Vivo Y28</h3>
              <p className="text-orange-600 font-bold my-2">Tk. 20,999</p>
              <p className="text-sm text-gray-500">No Review Yet</p>
            </div>
            <div className="shadow-xl bg-white pb-2">
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1717237546618684.jpeg"
                alt="Product Image"
              />
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/brand/20191202_1575290973_740323.jpeg"
                alt="brand icon"
                className="w-14 h-8 mx-auto"
              />
              <h3 className="text-md font-semibold">Vivo Y18</h3>
              <p className="text-orange-600 font-bold my-2">Tk. 14,999</p>
              <p className="text-sm text-gray-500">No Review Yet</p>
            </div>
            <div className="shadow-xl bg-white pb-2">
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1717660403496377.jpeg"
                alt="Product Image"
              />
              <img
                src="https://dvf83rt16ac4w.cloudfront.net/upload/brand/20180405_1522919778_830681.png"
                alt="brand icon"
                className="w-14 h-8 mx-auto"
              />
              <h3 className="text-md font-semibold">Galaxy M14 4G</h3>
              <p className="text-orange-600 font-bold my-2">Tk. 17,999</p>
              <p className="text-sm text-gray-500">No Review Yet</p>
            </div>
            {/* Repeat similar product cards */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phones;
