import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";

const AuthorItems = ({ authorId, authorImage }) => {
  const [nftItems, setNftItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemsData = async () => {
      try {
        const response = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        console.log(response.data);
        if (response.data.nftCollection) {
          setNftItems(response.data.nftCollection);
        } else {
          console.error("NFT collection data not found in API response.");
        }
      } catch (err) {
        console.error("Error fetching items data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchItemsData();
    }
  }, [authorId]);

  if (loading) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            {Array(8)
              .fill()
              .map((_, index) => (
                <div
                  className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                  key={index}
                >
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Skeleton circle={true} height={50} width={50} />
                    </div>
                    <div className="nft__item_wrap">
                      <Skeleton height={150} />
                    </div>
                    <div className="nft__item_info">
                      <Skeleton width={100} />
                      <div className="nft__item_price">
                        <Skeleton width={50} />
                      </div>
                      <div className="nft__item_like">
                        <Skeleton width={30} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (nftItems.length === 0) {
    return <div>No items found for this author.</div>;
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {nftItems.map((item, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to="">
                    <img
                      className="lazy"
                      src={authorImage || nftImage}
                      alt=""
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="nft__item_wrap">
                  <Link to={`/item-details/${item.nftId}`}>
                    <img
                      src={item.nftImage || nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
