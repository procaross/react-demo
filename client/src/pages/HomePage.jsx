import React from "react";
import { HeroBanner } from "../components/HeroBanner";
import { PageLayout } from "../components/PageLayout";
import { PublicPage } from "./PublicPage";

export const HomePage = () => (
  <PageLayout>
    <HeroBanner />
    <PublicPage />
  </PageLayout>
);
