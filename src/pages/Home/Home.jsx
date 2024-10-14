import React from 'react';
import Carousel from './Carousel/Carousel';
import FeaturedCategories from './FeaturedCategories/FeaturedCategories';
import ExclusiveProducts from './ExclusiveProducts/ExclusiveProducts';
import NewArrival from './NewArrival/NewArrival';
import ImageHover from './ImageHover/ImageHover';

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Carousel/>
            <FeaturedCategories/>
            <ExclusiveProducts/>
            <NewArrival/>
            <ImageHover/>
        </div>
    );
};

export default Home;