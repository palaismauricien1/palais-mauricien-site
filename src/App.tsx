import { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
  ChefHat,
  Star,
  Quote,
  CookingPot,
  Camera,
  BadgeCheck,
  Clock,
  CupSoda,
  Leaf,
  Plus,
  Menu,
  X,
  ClipboardList,
  Image as GalleryIcon,
  HeartHandshake,
  Users,
  Phone,
  Facebook,
  Navigation,
  ShoppingBag,
  Bike,
  Utensils,
} from 'lucide-react';
import heroImage from './assets/fondhero.webp';
import fondRestoImage from './assets/fondresto.webp';
import fonrespoImage from './assets/fonrespo.webp';
import commentaireImage from './assets/commentaire.webp';
import storefrontImage from './assets/restO.webp';
import logoImage from './assets/logopalaiiis.jpeg';
import aboutImage from './assets/about.webp';
import rizFritImg from './assets/riz-frit.webp';
import massaleCabriImg from './assets/massale-cabri.webp';
import sautePouletFumeImg from './assets/saute-poulet-fume.webp';
import sautePouletBredImg from './assets/saute-poulet-au-bred.webp';
import kebabMauricienImg from './assets/kebab-mauricien.webp';
import aloudaImg from './assets/alouda.webp';
import photorestaurantImg from './assets/photorestaurant.jpeg';
import kebabPngImg from './assets/kebab.webp';
import sautebredPngImg from './assets/sautebred.webp';
import { CustomCursor, Magnetic } from './cursor';
import { Preloader } from './preloader';
import { SiteConfigProvider } from './lib/SiteConfigProvider';
import {
  useSiteConfig,
  CAT_KEYS,
  CAT_LABELS,
  DAY_KEYS,
  DAY_LABELS,
  resolveImg,
  onImgError,
  getDisplayPrice,
  getPriceLine,
  getDispoToday,
  getTodayKey,
  getTodayDayKey,
  getDayServices,
  isOpenNow,
  getExceptionalClosure,
  getUpcomingClosures,
  formatDateFR,
  UBER_EATS_URL,
  GOOGLE_MAPS_URL,
  PHONE_TEL,
  PHONE_DISPLAY,
  TIKTOK_FALLBACK,
} from './lib/siteConfig';
import type { MenuItem, CategoryKey, SiteConfig } from './lib/siteConfig';
import { trackVisitIfConsented } from './lib/tracking';
import { CookieBanner } from './components/CookieBanner';
import { Seo } from './components/Seo';
import { breadcrumbLd } from './components/seoUtils';
import MentionsLegales from './pages/MentionsLegales';
import DishPage from './pages/DishPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  // Tracking de visites anonymes - uniquement si consentement déjà donné (RGPD).
  useEffect(() => {
    trackVisitIfConsented();
  }, []);

  return (
    <SiteConfigProvider>
      <CustomCursor />
      <Preloader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aujourdhui" element={<AujourdhuiPage />} />
        <Route path="/disponible-aujourdhui" element={<Navigate to="/aujourdhui" replace />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/galerie" element={<GaleriePage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/masale-cabri" element={<DishPage slug="masale-cabri" />} />
        <Route path="/vinday-poisson" element={<DishPage slug="vinday-poisson" />} />
        <Route path="/brochette-mauricienne" element={<DishPage slug="brochette-mauricienne" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieBanner />
    </SiteConfigProvider>
  );
}

const navLinks = [
  { label: "ACCUEIL", to: "/" },
  { label: "AUJOURD'HUI", to: "/aujourdhui" },
  { label: "MENU", to: "/menu" },
  { label: "GALERIE", to: "/galerie" },
  { label: "À PROPOS", to: "/a-propos" },
  { label: "CONTACT", to: "/contact" },
];

const marqueeItems = [
  { Icon: BadgeCheck, label: 'Certifié' },
  { Icon: ShoppingBag, label: 'À emporter' },
  { Icon: Leaf, label: 'Option végétarienne' },
  { Icon: Bike, label: 'Livraison via Uber Eats' },
];

function MarqueeSegment() {
  return (
    <>
      {marqueeItems.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2 shrink-0">
          <item.Icon size={11} className="text-gold-400/90 shrink-0" />
          <span className="text-[10px] sm:text-[11px] tracking-widest2 text-[#F3ECDF]/85 font-medium">
            {item.label}
          </span>
          <span className="text-gold-500/40 mx-3">•</span>
        </span>
      ))}
    </>
  );
}

