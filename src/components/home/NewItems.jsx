import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const countdownRefs = useRef([]);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setNewItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching new items:", err);
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  const calculateTimeLeft = (expiryDate) => {
    const now = new Date().getTime();
    const difference = expiryDate - now;

    if (difference <= 0) return "Expired";

    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        newItems.forEach((item, index) => {
          if (item.expiryDate && countdownRefs.current[index]) {
            countdownRefs.current[index].textContent = calculateTimeLeft(item.expiryDate);
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, newItems]);

  const carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    autoplay: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 },
      1200: { items: 4 },
    },
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                  <div className="nft__item">
                    <div className="nft_wrap">
                      <Skeleton height={150} />
                    </div>
                    <div className="author_list_pp">
                      <Skeleton
                        circle
                        height={50}
                        width={50}
                        style={{ margin: "0 auto" }}
                      />
                    </div>
                    <div className="nft__item_info">
                      <Skeleton height={20} width="80%" />
                      <Skeleton height={15} width="60%" style={{ marginTop: 5 }} />
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <OwlCarousel className="owl-theme" {...carouselOptions}>
              {newItems.map((item, index) => (
                <div className="nft__item" key={item.id}>
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={`Creator: ${item.creator}`}
                    >
                      <img
                        className="lazy"
                        src={item.authorImage}
                        alt={`Author of ${item.title}`}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  {item.expiryDate && (
                    <div
                      className="de_countdown"
                      ref={(el) => (countdownRefs.current[index] = el)}
                    >
                      {calculateTimeLeft(item.expiryDate)}
                    </div>
                  )}
                  <div className="nft__item_wrap">
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt="NFT Preview"
                      />
                    </Link>
                  </div>
                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
