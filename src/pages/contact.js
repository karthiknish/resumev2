import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { generateBG } from "../utils/bgAnim.js";
import Head from "next/head";
function Contact() {
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

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const router = useRouter();
  const [elemProps, setElemProps] = useState({});
  return (
    <>
      <Head>
        {" "}
        <title>contact // karthik nishanth.</title>
      </Head>
      <div className="wrapper no-bg">
        <header>
          <Link href="/">
            <h1>karthik nishanth.</h1>
            <span></span>
          </Link>
          <div>
            <span></span>
            <span className="alt"></span>
          </div>
        </header>

        <div className="contact site-cont">
          <div className="meta">
            <div className="intro">
              <p>
                Hey! I am production graduate who loves learning new tech, and
                building pretty things — mostly software. I am an individual
                with great problem-solving and team-working skills. And in my
                free time, I design and build intuitive user-interfaces and make
                products that not only help my own workflow, but thousands of
                other developers. Here are a couple of accomplishments.
              </p>
            </div>
            <ul>
              {/* <li>Achieved 86% in the first year of Computer Science BSc</li> */}
              <li>
                Finalist in Bizzventure,a Annual Pitching Competition for our
                Buisness Idea 'PABO'-a innovative solution to parking in busy
                cities.
              </li>
              <li>
                Interned in Talent Logistics,Egypt - giving them competitive
                solution to reach out digitally so to improve their boundries to
                other countries.
              </li>
              <li>
                Years of experience working with JavaScript (ES6), Python, PHP,
                HTML, CSS (SASS/SCSS), Node.js, React, GitHub/Git, Firebase,
                SQL, WordPress, and Adobe XD.
              </li>
              {/* <li>Languages: English, Bengali, Hindi (speaking), Urdu (speaking)</li> */}
            </ul>

            <div className="socials">
              {/* <a target="_blank" href={pdf}>
                Download CV
              </a> */}
              <a href="mailto:karthik.nishanth06@gmail.com">Email</a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/karthiknish"
              >
                GitHub
              </a>
              <a target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div
          className={"background-overlay anim "}
          style={{
            gridTemplateColumns: "repeat(" + elemProps.gridSizeX + ", 1fr",
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
}

export default Contact;
