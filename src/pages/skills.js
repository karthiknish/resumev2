import {
  FaCss3Alt,
  FaHtml5,
  FaReact,
  FaNode,
  FaBootstrap,
  FaPython,
  FaAngular,
  FaGitAlt,
} from "react-icons/fa";
import Head from "next/head";
import { DiJavascript1, DiDatabase, DiDocker } from "react-icons/di";
import { TbBrandNextjs } from "react-icons/tb";
import {
  SiTailwindcss,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobexd,
  SiAdobedreamweaver,
  SiMysql,
  SiGoogleanalytics,
  SiTableau,
  SiMicrosoftexcel,
  SiFigma,
  SiGatsby,
  SiRedux,
  SiVite,
  SiPostgresql,
  SiMongodb,
  SiJupyter,
  SiSvelte,
  SiTypescript,
} from "react-icons/si";
import { motion } from "framer-motion";

function Skills() {
  const Skill = ({ title, Icon, color }) => (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-lg font-bold">{title}</p>
      <Icon className="text-5xl" style={{ color }} />
    </div>
  );
  const programmingSkills = [
    { title: "HTML", Icon: FaHtml5, color: "#DD4B25" },
    { title: "CSS", Icon: FaCss3Alt, color: "#3594CF" },
    { title: "React", Icon: FaReact, color: "#5BD3F3" },
    { title: "Javascript", Icon: DiJavascript1, color: "#EFD81D" },
    { title: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
    { title: "NodeJs", Icon: FaNode, color: "#5B9853" },
    { title: "Bootstrap", Icon: FaBootstrap, color: "#700EED" },
    { title: "TailwindCSS", Icon: SiTailwindcss, color: "#700EED" },
    { title: "MySQL", Icon: SiMysql, color: "#005E86" },
    { title: "Python", Icon: FaPython, color: "#3776AB" },
    { title: "Git", Icon: FaGitAlt, color: "#F05032" },
    { title: "GatsbyJS", Icon: SiGatsby, color: "#663399" },
    { title: "Redux", Icon: SiRedux, color: "#764ABC" },
    { title: "PostgreSQL", Icon: SiPostgresql, color: "#336791" },
    { title: "MongoDB", Icon: SiMongodb, color: "#47A248" },
    { title: "Docker", Icon: DiDocker, color: "#2496ED" },
    { title: "SQL", Icon: DiDatabase, color: "#00648B" },
    { title: "Next.js", Icon: TbBrandNextjs, color: "#ffff" },
    { title: "Angular", Icon: FaAngular, color: "#DD1B16" },
    { title: "Vite", Icon: SiVite, color: "#646CFF" },
    { title: "Svelte", Icon: SiSvelte, color: "#FF3E00" },
  ];
  const analyticalSkills = [
    { title: "Google Analytics", Icon: SiGoogleanalytics, color: "#F8981D" },
    { title: "Tableau", Icon: SiTableau, color: "#E97627" },
    { title: "Excel", Icon: SiMicrosoftexcel, color: "#217346" },
    { title: "Jupyter Notebook", Icon: SiJupyter, color: "#F37626" },
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
        <title>skills // karthik nishanth.</title>
      </Head>
      <div className="min-h-screen p-8 md:p-8">
        <h2 className="mb-6 text-white text-3xl font-bold">
          Programming languages
        </h2>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4  bg-gradient-to-t from-gray-800 to-black text-white p-4 gap-4 md:gap-8"
        >
          {programmingSkills.map((skill) => (
            <Skill key={skill.title} {...skill} />
          ))}
        </motion.div>
        <h2 className="mt-12 text-white mb-6 text-3xl font-bold">
          Analytical Skills
        </h2>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4  bg-gradient-to-t from-gray-800 to-black text-white p-4 gap-4 md:gap-8"
        >
          {analyticalSkills.map((skill) => (
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
          className="grid grid-cols-2 md:grid-cols-4  bg-gradient-to-t from-gray-800 to-black text-white p-4 gap-4 md:gap-8"
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
