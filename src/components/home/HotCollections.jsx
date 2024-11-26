import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hot collections:", err);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 },
      1200: { items: 4 },
    },
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    key={index}
                  >
                    <div className="nft_coll">
                      {/* NFT Image Placeholder */}
                      <div className="nft_wrap">
                        <Skeleton height={150} />
                      </div>
                      {/* Author Image Placeholder */}
                      <div className="nft_coll_pp">
                        <Skeleton
                          circle
                          height={50}
                          width={50}
                          style={{ margin: "0 auto" }}
                        />
                      </div>
                      {/* Collection Info Placeholder */}
                      <div className="nft_coll_info">
                        <Skeleton height={20} width="80%" />
                        <Skeleton height={15} width="60%" style={{ marginTop: 5 }} />
                      </div>
                    </div>
                  </div>
                ))
            : (
              <OwlCarousel className="owl-theme" {...carouselOptions}>
                {collections.slice(0, 4).map((collection) => (
                  <div
                    className="item"
                    key={collection.id}
                  >
                    <div className="nft_coll">
                      {/* NFT Image */}
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img
                            src={collection.nftImage}
                            className="lazy img-fluid"
                            alt=""
                          />
                        </Link>
                      </div>
                      {/* Author Image */}
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage}
                            alt=""
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      {/* Collection Info */}
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>ERC-{collection.code}</span>
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

export default HotCollections;