function InfoMarquee() {
  return (
    <div className="h-7 sm:h-8 overflow-hidden bg-[#170f0a]/85 backdrop-blur-sm border-b border-gold-500/10">
      <div className="marquee-track flex items-center h-full whitespace-nowrap">
        <MarqueeSegment />
        <MarqueeSegment />
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [mobileOpen]);

  return (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <InfoMarquee />

      <div className="px-4 sm:px-6 pt-3 sm:pt-4">
        <header
          className={`mx-auto w-[90%] max-w-[1400px] rounded-full border transition-all duration-500 ${
            scrolled
              ? 'bg-white/90 border-white/10 shadow-lg shadow-black/15'
              : 'bg-white/90 border-white/40 shadow-md shadow-black/10'
          }`}
        >
          <div className="flex items-center justify-between h-14 sm:h-16 px-5 sm:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold-600/50 overflow-hidden bg-white shrink-0 group-hover:border-gold-500 transition-colors duration-300">
                <img src={logoImage} alt="Palais Mauricien" className="w-full h-full object-cover scale-110" />
              </div>
              <div>
                <p className="text-dark-800 font-playfair text-sm font-bold tracking-widest2 leading-none">
                  PALAIS MAURICIEN
                </p>
                <p className="text-gold-800 text-[9px] tracking-widest3 mt-0.5 leading-none">
                  LE PORT · LA RÉUNION
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`hero-ui nav-wave-link text-[11px] transition-colors duration-200 ${
                      active ? 'text-gold-700 is-active' : 'text-dark-800/60 hover:text-dark-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Commander button */}
            <div className="flex items-center gap-4">
              <Magnetic>
                <a
                  href={UBER_EATS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chamfer hidden lg:flex items-center gap-2 bg-gold-500 text-dark-800 px-5 py-2.5 text-[11px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-all duration-300"
                >
                  <ShoppingCart size={14} />
                  COMMANDER
                </a>
              </Magnetic>
              <button
                className="lg:hidden text-dark-800"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden mx-auto w-[90%] max-w-[1400px] mt-3 rounded-3xl bg-[#FBF7EC]/95 backdrop-blur-md border border-white/50 shadow-lg shadow-black/15 px-6 py-6 space-y-5">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-[11px] tracking-widest2 font-medium ${
                    active ? 'text-gold-700' : 'text-dark-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer btn-chamfer-outline flex items-center gap-2 text-gold-700 px-5 py-2.5 text-[11px] tracking-wide font-semibold font-sans mt-4"
            >
              <ShoppingCart size={14} />
              COMMANDER
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/** Item de la carte pour le JSON-LD (prix numérique + priceCurrency EUR). */
function menuItemLd(name: string, description: string, price: string) {
  return {
    '@type': 'MenuItem',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    suitableForDiet: 'https://schema.org/HalalDiet',
  };
}

/** Carte complète (5 sections) — même contenu que l'ancienne page menu du site statique. */
const MENU_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  '@id': 'https://www.palaismauricien.re/menu#menu',
  name: 'Carte du Palais Mauricien',
  description:
    "Carte complète du Palais Mauricien, restaurant halal mauricien au Port, La Réunion : plats principaux, street food, grillades, desserts et boissons.",
  inLanguage: 'fr',
  hasMenuSection: [
    {
      '@type': 'MenuSection',
      name: 'Plats principaux',
      hasMenuItem: [
        menuItemLd('Riz frit', "Riz sauté à l'œuf, légumes et sauce soja, façon mauricienne. Poulet 8 € ou végétarien 7 €.", '8.00'),
        menuItemLd('Sauté poulet fumé', 'Poulet fumé sauté à la créole, goût intense.', '8.00'),
        menuItemLd('Sauté poulet au bred', 'Poulet aux breds frais, parfumé aux épices locales.', '8.00'),
        menuItemLd('Masalé cabri', "Cabri mijoté lentement au massalé, recette emblématique de l'Île Maurice.", '9.00'),
        menuItemLd('Vinday poisson', 'Poisson mariné au vinaigre, curcuma et moutarde, classique mauricien.', '9.00'),
        menuItemLd('Daube poulet pomme de terre', 'Daube créole au poulet et pommes de terre, mijotée aux épices douces.', '8.00'),
        menuItemLd('Halim', 'Ragoût épicé de viande et lentilles, doux et savoureux.', '9.00'),
        menuItemLd('Mine bouille', 'Nouilles en bouillon parfumé, garniture créole. Poulet 9 € ou poulet œuf 10 €.', '9.00'),
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'Street food',
      hasMenuItem: [
        menuItemLd('Kebab mauricien', 'Kebab façon mauricienne, chutneys frais, épices parfumées.', '6.00'),
        menuItemLd('Brochette mauricienne', 'Tendre brochette marinée aux épices créoles, grillée sur braise.', '3.50'),
        menuItemLd('Roti', 'Pain plat moelleux fait maison, garni à votre choix. Veg 3 €, poulet 3,50 €, poisson 4,50 €.', '3.00'),
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'Grillades',
      hasMenuItem: [
        menuItemLd('Grillade mauricienne', 'Viande grillée marinée aux aromates, salade et frites.', '10.00'),
        menuItemLd('Cuisses', 'Cuisses de poulet grillées, marinées aux épices créoles.', '6.00'),
        menuItemLd('Foie de bœuf', 'Foie de bœuf grillé, parfumé aux épices et herbes fraîches.', '9.00'),
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'Desserts',
      hasMenuItem: [
        menuItemLd('Gulab jamun', 'Boulettes de lait concentré frites, imbibées de sirop à la rose.', '2.00'),
        menuItemLd('Rasgullah', 'Boules de fromage frais dans un sirop sucré à la cardamome.', '2.00'),
        menuItemLd('Napolitaine', 'Biscuit sablé fourré à la confiture, enrobé de glaçage rose.', '2.00'),
      ],
    },
    {
      '@type': 'MenuSection',
      name: 'Boissons',
      hasMenuItem: [
        menuItemLd('Alouda', 'Boisson emblématique mauricienne : lait, graines de basilic et sirop coloré.', '3.50'),
      ],
    },
  ],
};

function HomePage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWidth, setTitleWidth] = useState(0);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const measure = () => setTitleWidth(el.offsetWidth);
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title="Palais Mauricien - Restaurant halal mauricien · Le Port, La Réunion"
        description="Palais Mauricien - Restaurant halal mauricien au Port, La Réunion. Saveurs authentiques de l'Île Maurice. À emporter & livraison via Uber Eats. Note 4,4/5 sur Google."
        path="/"
        ogType="restaurant"
        jsonLd={breadcrumbLd([['Accueil', '/']])}
      />
      <SiteHeader />

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] lg:min-h-screen flex flex-col overflow-hidden">
        {/* Background food image — right half, image already well lit so no exposure boost needed */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Plat mauricien signature du Palais Mauricien, restaurant halal au Port, La Réunion"
            fetchpriority="high"
            className="w-full h-full object-cover object-right contrast-105 saturate-110"
          />
          {/* Stronger left-side scrim — fondhero.png's stone backdrop is lighter than the old shot, so text needs more coverage to stay readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#120b06]/50 via-[#120b06]/70 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 lg:px-10 pt-36 sm:pt-40 pb-28">
          {/* Main title */}
          <div className="mb-6 text-center lg:text-left hero-reveal animate-fade-up">
            <h1 ref={titleRef} className="hero-title inline-block font-playfair font-black text-gold-400 leading-none tracking-wider"
              style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
              PALAIS
            </h1>
            <h2 className="hero-script font-script text-white leading-none -mt-4 lg:-mt-8"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
              Mauricien
            </h2>
          </div>

          {/* Divider ornament — centered on the width of "PALAIS" on desktop, full-width on mobile */}
          <div
            className="flex items-center gap-4 mb-8 mx-auto lg:mx-0 w-full lg:w-[var(--hero-w)] hero-reveal animate-fade-up [animation-delay:150ms]"
            style={titleWidth ? ({ '--hero-w': `${titleWidth}px` } as React.CSSProperties) : undefined}
          >
            <div className="h-px flex-1 bg-gold-500/40" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <div className="h-px flex-1 bg-gold-500/40" />
          </div>

          {/* Subtitle — centered on the divider's width on desktop, full-width on mobile */}
          <div
            className="mb-4 mx-auto lg:mx-0 w-full lg:w-[var(--hero-w)] hero-reveal animate-fade-up [animation-delay:250ms]"
            style={titleWidth ? ({ '--hero-w': `${titleWidth}px` } as React.CSSProperties) : undefined}
          >
            {/* <p className="text-[11px] lg:text-[13px] tracking-widest3 font-light text-white/95 mb-3 text-center"> */}
              <p className="text-[11px] lg:text-[13px] tracking-widest3 font-bold text-white mb-3 text-center">
              Saveurs authentiques de L'île Maurice
            </p>
          </div>

          {/* CTA — centered on the title's central axis on desktop, full-width centered on mobile */}
          <div
            className="flex justify-center mx-auto lg:mx-0 w-full lg:w-[var(--hero-w)] hero-reveal animate-fade-up [animation-delay:350ms]"
            style={titleWidth ? ({ '--hero-w': `${titleWidth}px` } as React.CSSProperties) : undefined}
          >
            <Magnetic strength={0.4}>
              <Link
                to="/menu"
                className="btn-chamfer btn-chamfer-lg hero-script inline-flex items-center gap-3 whitespace-nowrap bg-gold-500 text-black px-8 py-4 text-2xl sm:text-3xl hover:bg-gold-400 transition-all duration-300"
              >
                <Utensils size={24} />
                Découvrir le menu
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ── SÉLECTION DU JOUR ── */}
      <TodaysSelection />

      {/* ── NOTRE HISTOIRE ── */}
      <section id="histoire" className="relative bg-[#efe0cb] overflow-hidden">
        {/* Mobile / tablet: fonrespo.png already bakes in the wave + cream panel, text overlaid on top like desktop.
            Negative margin (not absolute positioning) pulls the text up into the cream zone while staying in
            normal flow, so the section still grows to fit the text instead of it bleeding into the next section. */}
        <div className="lg:hidden">
          <img
            src={fonrespoImage}
            alt="Façade du restaurant Palais Mauricien au Port, La Réunion"
            className="w-full h-auto block"
            loading="lazy"
          />
          <div className="-mt-[68%] px-7 sm:px-12 pb-14">
            <AboutContent />
          </div>
        </div>

        {/* Desktop: single reference image, text overlaid on its cream panel */}
        <div className="hidden lg:block relative">
          <img src={fondRestoImage} alt="" aria-hidden="true" className="w-full h-auto block" />
          <div className="absolute inset-0 flex items-center">
            <div className="w-full grid grid-cols-[47%_53%]">
              <div />
              <div className="pl-16 xl:pl-24 pr-12 xl:pr-24">
                <AboutContent />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENU HIGHLIGHTS ── */}
      {/* <section className="bg-dark-800 py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold-500/70 text-[10px] tracking-widest3 mb-3">NOS SPÉCIALITÉS</p>
            <h3 className="font-playfair text-4xl lg:text-5xl font-bold text-white leading-tight">
              Nos plats<br />
              les plus <span className="italic text-gold-400">appréciés</span>
            </h3>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-16 bg-gold-500/30" />
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
                <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
              </svg>
              <div className="h-px w-16 bg-gold-500/30" />
            </div>
          </div>

          <SignatureDishesGrid />

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-block border border-gold-500/50 text-gold-400 px-10 py-4 text-[11px] tracking-wide font-semibold font-sans hover:bg-gold-500 hover:text-dark-800 transition-all duration-300"
            >
              VOIR TOUT LE MENU
            </Link>
          </div>
        </div>
      </section> */}

      {/* ── EXPLORER ── */}
      <section className="bg-dark-700 py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="text-center mb-16">
            <p className="font-playfair italic text-gold-400 text-sm mb-4">– Explorer –</p>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white leading-tight">
              Tout ce que<br />
              nous <span className="italic text-gold-400">proposons</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-16 bg-gold-500/30" />
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
                <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
              </svg>
              <div className="h-px w-16 bg-gold-500/30" />
            </div>
          </Reveal>

          <ExploreGrid />
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <Testimonials />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── COMMENT COMMANDER ── */}
      <HowToOrder />

      <SiteFooter />
      <PersistentCTAs />
    </div>
  );
}

/** Regroupe les jours consécutifs partageant les mêmes horaires (pour le footer). */
function buildHoursGroups(hours: SiteConfig['hours']): { label: string; text: string }[] {
  const groups: { start: (typeof DAY_KEYS)[number]; end: (typeof DAY_KEYS)[number]; text: string }[] = [];
  DAY_KEYS.forEach((k) => {
    const services = getDayServices(hours[k]);
    const text = services
      ? [services.midi && `Midi ${services.midi}`, services.soir && `Soir ${services.soir}`]
          .filter(Boolean)
          .join(' · ')
      : 'Fermé';
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.end = k;
    else groups.push({ start: k, end: k, text });
  });
  return groups.map((g) => ({
    label: g.start === g.end ? DAY_LABELS[g.start] : `${DAY_LABELS[g.start]} – ${DAY_LABELS[g.end]}`,
    text: g.text,
  }));
}

export function SiteFooter() {
  const config = useSiteConfig();
  const hoursGroups = buildHoursGroups(config.hours);

  return (
    <footer id="site-footer" className="bg-dark-900 border-t border-white/10 py-12 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto grid sm:grid-cols-3 gap-10">
        <div>
          <p className="text-gold-400 font-playfair font-bold tracking-widest2 text-sm mb-2">PALAIS MAURICIEN</p>
          <p className="text-gold-500/400 text-[9px] tracking-widest3 mb-4">LE PORT · LA RÉUNION</p>
          <p className="text-white/70 text-xs leading-relaxed">
            Cuisine mauricienne authentique,<br />
            préparée avec passion chaque jour.
          </p>
        </div>
        <div>
          <p className="text-white/50 text-[10px] tracking-widest2 mb-4">HORAIRES</p>
          {hoursGroups.map((group) => (
            <div key={group.label}>
              <p className="text-white/70 text-xs mb-1">{group.label}</p>
              <p className="text-gold-400 text-sm font-medium mb-3">{group.text}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-white/50 text-[10px] tracking-widest2 mb-4">CONTACT</p>
          <p className="text-white/70 text-xs mb-2">22 Av. de la Commune de Paris, Le Port 97420, La Réunion</p>
          <p className="text-white/70 text-xs mb-2">
            <a href={PHONE_TEL} className="hover:text-gold-400 transition-colors">{PHONE_DISPLAY}</a>
          </p>
          <Magnetic strength={0.3}>
            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer btn-chamfer-outline flex items-center gap-2 text-gold-400 px-5 py-2.5 text-[10px] tracking-wide font-semibold font-sans mt-4 hover:bg-gold-500/10 transition-colors"
            >
              <ShoppingCart size={12} />
              COMMANDER EN LIGNE
            </a>
          </Magnetic>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/80 text-[10px] tracking-wider">© 2026 Palais Mauricien. Tous droits réservés.</p>
        <p className="text-white/80 text-[10px] tracking-wider">Cuisine Halal Certifiée · À Emporter · Livraison Uber Eats</p>
        <Link
          to="/mentions-legales"
          className="text-white/80 text-[10px] tracking-wider hover:text-gold-400 transition-colors"
        >
          Mentions légales
        </Link>
        <a
          href="https://fondationstudio.fr/fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 text-[10px] tracking-wider hover:text-gold-400 transition-colors"
        >
          Créé par ACTCstudio.fr https://fondationstudio.fr/fr
        </a>
      </div>
    </footer>
  );
}

export function PersistentCTAs() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: '0px' }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Magnetic strength={0.25}>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-chamfer btn-chamfer-outline fixed left-5 z-40 lg:hidden flex items-center gap-2 bg-dark-900 text-gold-400 px-4 sm:px-5 py-2.5 text-[10px] tracking-wide font-semibold font-sans shadow-lg shadow-black/40 hover:bg-dark-700 transition-all duration-300 ${
            hidden ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
          style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        >
          <MapPin size={13} />
          Y ALLER
        </a>
      </Magnetic>
      <Magnetic strength={0.25}>
        <a
          href={UBER_EATS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-chamfer fixed right-5 z-40 lg:hidden flex items-center gap-2 bg-gold-500 text-dark-800 px-4 sm:px-5 py-2.5 text-[10px] tracking-wide font-semibold font-sans shadow-lg shadow-black/40 hover:bg-gold-400 transition-all duration-300 ${
            hidden ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
          style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        >
          <ShoppingCart size={13} />
          COMMANDER
        </a>
      </Magnetic>
    </>
  );
}

function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Tous les items visibles du config, toutes catégories confondues (carrousel "sélection"). */
function useVisibleDishes() {
  const config = useSiteConfig();
  return useMemo(
    () =>
      CAT_KEYS.flatMap((cat) => config.menu[cat].filter((item) => item.visible)).map((item) => ({
        id: item.id,
        name: item.name,
        price: getDisplayPrice(item),
        image: resolveImg(item.img),
      })),
    [config]
  );
}

function AboutContent() {
  return (
    <Reveal className="max-w-lg">
      <p className="text-gold-600 text-[11px] tracking-widest3 font-semibold uppercase mb-4">
        Restaurant
      </p>
      <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-dark-800 leading-[1.1]">
        La cuisine de<br />l'Île Maurice
      </h2>
      <p className="font-playfair text-4xl sm:text-5xl font-bold text-gold-600 leading-[1.1] mb-6">
        à La Réunion
      </p>
      <div className="w-12 h-px bg-gold-600/50 mb-6" />
      <p className="text-dark-800/70 leading-relaxed text-sm sm:text-base mb-8">
        Au cœur du Port, le Palais Mauricien vous fait voyager chaque jour vers l'Île Maurice.
        Épices douces, recettes transmises, produits frais. Cuisine 100% halal, à emporter ou en livraison.
      </p>
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-chamfer inline-flex items-center gap-3 bg-gold-600 text-white px-7 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-700 transition-colors"
      >
        <MapPin size={15} />
        NOUS TROUVER
      </a>
    </Reveal>
  );
}

function SelectionCard({ name, price, image }: { name: string; price: string; image: string }) {
  return (
    <div className="relative w-[250px] sm:w-[280px] h-[368px] sm:h-[404px] shrink-0 snap-start flex flex-col border border-gold-600/15 rounded-2xl overflow-hidden bg-white transition-all duration-300 ease-out hover:-translate-y-1.5">
      {/* Gold corner accents */}
      <span className="pointer-events-none absolute top-0 right-0 w-9 h-9 border-t-2 border-r-2 border-gold-500 rounded-tr-2xl z-10" />
      <span className="pointer-events-none absolute bottom-0 left-0 w-9 h-9 border-b-2 border-l-2 border-gold-500 rounded-bl-2xl z-10" />

      <div className="h-64 sm:h-72 overflow-hidden group shrink-0">
        <img src={image} onError={onImgError} alt={name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" />
      </div>
      <div className="flex-1 p-5 flex items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h3 className="font-playfair text-xl font-bold text-dark-800 leading-tight line-clamp-2">{name}</h3>
          <p className="text-gold-700 text-sm mt-1">{price}</p>
        </div>
        <Link
          to="/menu"
          aria-label={`Voir ${name}`}
          className="w-10 h-10 rounded-full border border-gold-600/40 flex items-center justify-center text-gold-700 hover:bg-gold-700 hover:text-white hover:border-gold-700 transition-colors shrink-0"
        >
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function TodaysSelection() {
  const todaysDishes = useVisibleDishes();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { ref: cardsRef, visible: cardsVisible } = useRevealOnScroll<HTMLDivElement>();

  const scrollByCard = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 24 : 300;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 24 : 300;
    setActive(Math.round(el.scrollLeft / step));
  };

  return (
    <section id="aujourdhui" className="relative bg-[#FAF7F2] py-24 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <Reveal className="text-center mb-14">
          <p className="font-playfair italic text-gold-400 text-sm mb-4">– La sélection du jour –</p>
          <div className="w-10 h-px bg-gold-600/50 mx-auto mb-5" />
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-800 leading-[1.05]">
            Aujourd'hui<br />
            à la <span className="italic text-gold-600">carte</span>
          </h2>
        </Reveal>

        <div className="flex justify-end mb-6">
          <Link
            to="/menu"
            className="link-ornate hero-ui inline-flex items-center gap-2 text-gold-700 text-[11px] tracking-wide font-semibold hover:text-gold-800 transition-colors"
          >
            VOIR LE MENU
            <ArrowRight size={13} />
          </Link>
        </div>

        <div ref={cardsRef} className="relative">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Plat précédent"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gold-600/30 bg-[#FAF7F2] items-center justify-center text-gold-700 hover:bg-gold-700 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {todaysDishes.map((dish, i) => (
              <div
                key={dish.id}
                style={{ transitionDelay: cardsVisible ? `${Math.min(i, 6) * 80}ms` : '0ms' }}
                className={`shrink-0 snap-start transition-all duration-500 ease-out ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <SelectionCard name={dish.name} price={dish.price} image={dish.image} />
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Plat suivant"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gold-600/30 bg-[#FAF7F2] items-center justify-center text-gold-700 hover:bg-gold-700 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {todaysDishes.map((dish, i) => (
            <span
              key={dish.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-gold-600' : 'w-1.5 bg-gold-600/25'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExploreCard({  title, description, linkLabel, image, Icon, to }: {
  // eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
  image: string;
  Icon: typeof MapPin;
  to: string;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] border-2 border-gold-500/40">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {/* <span className="inline-block font-playfair font-bold text-white text-xs sm:text-sm bg-gold-500 rounded-full px-3 py-1 mb-2">
              {eyebrow}
            </span> */}
            <h4 className="font-playfair text-xl sm:text-2xl font-bold text-white leading-tight mb-1.5 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]">
              {title}
            </h4>
            <p className="text-white/90 text-xs mb-3 [text-shadow:0_2px_5px_rgba(0,0,0,0.6)]">{description}</p>
            <Link
              to={to}
              className="link-ornate hero-ui inline-flex items-center gap-2 text-gold-400 text-[10px] tracking-wide font-semibold hover:text-gold-300 transition-colors"
            >
              {to === '/menu' ? <Utensils size={12} /> : null}
              {linkLabel.toUpperCase()}
              {to !== '/menu' ? <ArrowRight size={12} /> : null}
            </Link>
          </div>
          <div className="shrink-0 w-9 h-9 rounded-full border border-gold-400/50 bg-dark-900/40 backdrop-blur-sm flex items-center justify-center text-gold-400">
            <Icon size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExploreGrid() {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {exploreItems.map((item, i) => (
        <div
          key={item.title}
          style={{ transitionDelay: visible ? `${i * 100}ms` : '0ms' }}
          className={`transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <ExploreCard {...item} />
        </div>
      ))}
    </div>
  );
}

const exploreItems = [
  {
    eyebrow: "La Carte",
    title: "Notre Menu",
    description: "Plats principaux, street food, grillades, desserts & boissons mauriciens",
    linkLabel: "Voir le menu",
    image: massaleCabriImg,
    Icon: CookingPot,
    to: "/menu",
  },
  {
    eyebrow: "Galerie",
    title: "Nos Créations",
    description: "Découvrez nos plats en images, de la brochette au dessert",
    linkLabel: "Voir la galerie",
    image: kebabMauricienImg,
    Icon: Camera,
    to: "/galerie",
  },
  {
    eyebrow: "Nous Trouver",
    title: "Contact & Horaires",
    description: "22 Av. de la Commune de Paris, Le Port · Service midi & soir",
    linkLabel: "Nous contacter",
    image: storefrontImage,
    Icon: MapPin,
    to: "/contact",
  },
];

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A24 24 0 0 0 0 24c0 3.87.92 7.53 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.9l-7.97 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function TiktokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 0h-3.3v15.3c0 1.6-1.3 2.9-2.9 2.9a2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6 0 .9.1V9.1a6.3 6.3 0 0 0-.9-.1A6.2 6.2 0 0 0 4.2 15.3 6.2 6.2 0 0 0 10.4 21.5a6.2 6.2 0 0 0 6.2-6.2V7.4a8.2 8.2 0 0 0 4.8 1.5V5.6a4.9 4.9 0 0 1-4.8-4.9V0z" />
    </svg>
  );
}

function ReviewCard({ name, time, text }: { name: string; time: string; text: string }) {
  return (
    // Width is a % of the visible track (not of the doubled scroll content), so it reliably
    // yields ~1 card on mobile, ~2 on tablet, ~3 on desktop regardless of loop duplication.
    <div
      tabIndex={0}
      className="w-[86%] sm:w-[47%] lg:w-[31%] shrink-0 bg-white/90 border-[5px] border-gold-500/25 rounded-tr-2xl rounded-bl-2xl rounded-tl-none rounded-br-none p-6
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-0.5 text-gold-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <Quote size={20} className="text-gold-500/30" />
      </div>
      <p className="text-dark-800/80 text-sm leading-relaxed mb-6">{text}</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full border border-gold-500/40 bg-gold-50 flex items-center justify-center text-gold-700 font-playfair font-bold text-sm shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-dark-800 text-sm font-semibold">{name}</p>
          <p className="text-dark-800/50 text-xs">{time}</p>
        </div>
      </div>
    </div>
  );
}

const reviews = [
  {
    name: "Sophie L.",
    time: "Il y a 2 semaines",
    text: "Une expérience culinaire incroyable ! Des plats savoureux et authentiques, un vrai voyage à l'Île Maurice.",
  },
  {
    name: "Julien M.",
    time: "Il y a 1 mois",
    text: "Accueil chaleureux, service impeccable et cuisine délicieuse. On sent vraiment l'amour des bons produits.",
  },
  {
    name: "Marie D.",
    time: "Il y a 3 semaines",
    text: "Meilleur restaurant mauricien que j'ai testé jusqu'à présent ! Les saveurs sont au rendez-vous.",
  },
  {
    name: "Karim B.",
    time: "Il y a 5 jours",
    text: "Le massalé cabri est juste parfait, on retrouve vraiment le goût de l'Île Maurice. Je recommande fortement.",
  },
  {
    name: "Laura P.",
    time: "Il y a 1 semaine",
    text: "Cadre chaleureux et personnel très accueillant. Les portions sont généreuses et tout est fait maison.",
  },
  {
    name: "Thomas R.",
    time: "Il y a 2 mois",
    text: "Petit coup de cœur pour les brochettes et le riz frit. Rapport qualité-prix excellent, on reviendra vite !",
  },
  {
    name: "Nadia S.",
    time: "Il y a 4 jours",
    text: "Un vrai dépaysement culinaire, les épices sont bien dosées et les plats arrivent toujours chauds.",
  },
  {
    name: "Vincent A.",
    time: "Il y a 6 semaines",
    text: "Service rapide même en période de rush, et la carte propose de belles surprises pour les becs sucrés.",
  },
  {
    name: "Emma G.",
    time: "Il y a 3 jours",
    text: "Découverte grâce à des amis, on n'a pas été déçus. Le gulab jamun en dessert est un délice absolu.",
  },
];

// Must match the track's `gap-*` utility below (gap-6 = 24px) so the active-dot
// math lines up with the real distance between two cards.
const TESTIMONIALS_CARD_GAP_PX = 24;

function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const cardStep = () => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    return card ? card.getBoundingClientRect().width + TESTIMONIALS_CARD_GAP_PX : 300;
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / cardStep()) % reviews.length);
  };

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * cardStep(), behavior: 'smooth' });
  };

  return (
    <section
      className="relative py-24 px-6 lg:px-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${commentaireImage})` }}
    >
      <div className="max-w-[1400px] mx-auto">
        <Reveal className="text-center mb-14">
          <p className="font-playfair italic text-gold-600 text-sm mb-4">– Témoignages –</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark-800 leading-tight">
            Ils nous ont noté<br />
            4,4 / 5 sur Google.
          </h2>
        </Reveal>

        <Reveal
          delay={150}
          className="relative"
        >
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review, i) => (
              <ReviewCard key={`${review.name}-${i}`} {...review} />
            ))}
          </div>
        </Reveal>

        <div className="flex items-center justify-center gap-4 mt-8 mb-6">
          <button
            type="button"
            aria-label="Avis précédents"
            onClick={() => scrollByCard(-1)}
            className="w-8 h-8 rounded-full border border-gold-600/30 flex items-center justify-center text-gold-600/70 hover:text-gold-600 hover:border-gold-600/60 transition-colors shrink-0"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-2">
            {reviews.map((review, i) => (
              <span
                key={review.name}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-gold-600' : 'w-1.5 bg-gold-600/25'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Avis suivants"
            onClick={() => scrollByCard(1)}
            className="w-8 h-8 rounded-full border border-gold-600/30 flex items-center justify-center text-gold-600/70 hover:text-gold-600 hover:border-gold-600/60 transition-colors shrink-0"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="text-center">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chamfer inline-flex items-center gap-3 bg-dark-900 text-gold-400 pl-2 pr-6 py-2 text-[11px] tracking-wide font-semibold font-sans hover:bg-dark-700 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg border border-gold-500/40 bg-dark-800 flex items-center justify-center shrink-0">
              <GoogleIcon size={14} />
            </span>
            VOIR TOUS LES AVIS SUR GOOGLE
          </a>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    question: "Le Palais Mauricien est-il halal ?",
    answer: "Oui, toute notre cuisine est 100% halal certifiée.",
    Icon: BadgeCheck,
  },
  {
    question: "Quels sont les horaires d'ouverture ?",
    answer: "Nous sommes ouverts midi et soir, tous les jours.",
    Icon: Clock,
  },
  // {
  //   question: "Où êtes-vous situés ?",
  //   answer: "22 Av. de la Commune de Paris, Le Port, à La Réunion.",
  //   Icon: MapPin,
  // },
  {
    question: "Comment passer commande ?",
    answer: "Sur place, à emporter, ou en livraison via Uber Eats.",
    Icon: ShoppingCart,
  },
  // {
  //   question: "Quels sont vos plats signatures ?",
  //   answer: "Le Biryani Mauricien, le Vindaye Poisson et notre Riz Cantonais, best-seller de la maison.",
  //   Icon: Award,
  // },
  {
    question: "Avez-vous des plats végétariens ?",
    answer: "Oui, plusieurs plats de notre carte peuvent être préparés sans viande, sur demande.",
    Icon: Leaf,
  },
  // {
  //   question: "Comment savoir ce qui est disponible aujourd'hui ?",
  //   answer: "Consultez notre sélection du jour, mise à jour chaque matin sur cette page.",
  //   Icon: Calendar,
  // },
  // {
  //   question: "Acceptez-vous la carte bancaire ?",
  //   answer: "Oui, carte bancaire, espèces et principaux paiements mobiles sont acceptés.",
  //   Icon: CreditCard,
  // },
];

// Thin gold line-art fern used as a subtle background watermark and as the CTA card's decorative sprig.
function FaqLeafBranch({ className }: { className?: string }) {
  const pairs = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M100 396 C 100 300, 100 200, 100 8" strokeLinecap="round" />
      {pairs.map((i) => {
        const y = 60 + i * 44;
        const len = 58 - i * 4;
        return (
          <g key={i} strokeLinecap="round">
            <path d={`M100 ${y} C ${100 - len * 0.3} ${y - len * 0.45}, ${100 - len * 0.65} ${y - len * 0.15}, ${100 - len} ${y + len * 0.35}`} />
            <path d={`M100 ${y} C ${100 + len * 0.3} ${y - len * 0.45}, ${100 + len * 0.65} ${y - len * 0.15}, ${100 + len} ${y + len * 0.35}`} />
          </g>
        );
      })}
    </svg>
  );
}

// Symmetric filigree flourish for the ornate section divider.
function FaqFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M2 12 C 14 12, 18 4, 30 4 C 40 4, 42 12, 50 12" />
      <path d="M98 12 C 86 12, 82 4, 70 4 C 60 4, 58 12, 50 12" />
      <circle cx="2" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="98" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="50" cy="12" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FaqItem({ question, answer, Icon }: { question: string; answer: string; Icon: typeof MapPin }) {
  return (
    <details className="group rounded-2xl border border-gold-500/30 bg-[#FBF7EC] shadow-[0_10px_30px_-14px_rgba(120,90,40,0.35)] px-5 sm:px-7 [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-center gap-4 sm:gap-5 py-5 sm:py-6 cursor-pointer select-none">
        <span className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-gold-500/40 p-[3px]">
          <span className="w-full h-full rounded-full border border-gold-600/60 flex items-center justify-center text-gold-600">
            <Icon size={16} />
          </span>
        </span>
        <span className="flex-1 font-playfair text-dark-800 text-base sm:text-lg">{question}</span>
        <Plus size={18} strokeWidth={1.75} className="shrink-0 text-gold-600 transition-transform duration-300 group-open:rotate-45" />
      </summary>
      <p className="text-dark-800/55 text-sm leading-relaxed pl-[3.75rem] sm:pl-[4.25rem] pb-5 sm:pb-6 pr-2">{answer}</p>
    </details>
  );
}

function FaqSection() {
  return (
    <section className="relative py-24 px-6 lg:px-10 bg-[#F3ECDF] overflow-hidden">
      <div className="pointer-events-none absolute -top-10 -left-16 w-72 h-[420px] text-gold-700/[0.07] rotate-[-8deg]">
        <FaqLeafBranch className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto">
        <Reveal className="text-center mb-10">
          <p className="font-playfair italic text-gold-600 text-sm mb-4">– Questions fréquentes –</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-dark-800 leading-tight">
            Tout ce que <span className="italic text-gold-600">vous voulez savoir</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-24 bg-gold-500/30" />
            <FaqFlourish className="w-8 h-8 text-gold-500/70 shrink-0" />
            <div className="h-px w-24 bg-gold-500/30" />
          </div>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 60}>
              <FaqItem {...faq} />
            </Reveal>
          ))}
        </div>

        <div className="relative mt-4 rounded-2xl border border-gold-500/30 bg-[#FBF7EC] shadow-[0_10px_30px_-14px_rgba(120,90,40,0.35)] px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between overflow-hidden">
          <div className="hidden sm:block absolute left-4 bottom-2 w-16 h-24 text-gold-500/50 pointer-events-none">
            <FaqLeafBranch className="w-full h-full" />
          </div>
          <div className="flex-1 text-center sm:text-left sm:pl-16">
            <p className="font-playfair text-gold-700 font-semibold text-lg sm:text-xl mb-1">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <p className="text-dark-800/50 text-xs sm:text-sm">Contactez-nous, nous sommes là pour vous aider.</p>
          </div>
          <Link
            to="/contact"
            className="btn-chamfer btn-chamfer-outline shrink-0 inline-flex items-center gap-2 text-gold-700 px-7 py-3.5 text-[11px] tracking-wide font-semibold font-sans hover:bg-gold-600 hover:text-white transition-all duration-300"
          >
            NOUS CONTACTER
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}

