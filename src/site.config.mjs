// Single source of truth for business facts. Every page, price list and JSON-LD block is generated from this file,
// so a change here (hours, prices, review floor) updates the whole site consistently.

export const SITE_URL = 'https://kairoscuts.com';

// Paste the content value from Search Console's "HTML tag" method if you verify that way (DNS verification needs nothing here).
export const GOOGLE_SITE_VERIFICATION = '';

export const BOOKING_URL = 'https://www.fresha.com/a/kairos-cuts-hamilton-142-king-street-west-vxzg37vi?pId=825929';
export const INSTAGRAM_URL = 'https://www.instagram.com/kairoscuts';
export const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=142+King+Street+West+Unit+1+Stoney+Creek+Hamilton+Ontario+L8G+0A9';

export const business = {
  name: 'Kairos Cuts',
  founded: '2019',
  phoneDisplay: '(905) 662-1810',
  phoneE164: '+19056621810',
  email: 'info@kairoscuts.com',
  address: {
    street: '142 King Street West, Unit 1',
    locality: 'Stoney Creek',
    city: 'Hamilton',
    region: 'ON',
    regionName: 'Ontario',
    postalCode: 'L8G 0A9',
    country: 'CA',
  },
  // Fresha lists Friday as 10 AM – 8 PM; the website shows 7 PM. Confirm with the owner, then change `fri` below.
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], label: 'Mon – Fri', opens: '10:00', closes: '19:00', display: '10:00 AM – 7:00 PM' },
    { days: ['Saturday'], label: 'Saturday', opens: '09:00', closes: '17:00', display: '9:00 AM – 5:00 PM' },
    { days: ['Sunday'], label: 'Sunday', closed: true, display: 'Closed' },
  ],
  rating: '5.0',
  // A floor rather than a live count, so the copy stays true as reviews accumulate on Fresha.
  reviewFloor: '1,650+',
  awards: ['Fresha Best in Class 2023', 'Fresha Highly Recommended 2025', 'Fresha Best in Class 2026'],
};

export const menu = [
  {
    id: 'signature-cuts', title: 'Signature Cuts', from: 25,
    items: [
      { name: "Gentlemen's Haircut", price: 35, duration: '45 min', minutes: 45 },
      { name: 'Fade Haircut', price: 40, duration: '45 min – 1 hr', minutes: 45 },
      { name: 'Scissors Only', price: 45 },
      { name: 'Buzz Cut, 1 Level', price: 27 },
      { name: 'Senior Cut', price: 28 },
      { name: 'Cut & Design', price: 55, andUp: true },
      { name: 'Apprentice Cut', price: 25 },
    ],
  },
  {
    id: 'hair-and-beard', title: 'Hair & Beard', from: 25,
    items: [
      { name: 'Fade + Beard', price: 45, duration: '1 hr 15 min', minutes: 75 },
      { name: "Gentleman's Haircut + Beard", price: 40, duration: '45 min – 1 hr 15 min', minutes: 45 },
      { name: 'Beard', price: 25, duration: '30 min', minutes: 30 },
    ],
  },
  {
    id: 'young-gentlemen', title: 'Young Gentlemen', from: 30,
    items: [
      { name: 'Kids Haircut', price: 30, duration: 'All ages · 30–45 min', minutes: 30 },
      { name: "Young Man's Basic Cut", price: 30, duration: '10–15 yrs' },
      { name: "Young Man's Fade", price: 38 },
    ],
  },
  {
    id: 'finishing-touches', title: 'Finishing Touches', from: 5,
    items: [
      { name: 'Line Up', price: 25 },
      { name: 'Shampoo', price: 8 },
      { name: 'Shampoo / Conditioner', price: 10 },
      { name: 'Hot Towel', price: 5 },
    ],
  },
];

// `rated` is true only where Fresha shows a 5.0 rating on the barber's profile.
export const barbers = [
  { id: 'dee', name: 'Dee', role: 'Owner · Master Barber', rated: true, extra: '35+ years', image: 'barber-dee', alt: 'Dee, owner and master barber of Kairos Cuts' },
  { id: 'tiago', name: 'Tiago', role: 'Senior Barber', rated: true, image: 'barber-tiago', alt: 'Tiago, senior barber at Kairos Cuts' },
  { id: 'joban', name: 'Joban', role: 'Senior Barber', rated: true, image: 'barber-joban', alt: 'Joban, senior barber at Kairos Cuts' },
  { id: 'dami', name: 'Dami', role: 'Barber', rated: true, image: 'barber-dami', alt: 'Dami, barber at Kairos Cuts' },
  { id: 'shia', name: 'Shia', role: 'Loc Specialist · Braids', rated: false, image: 'barber-shia', alt: 'Shia, braid and loc specialist at Kairos Cuts' },
  { id: 'shi', name: 'Shi', role: 'Curly-Puff Barber · Apprentice', rated: false, image: 'barber-shi', alt: 'Shi, apprentice barber at Kairos Cuts' },
  { id: 'dante', name: 'Dante', role: 'Apprentice', rated: false, image: 'barber-dante', alt: 'Dante, apprentice barber at Kairos Cuts' },
];

// Verified Fresha reviews already published on the site. `barber` matches a barber id.
export const reviews = [
  { who: 'Glory-Anne H', service: 'Seniors Haircut', barber: 'dee', text: 'The environment is so calm, and Dee is so wonderful with my elderly dad. I watch as they do other people and they are all so caring and it is also fun just to be there.' },
  { who: 'Paul A', service: "Gentlemen's Haircut", barber: 'dami', text: "Excellent cut and service! Dami will make sure your hair looks 100 and you're taken care of. Highly recommend." },
  { who: 'Parm G', service: 'Cut + Beard', barber: 'joban', text: 'Joban put time and great effort in the haircut; I am very pleased with the end result and will now be my go-to barber. The shop is clean and everyone is friendly!' },
  { who: 'Sher L', service: "Gentlemen's Haircut", barber: 'dee', text: 'Dee is an awesome barber who has honed his craft over many years. I was welcomed very warmly and from start to finish was treated with respect and courtesy.' },
  { who: 'Samuel', service: "Gentlemen's Haircut", barber: 'tiago', text: 'Tiago was fantastic! Absolutely love the haircut, very welcoming shop, and super chill!! Highly recommend these guys!' },
  { who: 'Scott L', service: 'Fade Haircut', barber: 'joban', text: 'Amazing barber shop, vibes are always great in the shop, the banter between the staff is always entertaining, haircuts are always on point.' },
  { who: 'Riley L', service: "Gentlemen's Haircut", barber: 'tiago', text: "Great folks over at Kairos cuts. They take pride in their work and make you feel at home. Tiago is my go-to but you can't go wrong with anyone there." },
  { who: 'Nathan B', service: 'Fade Haircut', barber: 'joban', text: "I've been coming here for years and it never disappoints. The barbers are genuinely kind and welcoming every single time — that consistency is what keeps me coming back. Wouldn't go anywhere else." },
  { who: 'Mike F', service: "Gentlemen's Haircut", barber: 'dee', text: 'Amazing service. Dee always delivers a top notch cut. Been going here for years. Definitely recommend.' },
  { who: 'Adam', service: "Gentlemen's Haircut", barber: 'dami', text: 'Love the staff! Great value for great results, unparalleled hospitality.' },
];

export function findService(name) {
  for (const cat of menu) for (const item of cat.items) if (item.name === name) return { ...item, category: cat.title };
  throw new Error(`Unknown service: ${name}`);
}

export function priceLabel(item) {
  return `$${item.price}${item.andUp ? ' & up' : ''}`;
}
