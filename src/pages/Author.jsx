import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Author = () => {
  const { authorId } = useParams();
  const [authorData, setAuthorData] = useState();
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // Tracks follow/unfollow state

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setAuthorData(response.data);
      } catch (err) {
        console.error("Error fetching author data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  const handleCopy = () => {
    if (authorData?.address) {
      navigator.clipboard.writeText(authorData.address).then(() => {
        alert("Address copied to clipboard!");
      });
    }
  };

  const handleFollowToggle = () => {
    if (authorData) {
      const updatedFollowers = isFollowing
        ? authorData.followers - 1
        : authorData.followers + 1;

      setAuthorData((prevData) => ({
        ...prevData,
        followers: updatedFollowers,
      }));

      setIsFollowing((prev) => !prev);
    }
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{
            background: loading
              ? undefined
              : `url(${authorData?.authorImage}) top`,
          }}
        >
          {loading && <Skeleton height={300} />}
        </section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {loading ? (
                        <Skeleton circle={true} height={100} width={100} />
                      ) : (
                        <img src={authorData.authorImage} alt="" />
                      )}
                      {loading ? (
                        <Skeleton
                          width={20}
                          height={20}
                          style={{ marginTop: "-1.5rem", marginLeft: "-0.5rem" }}
                        />
                      ) : (
                        <i className="fa fa-check"></i>
                      )}
                      <div className="profile_name">
                        <h4>
                          {loading ? (
                            <Skeleton width={200} />
                          ) : (
                            authorData.authorName
                          )}
                          <span className="profile_username">
                            {loading ? (
                              <Skeleton width={100} />
                            ) : (
                              `@${authorData.tag}`
                            )}
                          </span>
                          <span id="wallet" className="profile_wallet">
                            {loading ? (
                              <Skeleton width={250} />
                            ) : (
                              authorData.address
                            )}
                          </span>
                          {!loading && (
                            <button
                              id="btn_copy"
                              title="Copy Text"
                              onClick={handleCopy}
                            >
                              Copy
                            </button>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {loading ? (
                          <Skeleton width={50} />
                        ) : (
                          `${authorData.followers} followers`
                        )}
                      </div>
                      {!loading && (
                        <button className="btn-main" onClick={handleFollowToggle}>
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  {loading ? (
                    <Skeleton height={200} />
                  ) : (
                    <AuthorItems
                      authorId={authorId}
                      authorImage={authorData.authorImage}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
