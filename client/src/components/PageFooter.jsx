import React from "react";
import { PageFooterHyperlink } from "./PageFooterHyperlink";

export const PageFooter = () => {
  // 更新为电影主题的资源链接
  const resourceList = [
    {
      path: "https://www.imdb.com/",
      label: "IMDb",
    },
    {
      path: "https://www.rottentomatoes.com/",
      label: "Rotten Tomatoes",
    },
    {
      path: "https://www.boxofficemojo.com/",
      label: "Box Office Mojo",
    },
    {
      path: "https://www.filmratings.com/",
      label: "Film Ratings",
    },
  ];

  return (
    <footer className="page-footer">
      <div className="page-footer-grid">
        <div className="page-footer-grid__info">
          <div className="page-footer-info__message">
            <p className="page-footer-message__headline">
              <span>This movie guide is presented by </span>
              <PageFooterHyperlink path="https://www.imdb.com/">
                IMDB
              </PageFooterHyperlink>
            </p>
            <p className="page-footer-message__description">
              <PageFooterHyperlink  path="https://www.imdb.com/">
                <span>
                  Dive into the world of cinema with our expert reviews and
                  recommendations.
                </span>
              </PageFooterHyperlink>
            </p>
          </div>

          <div className="page-footer-info__resource-list">
            {resourceList.map(resource => (
              <div key={resource.path} className="page-footer-info__resource-list-item">
                <PageFooterHyperlink path={resource.path}>
                  {resource.label}
                </PageFooterHyperlink>
              </div>
            ))}
          </div>
        </div>

        <div className="page-footer-grid__brand">
          <div className="page-footer-brand">
            <div style={{marginTop: '8px'}}>
              © {new Date().getFullYear()} HAHA Cinema. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};