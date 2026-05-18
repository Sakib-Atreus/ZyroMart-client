import React from 'react';
import Carousel from './Carousel/Carousel';
import FeaturedCategories from './FeaturedCategories/FeaturedCategories';
import ExclusiveProducts from './ExclusiveProducts/ExclusiveProducts';
import NewArrival from './NewArrival/NewArrival';
import ImageHover from './ImageHover/ImageHover';
import Accessories from './Accessories/Accessories';
import WelcomeModal from '../../components/WelcomeModal/WelcomeModal';

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <WelcomeModal />
            <Carousel/>
            <FeaturedCategories/>
            <ExclusiveProducts/>
            <NewArrival/>
            <Accessories/>
            <ImageHover/>
        </div>
    );
};

export default Home;