const orderSteps = [
  {
    Icon: ClipboardList,
    title: 'Choisissez vos plats',
    description: 'Parcourez notre menu en ligne, repérez vos envies du moment.',
  },
  {
    Icon: ShoppingCart,
    title: 'Commandez sur Uber Eats',
    description: 'Validez votre commande en quelques clics, sans appel ni attente.',
  },
  {
    Icon: ArrowRight,
    title: 'Récupérez ou recevez',
    description: 'À emporter au restaurant, ou livré chez vous par Uber Eats.',
  },
];

function HowToOrder() {
  const { ref: stepsRef, visible: stepsVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="relative py-24 px-6 lg:px-10 overflow-hidden">
      <div className="absolute inset-0">
        <img src={sautePouletFumeImg} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-dark-500/85" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gold-500/70 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <p className="font-playfair italic text-gold-400 text-sm">- Simple comme un clic -</p>
          </div>

          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-16">
            Comment <span className="italic text-gold-400">commander</span> ?
          </h2>
        </Reveal>

        <div ref={stepsRef} className="relative flex flex-col sm:grid sm:grid-cols-3 gap-6 mb-14">
          <div className="hidden sm:block absolute top-7 left-[16.66%] right-[16.66%] h-px bg-gold-500/25" />
          {orderSteps.map((step, i) => (
            <div
              key={step.title}
              style={{ transitionDelay: stepsVisible ? `${i * 120}ms` : '0ms' }}
              className={`relative flex gap-5 sm:flex-col sm:items-center sm:gap-0 transition-all duration-700 ease-out ${
                stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col items-center shrink-0 sm:contents">
                <div className="w-14 h-14 rounded-md border border-gold-500/50 bg-dark-900 flex items-center justify-center text-gold-400 shrink-0 sm:mb-5">
                  <step.Icon size={20} />
                </div>
                {i < orderSteps.length - 1 && (
                  <div className="w-px flex-1 bg-gold-500/25 my-2 sm:hidden" />
                )}
              </div>
              <div className="pb-8 sm:pb-0 sm:contents">
                <p className="font-playfair text-white text-lg font-semibold mb-2 text-left sm:text-center">{step.title}</p>
                <p className="text-white/80 text-sm leading-relaxed max-w-[260px] text-left sm:text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={UBER_EATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chamfer inline-flex items-center gap-2 bg-gold-500 text-dark-900 px-7 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors"
          >
            <ShoppingCart size={15} />
            Commander sur Uber Eats
          </a>
          <Link
            to="/menu"
            className="btn-chamfer btn-chamfer-outline inline-flex items-center gap-2 text-white px-7 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:text-gold-300 transition-colors"
          >
            <Utensils size={13} />
            Voir le menu d'abord
          </Link>
        </div>
      </div>
    </section>
  );
}

const CATEGORY_ICONS: Record<CategoryKey, typeof ChefHat> = {
  plats: ChefHat,
  street: Flame,
  grillades: CookingPot,
  desserts: Leaf,
  boissons: CupSoda,
};

function RemainingBadge({ remaining }: { remaining: number }) {
  if (remaining <= 0) {
    return (
      <span className="self-start inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-dark-900/80 text-gold-500/70 px-2.5 py-1 text-[10px] tracking-wide font-semibold font-sans">
        Épuisé
      </span>
    );
  }
  return (
    <span className="self-start inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/15 text-gold-400 px-2.5 py-1 text-[10px] tracking-wide font-semibold font-sans">
      <Flame size={10} />
      {remaining} portion{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
    </span>
  );
}

function MenuDishCard({
  name,
  description,
  price,
  image,
  remaining,
}: {
  name: string;
  description: string;
  price: string;
  image: string;
  remaining?: number | null;
}) {
  return (
    <div className="group h-full flex flex-col rounded-2xl overflow-hidden border border-gold-500/20 bg-dark-700/50 hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden shrink-0">
        <img src={image} onError={onImgError} alt={name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-playfair text-white font-bold text-base leading-tight mb-1.5 line-clamp-2">{name}</h3>
        <p className="text-white/90 text-xs leading-relaxed mb-4 line-clamp-3">{description}</p>
        <div className="mt-auto pt-2 flex flex-col gap-2.5">
          {typeof remaining === 'number' && <RemainingBadge remaining={remaining} />}
          <span className="text-gold-400 text-sm font-semibold">{price}</span>
          <a
            href={UBER_EATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chamfer btn-chamfer-sm btn-chamfer-outline w-full inline-flex items-center justify-center gap-1.5 text-gold-400 px-3 py-2 text-[10px] tracking-wide font-semibold font-sans hover:bg-gold-500 hover:text-dark-800 transition-colors duration-200"
          >
            <ShoppingCart size={12} />
            COMMANDER
          </a>
        </div>
      </div>
    </div>
  );
}

type MenuCardData = { id: number; name: string; description: string; price: string; image: string; remaining?: number | null };

function MenuCategorySection({
  title,
  Icon,
  dishes,
}: {
  title: string;
  Icon: typeof ChefHat;
  dishes: MenuCardData[];
}) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div className="mb-20 last:mb-0">
      <Reveal className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px flex-1 bg-gold-500/25 max-w-[120px]" />
        <div className="flex items-center gap-2.5 text-gold-400 shrink-0">
          <Icon size={16} />
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="h-px flex-1 bg-gold-500/25 max-w-[120px]" />
      </Reveal>
      <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {dishes.map((dish, i) => (
          <div
            key={dish.id}
            style={{ transitionDelay: visible ? `${i * 70}ms` : '0ms' }}
            className={`transition-all duration-500 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <MenuDishCard {...dish} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AujourdhuiPage() {
  const config = useSiteConfig();

  const dispoCategories = useMemo(() => {
    const dispo = getDispoToday(config);
    return CAT_KEYS.filter((cat) => dispo[cat].length > 0).map((cat) => ({
      key: cat,
      title: CAT_LABELS[cat],
      Icon: CATEGORY_ICONS[cat],
      dishes: dispo[cat].map(
        (item): MenuCardData => ({
          id: item.id,
          name: item.name,
          description: item.desc,
          price: getPriceLine(item),
          image: resolveImg(item.img),
          remaining: typeof item.remaining === 'number' ? item.remaining : null,
        })
      ),
    }));
  }, [config]);

  const hasDishes = dispoCategories.length > 0;
  const updatedToday = config.dispoDate === getTodayKey();

  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title="Disponible aujourd'hui - Palais Mauricien"
        description="La sélection du jour du Palais Mauricien au Port, La Réunion : plats mauriciens halal disponibles aujourd'hui, mise à jour chaque matin. À emporter ou livraison Uber Eats."
        path="/aujourdhui"
        jsonLd={breadcrumbLd([['Accueil', '/'], ["Disponible aujourd'hui", '/aujourdhui']])}
      />
      <SiteHeader />

      {/* ── EN-TÊTE ── */}
      <section className="pt-40 pb-6 px-6 lg:px-10 bg-dark-900">
        <Reveal className="max-w-[1400px] mx-auto text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Disponible <span className="italic text-gold-400">aujourd'hui</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Une sélection de nos meilleures recettes mauriciennes, fraîchement préparées par notre chef.
          </p>
          {config.dispoDate && (
            <p className="inline-flex items-center gap-2 mt-5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 px-4 py-1.5 text-[11px] tracking-wide font-medium font-sans">
              <Clock size={12} />
              {updatedToday
                ? "Sélection mise à jour aujourd'hui"
                : `Dernière mise à jour : ${formatDateFR(config.dispoDate)}`}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gold-500/30" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <div className="h-px w-16 bg-gold-500/30" />
          </div>
        </Reveal>
      </section>

      {/* ── CATÉGORIES ── */}
      <section className="pt-4 pb-20 px-6 lg:px-10 bg-dark-800">
        <div className="max-w-[1400px] mx-auto">
          {hasDishes ? (
            dispoCategories.map((category) => (
              <MenuCategorySection
                key={category.key}
                title={category.title}
                Icon={category.Icon}
                dishes={category.dishes}
              />
            ))
          ) : (
            <Reveal className="max-w-xl mx-auto text-center rounded-2xl border border-gold-500/25 bg-dark-700/50 px-8 py-14 mt-8">
              <div className="w-14 h-14 mx-auto rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400 mb-5">
                <CookingPot size={22} />
              </div>
              <p className="font-playfair text-2xl font-bold text-white mb-3">
                La sélection du jour arrive bientôt
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-7">
                Aucun plat n'est encore affiché pour aujourd'hui.<br />
                Revenez plus tard ou appelez-nous pour connaître la sélection du moment.
              </p>
              <a
                href={PHONE_TEL}
                className="btn-chamfer btn-chamfer-outline inline-flex items-center gap-2 text-gold-400 px-6 py-3 text-[11px] tracking-wide font-semibold font-sans hover:bg-gold-500 hover:text-dark-900 transition-colors"
              >
                <Phone size={13} />
                {PHONE_DISPLAY}
              </a>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── APPEL À LA COMMANDE ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={sautebredPngImg} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover object-right" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40 sm:from-white/85 sm:via-white/55 sm:to-white/5 lg:from-white/75 lg:via-white/35 lg:to-transparent" />

        <Reveal className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-14 sm:py-16">
          <div className="max-w-md">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-dark-800 leading-tight mb-3">
              Une envie&nbsp;? On prépare votre commande
            </h2>
            <div className="w-10 h-px bg-gold-600/50 mb-4" />
            <p className="text-dark-800 sm:text-dark-800/80 text-sm mb-6">
              À emporter ou en livraison, on s'occupe du reste.
            </p>
            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer inline-flex items-center gap-2 bg-gold-500 text-dark-900 px-6 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors"
            >
              <ShoppingCart size={15} />
              Commander sur Uber Eats
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
      <PersistentCTAs />
    </div>
  );
}

type MenuDish = { id: number; name: string; description: string; price: string; image: string };

const incontournables = [
  {
    name: 'Riz frit',
    description: 'Riz sauté aux légumes et morceaux de viande, parfumé aux épices douces.',
    price: 'à partir de 8 €',
    image: rizFritImg,
    Icon: ChefHat,
  },
  {
    name: 'Sauté poulet fumé',
    description: 'Poulet fumé sauté aux oignons et épices, saveur intense et fumée.',
    price: 'à partir de 9 €',
    image: sautePouletFumeImg,
    Icon: Flame,
  },
  {
    name: 'Sauté poulet au Bred',
    description: 'Poulet sauté aux brèdes locales et piment, plat traditionnel.',
    price: 'à partir de 9 €',
    image: sautePouletBredImg,
    Icon: CookingPot,
  },
];

/** Carte complète construite depuis le config (items visibles uniquement).
    Le prix affiche chaque variante ("Poulet 8 € · Végétarien 7 €") le cas échéant. */
function useFullMenuCategories(config: SiteConfig): { key: string; label: string; dishes: MenuDish[] }[] {
  return useMemo(
    () =>
      CAT_KEYS.map((key) => ({
        key,
        label: CAT_LABELS[key].toUpperCase(),
        dishes: config.menu[key]
          .filter((item) => item.visible)
          .map(
            (item): MenuDish => ({
              id: item.id,
              name: item.name,
              description: item.desc,
              price: getPriceLine(item),
              image: resolveImg(item.img),
            })
          ),
      })),
    [config]
  );
}

function ExpandableDishDescription({ text }: { text: string }) {
  return (
    <p className="text-white/70 text-sm sm:text-base mt-2 leading-relaxed line-clamp-3">
      {text}
    </p>
  );
}

function MenuPage() {
  const config = useSiteConfig();
  const fullMenuCategories = useFullMenuCategories(config);
  const [activeCategory, setActiveCategory] = useState(0);
  const [openDishIndex, setOpenDishIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const category = fullMenuCategories[activeCategory];
  const dishes = category.dishes;

  const selectCategory = (i: number) => {
    setActiveCategory(i);
    setOpenDishIndex(null);
  };

  const closeDish = () => {
    setModalVisible(false);
    window.setTimeout(() => setOpenDishIndex(null), 200);
  };

  const goToDish = (dir: number) => {
    setOpenDishIndex((current) => {
      if (current === null) return current;
      return (current + dir + dishes.length) % dishes.length;
    });
  };

  useEffect(() => {
    if (openDishIndex === null) return;
    const id = requestAnimationFrame(() => setModalVisible(true));
    return () => cancelAnimationFrame(id);
  }, [openDishIndex]);

  useEffect(() => {
    if (openDishIndex === null) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDish();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [openDishIndex]);

  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title="Menu - Palais Mauricien"
        description="La carte du Palais Mauricien au Port, La Réunion : plats principaux, street food, grillades, desserts et boissons de l'Île Maurice. 100% halal, de 2 € à 10 €, à emporter ou livraison Uber Eats."
        path="/menu"
        jsonLd={[breadcrumbLd([['Accueil', '/'], ['Menu', '/menu']]), MENU_JSONLD]}
      />
      <SiteHeader />

      {/* ── FOND SUR TOUTE LA PAGE ── */}
      <div
        className="relative bg-cover bg-center transition-[background-image] duration-500"
        style={{ backgroundImage: `url(${category.key === 'boissons' ? aloudaImg : massaleCabriImg})` }}
      >
        <div className="absolute inset-0 bg-dark-500/90" />

        <div className="relative z-10">
          {/* ── EN-TÊTE + ONGLETS ── */}
          <section className="pt-40 pb-6 sm:pb-10 px-6 lg:px-10">
            <Reveal className="max-w-[1400px] mx-auto text-center">
              <p className="text-gold-500/70 text-[10px] tracking-widest3 mb-4">LA CARTE</p>
              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
                La carte du <span className="italic text-gold-400">Palais Mauricien</span>
              </h1>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-16 bg-gold-500/30" />
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
                  <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
                </svg>
                <div className="h-px w-16 bg-gold-500/30" />
              </div>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                {fullMenuCategories.map((cat, i) => (
                  <div key={cat.key} className="flex items-center gap-4">
                    <button
                      onClick={() => selectCategory(i)}
                      className={`text-[11px] tracking-wide font-semibold font-sans transition-colors duration-200 ${
                        i === activeCategory
                          ? 'bg-gold-500 text-dark-900 px-5 py-3 rounded-full'
                          : 'text-white/60 hover:text-white px-1'
                      }`}
                    >
                      {cat.label}
                    </button>
                    {i < fullMenuCategories.length - 1 && <span className="text-white/15">|</span>}
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ── LISTE DES PLATS ── */}
          <section className="pt-6 pb-16 sm:pt-16 px-6 lg:px-10">
            <div key={category.key} className="max-w-[1000px] mx-auto">
              <div className="rounded-2xl border border-gold-500/25 bg-dark-800/70 backdrop-blur-sm px-5 sm:px-8">
                {dishes.map((dish, i) => (
                  <div
                    key={dish.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                  >
                    <div className="flex items-start gap-4 sm:gap-6 py-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-playfair text-lg sm:text-xl font-bold text-white leading-tight">{dish.name}</h3>
                        <ExpandableDishDescription text={dish.description} />
                        <p className="text-gold-400 font-semibold text-base sm:text-lg mt-3">{dish.price}</p>
                      </div>
                      <button
                        onClick={() => setOpenDishIndex(i)}
                        aria-label={`Voir ${dish.name} en détail`}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-gold-500/40 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark-800 transition-colors duration-200 shrink-0"
                      >
                        <GalleryIcon size={16} />
                      </button>
                    </div>
                    {i < dishes.length - 1 && (
                      <div className="h-px bg-gold-500/15" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 mt-14">
                <div className="h-px w-16 bg-gold-500/30" />
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
                  <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
                </svg>
                <div className="h-px w-16 bg-gold-500/30" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── LES INCONTOURNABLES ── */}
      <section className="py-24 px-6 lg:px-10 bg-[#FAF7F2]">
        <div className="max-w-[1000px] mx-auto">
          <Reveal className="text-center mb-16">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current mx-auto mb-3">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <p className="text-gold-700 text-[10px] tracking-widest3 font-semibold uppercase mb-3">Nos signatures</p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark-800">
              Les <span className="italic text-gold-600">Incontournables</span>
            </h2>
          </Reveal>

          <div>
            {incontournables.map((item, i) => (
              <Reveal key={item.name} delay={i * 100} className="flex gap-5 sm:gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gold-500/40 bg-white flex items-center justify-center text-gold-600 shadow-sm">
                    <item.Icon size={18} />
                  </div>
                  {i < incontournables.length - 1 && (
                    <div className="w-px flex-1 border-l border-dashed border-gold-500/30 my-2" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-playfair text-lg sm:text-xl font-bold text-dark-800 mb-1">{item.name}</h3>
                      <p className="text-dark-800/50 text-xs sm:text-sm leading-relaxed max-w-xs">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 shrink-0">
                      <span className="text-gold-600 font-semibold text-base whitespace-nowrap">{item.price}</span>
                      <a
                        href={UBER_EATS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-chamfer btn-chamfer-sm inline-flex items-center justify-center gap-2 bg-gold-500 text-dark-900 px-4 py-2.5 text-[10px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors whitespace-nowrap"
                      >
                        Commander sur Uber Eats
                        <ArrowRight size={12} />
                      </a>
                    </div>

                    <div className="w-full sm:w-32 lg:w-40 h-28 sm:h-24 rounded-lg overflow-hidden shrink-0 shadow-md">
                      <img src={item.image} alt={`${item.name} - plat mauricien halal du Palais Mauricien`} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPEL À LA COMMANDE ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={kebabPngImg} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover object-right" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40 sm:from-white/85 sm:via-white/55 sm:to-white/5 lg:from-white/75 lg:via-white/35 lg:to-transparent" />

        <Reveal className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-14 sm:py-16">
          <div className="max-w-md">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-dark-800 leading-tight mb-3">
              Envie de commander&nbsp;?
            </h2>
            <div className="w-10 h-px bg-gold-600/50 mb-4" />
            <p className="text-dark-800 sm:text-dark-800/60 text-sm mb-6">
              Commandez en quelques clics, à emporter ou livré par Uber Eats.
            </p>
            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer inline-flex items-center gap-2 bg-gold-500 text-dark-900 px-6 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors"
            >
              <ShoppingCart size={15} />
              Commander sur Uber Eats
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
      <PersistentCTAs />

      {openDishIndex !== null && dishes[openDishIndex] && (
        <DishModal
          dish={dishes[openDishIndex]}
          categoryLabel={category.label}
          index={openDishIndex}
          total={dishes.length}
          visible={modalVisible}
          onClose={closeDish}
          onPrev={() => goToDish(-1)}
          onNext={() => goToDish(1)}
        />
      )}
    </div>
  );
}

function DishModal({
  dish,
  categoryLabel,
  index,
  total,
  visible,
  onClose,
  onPrev,
  onNext,
}: {
  dish: MenuDish;
  categoryLabel: string;
  index: number;
  total: number;
  visible: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] bg-dark-800 border border-gold-500/25 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 transition-all duration-200 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-dark-900/70 border border-white/15 flex items-center justify-center text-white hover:bg-dark-900 hover:text-gold-400 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="aspect-[4/3] lg:aspect-auto">
          <img src={dish.image} onError={onImgError} alt={dish.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-6 sm:p-8 flex flex-col overflow-y-auto">
          <p className="text-gold-500/70 text-[10px] tracking-widest3 mb-3">{categoryLabel}</p>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
            {dish.name}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed mb-6">{dish.description}</p>
          <p className="text-gold-400 font-semibold text-xl mb-8">{dish.price}</p>

          <a
            href={UBER_EATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chamfer inline-flex items-center justify-center gap-2 bg-gold-500 text-dark-900 px-6 py-3.5 text-[11px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors mb-6"
          >
            <ShoppingCart size={14} />
            COMMANDER
          </a>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={onPrev}
              aria-label="Plat précédent"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-white/40 text-xs tracking-widest2">
              {index + 1} / {total}
            </span>
            <button
              onClick={onNext}
              aria-label="Plat suivant"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type GalleryItem = { id: number; name: string; image: string; category: 'plats' | 'boissons' | 'desserts'; tall?: boolean };

/** Galerie construite depuis le config : 'plats' regroupe plats + street + grillades. */
function useGalleryItems(config: SiteConfig): GalleryItem[] {
  return useMemo(() => {
    const toItem = (item: MenuItem, category: GalleryItem['category']): GalleryItem => ({
      id: item.id,
      name: item.name,
      image: resolveImg(item.img),
      category,
    });
    const items = [
      ...[...config.menu.plats, ...config.menu.street, ...config.menu.grillades]
        .filter((i) => i.visible)
        .map((i) => toItem(i, 'plats')),
      ...config.menu.boissons.filter((i) => i.visible).map((i) => toItem(i, 'boissons')),
      ...config.menu.desserts.filter((i) => i.visible).map((i) => toItem(i, 'desserts')),
    ];
    // 2-3 cartes "hautes" pour rythmer la maçonnerie (comme avant).
    return items.map((item, i) => (i === 2 || i === 9 ? { ...item, tall: true } : item));
  }, [config]);
}

const galleryFilters: { key: 'tous' | GalleryItem['category']; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'plats', label: 'Plats' },
  { key: 'boissons', label: 'Boissons' },
  { key: 'desserts', label: 'Desserts' },
];

function GalleryCard({
  name,
  image,
  tall,
  style,
}: {
  name: string;
  image: string;
  tall?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`group relative rounded-xl overflow-hidden border border-gold-500/25 animate-fade-up ${tall ? 'row-span-2' : ''}`}
    >
      <img
        src={image}
        onError={onImgError}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-center">
        <p className="font-playfair italic text-white text-sm sm:text-base">{name}</p>
      </div>
    </div>
  );
}

function GaleriePage() {
  const config = useSiteConfig();
  const galleryItems = useGalleryItems(config);
  const [activeFilter, setActiveFilter] = useState<'tous' | GalleryItem['category']>('tous');

  const items =
    activeFilter === 'tous' ? galleryItems : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title="Galerie - Palais Mauricien"
        description="Découvrez en photos les plats, boissons et desserts mauriciens du Palais Mauricien au Port, La Réunion : masalé cabri, brochettes, alouda, gulab jamun et plus encore."
        path="/galerie"
        jsonLd={breadcrumbLd([['Accueil', '/'], ['Galerie', '/galerie']])}
      />
      <SiteHeader />

      {/* ── EN-TÊTE + FILTRES ── */}
      <section className="pt-40 pb-14 px-6 lg:px-10 bg-dark-900">
        <Reveal className="max-w-[1400px] mx-auto text-center">
          <p className="text-gold-500/70 text-[10px] tracking-widest3 mb-4">PALAIS MAURICIEN</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            La <span className="italic text-gold-400">Galerie</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-gold-500/30" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <div className="h-px w-16 bg-gold-500/30" />
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {galleryFilters.map((filter, i) => (
              <div key={filter.key} className="flex items-center gap-4">
                <button
                  onClick={() => setActiveFilter(filter.key)}
                  className={`text-[13px] tracking-wide transition-colors duration-200 ${
                    activeFilter === filter.key
                      ? 'bg-gold-500 text-dark-900 px-5 py-2 rounded-full font-semibold'
                      : 'text-white/70 hover:text-white px-1'
                  }`}
                >
                  {filter.label}
                </button>
                {i < galleryFilters.length - 1 && <span className="text-white/15">|</span>}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── GRILLE PHOTOS ── */}
      <section className="py-16 px-6 lg:px-10 bg-dark-800">
        <div className="max-w-[1400px] mx-auto">
          <div
            key={activeFilter}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 grid-flow-dense gap-4 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px]"
          >
            {items.map((item, i) => (
              <GalleryCard key={item.id} name={item.name} image={item.image} tall={item.tall} style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      <PersistentCTAs />
    </div>
  );
}

const ourValues = [
  {
    title: 'Authenticité',
    description: 'Des recettes fidèles à nos traditions mauriciennes.',
    Icon: Leaf,
  },
  {
    title: 'Qualité',
    description: 'Des ingrédients sélectionnés avec soin, chaque jour.',
    Icon: HeartHandshake,
  },
  {
    title: 'Partage',
    description: "Plus qu'un repas, un moment de convivialité.",
    Icon: Users,
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title="Qui sommes-nous ? - Palais Mauricien"
        description="Notre histoire - Palais Mauricien, restaurant halal mauricien au Port, La Réunion. Découvrez nos valeurs, notre passion pour la cuisine de l'Île Maurice."
        path="/a-propos"
        jsonLd={breadcrumbLd([['Accueil', '/'], ['À propos', '/a-propos']])}
      />
      <SiteHeader />

      {/* ── QUI SOMMES-NOUS ── */}
      <section className="relative pt-40 pb-28 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={sautePouletFumeImg} alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark-500/95" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <Reveal className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
              {/* <p className="text-gold-400 text-[11px] tracking-widest3 font-semibold mb-4">NOTRE MAISON</p> */}
              <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-white leading-tight">
                Une histoire
              </h1>
              <p className="font-playfair italic text-gold-400 text-4xl sm:text-5xl leading-tight mb-6">
                de passion
              </p>
              <div className="w-8 h-px bg-white/25 mb-6" />

              <div className="space-y-4 text-white/55 text-sm sm:text-base leading-relaxed max-w-lg">
                <p>
Le Palais Mauricien célèbre les saveurs authentiques de l’Île Maurice au cœur du Port. Chaque jour, nous préparons des recettes traditionnelles avec des produits frais, des épices soigneusement sélectionnées et un véritable savoir-faire mauricien.

Notre cuisine est 100 % halal et certifiée, pour vous offrir des plats généreux, authentiques et préparés en toute confiance.
                </p>

                {/* <p>
                  Notre cuisine est 100&nbsp;% halal, certifiée, sans compromis. Parce que chaque
                  client mérite de manger sereinement, en confiance.
                </p> */}
              </div>
            </Reveal>

            <Reveal className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md">
                <div className="aspect-[4/5] rounded-t-[160px] rounded-b-2xl border-2 border-gold-500/40 p-[5px]">
                  <div className="w-full h-full rounded-t-[160px] rounded-b-2xl overflow-hidden">
                    <img src={photorestaurantImg} alt="Façade du restaurant Palais Mauricien au Port, La Réunion" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-3 w-[110px] sm:-bottom-8 sm:-right-6 sm:w-[150px] bg-[#F3ECDF] border border-gold-500/25 p-4 shadow-xl">
                  <img src={logoImage} alt="Logo du Palais Mauricien" loading="lazy" className="w-full h-auto" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={150} className="order-3 lg:order-none lg:col-start-2 lg:row-start-2">
              <div className="pt-6 border-t border-white/10 mb-10">
                <p className="font-script text-gold-400 text-3xl leading-none mb-2">Palais Mauricien</p>
                <p className="text-white text-sm font-semibold mb-1">L'équipe du Palais Mauricien</p>
                <p className="text-white/50 text-xs tracking-wide">Le Port · La Réunion · Depuis 2018</p>
              </div>

              <Link
                to="/#histoire"
                className="btn-chamfer btn-chamfer-outline inline-flex items-center gap-2 text-gold-400 px-8 py-3.5 text-[11px] tracking-wide font-semibold font-sans hover:bg-gold-500 hover:text-dark-900 transition-colors"
              >
                <MapPin size={14} />
                S'Y RENDRE
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ── */}
      <section className="py-24 px-6 lg:px-10 bg-dark-900">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-gold-500/70 text-[10px] tracking-widest3 mb-3">NOS ENGAGEMENTS</p>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white leading-tight">
              Nos <span className="italic text-gold-400">valeurs</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {ourValues.map((value, i) => (
              <Reveal key={value.title} delay={i * 120} className="text-center px-8 py-10 sm:py-0">
                <div className="w-20 h-20 mx-auto rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400 mb-5">
                  <value.Icon size={26} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-[220px] mx-auto">{value.description}</p>
              </Reveal>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-16">
            <div className="h-px w-16 bg-gold-500/30" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <div className="h-px w-16 bg-gold-500/30" />
          </div>
        </div>
      </section>

      {/* ── LA CUISINE DE L'ÎLE MAURICE ── */}
      <section className="relative py-24 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutImage} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark-900/50" />
        </div>

        <Reveal className="relative z-10 max-w-2xl mx-auto">
          <div className="relative rounded-2xl border border-gold-500/20 bg-[#F3ECDF] px-8 sm:px-14 py-12 sm:py-16 text-center shadow-2xl overflow-hidden">
            <svg viewBox="0 0 60 60" className="absolute bottom-4 left-4 w-14 h-14 text-gold-600/25" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M5 55C15 45 15 25 5 5" />
              <path d="M5 55C20 50 30 35 25 15" />
            </svg>
            <svg viewBox="0 0 60 60" className="absolute top-4 right-4 w-14 h-14 text-gold-600/25" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M55 5C45 15 45 35 55 55" />
              <path d="M55 5C40 10 30 25 35 45" />
            </svg>

            <p className="font-playfair italic text-gold-600 text-sm mb-4">L'île sœur</p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark-800 leading-tight">
              La cuisine de
            </h2>
            <p className="font-playfair italic text-gold-600 text-3xl sm:text-4xl leading-tight mb-6">
              l'Île Maurice
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-gold-600/40" />
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gold-600/60 fill-current shrink-0">
                <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
              </svg>
              <div className="h-px w-8 bg-gold-600/40" />
            </div>

            <p className="text-dark-800/70 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-9">
              Des saveurs métissées, nées de rencontres et de voyages. Épices chaudes, produits de
              la mer, recettes créoles et chinoises&nbsp;: l'âme de l'île dans chaque assiette.
            </p>

            <Link
              to="/menu"
              className="btn-chamfer inline-flex items-center gap-2 bg-gold-600 text-white px-8 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-700 transition-colors"
            >
              <Utensils size={13} />
              Découvrir notre menu
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
      <PersistentCTAs />
    </div>
  );
}

const contactAddress = "22 Av. de la Commune de Paris, Le Port 97420, La Réunion";
const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`;
const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`;

/**
 * Statut du jour depuis le config : tient compte de `closed`, de
 * `midi.actif`/`soir.actif` ET des fermetures exceptionnelles.
 */
function getTodayStatus(config: SiteConfig) {
  const todayDayKey = getTodayDayKey();
  const closure = getExceptionalClosure(config, getTodayKey());
  const { open } = isOpenNow(config.hours[todayDayKey]);
  return { todayDayKey, closure, openNow: open && !closure };
}

/** FAQPage schema.org construit depuis les questions réellement affichées sur le site. */
const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const CONTACT_POINT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPoint',
  telephone: '+262693432225',
  email: 'palaismauricien@gmail.com',
  contactType: 'customer service',
  areaServed: 'RE',
  availableLanguage: ['fr'],
};

function ContactPage() {
  const config = useSiteConfig();
  const { todayDayKey, closure, openNow } = getTodayStatus(config);
  const upcomingClosures = getUpcomingClosures(config, 6);
  const tiktokUrl = config.socials.tiktok || TIKTOK_FALLBACK;

  return (
    <div className="min-h-screen bg-[#F3ECDF] text-dark-800 font-sans overflow-x-hidden">
      <Seo
        title="Contact - Palais Mauricien"
        description="Contact et horaires du Palais Mauricien - 22 Av. de la Commune de Paris, Le Port 97420, La Réunion. Tél : +262 693 43 22 25. Lun-sam 10h30-14h30 et 18h30-21h30."
        path="/contact"
        jsonLd={[
          breadcrumbLd([['Accueil', '/'], ['Contact', '/contact']]),
          FAQ_JSONLD,
          CONTACT_POINT_JSONLD,
        ]}
      />
      <SiteHeader />

      {/* ── EN-TÊTE ── */}
      <section className="relative pt-40 pb-16 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={massaleCabriImg} alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark-900/90" />
        </div>

        <Reveal className="relative z-10 max-w-[1400px] mx-auto text-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold-500/70 fill-current mx-auto mb-4">
            <path d="M12 2c1.2 2.4 1.2 4.2 0 6-1.2-1.8-1.2-3.6 0-6zM6 9c2.4 1 3.8 2.2 4.6 4C8.6 12.4 6.8 11 6 9zm12 0c-.8 2-2.6 3.4-4.6 4 .8-1.8 2.2-3 4.6-4zM12 22c-.6-3.4 0-6.4 0-9 .6 2.6 0 5.6 0 9z" />
          </svg>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Contact & <span className="italic text-gold-400">Horaires</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gold-500/30" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <div className="h-px w-16 bg-gold-500/30" />
          </div>
        </Reveal>

        <svg
          className="absolute -bottom-px left-0 w-full h-10 sm:h-14"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,60 L0,30 Q360,-10 720,20 Q1080,50 1440,15 L1440,60 Z" fill="#F3ECDF" />
        </svg>
      </section>

      {/* ── COORDONNÉES + CARTE ── */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10">
          {/* Colonne gauche */}
          <div>
            <div className="space-y-4 mb-8">
              <Reveal className="flex items-start gap-4 border border-gold-600/20 rounded-xl bg-white/50 px-5 py-4">
                <span className="shrink-0 w-11 h-11 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-700">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-gold-700 text-[10px] tracking-widest2 font-semibold mb-1">ADRESSE</p>
                  <p className="text-dark-800 text-sm leading-relaxed">{contactAddress}</p>
                </div>
              </Reveal>

              <Reveal delay={80} className="flex items-start gap-4 border border-gold-600/20 rounded-xl bg-white/50 px-5 py-4">
                <span className="shrink-0 w-11 h-11 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-700">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-gold-700 text-[10px] tracking-widest2 font-semibold mb-1">TÉLÉPHONE</p>
                  <a href="tel:+262693432225" className="text-dark-800 text-sm font-medium hover:text-gold-700 transition-colors">
                    +262 693 43 22 25
                  </a>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <a
                  href="https://web.facebook.com/people/Palais-mauricien/100070319323315/?_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Voir la page Facebook du Palais Mauricien"
                  className="flex items-start gap-4 border border-gold-600/20 rounded-xl bg-white/50 px-5 py-4 hover:border-gold-600/40 hover:bg-white/70 transition-colors"
                >
                  <span className="shrink-0 w-11 h-11 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-700">
                    <Facebook size={18} />
                  </span>
                  <div>
                    <p className="text-gold-700 text-[10px] tracking-widest2 font-semibold mb-1">FACEBOOK</p>
                    <p className="text-dark-800 text-sm font-medium">Palais Mauricien</p>
                  </div>
                </a>
              </Reveal>

              <Reveal delay={220}>
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Voir la page TikTok du Palais Mauricien"
                  className="flex items-start gap-4 border border-gold-600/20 rounded-xl bg-white/50 px-5 py-4 hover:border-gold-600/40 hover:bg-white/70 transition-colors"
                >
                  <span className="shrink-0 w-11 h-11 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-700">
                    <TiktokIcon size={18} />
                  </span>
                  <div>
                    <p className="text-gold-700 text-[10px] tracking-widest2 font-semibold mb-1">TIKTOK</p>
                    <p className="text-dark-800 text-sm font-medium">Palais Mauricien</p>
                  </div>
                </a>
              </Reveal>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
              <h2 className="font-playfair text-2xl font-bold text-dark-800">Horaires d'ouverture</h2>
              <span
                className={`self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wide whitespace-nowrap ${
                  openNow ? 'bg-green-600/10 text-green-700' : 'bg-red-600/10 text-red-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${openNow ? 'bg-green-600' : 'bg-red-600'}`} />
                {closure ? 'FERMETURE EXCEPTIONNELLE' : openNow ? "OUVERT AUJOURD'HUI" : "FERMÉ POUR LE MOMENT"}
              </span>
            </div>

            {closure && (
              <div className="rounded-xl border border-red-600/20 bg-red-600/5 px-5 py-3.5 mb-4">
                <p className="text-red-700 text-sm font-medium">
                  Fermeture exceptionnelle aujourd'hui
                  {closure.reason ? ` — ${closure.reason}` : ''}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gold-600/20" />
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-gold-600/50 fill-current shrink-0">
                <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
              </svg>
              <div className="h-px flex-1 bg-gold-600/20" />
            </div>

            <div className="rounded-xl border border-gold-600/20 bg-white/50 divide-y divide-gold-600/10 mb-8">
              {DAY_KEYS.map((dayKey, i) => {
                const services = getDayServices(config.hours[dayKey]);
                return (
                  <div
                    key={dayKey}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={`flex items-center justify-between px-5 py-3 text-sm animate-fade-up ${
                      dayKey === todayDayKey ? 'bg-gold-500/10' : ''
                    }`}
                  >
                    <span className="font-medium text-dark-800">{DAY_LABELS[dayKey]}</span>
                    {!services ? (
                      <span className="text-red-600/80 font-medium text-sm">Fermé</span>
                    ) : (
                      <span className="text-dark-800/70 text-sm">
                        {services.midi && (
                          <>
                            Midi <span className="text-gold-700 font-medium">{services.midi}</span>
                          </>
                        )}
                        {services.midi && services.soir && <span className="mx-2 text-dark-800/30">•</span>}
                        {services.soir && (
                          <>
                            Soir <span className="text-gold-700 font-medium">{services.soir}</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {upcomingClosures.length > 0 && (
              <Reveal className="rounded-xl border border-gold-600/25 bg-gold-500/10 px-5 py-4 mb-8">
                <p className="text-gold-700 text-[10px] tracking-widest2 font-semibold mb-2.5">
                  FERMETURES EXCEPTIONNELLES À VENIR
                </p>
                <ul className="space-y-1.5">
                  {upcomingClosures.map((c) => (
                    <li key={c.date} className="text-dark-800/70 text-sm">
                      <span className="font-medium text-dark-800">{formatDateFR(c.date)}</span>
                      {c.reason ? ` — ${c.reason}` : ''}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer btn-chamfer-outline flex items-center justify-between gap-3 bg-dark-900 text-white px-6 py-4 text-[12px] tracking-wide font-semibold font-sans hover:bg-dark-800 transition-colors"
            >
              <span className="flex items-center gap-3">
                <ShoppingCart size={16} className="text-gold-400" />
                COMMANDER SUR UBER EATS
              </span>
              <ArrowRight size={15} className="text-gold-400" />
            </a>
          </div>

          {/* Colonne droite : carte */}
          <Reveal delay={150} className="relative rounded-2xl overflow-hidden border border-gold-600/20 shadow-xl min-h-[420px] lg:min-h-0">
            <iframe
              title="Localisation du Palais Mauricien"
              src={googleMapsEmbedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="absolute top-5 left-5 right-16 sm:right-auto sm:w-72 bg-white rounded-xl shadow-lg p-4 flex items-start gap-3">
              <span className="shrink-0 w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center text-gold-700">
                <MapPin size={16} />
              </span>
              <div>
                <p className="text-dark-800 font-playfair font-bold text-sm leading-tight mb-1">Palais Mauricien</p>
                <p className="text-dark-800/60 text-xs leading-relaxed">{contactAddress}</p>
              </div>
            </div>

            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Itinéraire vers le Palais Mauricien"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gold-700 hover:text-gold-800 transition-colors"
            >
              <Navigation size={16} />
            </a>

            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer absolute bottom-5 right-5 flex items-center gap-2 bg-dark-900 text-white px-5 py-3 text-[11px] tracking-wide font-semibold font-sans hover:bg-dark-800 transition-colors"
            >
              <MapPin size={14} className="text-gold-400" />
              OUVRIR DANS GOOGLE MAPS
            </a>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
      <PersistentCTAs />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title="Page introuvable - Palais Mauricien"
        description="Cette page n'existe pas ou a été déplacée. Retrouvez le Palais Mauricien depuis l'accueil ou la carte."
        path="/404"
        noindex
      />
      <SiteHeader />

      <section className="pt-48 pb-32 px-6 lg:px-10 bg-dark-900 min-h-[70vh] flex items-center">
        <Reveal className="max-w-[700px] mx-auto text-center">
          <p className="text-gold-500/70 text-[10px] tracking-widest3 mb-4">ERREUR 404</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Page <span className="italic text-gold-400">introuvable</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gold-500/30" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <div className="h-px w-16 bg-gold-500/30" />
          </div>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-10">
            Cette page n'existe pas ou a été déplacée.<br />
            Le voyage vers l'Île Maurice continue depuis l'accueil ou notre carte.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-chamfer inline-flex items-center gap-2 bg-gold-500 text-dark-900 px-7 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors"
            >
              Retour à l'accueil
            </Link>
            <Link
              to="/menu"
              className="btn-chamfer btn-chamfer-outline inline-flex items-center gap-2 text-gold-400 px-7 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-500 hover:text-dark-900 transition-colors"
            >
              <Utensils size={13} />
              Voir le menu
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
