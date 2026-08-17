import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Utensils, BadgeCheck, Flame, Clock, Leaf } from 'lucide-react';
import { SiteHeader, SiteFooter, PersistentCTAs, Reveal } from '../App';
import { UBER_EATS_URL, PHONE_TEL, PHONE_DISPLAY, resolveImg, onImgError } from '../lib/siteConfig';
import { Seo } from '../components/Seo';
import { breadcrumbLd, SITE_URL } from '../components/seoUtils';

export type DishSlug = 'masale-cabri' | 'vinday-poisson' | 'brochette-mauricienne';

type DishPageData = {
  label: string;
  titleMain: string;
  titleItalic: string;
  intro: string;
  category: string;
  price: string;
  img: string; // chemin config ("images/xxx.webp") résolu via resolveImg
  sections: { title: string; paragraphs: ReactNode[] }[];
  facts: { label: string; text: string }[];
  howToOrder: ReactNode;
  ctaTitle: string;
  ctaButton: string;
  related: { to: string; title: string; text: string }[];
};

const RELATED_MENU = {
  to: '/menu',
  title: 'Toute la carte',
  text: '18 plats mauriciens à découvrir',
};

const DISHES: Record<DishSlug, DishPageData> = {
  'masale-cabri': {
    label: '- Plat signature -',
    titleMain: 'Masalé',
    titleItalic: 'cabri',
    intro:
      "L'âme de la cuisine mauricienne dans une assiette : du cabri mijoté pendant des heures dans un massalé maison, jusqu'à devenir d'une tendreté incomparable.",
    category: 'Plats principaux',
    price: '9 €',
    img: 'images/massalé cabri v2.webp',
    sections: [
      {
        title: "Une recette née de l'océan Indien",
        paragraphs: [
          <>
            Le masalé cabri - parfois écrit <em>massalé</em> ou <em>massala</em> - est l'un des plats les plus
            emblématiques de l'Île Maurice. Il tire ses origines de l'arrivée des travailleurs engagés indiens
            au XIXᵉ siècle, qui ont apporté avec eux leur tradition des mélanges d'épices torréfiées. Au fil des
            générations, la recette s'est créolisée au contact des saveurs locales pour devenir un plat unique,
            reconnaissable entre mille.
          </>,
          <>
            À La Réunion comme à Maurice, le masalé cabri est le plat des grandes occasions, des fêtes de
            famille et des dimanches en bord de mer. C'est aussi celui qu'on commande quand on veut goûter{' '}
            <strong>la vraie cuisine mauricienne</strong>, sans concession.
          </>,
        ],
      },
      {
        title: 'Notre version au Palais Mauricien',
        paragraphs: [
          <>
            Notre cabri est mariné la veille avec notre <strong>massalé maison</strong> - un mélange torréfié
            sur place qui combine cumin, coriandre, cardamome, clous de girofle, fenugrec, curcuma et piments
            séchés. Il est ensuite mijoté lentement avec de l'oignon, de la tomate, de l'ail et du gingembre
            frais, jusqu'à ce que la viande se détache toute seule.
          </>,
          <>
            Servi avec du riz blanc, c'est le plat qui réconcilie tout le monde : ceux qui aiment les saveurs
            intenses comme ceux qui découvrent la cuisine mauricienne pour la première fois.
          </>,
        ],
      },
    ],
    facts: [
      { label: 'Halal', text: "viande certifiée halal, comme l'ensemble de notre carte." },
      { label: "Niveau d'épices", text: 'équilibré - parfumé sans être brûlant. Adapté à tous les palais.' },
      {
        label: 'Conservation',
        text: 'à consommer dans les 24 h après commande, à conserver au frais. Réchauffer doucement à la casserole.',
      },
      { label: 'Allergènes', text: 'peut contenir des traces de fruits à coque (massalé). Sans gluten.' },
    ],
    howToOrder: (
      <>
        Le masalé cabri est disponible <strong>aux deux services, midi et soir, du lundi au samedi</strong>.
        Nous le préparons en quantité limitée chaque jour pour garantir la qualité du mijotage - pensez à
        vérifier{' '}
        <Link to="/aujourdhui" className="text-gold-400 underline underline-offset-2 hover:text-gold-300">
          la sélection du jour
        </Link>{' '}
        avant de venir, ou commandez à l'avance via Uber Eats.
      </>
    ),
    ctaTitle: "Envie d'y goûter ?",
    ctaButton: 'Commander le masalé cabri (9 €)',
    related: [
      {
        to: '/vinday-poisson',
        title: 'Vinday poisson',
        text: 'Poisson mariné au vinaigre et curcuma, classique mauricien - 9 €',
      },
      {
        to: '/brochette-mauricienne',
        title: 'Brochette mauricienne',
        text: 'Tendre brochette grillée sur braise - 3,50 €',
      },
      RELATED_MENU,
    ],
  },

  'vinday-poisson': {
    label: '- Plat traditionnel -',
    titleMain: 'Vinday',
    titleItalic: 'poisson',
    intro:
      'Le poisson dans une marinade vinaigrée et dorée - la fraîcheur de la mer rencontre la chaleur des épices mauriciennes.',
    category: 'Plats principaux',
    price: '9 €',
    img: 'images/vinday poisson v2.webp',
    sections: [
      {
        title: "L'héritage indo-mauricien",
        paragraphs: [
          <>
            Le vinday - du portugais <em>vindaloo</em> qui veut dire <em>vinaigre et ail</em> - est un plat dont
            les racines remontent à Goa, en Inde, avant d'atteindre l'Île Maurice avec les marins. À Maurice, la
            version s'est adoucie et créolisée : moins de piment qu'à Goa, plus d'épices parfumées, et surtout
            le poisson plutôt que la viande.
          </>,
          <>
            Le résultat : un plat unique où le <strong>vinaigre joue le rôle d'attendrisseur</strong> et révèle
            les saveurs du poisson, soutenu par le curcuma qui donne sa couleur dorée caractéristique et la
            moutarde qui apporte son piquant subtil.
          </>,
        ],
      },
      {
        title: 'Notre version au Palais Mauricien',
        paragraphs: [
          <>
            Notre vinday est préparé avec du poisson local, mariné dans un mélange de vinaigre, curcuma frais,
            ail, gingembre, graines de moutarde et coriandre fraîche. La marinade est dosée pour rester
            équilibrée - vous sentez le caractère sans qu'il vienne masquer la chair du poisson.
          </>,
          <>
            Servi avec du riz blanc qui absorbe la sauce dorée, c'est le plat{' '}
            <strong>parfait pour ceux qui veulent goûter quelque chose de différent</strong> sans s'aventurer
            dans les épices très fortes.
          </>,
        ],
      },
    ],
    facts: [
      { label: 'Halal', text: 'ingrédients tracés et conformes aux normes halal.' },
      { label: "Niveau d'épices", text: 'doux à modéré. Convient aux palais sensibles.' },
      {
        label: 'Conservation',
        text: "à consommer le jour même de préférence - les saveurs vinaigrées s'intensifient au repos. Réchauffer doucement.",
      },
      { label: 'Allergènes', text: 'poisson, moutarde. Sans gluten.' },
    ],
    howToOrder: (
      <>
        Le vinday poisson est servi <strong>du lundi au samedi, midi et soir</strong>. Comme tout plat à base de
        poisson, nous le préparons en quantité ajustée à la demande pour garantir la fraîcheur. Vérifiez{' '}
        <Link to="/aujourdhui" className="text-gold-400 underline underline-offset-2 hover:text-gold-300">
          la sélection du jour
        </Link>{' '}
        ou commandez via Uber Eats.
      </>
    ),
    ctaTitle: 'Une envie de poisson mauricien ?',
    ctaButton: 'Commander le vinday poisson (9 €)',
    related: [
      {
        to: '/masale-cabri',
        title: 'Masalé cabri',
        text: "Recette emblématique de l'Île Maurice - 9 €",
      },
      {
        to: '/brochette-mauricienne',
        title: 'Brochette mauricienne',
        text: 'Tendre brochette grillée sur braise - 3,50 €',
      },
      RELATED_MENU,
    ],
  },

  'brochette-mauricienne': {
    label: '- Street food signature -',
    titleMain: 'Brochette',
    titleItalic: 'mauricienne',
    intro:
      "Le goût de la rue à Port-Louis : viande marinée aux épices, grillée sur braise jusqu'à caraméliser - un classique imbattable.",
    category: 'Street food',
    price: '3,50 €',
    img: 'images/brochette de mauricien v2.webp',
    sections: [
      {
        title: "L'âme du street food mauricien",
        paragraphs: [
          <>
            À l'Île Maurice, les <em>brochettes</em> sont le compagnon obligatoire du soir : on les achète à
            Port-Louis dans les <em>baz dimanche</em>, sur la plage en fin de journée, ou à la sortie d'un
            match. C'est l'incontournable street food, celui qu'on partage entre amis avec une boisson fraîche.
          </>,
          <>
            La marinade - c'est elle qui fait toute la différence. Chaque famille mauricienne a sa recette,
            transmise de génération en génération, avec son équilibre unique entre{' '}
            <strong>épices, herbes fraîches, ail et gingembre</strong>.
          </>,
        ],
      },
      {
        title: 'Notre version au Palais Mauricien',
        paragraphs: [
          <>
            Notre brochette est marinée plusieurs heures dans un mélange maison : ail, gingembre, coriandre
            fraîche, cumin, curcuma, paprika fumé et un trait de vinaigre pour attendrir la viande. Elle est
            ensuite cuite <strong>directement sur braise</strong> - c'est cette caramélisation au feu qui donne
            ce goût grillé impossible à reproduire sur poêle.
          </>,
          <>
            Servie avec une sauce chutney maison, c'est le plat <strong>parfait à emporter sur le pouce</strong>{' '}
            ou à grouper en commande pour partager.
          </>,
        ],
      },
    ],
    facts: [
      { label: 'Halal', text: 'viande certifiée halal.' },
      {
        label: "Niveau d'épices",
        text: 'modéré, parfumé sans être piquant. Plébiscitée par les enfants comme par les adultes.',
      },
      {
        label: 'Format',
        text: '3,50 € la brochette. Comptez 2-3 brochettes par personne pour un repas, 1 en accompagnement.',
      },
      {
        label: 'Conservation',
        text: 'se mange chaude. Si réchauffage, passer 2 min au four ou poêle (pas micro-ondes - la viande devient sèche).',
      },
      { label: 'Allergènes', text: "peut contenir des traces de moutarde et d'épices fortes. Sans gluten." },
    ],
    howToOrder: (
      <>
        Les brochettes sont disponibles <strong>aux deux services, midi et soir, du lundi au samedi</strong>.
        C'est l'un de nos plats les plus demandés - pour les commandes de plus de 10 brochettes, mieux vaut nous
        prévenir au{' '}
        <a href={PHONE_TEL} className="text-gold-400 underline underline-offset-2 hover:text-gold-300">
          {PHONE_DISPLAY}
        </a>{' '}
        pour qu'on prépare tranquillement. Pour les petites quantités, Uber Eats fait le job en quelques clics.
      </>
    ),
    ctaTitle: 'Une envie de brochettes ?',
    ctaButton: "Commander des brochettes (3,50 € l'unité)",
    related: [
      {
        to: '/masale-cabri',
        title: 'Masalé cabri',
        text: "Recette emblématique de l'Île Maurice - 9 €",
      },
      {
        to: '/vinday-poisson',
        title: 'Vinday poisson',
        text: 'Poisson mariné, classique mauricien - 9 €',
      },
      RELATED_MENU,
    ],
  },
};

