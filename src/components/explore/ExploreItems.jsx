import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

const ExploreItems = () => {
  const [explore, setExplore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(8); 
  const [sortBy, setSortBy] = useState(""); 

  useEffect(() => {
    const Explore = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );
        setExplore(res.data);
        console.log(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching new items:", err);
        setLoading(false);
      }
    };

    Explore();
  }, []);

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedItems = () => {
    if (sortBy === "price_low_to_high") {
      return [...explore].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high_to_low") {
      return [...explore].sort((a, b) => b.price - a.price);
    } else if (sortBy === "likes_high_to_low") {
      return [...explore].sort((a, b) => b.likes - a.likes);
    } else {
      return explore;
    }
  };

  return (
    <>
      <div>
        <select id="filter-items" value={sortBy} onChange={handleSortChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {loading ? (
        <>
          {Array.from({ length: visibleItems }).map((_, index) => (
            <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div className="nft_coll">
                <div className="nft_wrap">
                  <Skeleton height={150} />
                </div>
                <div className="nft_coll_pp">
                  <Skeleton
                    circle
                    height={50}
                    width={50}
                    style={{ margin: "0 auto" }}
                  />
                </div>
                <div className="nft_coll_info">
                  <Skeleton height={20} width="80%" />{" "}
                  <Skeleton
                    height={15}
                    width="60%"
                    style={{ marginTop: 5 }}
                  />{" "}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        sortedItems()
          .slice(0, visibleItems)
          .map((items, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to="/author"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                  >
                    <img className="lazy" src={items.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="de_countdown">5h 30m 32s</div>

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to="/item-details">
                    <img
                      src={items.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{items.title}</h4>
                  </Link>
                  <div className="nft__item_price">{items.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{items.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
      )}

      {visibleItems < explore.length && (
        <div className="col-md-12 text-center">
          <button
            id="loadmore"
            className="btn-main lead"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
