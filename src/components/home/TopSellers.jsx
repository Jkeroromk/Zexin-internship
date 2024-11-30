import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import axios from "axios";

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
        console.log(res.data);
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
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {Topseller.map((Sellers, index) => (
                <li key={index}>
                  <div className="author_list_pp">
                  <Link to={`/author/${Sellers.id}`}>
                      <img
                        className="lazy pp-author"
                        src={Sellers.authorImage}
                        alt=""
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="author_list_info">
                    <Link to="/author">{Sellers.authorName}</Link>
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
