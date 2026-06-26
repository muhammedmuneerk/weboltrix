import heroStudio from "../assets/mmk-hero-studio.jpg";
import logoSquare from "../assets/logos/MMKWebsites-Logo-crop-1-1-bgremoved.png";
import logoWide from "../assets/logos/weboltrix-bgremoved.png";
import mmkShopImage from "../assets/preview/screens.png";
import amorWeddingsImage from "../assets/preview/collage-amorweddings-3.png";
import amorUniformsImage from "../assets/preview/AmorUniforms-Preview.png";
import shazzzImage from "../assets/preview/collage-shazzz-2.png";
import spicenzaImage from "../assets/preview/spicenza-2.png";
import artisanCreationsImage from "../assets/preview/artisancreations-2.png";
import mmkflixImage from "../assets/preview/collage-mmkflix-1.png";
import todoImage from "../assets/preview/screencapture-mmk-todoapp-vercel-app-2024-10-24-06_39_05.png";
import airbnbImage from "../assets/preview/collage-airbnb.png";
import noirCuisineImage from "../assets/preview/noir-cuisine.png";
import amorWeddingsBefore from "../assets/preview/before-after/AmorWeddings-Before.png";
import amorWeddingsAfter from "../assets/preview/before-after/AmorWeddings-After.png";
import spicenzaBefore from "../assets/preview/before-after/Spicenza-Before.png";
import spicenzaAfter from "../assets/preview/before-after/Spicenza-After.png";
import artisanCreationsBefore from "../assets/preview/before-after/ArtisanCreations-Before.png";
import artisanCreationsAfter from "../assets/preview/before-after/ArtisanCreations-After.png";
import noirCuisineBefore from "../assets/preview/before-after/NoirCuisine-Before.png";
import noirCuisineAfter from "../assets/preview/before-after/NoirCuisine-After.png";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const brandAssets = {
  logoSquare,
  logoWide,
};

export const studioAssets = {
  heroStudio,
};

