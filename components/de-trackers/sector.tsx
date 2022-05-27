import Slider from 'react-slick';
import React, { useState } from 'react';

interface IList {
  id: number;
  image: string;
}

function Sector() {
  const [active, setActive] = useState(false);

  const list: IList[] = [
    {
      id: 1,
      image: '/assets/de-trackers/image 4.png',
    },
    {
      id: 2,
      image: '/assets/de-trackers/image 5.png',
    },
    {
      id: 3,
      image: '/assets/de-trackers/image 6.png',
    },
    {
      id: 4,
      image: '/assets/de-trackers/image 7.png',
    },
    {
      id: 5,
      image: '/assets/de-trackers/image 8.png',
    },
    {
      id: 6,
      image: '/assets/de-trackers/image 9.png',
    },
    {
      id: 7,
      image: '/assets/de-trackers/image 10.png',
    },
    {
      id: 8,
      image: '/assets/de-trackers/image 11.png',
    },
    {
      id: 9,
      image: '/assets/de-trackers/image 12 (1).png',
    },
    {
      id: 10,
      image: '/assets/de-trackers/image 13.png',
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 1,
  };

  const handleClick = () => {
    setActive(true);
  };

  return (
    <>
      <div className="bg-sector py-4">
        <div className="container">
          <div className="row g-1 g-lg-1">
            <Slider {...settings}>
              {list.map((list, index) => (
                <div className="col" key={index}>
                  <img
                    className="img-fluid text-center m-auto"
                    src={list.image}
                    alt="photo"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}
export default Sector;
