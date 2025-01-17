import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import oep1 from "../../../assets/OnlineExclusiveProducts/oep1.png";
import oep2 from "../../../assets/OnlineExclusiveProducts/oep2.png";
import oep3 from "../../../assets/OnlineExclusiveProducts/oep3.png";
import oep4 from "../../../assets/OnlineExclusiveProducts/oep4.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";

const { Meta } = Card;

const ExclusiveProducts = () => {
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
      <div className="flex justify-between pt-24 pb-8 pe-1 lg:pe-0 md:pe-0">
        <h1 className="text-2xl text-center font-semibold px-2">Online Exclusive Products</h1>
        <Link className="flex text-center items-center gap-2 text-sm text-primary">
          Show All <IoIosArrowForward />
        </Link>
      </div>

      <Slider {...settings}>
        {[
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/1717390962489463.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/1720426819380127.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/1717318099047728.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/1717405672465672.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/1717832416869803.jpeg",
          "https://dvf83rt16ac4w.cloudfront.net/upload/media/171784176344481.jpeg"
        ].map((src, index) => (
          <div key={index} className="mx-auto"> {/* Center each product card */}
            <Card
              style={{
                width: 300,
                position: 'relative', // Ensure positioning for the overlay
              }}
              cover={
                <div style={{ position: 'relative' }}>
                  <img alt="example" src={src} style={{ width: '100%', height: 'auto' }} />
                  <div
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '10px',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    <img src="https://gadgetandgear.com/_next/static/media/online-only.6c507492.svg" className="w-16 h-16" alt="" />
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
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title="Card title"
                description="This is the description"
              />
            </Card>
          </div>
        ))}
      </Slider>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 justify-between gap-2 my-12">
        <img src={oep1} alt="" className="mx-auto" /> {/* Center each image */}
        <img src={oep2} alt="" className="mx-auto" />
        <img src={oep3} alt="" className="mx-auto" />
        <img src={oep4} alt="" className="mx-auto" />
      </div>
    </div>
  );
};

export default ExclusiveProducts;
