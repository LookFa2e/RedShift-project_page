import React from 'react';
import '../scss/sideads.scss'; 
import LeftAds from '../images/left.webp';
import RightAds from '../images/right.webp';


const SideAds: React.FC= () => {
  return (
    <div className="side-ads">
      <div className="side-ads-left">
        <img src={LeftAds} alt="leftads" />
      </div>
      <div className="side-ads-right">
        <img src={RightAds} alt="rightads" />
      </div>
    </div>
  );
};

export default SideAds;
