import React from 'react';
import './ImageHover.css';

const ImageHover = () => {
  return (
    <div className="image-container">
      {/* First image with hover effect */}
      <div className="image-wrapper">
        <img 
          src="https://img.freepik.com/premium-photo/laptop-with-many-headphones-keyboard-it_984237-49388.jpg" 
          alt="JBL Charge 5" 
          className="hover-image"
        />
        <div className="overlay">
          <p>JBL Charge 5</p>
        </div>
      </div>

      {/* Second image with hover effect */}
      <div className="image-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1628114855403-820f62c99e02?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGVsZWN0cm9uaWMlMjBwcm9kdWN0fGVufDB8fDB8fHww" 
          alt="Headphones"
          className="hover-image"
        />
        <div className="overlay">
          <p>Headphones</p>
        </div>
      </div>

      {/* Third image with hover effect */}
      <div className="image-wrapper">
        <img 
          src="https://www.droptica.com/sites/droptica.com/files/styles/blog_banner_image/public/media/image/10%20inspirujacych%20stron.jpg?itok=1vGYQVwW" 
          alt="TWS Collections"
          className="hover-image"
        />
        <div className="overlay">
          <p>TWS Collections</p>
        </div>
      </div>

    </div>
  );
};

export default ImageHover;
