import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TopSellers = () => {
  const [Topseller, setTopseller] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const TopSellers = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );
        setTopseller(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching new items:", err);
        setLoading(false);
      }
    };

    TopSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>{loading ? <Skeleton width={200} height={25} /> : "Top Sellers"}</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {loading
                ? Array(12)
                    .fill(0)
                    .map((_, index) => (
                      <li key={index}>
                        <div className="author_list_pp">
                          <Skeleton circle={true} height={50} width={50} />
                        </div>
                        <div className="author_list_info">
                          <Skeleton width={150} height={15} />
                          <Skeleton width={80} height={15} />
                        </div>
                      </li>
                    ))
                : Topseller.map((Sellers, index) => (
                    <li key={index}>
                      <div className="author_list_pp">
                        <Link to={`/author/${Sellers.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={Sellers.authorImage}
                            alt=""
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${Sellers.authorId}`}>
                          {Sellers.authorName}
                        </Link>
                        <span>{Sellers.price} ETH</span>
                      </div>
                    </li>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
