import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { generateBG } from "../utils/bgAnim.js";
import {
  FaCss3Alt,
  FaHtml5,
  FaReact,
  FaNode,
  FaBootstrap,
} from "react-icons/fa";
import { DiJavascript1 } from "react-icons/di";
import {
  SiTailwindcss,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobexd,
  SiAdobedreamweaver,
  SiMysql,
  SiFigma,
} from "react-icons/si";
function Skills() {
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
      <div className="wrapper no-bg">
        <Head>
          <title>skills // karthik nishanth.</title>
          <meta
            name="description"
            content="A creative designer and developer based in London."
          />
        </Head>

        <header>
          <Link
            href={{
              pathname: "/",
              query: { comeThru: comeThru ? "true" : undefined },
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

        <div className="contact site-cont">
          <div className="meta">
            <ul>
              <li>
                <h2>Programming languages</h2>
                <div className="prog">
                  <div
                    className="proglogo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      HTML
                    </ol>
                    <FaHtml5 style={{ fontSize: "60px", color: "#DD4B25" }} />
                  </div>
                  <div
                    className="proglogo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      CSS
                    </ol>
                    <FaCss3Alt style={{ fontSize: "60px", color: "#3594CF" }} />
                  </div>
                  <div
                    className="proglogo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      React
                    </ol>
                    <FaReact style={{ fontSize: "60px", color: "#5BD3F3" }} />
                  </div>
                  <div
                    className="proglogo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Javascript
                    </ol>
                    <DiJavascript1
                      style={{
                        fontSize: "80px",
                        color: "#EFD81D",
                        marginLeft: "10px",
                        marginTop: "-10px",
                      }}
                    />
                  </div>
                  <div
                    className="proglogo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      NodeJs
                    </ol>
                    <FaNode
                      style={{
                        fontSize: "80px",
                        color: "#5B9853",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                  <div
                    className="proglogo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Bootstrap
                    </ol>
                    <FaBootstrap
                      style={{
                        fontSize: "70px",
                        color: "#700EED",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                  <div
                    className="proglogo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "10px",
                    }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      TailwindCSS
                    </ol>
                    <SiTailwindcss
                      style={{
                        fontSize: "80px",
                        color: "#700EED",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                  <div
                    className="proglogo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "10px",
                    }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      MySql
                    </ol>
                    <SiMysql
                      style={{
                        fontSize: "80px",
                        color: "#005E86",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                </div>
                {/* <img
              width="70px"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/363px-CSS3_logo_and_wordmark.svg.png"
            /> */}
              </li>
              <li>
                <h2>Design Tools</h2>
                <div className="prog">
                  <div
                    className="proglogo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px",
                      alignItems: "center",
                    }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Photoshop
                    </ol>
                    <SiAdobephotoshop
                      style={{ fontSize: "60px", color: "#2FA3F7" }}
                    />
                  </div>
                  <div
                    className="proglogo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px",
                      alignItems: "center",
                    }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Illustrator
                    </ol>
                    <SiAdobeillustrator
                      style={{
                        fontSize: "60px",
                        color: "#F79500",
                      }}
                    />
                  </div>
                  <div
                    className="proglogo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px",
                      alignItems: "center",
                    }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      AdobeXd
                    </ol>
                    <SiAdobexd style={{ fontSize: "60px", color: "#F75EEE" }} />
                  </div>

                  <div
                    className="proglogo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginRight: "10px",
                    }}
                  >
                    <ol
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      DreamWeaver
                    </ol>
                    <SiAdobedreamweaver
                      style={{
                        fontSize: "60px",
                        color: "#5B9853",
                      }}
                    />
                  </div>
                  <div
                    className="proglogo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <ol
                      style={{
                        marginLeft: "-10px",
                        padding: "0px",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Figma
                    </ol>
                    <SiFigma
                      style={{
                        fontSize: "70px",
                        color: "#F76D60",
                      }}
                    />
                  </div>
                </div>
              </li>
            </ul>
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

export default Skills;
