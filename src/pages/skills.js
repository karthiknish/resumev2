import {
  FaCss3Alt,
  FaHtml5,
  FaReact,
  FaNode,
  FaBootstrap,
} from "react-icons/fa";
import Head from "next/head";
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
import { motion } from "framer-motion";
const Skill = ({ title, Icon, color }) => (
  <div className="flex flex-col items-center">
    <p className="mb-2 text-lg font-bold">{title}</p>
    <Icon className="text-5xl" style={{ color }} />
  </div>
);

function Skills() {
  const programmingSkills = [
    { title: "HTML", Icon: FaHtml5, color: "#DD4B25" },
    { title: "CSS", Icon: FaCss3Alt, color: "#3594CF" },
    { title: "React", Icon: FaReact, color: "#5BD3F3" },
    { title: "Javascript", Icon: DiJavascript1, color: "#EFD81D" },
    { title: "NodeJs", Icon: FaNode, color: "#5B9853" },
    { title: "Bootstrap", Icon: FaBootstrap, color: "#700EED" },
    { title: "TailwindCSS", Icon: SiTailwindcss, color: "#700EED" },
    { title: "MySQL", Icon: SiMysql, color: "#005E86" },
  ];

  const designTools = [
    { title: "Photoshop", Icon: SiAdobephotoshop, color: "#2FA3F7" },
    { title: "Illustrator", Icon: SiAdobeillustrator, color: "#F79500" },
    { title: "Adobe XD", Icon: SiAdobexd, color: "#F75EEE" },
    { title: "DreamWeaver", Icon: SiAdobedreamweaver, color: "#5B9853" },
    { title: "Figma", Icon: SiFigma, color: "#F76D60" },
  ];

  return (
    <>
      <Head>
        <title>Skills // karthik nishanth.</title>
      </Head>
      <div className="min-h-screen p-8">
        <h2 className="mb-6 text-white text-3xl font-bold">
          Programming languages
        </h2>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-4 bg-gradient-to-t from-gray-800 to-black text-white p-4 gap-8"
        >
          {programmingSkills.map((skill) => (
            <Skill key={skill.title} {...skill} />
          ))}
        </motion.div>

        <h2 className="mt-12 text-white mb-6 text-3xl font-bold">
          Design Tools
        </h2>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-5 bg-gradient-to-b from-gray-800 to-black text-white p-4 gap-8"
        >
          {designTools.map((tool) => (
            <Skill key={tool.title} {...tool} />
          ))}
        </motion.div>
      </div>
    </>
  );
}

export default Skills;