const FACT_ICONS = [BadgeCheck, Flame, Clock, Leaf, Utensils];

/** Métadonnées SEO par plat — titles/descriptions/JSON-LD repris de l'ancien site statique. */
const DISH_SEO: Record<
  DishSlug,
  { title: string; description: string; breadcrumbName: string; ldName: string; ldDescription: string; image: string; price: string }
> = {
  'masale-cabri': {
    title: 'Masalé cabri - Recette signature mauricienne · Palais Mauricien',
    description:
      "Masalé cabri - la recette emblématique de l'Île Maurice servie au Palais Mauricien, Le Port (974). Cabri mijoté lentement aux épices massalé. Halal, 9 €, à emporter ou livraison Uber Eats.",
    breadcrumbName: 'Masalé cabri',
    ldName: 'Masalé cabri',
    ldDescription:
      "Cabri mijoté lentement au massalé - la recette emblématique de l'Île Maurice. Plat halal du Palais Mauricien, Le Port, La Réunion.",
    image: `${SITE_URL}/images/massal%C3%A9%20cabri%20v2.webp`,
    price: '9.00',
  },
  'vinday-poisson': {
    title: 'Vinday poisson - Classique mauricien · Palais Mauricien',
    description:
      'Vinday poisson - classique mauricien au Palais Mauricien, Le Port (974). Poisson mariné au vinaigre, curcuma et moutarde, parfumé aux épices. Halal, 9 €, à emporter ou livraison.',
    breadcrumbName: 'Vinday poisson',
    ldName: 'Vinday poisson',
    ldDescription:
      'Poisson mariné au vinaigre, curcuma et moutarde - un classique mauricien. Plat halal du Palais Mauricien, Le Port, La Réunion.',
    image: `${SITE_URL}/images/vinday%20poisson%20v2.webp`,
    price: '9.00',
  },
  'brochette-mauricienne': {
    title: 'Brochette mauricienne - Street food signature · Palais Mauricien',
    description:
      'Brochette mauricienne - street food signature au Palais Mauricien, Le Port (974). Tendre brochette marinée aux épices créoles, grillée sur braise. Halal, 3,50 €, à emporter ou livraison.',
    breadcrumbName: 'Brochette mauricienne',
    ldName: 'Brochette mauricienne',
    ldDescription:
      'Tendre brochette marinée aux épices créoles, grillée sur braise. Street food halal du Palais Mauricien, Le Port, La Réunion.',
    image: `${SITE_URL}/images/brochette%20de%20mauricien%20v2.webp`,
    price: '3.50',
  },
};

