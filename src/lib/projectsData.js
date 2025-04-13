import { FaReact, FaNode, FaPython } from "react-icons/fa/index.js";

import { DiJavascript1, DiDatabase } from "react-icons/di/index.js";
import { TbBrandNextjs } from "react-icons/tb/index.js";
import {
  SiTailwindcss,
  SiPandas,
  SiOpenai,
  SiWebcomponentsdotorg,
  SiScikitlearn,
  SiWordpress,
  SiTestinglibrary,
  SiNumpy,
  SiSvelte,
  SiTypescript,
  SiGooglesearchconsole,
  SiStyledcomponents,
} from "react-icons/si/index.js";
export const projectsData = [
  {
    id: "medblocks",
    title: "Medblocks",
    shortdescription:
      "Medblocks is a platform for building modern healthcare applications using industry-standard vendor-neutral APIs, allowing developers to create installable apps for clinical decision support and consolidated clinical knowledge. ",
    description:
      "Medblocks provides healthcare developers with a cutting-edge platform for creating modern healthcare applications using vendor-neutral APIs, enabling them to develop clinical decision support and consolidated clinical knowledge apps that can be easily installed. The platform offers a comprehensive ecosystem for data migration and analytics, and features the user-friendly Medblocks UI, an open-source openEHR form builder that streamlines clinical workflows. It also supports the latest industry standards in terminology, and boasts seamless data operations through the use of Nifi on Apache Kafka. With a reputation for delivering excellent care, Medblocks is the go-to operating system for healthcare apps, trusted by a diverse range of organizations.",
    meta: "Open Source Platform",
    image: "/medblocks.png",
    extlink: "https://medblocks.org/",
    link: "/projects/medblocks",
    challenges: ["Challenge 1 for Medblocks", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for Medblocks.",
      author: "Client A",
    }, // Placeholder
    category: "fullstack",
    techStack: [
      { icon: FaReact, name: "React" },
      { icon: TbBrandNextjs, name: "Nextjs" },
      { icon: DiJavascript1, name: "JavaScript" },
      { icon: DiDatabase, name: "Database" },
    ],
  },
  {
    id: "medblocksui",
    title: "Medblocks UI",
    shortdescription:
      "Medblocks UI is a set of web components for data capture in healthcare applications. It allows developers to convert openEHR templates into web components and provides experimental support for FHIR Resources. ",
    description:
      "Medblocks UI is a powerful tool for healthcare application developers, consisting of a set of web components designed for capturing data. It enables developers to easily convert openEHR templates into web components, and offers experimental support for FHIR Resources. The components are built according to web components standards using Lit, and are published as ES modules in adherence with open-wc guidelines. Developers can customize the set of default UI components, which are available for each data type, by adjusting CSS variables. The most important component in the collection is the mb-form component, which can generate structured openEHR or FHIR compositions, helping developers to streamline their workflows. Medblocks UI can be imported as a custom element in any framework that supports web components.",
    meta: "Web Components Library",
    image: "/medblocksui.png",
    extlink: "https://medblocks-ui.vercel.app/?path=/story/introduction--page",
    link: "/projects/medblocksui",
    challenges: ["Challenge 1 for Medblocks UI", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for Medblocks UI.",
      author: "Client B",
    }, // Placeholder
    category: "fullstack",
    techStack: [
      { icon: SiSvelte, name: "Svelte" },
      { icon: SiTypescript, name: "TypeScript" },
      { icon: SiWebcomponentsdotorg, name: "Web Components" },
      { icon: SiTestinglibrary, name: "Web Test Runner" },
    ],
  },
  {
    id: "covergenerator",
    title: "Cover Letter Generator",
    shortdescription:
      "The cover letter generator is a software tool that takes in the role and company information provided by the user and generates a personalized cover letter using OpenAI and Google. The generator is designed to create a professional cover letter that highlights the user's skills and experience, helping them to stand out in the job market.",
    description:
      "The cover letter generator is a cutting-edge software tool that enables users to generate personalized cover letters using OpenAI and Google Search Console. By inputting the job role and company information, the generator produces a professional and high-quality cover letter that highlights the user's skills and experience, making them stand out in the job market. Thanks to its advanced capabilities, the tool is able to tailor the letter to the specific job role and company, freeing users from the hassle of crafting customized letters from scratch. Once generated, the cover letter can be easily downloaded and submitted with a job application, giving users an edge in their job search. With the cover letter generator, users can create a standout letter that can help them land their dream job in a fraction of the time it would take to write one manually.",
    meta: "AI-Powered Tool",
    image: "/covergenerator.png",
    link: "/projects/covergenerator",
    extlink: "https://karthiknish.com/covergenerator",
    challenges: ["Challenge 1 for Cover Gen", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for Cover Gen.",
      author: "User C",
    }, // Placeholder
    category: "fullstack",
    techStack: [
      { icon: FaReact, name: "React" },
      { icon: TbBrandNextjs, name: "Nextjs" },
      { icon: DiJavascript1, name: "JavaScript" },
      { icon: DiDatabase, name: "Database" },
      { icon: SiTailwindcss, name: "Tailwind" },
      { icon: SiOpenai, name: "OpenAI" },
      { icon: SiGooglesearchconsole, name: "Google Search Console" },
    ],
  },
  {
    id: "initiosolutions",
    title: "Initio Solutions",
    shortdescription:
      "Initio Solutions is a technology pioneer that specializes in web and app solutions designed to transform new concepts into driving forces for businesses. With expertise in web development, app development, SEO, social media marketing, content writing, cloud and data management, data entry, and graphic design.",
    description:
      "Initio Solutions is a trailblazer in the technology industry, providing innovative web and app solutions that help businesses bring their ideas to life. Their comprehensive suite of services includes web and app development, SEO, social media marketing, content writing, cloud and data management, data entry, and graphic design, all of which are tailored to meet the unique needs of their clients. With a proven track record of excellence, Initio Solutions has served over 25 clients, built 32 websites, and developed 4 successful products. Their commitment to delivering top-quality products and services has made them a trusted partner in the tech industry.",
    meta: "25+ Clients Served",
    image: "/initiosol.png",
    extlink: "https://initiosolutions.com/",
    link: "/projects/initiosolutions",
    challenges: ["Challenge 1 for Initio", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for Initio.",
      author: "Client D",
    }, // Placeholder
    category: "fullstack",
    techStack: [
      { icon: FaReact, name: "React" },
      { icon: TbBrandNextjs, name: "Nextjs" },
      { icon: DiJavascript1, name: "JavaScript" },
      { icon: SiTailwindcss, name: "Tailwind" },
      { icon: DiDatabase, name: "Database" },
      { icon: SiOpenai, name: "OpenAI" },
      { icon: FaNode, name: "Node Mailer" },
    ],
  },
  {
    id: "acaa",
    title: "Afghans and Central Asian Association",
    shortdescription:
      "The Afghanistan and Central Asian Association (ACAA) is a charity that supports Afghans and Central Asians living away from their homeland, helping them to live and prosper in the UK with their wide range of services includes language classes, employment workshops, women`s support groups. ",
    description:
      "The Afghanistan and Central Asian Association (ACAA) is a charitable organization that focuses on providing support to Afghans and Central Asians who have left their homelands and now reside in the UK. Their services include language classes, employment workshops, women`s support groups, youth and family support services, and cultural and social events. ACAA's mission is to help these individuals thrive and prosper in their new home. ACAA has grown from a small organization in Lewisham to a full-functioning charity in Feltham that serves thousands of refugees across different locations, including Hounslow, Croydon, Ealing, and Greenwich. They have expanded their impact over the years and currently support over 13,000 refugees annually, making a significant difference in their lives.",
    meta: "13k+ Refugees Supported",
    image: "/acaa.png",
    extlink: "https://acaa.org.uk/",
    link: "/projects/acaa",
    challenges: ["Challenge 1 for ACAA", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for ACAA.",
      author: "Org E",
    }, // Placeholder
    category: "fullstack",
    techStack: [
      { icon: SiWordpress, name: "Wordpress" },
      { icon: DiDatabase, name: "Database" },
      { icon: SiStyledcomponents, name: "Styled Components" },
    ],
  },
  {
    id: "dreamedconsultancy",
    title: "Dream Ed Consultancy",
    shortdescription:
      "Dream Education is an education consultancy that empowers students to achieve their full potential through personalized guidance and expert support in navigating the complex world of education.",
    description:
      "Empowering students to achieve their academic potential, Dreamedconsultancy is an education consultancy that offers personalized guidance and expert support in navigating the complexities of international education. With a team of knowledgeable professionals, they provide comprehensive services, tailored guidance, and networking opportunities to increase the chances of success. Dreamedconsultancy offers innovative resources that help students discover their path to their desired university, unlocking their full potential and achieving their academic aspirations. With satisfied students' testimonials who have studied in the UK, USA, and Australia, Empowering Your Future with Education is committed to helping students achieve their educational goals and broaden their horizons.",
    meta: "Education Consultancy Site",
    image: "/dreamedcons.png",
    link: "/projects/dreamedconsultancy",
    extlink: "https://dreamedconsultancy.com/",
    challenges: ["Challenge 1 for DreamEd", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for DreamEd.",
      author: "Client F",
    }, // Placeholder
    category: "fullstack",
    techStack: [
      { icon: FaReact, name: "React" },
      { icon: TbBrandNextjs, name: "Nextjs" },
      { icon: DiJavascript1, name: "JavaScript" },
      { icon: SiTailwindcss, name: "Tailwind" },
      { icon: DiDatabase, name: "Database" },
      { icon: SiOpenai, name: "OpenAI" },
      { icon: FaNode, name: "Node Mailer" },
    ],
  },
  {
    id: "creditcard",
    title: "Credit Card Fraud Detection",
    shortdescription:
      "The dataset includes anonymized, PCA-transformed credit card transactions from European cardholders in September 2013, categorized as fraudulent or genuine. Due to confidentiality, original features and further information are unavailable.",
    description:
      "This project uses SMOTE oversampling to detect fraudulent credit card transactions in PCA-transformed data from Kaggle. The evaluation focused on Recall and Precision scores of the Logistic Regression and Random Forest models. Despite the high recall of Logistic Regression (0.955), its low precision (0.078) made Random Forest, with a balance of recall (0.87) and precision (0.73), the more effective model for fraud detection.",
    meta: "87% Recall / 73% Precision",
    category: "analytics",
    image: "/credcard.png",
    extlink: "https://github.com/karthiknish/creditcardfraud-python",
    link: "/projects/creditcard",
    challenges: ["Challenge 1 for Fraud Detection", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for Fraud Detection.",
      author: "Self G",
    }, // Placeholder
    techStack: [
      { icon: FaPython, name: "Python" },
      { icon: SiPandas, name: "Pandas" },
      { icon: SiScikitlearn, name: "Sci Kit Learn" },
      { icon: SiNumpy, name: "Numpy" },
    ],
  },
  {
    id: "netflix",
    title: "Historical Stock Price Analysis of Netflix Inc.",
    shortdescription:
      "This analysis delves into Netflix's stock performance from 2015 onwards, revealing an overall upward trend. It also highlights significant trading volume variations",
    description:
      "Analyzed historical stock price data for Netflix Inc. (NFLX), including daily prices and trading volume from 2015 to present. The data showed an overall upward trend in Netflix's stock price with periods of volatility. Trading volume varied significantly, with spikes likely corresponding to key events. The most frequent closing price range was around $300-350. This analysis provides a foundation for deeper investigations into Netflix's stock performance.",
    meta: "Stock Price Analysis",
    category: "analytics",
    image: "/netflix.png",
    extlink: "https://github.com/karthiknish/stock-prediction-netflix-python",
    link: "/projects/netflix",
    challenges: ["Challenge 1 for Netflix Analysis", "Challenge 2"], // Placeholder
    solutions: ["Solution 1", "Solution 2"], // Placeholder
    results: ["Result 1: Detail", "Result 2: Detail"], // Placeholder
    testimonial: {
      quote: "Placeholder testimonial for Netflix Analysis.",
      author: "Self H",
    }, // Placeholder
    techStack: [
      { icon: FaPython, name: "Python" },
      { icon: SiPandas, name: "Pandas" },
      { icon: SiNumpy, name: "Numpy" },
    ],
  },
];
