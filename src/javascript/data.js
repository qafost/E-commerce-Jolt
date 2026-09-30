const CATEGORIES = [
  { id: "all", name: "All", icon: "public/icon/basket.svg" },
  { id: "home", name: "Home", icon: "public/icon/home-category.svg" },
  { id: "audio", name: "Audio", icon: "public/icon/music.svg" },
  { id: "sale", name: "Sale", icon: "public/icon/discount.svg" },
  { id: "best", name: "Best sellers", icon: "public/icon/best-seller.svg" }
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Studio Wireless Headphones",
    price: 189,
    compareAt: 229,
    category: "audio",
    tags: ["best", "sale"],
    stock: 12,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Over-ear wireless headphones with 32-hour battery life and active noise cancelling."
  },
  {
    id: "p2",
    name: "Compact Travel Speaker",
    price: 79,
    category: "audio",
    tags: ["best"],
    stock: 20,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4b31f?auto=format&fit=crop&w=800&q=80",
    description: "IPX7 Bluetooth speaker, pocket-sized, with a surprisingly wide stereo field."
  },
  {
    id: "p3",
    name: "Linen Throw Blanket",
    price: 64,
    category: "home",
    tags: [],
    stock: 18,
    image: "https://images.unsplash.com/photo-1584100936595-c0654d78affb?auto=format&fit=crop&w=800&q=80",
    description: "Washed linen throw for sofas and beds. Softens with every wash."
  },
  {
    id: "p4",
    name: "Ceramic Table Lamp",
    price: 112,
    category: "home",
    tags: ["best"],
    stock: 8,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    description: "Warm dimmable lamp with a glazed ceramic base and linen shade."
  },
  {
    id: "p5",
    name: "Everyday Canvas Tote",
    price: 38,
    compareAt: 48,
    category: "home",
    tags: ["sale"],
    stock: 30,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    description: "Heavyweight canvas tote with an inner pocket. Built for groceries and laptops."
  },
  {
    id: "p6",
    name: "Analog Wrist Watch",
    price: 145,
    category: "home",
    tags: ["best"],
    stock: 9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Minimal analog watch with a stainless case and interchangeable strap."
  },
  {
    id: "p7",
    name: "Desk Plant Set",
    price: 42,
    category: "home",
    tags: [],
    stock: 14,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    description: "Low-maintenance succulents in matte pots. Water once a week."
  },
  {
    id: "p8",
    name: "In-ear Studio Buds",
    price: 99,
    compareAt: 129,
    category: "audio",
    tags: ["sale", "best"],
    stock: 22,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    description: "Sweat-resistant earbuds with a charging case and 6-hour playback."
  },
  {
    id: "p9",
    name: "Wool Accent Cushion",
    price: 36,
    category: "home",
    tags: [],
    stock: 16,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    description: "Hand-loomed cushion cover in a dense wool blend. Insert included."
  },
  {
    id: "p10",
    name: "Desktop Record Player",
    price: 220,
    category: "audio",
    tags: ["best"],
    stock: 6,
    image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=80",
    description: "Belt-drive turntable with a built-in preamp. Ready for modern speakers."
  }
];

const POSTS = [
  {
    id: "essentials",
    title: "How to pick everyday essentials",
    date: "March 12, 2026",
    excerpt: "Build a smaller wardrobe that still feels complete — start with quality basics that last.",
    body: "Buy fewer things, but make sure each one earns its place. Start with pieces you will use every week: a tote that holds a laptop, a lamp you actually sit under, headphones that survive a commute. Quality shows up in stitching, weight, and how an object feels after a month — not in the launch photo."
  },
  {
    id: "audio",
    title: "Audio that travels well",
    date: "April 2, 2026",
    excerpt: "Wireless headphones and compact speakers for commute, gym, and late-night focus.",
    body: "Portable audio should disappear until you need it. Look for battery life over 20 hours, a case you will actually pocket, and sound that stays clear at city volume. A small speaker at home can replace a soundbar if you sit close and care about warmth more than cinema effects."
  },
  {
    id: "home",
    title: "Home comfort, quietly",
    date: "May 18, 2026",
    excerpt: "Soft lighting, better textiles, and small objects that make a room feel finished.",
    body: "A room feels finished when light is warm, textiles have texture, and surfaces are not empty. One good lamp, a throw, and a plant do more than a full furniture reset. Keep the palette tight so new pieces still belong next year."
  }
];