export default function DishPage({ slug }: { slug: DishSlug }) {
  const dish = DISHES[slug];
  const imgSrc = resolveImg(dish.img);
  const seo = DISH_SEO[slug];

  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title={seo.title}
        description={seo.description}
        path={`/${slug}`}
        ogType="article"
        ogImage={seo.image}
        jsonLd={[
          breadcrumbLd([
            ['Accueil', '/'],
            ['Menu', '/menu'],
            [seo.breadcrumbName, `/${slug}`],
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'MenuItem',
            name: seo.ldName,
            description: seo.ldDescription,
            image: seo.image,
            offers: {
              '@type': 'Offer',
              price: seo.price,
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: UBER_EATS_URL,
            },
            suitableForDiet: 'https://schema.org/HalalDiet',
            menuOfRestaurant: `${SITE_URL}/menu`,
          },
        ]}
      />
      <SiteHeader />

      {/* ── HERO ── */}
      <section className="relative pt-44 pb-20 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imgSrc}
            onError={onImgError}
            alt={`${dish.titleMain} ${dish.titleItalic} - plat mauricien halal du Palais Mauricien`}
            fetchpriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-900/85" />
        </div>
        <Reveal className="relative z-10 max-w-[900px] mx-auto text-center">
          <p className="font-playfair italic text-gold-400 text-sm mb-4">{dish.label}</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {dish.titleMain} <span className="italic text-gold-400">{dish.titleItalic}</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gold-500/30" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500/60 fill-current shrink-0">
              <path d="M12 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
            </svg>
            <div className="h-px w-16 bg-gold-500/30" />
          </div>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">{dish.intro}</p>
        </Reveal>
      </section>

      {/* ── ARTICLE ── */}
      <article className="py-16 px-6 lg:px-10 bg-dark-800">
        <div className="max-w-[780px] mx-auto">
          {/* Prix + CTA */}
          <Reveal className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-8 border-b border-gold-500/15">
            <div>
              <p className="text-gold-500/70 text-[10px] tracking-widest3 uppercase mb-2">{dish.category}</p>
              <p className="font-playfair text-gold-400 text-3xl font-bold">{dish.price}</p>
            </div>
            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer inline-flex items-center gap-2 bg-gold-500 text-dark-900 px-6 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors"
            >
              <ShoppingCart size={15} />
              Commander sur Uber Eats
            </a>
          </Reveal>

          {dish.sections.map((section) => (
            <Reveal key={section.title} className="mb-10">
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gold-400 mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-white/70 text-sm sm:text-base leading-relaxed [&_strong]:text-white/90">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}

          {/* Bon à savoir */}
          <Reveal className="mb-10">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gold-400 mb-5">Bon à savoir</h2>
            <ul className="space-y-3">
              {dish.facts.map((fact, i) => {
                const Icon = FACT_ICONS[i % FACT_ICONS.length];
                return (
                  <li key={fact.label} className="flex items-start gap-3 text-white/70 text-sm sm:text-base leading-relaxed">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full border border-gold-500/40 flex items-center justify-center text-gold-400">
                      <Icon size={12} />
                    </span>
                    <span>
                      <strong className="text-white/90">{fact.label}</strong> : {fact.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Comment commander */}
          <Reveal className="mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gold-400 mb-4">Comment commander</h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed [&_strong]:text-white/90">
              {dish.howToOrder}
            </p>
          </Reveal>

          {/* CTA */}
          <Reveal className="rounded-2xl border border-gold-500/25 bg-gold-500/5 px-8 py-10 text-center mb-14">
            <p className="font-playfair text-gold-400 text-2xl font-bold mb-2">{dish.ctaTitle}</p>
            <p className="text-white/70 text-sm mb-6">Commandez en deux clics, à emporter ou en livraison.</p>
            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chamfer inline-flex items-center gap-2 bg-gold-500 text-dark-900 px-7 py-3.5 text-[12px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors"
            >
              <ShoppingCart size={15} />
              {dish.ctaButton}
            </a>
          </Reveal>

          {/* Vous aimerez aussi */}
          <Reveal>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gold-400 mb-6">Vous aimerez aussi</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {dish.related.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block rounded-xl border border-gold-500/20 bg-gold-500/5 p-5 hover:border-gold-500/40 transition-colors"
                >
                  <p className="font-playfair text-gold-400 font-bold text-base mb-1.5 flex items-center gap-2">
                    {item.to === '/menu' && <Utensils size={13} />}
                    {item.title}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">{item.text}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </article>

      <SiteFooter />
      <PersistentCTAs />
    </div>
  );
}
