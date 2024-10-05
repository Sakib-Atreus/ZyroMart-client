import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import na1 from "../../../assets/NewArrival/na1.png";
import na2 from "../../../assets/NewArrival/na2.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
const { Meta } = Card;

const NewArrival = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // For devices with width <= 1024px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For devices with width <= 768px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
      {
        breakpoint: 480, // For devices with width <= 480px (mobile)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
    ],
  };
  return (
    <div className="">
      <div className="pt-4 pb-8">
        <h1 className="text-3xl text-center font-semibold">New Arrival</h1>
      </div>

      <Slider {...settings}>
        {[
          "https://dvf83rt16ac4w.cloudfront.net/upload/product/20220820_1660984332_600269.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/product/20240104_1704359142_975696.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/product/20220113_1642052594_412206.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/product/20231223_1703312020_658522.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/1725942431648642.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/1725772826476726.jpeg",
        ].map((src, index) => (
          <div key={index} className="mx-auto">
            {" "}
            {/* Center each product card */}
            <Card
              style={{
                width: 300,
                position: "relative", // Ensure positioning for the overlay
              }}
              cover={
                <div style={{ position: "relative" }}>
                  <img
                    alt="example"
                    src={src}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "10px",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <img
                      src="https://gadgetandgear.com/_next/static/media/online-only.6c507492.svg"
                      className="w-16 h-16"
                      alt=""
                    />
                  </div>
                </div>
              }
              actions={[
                // <SettingOutlined key="setting" />,
                // <EditOutlined key="edit" />,
                // <EllipsisOutlined key="ellipsis" />,
                <div className="flex gap-2">
                  {/* Customize Buy Now button */}
                  <Link
                    to=""
                    className="bg-orange-100 !text-primary px-4 py-2 rounded-md hover:bg-primary hover:!text-white text-md font-semibold"
                  >
                    Buy Now
                  </Link>
                  {/* Customize Add To Cart button */}
                  <Link
                    to=""
                    className="bg-gray-200 !text-gray-600 px-4 py-2 rounded-md hover:bg-gray-700 hover:!text-white text-md font-semibold"
                  >
                    Add To Cart
                  </Link>
                </div>,
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                }
                title="Card title"
                description="This is the description"
              />
            </Card>
          </div>
        ))}
      </Slider>

      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-between gap-2 my-8">
        <img src={na1} alt="" />
        <img src={na2} alt="" />
      </div>
    </div>
  );
};

export default NewArrival;
