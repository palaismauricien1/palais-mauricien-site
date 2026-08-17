import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SiteHeader, SiteFooter, Reveal } from '../App';
import { UBER_EATS_URL, PHONE_TEL, PHONE_DISPLAY, CONTACT_EMAIL } from '../lib/siteConfig';
import { Seo } from '../components/Seo';
import { breadcrumbLd } from '../components/seoUtils';

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="mb-12">
      <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gold-400 mb-5 pb-3 border-b border-gold-500/20">
        {title}
      </h2>
      <div className="space-y-3 text-white/70 text-sm leading-relaxed [&_strong]:text-white/90 [&_h3]:font-playfair [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_code]:text-gold-300 [&_code]:text-xs [&_a]:text-gold-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gold-300">
        {children}
      </div>
    </Reveal>
  );
}

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-dark-800 text-white font-sans overflow-x-hidden">
      <Seo
        title="Mentions légales - Palais Mauricien"
        description="Mentions légales, politique de confidentialité et CGV du Palais Mauricien - Le Port, La Réunion."
        path="/mentions-legales"
        jsonLd={breadcrumbLd([['Accueil', '/'], ['Mentions légales', '/mentions-legales']])}
      />
      <SiteHeader />

      <section className="pt-40 pb-10 px-6 lg:px-10 bg-dark-900">
        <Reveal className="max-w-[780px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gold-400 text-[11px] tracking-wide font-semibold hover:text-gold-300 transition-colors mb-8"
          >
            <ChevronLeft size={14} />
            RETOUR À L'ACCUEIL
          </Link>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Mentions <span className="italic text-gold-400">légales</span>
          </h1>
          <p className="font-playfair italic text-white/50 text-sm pb-8 border-b border-white/10">
            Dernière mise à jour : mai 2026
          </p>
        </Reveal>
      </section>

      <section className="py-14 px-6 lg:px-10 bg-dark-800">
        <div className="max-w-[780px] mx-auto">
          <LegalSection title="1. Informations légales">
            <p><strong>Dénomination :</strong> Palais Mauricien</p>
            <p><strong>Forme juridique :</strong> Entreprise individuelle / Restaurant</p>
            <p><strong>Adresse :</strong> 22 Avenue de la Commune de Paris, Le Port 97420, La Réunion</p>
            <p>
              <strong>Téléphone :</strong> <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
            </p>
            <p>
              <strong>Email :</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p><strong>Responsable de publication :</strong> Gérant du Palais Mauricien</p>
            <p>
              <strong>Hébergeur du site :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
              États-Unis -{' '}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                vercel.com
              </a>
              . Données techniques (logs serveur) hébergées sur l'infrastructure Vercel ; le site lui-même est
              servi depuis le réseau de diffusion Vercel (région européenne par défaut).
            </p>
          </LegalSection>

          <LegalSection title="2. Propriété intellectuelle">
            <p>
              L'ensemble des contenus présents sur ce site (textes, photographies, logo, design) est la
              propriété exclusive du Palais Mauricien. Toute reproduction, distribution ou utilisation sans
              autorisation préalable écrite est interdite.
            </p>
          </LegalSection>

          <LegalSection title="3. Conditions générales de vente (CGV)">
            <h3>Commandes à emporter et livraison</h3>
            <p>
              Les commandes (à emporter ou en livraison) s'effectuent exclusivement via la plateforme
              partenaire{' '}
              <a href={UBER_EATS_URL} target="_blank" rel="noopener noreferrer">
                Uber Eats
              </a>
              . Le paiement, la confirmation, les délais et les frais éventuels sont gérés par Uber Eats selon
              ses propres conditions générales.
            </p>
            <h3>Livraison</h3>
            <p>
              La livraison est assurée uniquement par Uber Eats, dans les zones desservies par la plateforme au
              départ du Port. Le Palais Mauricien ne saurait être tenu responsable des retards de livraison ou
              de la disponibilité du service Uber Eats. Pour toute question, le restaurant reste joignable au{' '}
              <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>.
            </p>
            <h3>Prix</h3>
            <p>
              Les prix affichés sur ce site sont indiqués en euros (€) et sont susceptibles d'être modifiés à
              tout moment. Le prix applicable est celui en vigueur au moment de la commande.
            </p>
            <h3>Droit de rétractation</h3>
            <p>
              Conformément à la réglementation applicable aux produits alimentaires préparés, le droit de
              rétractation ne s'applique pas aux denrées périssables.
            </p>
            <h3>Réclamations</h3>
            <p>
              Toute réclamation doit être formulée dans les 24h suivant la réception ou le retrait de la
              commande, par téléphone ou directement au restaurant.
            </p>
          </LegalSection>

          <LegalSection title="4. Politique de confidentialité & RGPD">
            <h3>Responsable du traitement</h3>
            <p>
              Le responsable du traitement des données est le gérant du Palais Mauricien, joignable au{' '}
              <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> ou par email à{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h3>Données collectées</h3>
            <p>
              Ce site ne contient pas de formulaire de contact ni de création de compte client. Aucune donnée
              personnelle (nom, email, adresse) n'est demandée aux visiteurs.
            </p>
            <p>
              Toutefois, sous réserve de votre consentement préalable (bandeau cookies), les données techniques
              suivantes peuvent être collectées :
            </p>
            <ul>
              <li>
                <strong>Statistiques de fréquentation anonymes</strong> : un horodatage est enregistré à chaque
                visite afin de connaître le nombre quotidien de visiteurs. Aucune adresse IP, aucun identifiant
                personnel et aucune donnée de profilage ne sont conservés.
              </li>
            </ul>
            <p>
              Le menu, les horaires et la sélection du jour affichés sur le site sont des données publiques
              relatives au restaurant ; ils ne contiennent aucune donnée à caractère personnel.
            </p>

            <h3>Sous-traitants et destinataires des données</h3>
            <ul>
              <li>
                <strong>Vercel Inc.</strong> (États-Unis) - hébergeur du site et de ses logs techniques
                (adresses IP, user-agent, requêtes HTTP). Transfert hors UE encadré par les Clauses
                Contractuelles Types de la Commission européenne.{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Politique de confidentialité Vercel
                </a>
                .
              </li>
              <li>
                <strong>Supabase Inc.</strong> (États-Unis, infrastructure UE/AWS Francfort) - base de données
                stockant le menu, les horaires et le compteur anonyme de visites.{' '}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                  Politique de confidentialité Supabase
                </a>
                .
              </li>
              <li>
                <strong>Google LLC</strong> (États-Unis) - fourniture des polices d'écriture (Google Fonts) ; à
                chaque page chargée, votre navigateur communique son adresse IP à Google pour récupérer les
                fichiers de police.{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Politique Google
                </a>
                .
              </li>
              <li>
                <strong>jsDelivr</strong> (réseau de diffusion open-source) - fourniture de la bibliothèque
                Supabase JavaScript depuis un CDN public.
              </li>
            </ul>

            <h3>Cookies et stockage local</h3>
            <p>
              Ce site n'utilise pas de cookies HTTP. Il stocke en revanche, dans la mémoire locale de votre
              navigateur (<em>localStorage</em>), les éléments suivants :
            </p>
            <ul>
              <li>
                <code>pm_cookies_ok</code> - mémorisation de votre choix concernant les statistiques de visite ;
              </li>
              <li>
                <code>pm_data</code> - copie locale du menu et des horaires, pour accélérer l'affichage entre
                deux pages ;
              </li>
              <li>
                <code>pm_visits</code> - cache local du compteur de visites ;
              </li>
              <li>
                <code>pm_loaded</code> - empêche le ré-affichage de l'animation d'ouverture lors d'une même
                session.
              </li>
            </ul>
            <p>
              Aucune de ces données n'est transmise à un serveur publicitaire ou à un réseau social. Vous pouvez
              les supprimer à tout moment via les paramètres de votre navigateur (« Effacer les données du
              site »), ou en cliquant sur « Refuser » dans le bandeau de cookies (qui réapparaît à votre
              prochaine visite).
            </p>

            <h3>Carte Google Maps</h3>
            <p>
              La page Contact peut intégrer une carte Google Maps. En chargeant cette carte, votre navigateur
              peut transmettre des données à Google LLC conformément à sa politique de confidentialité.
            </p>

            <h3>Liens vers Uber Eats et Facebook</h3>
            <p>
              Ce site contient des liens sortants vers Uber Eats (commande) et Facebook (page du restaurant).
              Ces sites tiers traitent leurs visiteurs selon leurs propres politiques. Le Palais Mauricien n'a
              pas accès aux données collectées par ces plateformes.
            </p>

            <h3>Durée de conservation</h3>
            <p>
              Les statistiques anonymes de visite sont conservées pendant 12 mois maximum, puis purgées. Les
              logs techniques de l'hébergeur sont conservés selon ses propres durées (consulter sa politique).
            </p>

            <h3>Vos droits</h3>
            <p>
              Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 « Informatique et Libertés »,
              vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition au
              traitement, ainsi que d'un droit à la portabilité de vos données. Vous pouvez exercer ces droits
              en contactant : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou{' '}
              <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>.
            </p>
            <p>
              En cas de litige, vous pouvez introduire une réclamation auprès de la Commission Nationale de
              l'Informatique et des Libertés (CNIL) -{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                www.cnil.fr
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="5. Limitation de responsabilité">
            <p>
              Le Palais Mauricien s'efforce de maintenir les informations de ce site à jour (horaires, menu,
              prix). Toutefois, il ne peut garantir l'exactitude, la complétude ou l'actualité des informations
              diffusées. Les horaires et disponibilités des plats peuvent varier sans préavis.
            </p>
          </LegalSection>

          <LegalSection title="6. Droit applicable">
            <p>
              Le présent site et les présentes mentions légales sont soumis au droit français. En cas de litige,
              les tribunaux compétents du ressort de Saint-Denis de La Réunion seront seuls compétents.
            </p>
          </LegalSection>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
