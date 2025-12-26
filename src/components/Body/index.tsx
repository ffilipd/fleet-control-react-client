import { Suspense } from "react";
import Header from "../Header";
import { Outlet } from "react-router-dom";
import Wrapper from "./Wrapper";
import Inner from "./Inner";
import Footer from "./footer";

function Body() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Wrapper>
        <Header />
        <Inner>
          <Outlet />
        </Inner>
        <Footer />
      </Wrapper>
    </Suspense>
  );
}

export default Body;