export const projects = [
  {
    slug: "mmk-shop",
    title: "MMK Shop",
    category: "E-commerce Platform",
    image: mmkShopImage,
    visualAlt: "MMK Shop e-commerce screens showing storefront and admin interface previews.",
    description: "A full-stack e-commerce application with admin panel and PayPal integration.",
    link: "https://mmk-shop.onrender.com",
    github: "https://github.com/muhammedmuneerk/mmk-shop",
    tags: ["MongoDB", "Express", "React", "Node.js", "Bootstrap"],
    transformation: "From simple product browsing -> complete online selling system",
    impact: "A more serious shopping experience with admin control and payment flow",
    problem:
      "The shop needed more than a visual storefront. It needed product management, checkout confidence, and a real selling workflow.",
    solution:
      "We built a full-stack MERN commerce flow with product pages, admin controls, cart logic, and PayPal integration.",
    result:
      "A functional e-commerce platform that can present products, manage orders, and support customer checkout.",
    metrics: ["Admin panel", "PayPal checkout", "MERN stack"],
    caseNotes: [
      "The admin panel keeps product management practical instead of forcing every edit through code.",
      "Checkout and cart flows are structured to reduce confusion before payment.",
      "The stack gives the project room to expand with more store features later.",
    ],
  },
  {
    slug: "amor-weddings",
    title: "AMOR WEDDINGS",
    category: "Men's Clothing Brand",
    image: amorWeddingsImage,
    visualAlt: "AMOR WEDDINGS portfolio website collage with premium clothing gallery previews.",
    description:
      "A business portfolio for a men's clothing brand. This website includes an advanced gallery.",
    link: "https://amorweddings-v00.vercel.app",
    linkBefore: "https://amorweddings.onrender.com",
    linkAfter: "https://amorweddings-v00.vercel.app",
    github: "https://github.com/muneer2005/amorweddings",
    tags: ["HTML", "CSS", "JavaScript"],
    transformation: "From basic portfolio -> premium gallery-led brand experience",
    impact: "Higher trust, stronger visual presentation, and clearer customer intent",
    problem:
      "The brand needed its website to feel closer to the quality of the clothing and make visitors confident before contacting.",
    solution:
      "We shaped an image-led portfolio with gallery depth, polished spacing, and clearer paths toward enquiry.",
    result:
      "A more premium online presence that makes the brand feel established and easier to explore.",
    metrics: ["Advanced gallery", "Premium portfolio", "Brand trust"],
    caseNotes: [
      "Gallery-first presentation lets visitors feel the product quality before reading service details.",
      "The visual rhythm was tuned so the brand feels polished rather than just listed online.",
      "Direct enquiry points stay close to the moments where customers are likely to act.",
    ],
  },
  {
    slug: "amor-uniforms",
    title: "AMOR UNIFORMS",
    category: "Uniform Solutions",
    image: amorUniformsImage,
    visualAlt: "AMOR UNIFORMS website preview showing end-to-end uniform solution sections.",
    description:
      "A business portfolio for Amor Weddings's Uniforms Division. End-to-End Uniform Solutions.",
    link: "https://amorweddings-v00.vercel.app/amor-uniforms",
    github: "https://github.com/muhammedmuneerk/amorweddings-v00",
    tags: ["HTML", "CSS", "JavaScript"],
    transformation: "From service extension -> focused uniform division page",
    impact: "Clearer product understanding and faster quote intent",
    problem:
      "The uniforms division needed to separate its offer clearly while still feeling connected to the Amor brand.",
    solution:
      "We built a structured business portfolio page with uniform categories, service clarity, and simple contact flow.",
    result:
      "A division page that explains the offer quickly and makes bulk uniform enquiries easier to start.",
    metrics: ["Uniform clarity", "Quote intent", "Business portfolio"],
    caseNotes: [
      "The page separates the uniforms offer without making the visitor feel they left the brand ecosystem.",
      "Service sections are arranged for quick scanning by schools, teams, and organizations.",
      "Contact actions are positioned near decision points so users can move from browsing to enquiry.",
    ],
  },
  {
    slug: "shazzz",
    title: "Shazzz",
    category: "Personal Portfolio",
    image: shazzzImage,
    visualAlt: "Shazzz personal portfolio website collage with establishment and experience sections.",
    description:
      "A static personal portfolio website showcasing the experiences and establishments of Shazzz.",
    link: "https://shazzzz.onrender.com",
    github: "https://github.com/muhammedmuneerk/shazzz",
    tags: ["HTML", "CSS", "JavaScript"],
    transformation: "From scattered personal details -> structured personal presence",
    impact: "A sharper personal brand with clearer story and credibility",
    problem:
      "The portfolio needed to collect personal experiences and establishments into one clear, memorable presence.",
    solution:
      "We designed a static portfolio with focused sections, strong visual hierarchy, and a simple browsing path.",
    result:
      "A personal site that feels more intentional and easier for visitors to understand.",
    metrics: ["Personal brand", "Static site", "Clear story"],
    caseNotes: [
      "The layout gives personal context without overwhelming visitors with too much detail at once.",
      "Section hierarchy helps each establishment and experience feel connected to the bigger story.",
      "The static build keeps the site simple, fast, and easy to maintain.",
    ],
  },
  {
    slug: "spicenza",
    title: "Spicenza",
    category: "Import & Export",
    image: spicenzaImage,
    visualAlt: "Spicenza spices import and export website preview with dark and light interface styling.",
    description:
      "A spices import and export company website design with advanced dark-mode and light-mode options.",
    link: "https://spicenza.vercel.app",
    github: "https://github.com/muhammedmuneerk/Spicenza",
    tags: ["HTML", "CSS", "JavaScript"],
    transformation: "From simple company page -> polished global trade presence",
    impact: "A more trustworthy first impression for buyers and partners",
    problem:
      "The company needed to communicate export credibility, product clarity, and brand polish in a competitive category.",
    solution:
      "We created a refined spices website with dark and light modes, strong product visuals, and clear company positioning.",
    result:
      "A more professional trade-facing website that feels modern and easier to trust.",
    metrics: ["Dark mode", "Light mode", "Trade trust"],
    caseNotes: [
      "Mode switching gives the site a premium interaction detail without distracting from the company offer.",
      "Product and company sections are arranged to support credibility for import and export audiences.",
      "The design keeps the brand feeling bold while still practical for business visitors.",
    ],
  },
  {
    slug: "artisan-creations",
    title: "Artisan Creations",
    category: "Art & Craft Brand",
    image: artisanCreationsImage,
    visualAlt: "Artisan Creations art and craft portfolio website preview with AI-generated visual assets.",
    description:
      "An art and craft business portfolio website design. This website includes images generated by AI.",
    link: "https://artisancreations.vercel.app",
    github: "https://github.com/muhammedmuneerk/artisancreations",
    tags: ["HTML", "CSS", "JavaScript"],
    transformation: "From handmade offer -> crafted digital storefront feel",
    impact: "A warmer, more visual brand experience for craft buyers",
    problem:
      "The business needed a visual identity online that could make handmade products feel desirable and trustworthy.",
    solution:
      "We created an art-focused portfolio layout supported by AI-generated imagery and clear business sections.",
    result:
      "A more expressive portfolio that gives visitors a stronger sense of style, product mood, and brand care.",
    metrics: ["AI imagery", "Craft portfolio", "Visual identity"],
    caseNotes: [
      "AI-generated visuals help establish an art direction before a full product library is available.",
      "The page structure balances emotion and clarity so the site still works as a business tool.",
      "Soft visual sections help the craft brand feel more memorable and premium.",
    ],
  },
  {
    slug: "mmkflix",
    title: "MMKflix",
    category: "Streaming UI Clone",
    image: mmkflixImage,
    visualAlt: "MMKflix Netflix clone preview with movie rows and dark streaming interface.",
    description: "A Netflix clone built with React and TMDB API integration.",
    link: "https://mmkflix.vercel.app",
    github: "https://github.com/muhammedmuneerk/mmkflix",
    tags: ["React", "Node.js", "CSS", "TMDB API"],
    transformation: "From static movie layout -> dynamic API-powered streaming interface",
    impact: "A richer React experience with real content discovery behavior",
    problem:
      "The project needed to feel like a real streaming interface instead of a static gallery of posters.",
    solution:
      "We built a React interface connected to TMDB data, with content rows and a familiar dark entertainment layout.",
    result:
      "A polished clone experience that demonstrates component structure, API usage, and modern UI flow.",
    metrics: ["React UI", "TMDB API", "Streaming layout"],
    caseNotes: [
      "Dynamic movie data makes the interface feel active and closer to a production entertainment product.",
      "Reusable rows and cards keep the layout scalable as more categories are added.",
      "The dark visual system keeps attention on posters and discovery behavior.",
    ],
  },
  {
    slug: "todo-app",
    title: "ToDo App",
    category: "Productivity Tool",
    image: todoImage,
    visualAlt: "Modern Todo App screenshot with task list interface.",
    description: "A modern todolist application.",
    link: "https://mmk-todoapp.vercel.app",
    github: "https://github.com/muhammedmuneerk/todoapp",
    tags: ["React", "CSS"],
    transformation: "From plain task list -> cleaner everyday productivity tool",
    impact: "A focused interface for quickly managing simple tasks",
    problem:
      "The app needed to keep task management simple while still feeling cleaner than a basic browser exercise.",
    solution:
      "We built a modern React task interface with clear actions, tidy spacing, and a lightweight visual system.",
    result:
      "A simple productivity app that feels easy to use and direct.",
    metrics: ["React app", "Task flow", "Clean UI"],
    caseNotes: [
      "The UI keeps the core workflow visible instead of hiding task actions behind extra complexity.",
      "React state keeps the interaction quick and responsive.",
      "The restrained styling helps the app feel useful without feeling over-designed.",
    ],
  },
  {
    slug: "airbnb-clone",
    title: "Airbnb Clone",
    category: "Full-stack Booking UI",
    image: airbnbImage,
    visualAlt: "Airbnb clone website collage with listing cards, booking interface, and travel UI screens.",
    description: "A full-stack Airbnb clone with modern UI and cloud image storage.",
    link: "https://mmbnb.vercel.app",
    github: "https://github.com/muhammedmuneerk/mmbnb",
    tags: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS", "Cloudinary"],
    transformation: "From listing concept -> full-stack booking-style platform",
    impact: "A stronger product demo with listings, media, and modern interface flow",
    problem:
      "The project needed to demonstrate more than layout skill. It needed full-stack structure, listings, and cloud media handling.",
    solution:
      "We built a MERN-style Airbnb clone with a modern React interface, Tailwind styling, and Cloudinary image storage.",
    result:
      "A fuller product experience that shows how marketplace-style interfaces can be structured and scaled.",
    metrics: ["Cloudinary", "Full stack", "Marketplace UI"],
    caseNotes: [
      "Cloud image storage supports listing visuals without bloating the app structure.",
      "The listing layout mirrors a familiar booking pattern so users understand it quickly.",
      "Full-stack foundations give the clone stronger portfolio value than a static UI mockup.",
    ],
  },
  {
    slug: "noir-cuisine",
    title: "Noir Cuisine",
    category: "Restaurant Website",
    image: noirCuisineImage,
    visualAlt: "Noir Cuisine restaurant portfolio website preview in a black theme.",
    description: "A static restaurant portfolio website design in a black theme.",
    link: "https://noircuisine.vercel.app/",
    github: "https://github.com/muhammedmuneerk/noir-cuisine",
    tags: ["HTML", "CSS", "JavaScript"],
    transformation: "From simple restaurant listing -> atmospheric premium dining presence",
    impact: "A more memorable restaurant brand mood and clearer dining impression",
    problem:
      "The restaurant concept needed a dark, premium web presence that could feel atmospheric while still showing the offer clearly.",
    solution:
      "We created a static black-theme restaurant portfolio with menu-style sections, strong contrast, and refined visuals.",
    result:
      "A mood-rich restaurant site that feels more premium and easier to remember.",
    metrics: ["Black theme", "Restaurant brand", "Static site"],
    caseNotes: [
      "The black theme creates a stronger dining mood without hiding the practical content.",
      "Menu and brand sections are arranged for fast scanning by hungry visitors.",
      "The static build keeps the experience fast and reliable.",
    ],
  },
];

