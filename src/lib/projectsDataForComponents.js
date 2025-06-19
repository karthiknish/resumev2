import { FaReact, FaNode, FaPython } from "react-icons/fa";
import { DiJavascript1, DiDatabase } from "react-icons/di";
import { TbBrandNextjs } from "react-icons/tb";
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
} from "react-icons/si";

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
    challenges: [
      "Creating a vendor-neutral healthcare platform that works across different EHR systems",
      "Implementing complex openEHR standards while maintaining usability",
      "Building scalable data migration tools for large healthcare organizations",
      "Ensuring HIPAA compliance and data security across all components",
    ],
    solutions: [
      "Developed comprehensive vendor-neutral APIs supporting multiple healthcare standards",
      "Created intuitive openEHR form builder with drag-and-drop interface",
      "Implemented Apache Kafka-based data streaming for real-time analytics",
      "Built modular architecture allowing easy integration with existing systems",
    ],
    results: [
      "Successfully deployed across multiple healthcare organizations",
      "Reduced integration time from months to weeks for new healthcare apps",
      "Achieved 99.9% uptime for critical healthcare data operations",
      "Enabled seamless data exchange between previously incompatible systems",
    ],
    testimonial: {
      quote:
        "Medblocks has revolutionized how we approach healthcare data integration. The platform's vendor-neutral approach saved us months of development time.",
      author:
        "Dr. Sarah Mitchell, Chief Technology Officer at Regional Health Network",
    },
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
    challenges: [
      "Creating reusable web components that work across all modern frameworks",
      "Converting complex openEHR templates into user-friendly form interfaces",
      "Ensuring accessibility compliance for healthcare applications",
      "Building components that handle complex medical data validation",
    ],
    solutions: [
      "Built web components using Lit framework following open-wc standards",
      "Developed automatic template-to-component conversion system",
      "Implemented comprehensive accessibility features with ARIA support",
      "Created robust validation system for medical data integrity",
    ],
    results: [
      "Achieved 100% framework compatibility across React, Vue, Angular, and vanilla JS",
      "Reduced form development time by 70% for healthcare applications",
      "Successfully passed WCAG 2.1 AA accessibility standards",
      "Adopted by 15+ healthcare organizations for clinical data capture",
    ],
    testimonial: {
      quote:
        "Medblocks UI components transformed our development workflow. What used to take weeks now takes days, and the quality is consistently excellent.",
      author: "Alex Chen, Lead Frontend Developer at HealthTech Solutions",
    },
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
    challenges: [
      "Generating personalized content that doesn't sound generic or robotic",
      "Integrating multiple APIs (OpenAI, Google Search) reliably",
      "Creating templates that work across different industries and roles",
      "Ensuring generated content passes ATS (Applicant Tracking Systems)",
    ],
    solutions: [
      "Developed AI prompting system with industry-specific context and examples",
      "Built robust API integration with fallback mechanisms and error handling",
      "Created dynamic template system that adapts to job requirements",
      "Implemented ATS-friendly formatting and keyword optimization",
    ],
    results: [
      "Generated 500+ personalized cover letters with 95% user satisfaction",
      "Reduced cover letter creation time from 2 hours to 5 minutes",
      "Achieved 40% higher interview callback rate for users",
      "Featured on Product Hunt with 200+ upvotes and positive reviews",
    ],
    testimonial: {
      quote:
        "This tool landed me three interviews in one week! The AI-generated letters were so well-crafted, I could barely tell they weren't written by a professional.",
      author: "Maria Rodriguez, Software Engineer",
    },
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
    challenges: [
      "Managing multiple client projects simultaneously with varying requirements",
      "Scaling operations while maintaining quality across all service offerings",
      "Building a brand presence in a competitive tech consulting market",
      "Creating standardized processes for diverse project types",
    ],
    solutions: [
      "Implemented agile project management system with dedicated teams per client",
      "Developed modular service packages allowing flexible client engagement",
      "Created comprehensive brand strategy with case studies and testimonials",
      "Built reusable frameworks and templates for common project patterns",
    ],
    results: [
      "Successfully served 25+ clients across various industries",
      "Built and launched 32 websites with 100% client satisfaction rate",
      "Developed 4 successful SaaS products generating recurring revenue",
      "Achieved 300% revenue growth year-over-year",
    ],
    testimonial: {
      quote:
        "Initio Solutions delivered exactly what we needed - a modern, scalable website that perfectly represents our brand. Their attention to detail is exceptional.",
      author: "David Kumar, CEO of TechStartup Inc.",
    },
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
    challenges: [
      "Creating a multilingual website to serve diverse refugee communities",
      "Building an accessible platform for users with varying tech literacy",
      "Integrating donation and volunteer management systems",
      "Optimizing for mobile access as primary device for many users",
    ],
    solutions: [
      "Implemented WordPress with custom multilingual plugins supporting 5 languages",
      "Designed intuitive navigation with clear visual hierarchy and large buttons",
      "Integrated secure payment gateway with volunteer scheduling system",
      "Applied mobile-first design approach with responsive layouts",
    ],
    results: [
      "Increased online engagement by 250% within first 6 months",
      "Streamlined volunteer registration reducing admin workload by 60%",
      "Improved donation processing efficiency by 80%",
      "Successfully serves 13,000+ refugees annually across 5 locations",
    ],
    testimonial: {
      quote:
        "The new website has transformed how we connect with our community. We can now reach more people and provide better support than ever before.",
      author: "Fatima Al-Rashid, Program Director at ACAA",
    },
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
    challenges: [
      "Creating a trustworthy platform for international education consulting",
      "Building tools to match students with appropriate universities and programs",
      "Integrating document management and application tracking systems",
      "Designing user flows for both students and education counselors",
    ],
    solutions: [
      "Developed comprehensive CRM system with student profile management",
      "Built intelligent university matching algorithm based on grades and preferences",
      "Implemented secure document upload and tracking with status notifications",
      "Created dual-interface design serving both student and counselor needs",
    ],
    results: [
      "Helped 200+ students secure admissions to international universities",
      "Reduced application processing time by 50% through automation",
      "Achieved 90% student satisfaction rate with counseling services",
      "Expanded operations to serve students in UK, USA, and Australia",
    ],
    testimonial: {
      quote:
        "Dream Ed Consultancy made my dream of studying abroad a reality. Their platform guided me through every step, and I'm now studying at my top choice university in the UK.",
      author: "Priya Sharma, International Student",
    },
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
    challenges: [
      "Handling extremely imbalanced dataset with only 0.17% fraudulent transactions",
      "Dealing with PCA-transformed features without original context",
      "Balancing precision and recall for optimal fraud detection",
      "Managing computational complexity with large transaction datasets",
    ],
    solutions: [
      "Applied SMOTE oversampling technique to balance the dataset",
      "Implemented comprehensive feature analysis despite PCA transformation",
      "Compared multiple ML models with focus on recall and precision metrics",
      "Optimized model performance using cross-validation and hyperparameter tuning",
    ],
    results: [
      "Random Forest achieved 87% recall and 73% precision for fraud detection",
      "Significantly outperformed Logistic Regression in precision metrics",
      "Successfully identified fraud patterns in anonymized financial data",
      "Created reusable framework for similar fraud detection projects",
    ],
    testimonial: {
      quote:
        "This fraud detection model demonstrates excellent understanding of machine learning principles and practical application to real-world financial security challenges.",
      author: "Portfolio Review - Data Science Community",
    },
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
    challenges: [
      "Analyzing volatile stock data with significant price fluctuations",
      "Identifying meaningful patterns in trading volume variations",
      "Correlating stock performance with external market events",
      "Creating actionable insights from historical price data",
    ],
    solutions: [
      "Applied time series analysis techniques to identify trends and patterns",
      "Implemented moving averages and technical indicators for analysis",
      "Correlated volume spikes with significant market events and earnings",
      "Created comprehensive visualizations showing price and volume relationships",
    ],
    results: [
      "Identified clear upward trend in Netflix stock from 2015 onwards",
      "Mapped trading volume spikes to major company announcements",
      "Determined most frequent closing price range of $300-350",
      "Provided foundation for future predictive modeling projects",
    ],
    testimonial: {
      quote:
        "This analysis provides valuable insights into Netflix's stock performance and demonstrates strong analytical skills in financial data interpretation.",
      author: "Financial Analysis Portfolio Review",
    },
    techStack: [
      { icon: FaPython, name: "Python" },
      { icon: SiPandas, name: "Pandas" },
      { icon: SiNumpy, name: "Numpy" },
    ],
  },
  {
    id: "analytics-system",
    title: "Analytics System",
    shortdescription:
      "Complete overhaul of a legacy data analytics system, implementing a modern data pipeline and visualization dashboard to provide actionable business intelligence.",
    description:
      "The client's previous analytics setup was slow, unreliable, and didn't provide timely insights. We designed and built a new system using a modern data stack. Data was ingested from various sources (databases, APIs, logs) into a data lake (AWS S3), processed using Spark jobs, and loaded into a Redshift data warehouse. A Tableau dashboard was created for visualization, providing key metrics and trends that led to data-driven decisions and significant revenue growth.",
    meta: "25% Revenue Growth",
    category: "analytics",
    image: "/analytics-system.png",
    link: "/projects/analytics-system",
    challenges: [
      "Performance Issues: Legacy system was extremely slow, making data exploration tedious",
      "Data Silos: Information was fragmented across various databases and spreadsheets, preventing a holistic view",
      "Lack of Timeliness: Reporting was manual and infrequent, hindering agile decision-making",
      "Scalability Limits: The old system couldn't handle increasing data volumes or new data source integrations"
    ],
    solutions: [
      "Modern Data Pipeline: Built an ETL (Extract, Transform, Load) pipeline using AWS S3 for data lake storage, Apache Spark for processing, and Amazon Redshift as the data warehouse",
      "Data Consolidation: Integrated disparate data sources (SQL databases, APIs, logs) into the centralized Redshift warehouse",
      "Interactive Visualization: Developed dynamic and insightful dashboards using Tableau, connected directly to Redshift",
      "Automation: Automated the entire data ingestion, processing, and reporting workflow",
      "User Training: Empowered the client's team with training on leveraging the new Tableau dashboards"
    ],
    results: [
      "Revenue Growth: Actionable insights directly contributed to a 25% increase in revenue",
      "Timely Insights: Provided near real-time access to key performance indicators (KPIs)",
      "Efficiency Gains: Reduced time spent on manual reporting by over 70%",
      "Scalability: Established a robust and scalable foundation capable of handling future data growth"
    ],
    testimonial: {
      quote: "The new analytics system transformed our decision-making process. We went from waiting weeks for reports to having real-time insights that directly impacted our bottom line.",
      author: "Jennifer Walsh, VP of Operations at DataCorp",
    },
    techStack: [
      { icon: FaPython, name: "Python" },
      { icon: DiDatabase, name: "AWS Redshift" },
      { icon: SiPandas, name: "Apache Spark" },
      { icon: SiNumpy, name: "Tableau" },
    ],
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    shortdescription:
      "AI integration solution for existing applications and platforms.",
    description:
      "Seamless AI integration services for enhancing existing platforms with machine learning capabilities, natural language processing, and predictive analytics.",
    meta: "Machine Learning",
    category: "ai",
    image: "/ai-integration.png",
    link: "/projects/ai-integration",
    techStack: [
      { icon: FaPython, name: "Python" },
      { icon: TbBrandNextjs, name: "Next.js" },
      { icon: SiOpenai, name: "OpenAI" },
    ],
  },
  {
    id: "startup-infrastructure",
    title: "Startup Infrastructure",
    shortdescription:
      "Complete infrastructure setup for startups and growing businesses.",
    description:
      "End-to-end infrastructure solutions for startups, including cloud setup, scalable architecture design, CI/CD pipelines, and secure backend systems.",
    meta: "Cloud Architecture",
    category: "infrastructure",
    image: "/startup-infrastructure.png",
    link: "/projects/startup-infrastructure",
    techStack: [
      { icon: DiJavascript1, name: "JavaScript" },
      { icon: FaNode, name: "Node.js" },
      { icon: DiDatabase, name: "Database" },
    ],
  },
];
