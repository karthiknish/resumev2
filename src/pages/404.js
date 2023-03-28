import { useState, useEffect } from "react";
import Link from "next/link";
import { generateBG } from "../utils/bgAnim.js";
import Head from "next/head";
function FourOhFour() {
  const [elemProps, setElemProps] = useState({});

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const initialElemProps = generateBG(width, height, false);
    setElemProps(initialElemProps);

    let resized = false;

    const handleResize = () => {
      if (!resized) {
        resized = true;

        if (width !== window.innerWidth || height !== window.innerHeight) {
          const newElemProps = generateBG(
            window.innerWidth,
            window.innerHeight,
            true
          );
          setElemProps(newElemProps);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app fof">
      <Head>
        <title>it`s a 404 // karthik nishanth.</title>
      </Head>
      <h1 className="four">
        it`s a 404
        <Link href="/">
          let`s go back home <span className="arrow"> &#8594;</span>
        </Link>
      </h1>{" "}
      <div
        className={"background-overlay anim "}
        style={{
          gridTemplateColumns: `repeat(${elemProps.gridSizeX}, 1fr)`,
        }}
      >
        {[
          ...Array((elemProps.gridSizeX || 0) * (elemProps.gridSizeY || 0)),
        ].map((e, i) => (
          <span key={i}></span>
        ))}
      </div>
    </div>
  );
}

export default FourOhFour;