export const beforeAfterProjects = [
  {
    slug: "amor-weddings",
    title: "AMOR WEDDINGS",
    category: "Men's Clothing Brand",
    before: amorWeddingsBefore,
    after: amorWeddingsAfter,
    beforeAlt: "AMOR WEDDINGS website before redesign screenshot.",
    afterAlt: "AMOR WEDDINGS website after redesign screenshot.",
    description: "A cleaner gallery-led experience for a clothing brand that needed stronger trust.",
    outcome: "Premium gallery, sharper hierarchy, clearer enquiry path",
  },
  {
    slug: "spicenza",
    title: "Spicenza",
    category: "Import & Export",
    before: spicenzaBefore,
    after: spicenzaAfter,
    beforeAlt: "Spicenza website before redesign screenshot.",
    afterAlt: "Spicenza website after redesign screenshot.",
    description: "A spices company presentation upgraded into a more polished trade-facing website.",
    outcome: "Dark/light mode, product clarity, stronger global feel",
  },
  {
    slug: "artisan-creations",
    title: "Artisan Creations",
    category: "Art & Craft Brand",
    before: artisanCreationsBefore,
    after: artisanCreationsAfter,
    beforeAlt: "Artisan Creations website before redesign screenshot.",
    afterAlt: "Artisan Creations website after redesign screenshot.",
    description: "A handmade brand shaped into a warmer and more visual portfolio experience.",
    outcome: "Visual identity, AI imagery, craft-focused storytelling",
  },
  {
    slug: "noir-cuisine",
    title: "Noir Cuisine",
    category: "Restaurant Website",
    before: noirCuisineBefore,
    after: noirCuisineAfter,
    beforeAlt: "Noir Cuisine website before redesign screenshot.",
    afterAlt: "Noir Cuisine website after redesign screenshot.",
    description: "A restaurant concept turned into a darker, more atmospheric dining presence.",
    outcome: "Premium mood, menu clarity, memorable black theme",
  },
];

