// Pre-loads starter content straight from the Sensora design brief,
// so the site isn't empty on first run. Safe to re-run — it upserts by slug/key.
// Run: node scripts/seedContent.js
require("dotenv").config();
const mongoose = require("mongoose");
const ContentItem = require("../models/ContentItem");
const SiteSection = require("../models/SiteSection");

const dns = require("dns");

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])

const technologies = [
  { title: "Advanced Sensor Technologies", category: "Sensors", shortDescription: "Physical, environmental, optical, biomedical, MEMS and custom sensors." },
  { title: "Sensor Design & Microfabrication", category: "Sensors", shortDescription: "Concept to prototype: architecture, materials, thin-film, packaging, calibration." },
  { title: "Advanced Robotics", category: "Robotics", shortDescription: "Autonomous mobile robots, industrial and inspection robotics, robotic manipulators." },
  { title: "Drone & UAV Technologies", category: "Drones & UAV", shortDescription: "Intelligent aerial systems for surveillance, inspection, mapping and logistics." },
  { title: "VTOL & Advanced Air Mobility", category: "VTOL", shortDescription: "Vertical take-off and landing platforms, autonomous flight control and payload systems." },
  { title: "Autonomous Systems & AI", category: "AI & Autonomous Systems", shortDescription: "Sensor fusion, edge computing, computer vision and autonomous decision-making." },
];

const solutions = [
  { title: "Healthcare & Medical Technologies", category: "Healthcare", shortDescription: "Smart medical sensors, wearable and remote patient monitoring, rehabilitation robotics." },
  { title: "Defence, Security & Strategic Technologies", category: "Defence & Security", shortDescription: "Situational awareness, surveillance, ruggedized electronics, autonomous platforms." },
  { title: "Smart Home & Intelligent Security", category: "Smart Home", shortDescription: "Intrusion detection, environmental monitoring, smart access, IoT home automation." },
  { title: "Industrial & Infrastructure Monitoring", category: "Industry", shortDescription: "Predictive maintenance, vibration and structural-health monitoring." },
  { title: "Environment, Agriculture & Terrestrial Systems", category: "Environment & Agriculture", shortDescription: "Soil, air and water monitoring, weather stations, autonomous field platforms." },
  { title: "Space & Extreme-Environment Technologies", category: "Aerospace", shortDescription: "High-reliability sensors and ruggedized electronics for extreme environments." },
];

const products = [
  { title: "SensoraSense", category: "Sensing Platform", shortDescription: "Sensor product family — trademark availability to be confirmed before commercial use." },
  { title: "SensoraBot", category: "Robotics Platform", shortDescription: "Robotics product family — trademark availability to be confirmed before commercial use." },
  { title: "SensoraAir", category: "Drone/VTOL Platform", shortDescription: "Aerial systems product family — trademark availability to be confirmed before commercial use." },
  { title: "SensoraMed", category: "Medical Platform", shortDescription: "Healthcare product family — trademark availability to be confirmed before commercial use." },
  { title: "SensoraSecure", category: "Security Platform", shortDescription: "Security product family — trademark availability to be confirmed before commercial use." },
];

const careers = [
  { title: "Sensor & Microfabrication Engineer", category: "Engineering", meta: { location: "India", employmentType: "Full-time" }, shortDescription: "Work across sensor architecture, materials and microfabrication." },
  { title: "Robotics & Controls Engineer", category: "Engineering", meta: { location: "India", employmentType: "Full-time" }, shortDescription: "Build autonomous navigation and control for robotic platforms." },
  { title: "AI/ML Engineer — Autonomous Systems", category: "AI/ML", meta: { location: "India", employmentType: "Full-time" }, shortDescription: "Sensor fusion, computer vision and decision-making systems." },
];

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function upsertItems(items, type) {
  let order = 0;
  for (const item of items) {
    const slug = slugify(item.title);
    await ContentItem.findOneAndUpdate(
      { slug },
      { ...item, type, slug, order: order++, published: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${items.length} "${type}" items`);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await upsertItems(technologies, "technology");
  await upsertItems(solutions, "solution");
  await upsertItems(products, "product");
  await upsertItems(careers, "career");

  await SiteSection.findOneAndUpdate(
    { key: "home_hero" },
    {
      key: "home_hero",
      title: "SENSORA TECHNOLOGY",
      subtitle: "Sensing Intelligence. Engineering Autonomy.",
      body: "From microscopic sensing elements to intelligent autonomous machines, Sensora Technology develops technologies that perceive, understand and interact with the physical world.",
      buttons: [
        { label: "Explore Our Technologies", link: "/technologies" },
        { label: "Build With Sensora", link: "/contact" },
      ],
    },
    { upsert: true }
  );

  await SiteSection.findOneAndUpdate(
    { key: "about_company" },
    {
      key: "about_company",
      title: "About Sensora Technology",
      body: "Sensora Technology Private Limited is a deep-tech engineering company working across advanced sensing, autonomous systems, robotics, drones, VTOL platforms and intelligent electronics — spanning the chain from sensing to connectivity, intelligence, autonomy and real-world application.",
    },
    { upsert: true }
  );

  console.log("Site sections seeded.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
