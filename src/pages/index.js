import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { generateBG } from "../utils/bgAnim.js";

import Head from "next/head";

const HomeScreen = () => {
  const router = useRouter();

  let { comeThru } = router.query;
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
    <>
      <Head>
        <title>karthik nishanth.</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A creative designer and developer based in Liverpool."
        />
        <meta
          name="keywords"
          content="web development, design, Liverpool, freelance, business analyst"
        />
        <meta name="author" content="Karthik Nishanth" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/" />
        <meta
          property="og:title"
          content="Karthik Nishanth - Web Developer and Designer"
        />
        <meta
          property="og:description"
          content="A creative designer and developer based in Liverpool."
        />
        <meta
          property="og:image"
          content="https://yourwebsite.com/path/to/your-image.jpg"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://karthiknish.com/" />
        <meta
          property="twitter:title"
          content="Karthik Nishanth - Web Developer and Designer"
        />
        <meta
          property="twitter:description"
          content="A creative designer and developer based in Liverpool."
        />
        <meta
          property="twitter:image"
          content="https://media.licdn.com/dms/image/C4E03AQEJdFeqoffB_g/profile-displayphoto-shrink_100_100/0/1603790440614?e=1685577600&v=beta&t=6kdvYfBvqFT-ItGt4UEWwjo6oFpAxpdhnmnDmnAdmsw"
        />
      </Head>
      <div
        className={`relative min-h-screen ${comeThru ? "bg-transparent" : ""}`}
      >
        <header>
          <Link
            href={{
              pathname: "/",
              // query: { comeThru: comeThru ? "true" : undefined },
            }}
          >
            <h1>karthik nishanth.</h1>

            <span></span>
          </Link>

          <div>
            <span></span>

            <span className="alt"></span>
          </div>
        </header>

        <div className="main site-cont">
          <div className="hero">
            <h1 className="hi">hi! I m karthik.</h1>
            <h1>a business analyst graduate,freelance webdev and designer.</h1>
            <h2>
              i am passionate about building cutting-edge and elegant products
              designed to solve problems.
            </h2>
            <Link
              href={{
                pathname: "/about",
                // query: { comeThru: comeThru ? "true" : undefined },
              }}
              className="services card"
            >
              more about me <span className="arrow">&rarr;</span>
            </Link>
            <br />
            <Link
              href={{
                pathname: "/contact",
                // query: { comeThru: comeThru ? "true" : undefined },
              }}
              className="services card"
            >
              contact <span className="arrow">&rarr;</span>
            </Link>
          </div>

          <div className="children">
            <div className="socials">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/karthiknish"
              >
                GitHub
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/karthik-nishanth/"
              >
                LinkedIn
              </a>
            </div>
            <Link
              href={{
                pathname: "/blog",
                // query: { comeThru: comeThru ? "true" : undefined },
              }}
            >
              <div className="projects card">
                <h2>My Blog</h2>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/projects",
                // query: { comeThru: comeThru ? "true" : undefined },
              }}
            >
              <div className="projects card">
                <h2>view my projects</h2>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/skills",
                // query: { comeThru: comeThru ? "true" : undefined },
              }}
            >
              <div className="projects card">
                <h2>Programming Skills and tools</h2>
              </div>
            </Link>

            <Link
              href={{
                pathname: "/about",
                query: { comeThru: comeThru ? "true" : undefined },
              }}
              query={(comeThru = true)}
            >
              <div className="contact card">
                <h2>personal details</h2>
              </div>
            </Link>
          </div>
        </div>

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
    </>
  );
};
export default HomeScreen;