export const services = [
  {
    name: "Starter",
    price: "Lean launch",
    features: ["1-3 pages", "Mobile optimized", "WhatsApp integration"],
    audience: "New local businesses that need a polished first website quickly.",
    details: [
      "Focused homepage or compact multi-section site",
      "Premium mobile layout for quick customer trust",
      "Direct WhatsApp action for fast enquiries",
    ],
  },
  {
    name: "Business",
    price: "Growth ready",
    features: ["Multi-page website", "SEO basics", "Contact system"],
    audience: "Established shops, suppliers, and service providers ready to earn more trust.",
    featured: true,
    details: [
      "Home, services, about, portfolio, and contact flow",
      "Clear content structure with SEO-friendly page basics",
      "Contact form and enquiry journey built around conversion",
      "Conversion-minded proof, portfolio, and contact sections",
    ],
  },
  {
    name: "Premium",
    price: "Full experience",
    features: ["Cinematic UI", "Smooth animations", "Full brand experience"],
    audience: "Brands that want a memorable, high-end presence with stronger positioning.",
    details: [
      "High-impact art direction with refined interaction details",
      "Custom sections, motion rhythm, and launch-ready polish",
      "Full brand experience designed to feel memorable",
    ],
  },
];

export const uspItems = [
  ["Looks premium instantly", "Your business feels trusted and high-value from the first second."],
  ["Built for mobile users first", "The site feels effortless on the phone most customers actually use."],
  ["Loads fast, keeps visitors", "Clean pages reduce waiting, confusion, and lost customer attention."],
  ["Turns visitors into inquiries", "Every section guides people toward calling, chatting, or sending a lead."],
  ["Connects directly via WhatsApp", "Customers can start a conversation without hunting for contact details."],
];

