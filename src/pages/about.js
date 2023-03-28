import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { generateBG } from "../utils/bgAnim.js";
import Head from "next/head";
function About() {
  const router = useRouter();
  const aboutRef = useRef(null);
  const [animateState, setAnimateState] = useState("");
  const [animationEnd, setAnimationEnd] = useState(false);
  const [scroll, setScroll] = useState(true);

  let { comeThru } = router.query;
  const [elemProps, setElemProps] = useState({});
  const [messages, setMessages] = useState([
    "Hey! I'm Karthik Nishanth!",
    "I live in Liverpool, freelancing and currently looking for work in web/app dev and design 🤓",
    "I love solving problems that tackle real-life challenges and design solutions that work effortlessly ⚡",
    "So far, my biggest project is YouMusic,using youtube API to create a music player with search and recommendation features 🐣",
    "As a designer, creating beautiful, accessible, and intuitive interfaces is my priority 🙌",
    "I have experience working with the leading tech and programming languages. ",
    "Oh and, I love working on open-source software.",
    "I am incredibly passionate about using UI/UX tools to help build efficient, fast, and effortless websites 👨‍👩‍👦‍👦",
    "Currently, I am looking for a tech-related product or software engineering jobs for 2023 🤟🏼",
    "I am always looking forward to learning new things.",
    "Plus, I've got a keen eye for details, and a lot of experience that could be a perfect fit for your company 🤙🏼",
    "let's work together! 👀",
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const animControl = document.getElementsByClassName("animControl")[0];
      if (animControl) {
        animControl.classList.add("hide");
      }
    }
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

          setElemProps({ ...newElemProps });
        }
      }
    };
    const handleMouseWheel = () => {
      setScroll(false);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousewheel", handleMouseWheel);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousewheel", handleMouseWheel);
    };
  }, []);
  const stopAnim = () => {
    setAnimationEnd("stopaim");
    setAnimationEnd(true);
  };
  const loadMessage = (msg, i) => {
    const animationDelay = i + 1;
    const messageStyle = {
      animationDelay: `${animationDelay}s`,
    };
    if (i === 0) {
      console.log(i);
      return (
        <p style={messageStyle} className={"text item-" + i}>
          {msg}
          <span className="animControl" onClick={stopAnim}>
            Skip
          </span>
        </p>
      );
    } else if (i === 11) {
      console.log(i);
      return (
        <p style={messageStyle} className={"text item-" + i}>
          <Link href="/contact">{msg}</Link>
        </p>
      );
    } else {
      console.log(messageStyle);
      return (
        <p style={{ animationDelay: `${i + 1}s` }} className={"text item-" + i}>
          {msg}
        </p>
      );
    }
  };

  return (
    <>
      <Head>
        <title>about me // karthik nishanth.</title>
        <meta
          name="description"
          content="A creative designer and developer based in Bangalore."
        />
      </Head>
      <div
        ref={aboutRef}
        className={`wrapper ${animateState} ${animationEnd ? "no-bg" : ""}`}
      >
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

        <div className="page-about site-cont">
          <ul className={` flex flex-col ${animateState}`}>
            {messages.map((message, i) => (
              <li
                key={i}
                ref={(el) => {
                  if (el) {
                    el.addEventListener("animationend", (event) => {
                      if (event.animationName === "iwishicould") {
                        if (event.srcElement.className.indexOf("item-9") > -1) {
                          setAnimateState(true);
                          document.getElementsByClassName(
                            "animControl"
                          )[0].className += " hide";
                        }
                      }
                      if (event.animationName === "nightslikethis" && scroll) {
                        var size = aboutRef.current.clientHeight;
                        window.scrollTo(0, size);
                      }
                    });
                  }
                }}
              >
                <p className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </p>

                {loadMessage(message, i)}
              </li>
            ))}
          </ul>
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

export default About;
