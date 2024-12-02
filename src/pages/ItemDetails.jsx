import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import placeholderImage from "../images/nftImage.jpg"; // Placeholder if image is not available

const ItemDetails = () => {
  const { nftId } = useParams();
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNftDetails = async () => {
      try {
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch NFT details");
        }

        const data = await response.json();
        setNftData(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNftDetails();
  }, [nftId]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">
                  <Skeleton height={300} width="100%" />
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <h2>
                      <Skeleton width="80%" />
                    </h2>
                    <div className="item_info_counts">
                      <div className="item_info_views">
                        <Skeleton width={50} />
                      </div>
                      <div className="item_info_like">
                        <Skeleton width={50} />
                      </div>
                    </div>
                    <p>
                      <Skeleton count={3} />
                    </p>
                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>
                          <Skeleton width={80} />
                        </h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Skeleton circle={true} height={50} width={50} />
                          </div>
                          <div className="author_list_info">
                            <Skeleton width={120} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="de_tab tab_simple">
                      <h6>
                        <Skeleton width={80} />
                      </h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Skeleton circle={true} height={50} width={50} />
                        </div>
                        <div className="author_list_info">
                          <Skeleton width={120} />
                        </div>
                      </div>
                      <div className="spacer-40"></div>
                      <h6>
                        <Skeleton width={80} />
                      </h6>
                      <div className="nft-item-price">
                        <Skeleton width={50} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!nftData) {
    return <div>No data found</div>;
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={nftData.nftImage || placeholderImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={nftData.name || "NFT Image"}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{nftData.title}</h2>
                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {nftData.views || 0}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {nftData.likes || 0}
                    </div>
                  </div>
                  <p>{nftData.description || "No description available"}</p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${nftData.ownerId}`}>
                            <img
                              className="lazy"
                              src={nftData.ownerImage || placeholderImage}
                              alt="Owner"
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${nftData.ownerId}`}>
                            {nftData.ownerName || "Unknown Owner"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${nftData.creatorId}`}>
                            <img
                              className="lazy"
                              src={nftData.creatorImage || placeholderImage}
                              alt="Creator"
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${nftData.creatorId}`}>
                            {nftData.creatorName || "Unknown Creator"}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="Ethereum" />
                      <span>{nftData.price || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