export const contactDetails = {
  phone: "+918281689200",
  phoneDisplay: "+91 82816 89200",
  email: "mmkwebsites.business@gmail.com",
  instagram: "https://www.instagram.com/mmk_websites",
};

export const whatsappLink = `https://wa.me/${contactDetails.phone.replace("+", "")}?text=Hi%2C%20I%20want%20a%20website%20for%20my%20business`;

export const testimonials = [
  {
    quote:
      "After the new website, customers started asking better questions and reaching out with more confidence.",
    author: "Amor Weddings",
  },
  {
    quote:
      "The WhatsApp flow made a real difference. People could view our business and contact us without friction.",
    author: "Amor Uniforms",
  },
  {
    quote:
      "Our business started looking more established online, and that helped customers trust us before calling.",
    author: "Local Business Owner",
  },
];

export const resultStats = [
  {
    metric: "More inquiries",
    label: "Turn visits into real conversations",
    text: "Clear CTAs and WhatsApp paths reduce hesitation when customers are ready to ask.",
  },
  {
    metric: "Better brand trust",
    label: "Look established from the first scroll",
    text: "Premium layout, spacing, and proof signals make the business feel safer to choose.",
  },
  {
    metric: "Higher conversion",
    label: "Guide people toward action",
    text: "Each section is arranged to move visitors from interest to enquiry without confusion.",
  },
];

export const processSteps = ["Understanding", "Design", "Build", "Launch"];

export const processDetails = [
  {
    title: "Understand",
    eyebrow: "01 / Clarity",
    text: "We define the audience, offer, proof points, pages, and customer actions before touching visuals.",
  },
  {
    title: "Shape",
    eyebrow: "02 / Direction",
    text: "We turn the business into a premium visual direction with references, layout rhythm, and conversion priorities.",
  },
  {
    title: "Build",
    eyebrow: "03 / Execution",
    text: "We build responsive pages, animations, WhatsApp/contact paths, and performance-minded structure.",
  },
  {
    title: "Launch",
    eyebrow: "04 / Momentum",
    text: "We polish, test, hand over, and keep the site ready for edits as the business grows.",
  },
];

export const experiencePillars = [
  ["Cinematic first impression", "A hero section that makes the business feel established within seconds."],
  ["Proof before pressure", "Trust signals, project context, and clear outcomes appear before heavy selling."],
  ["Motion with purpose", "Scroll movement highlights hierarchy, not decoration for decoration's sake."],
  ["Contact without friction", "Every page keeps the next step obvious on desktop and mobile."],
];

export const faqs = [
  ["How fast can we start?", "Most projects can begin after the discovery call, content basics, and page scope are clear."],
  ["Do you write the content?", "We help shape headlines, section flow, and conversion copy so the site feels confident."],
  ["Will the site work on phones?", "Yes. The experience is designed mobile-first because most local customers browse there."],
  ["Can we add more pages later?", "Yes. The structure is built so new services, projects, and proof can be added cleanly."],
];
