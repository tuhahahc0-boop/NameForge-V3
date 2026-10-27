import { SubcategoryData } from '../types';

export const BUSINESS_AND_CREATIVE_DATA: Record<string, Record<string, SubcategoryData>> = {
  // 1. BRAND
  brand: {
    luxury: {
      icon: '💎',
      label: 'Luxe & Prestige',
      bestFor: 'Haute couture, parfums, joaillerie et hôtellerie 5 étoiles',
      prefixes: ['Aur', 'Vel', 'Cael', 'Mér', 'Sol', 'Élys', 'Nob', 'Vand', 'Lumi', 'Aven'],
      suffixes: ['or', 'ia', 'ence', 'is', 'ane', 'ell', 'eur', 'aure', 'ix', 'al'],
      descriptions: [
        '✨ Une identité raffinée aux résonances prestigieuses et épurées.',
        '💎 Un nom noble qui inspire immédiatement la rareté et l’exclusivité.',
      ],
      groupTypes: ['Maison', 'Atelier', 'Collection', 'Studio'],
      titles: ['Prestige', 'Édition Privée', 'Haute Parfumerie', 'Héritage'],
      strengths: ['Haute mémorisation', 'Perception haut de gamme', 'Élégance internationale'],
      watchouts: ['Nécessite impérativement une recherche d’antériorité de marque officielle'],
      disclaimer: 'Vérifiez la disponibilité auprès de l’INPI / EUIPO avant tout usage commercial.',
    },
    tech: {
      icon: '⚡',
      label: 'Tech & Moderne',
      bestFor: 'Plateformes logicielles, objets connectés et innovations',
      prefixes: ['Nex', 'Synt', 'Kinet', 'Velo', 'Aero', 'Zeta', 'Pulse', 'Hyper', 'Omni', 'Volt'],
      suffixes: ['iq', 'ex', 'io', 'fy', 'ix', 'ora', 'is', 'on', 'um', 'os'],
      descriptions: [
        '⚡ Un nom percutant évoquant vélocité, technologie et efficience.',
        '🚀 Une marque moderne pensée pour le digital et les nouveaux usages.',
      ],
      strengths: ['Sonorité punchy', 'Idéal pour le web et les apps', 'Impact générationnel'],
      watchouts: ['Les radicaux tech courts sont très convoités sur le web'],
    },
    lifestyle: {
      icon: '🌿',
      label: 'Lifestyle & Éco',
      bestFor: 'Cosmétiques bio, nutrition, bien-être et mode durable',
      prefixes: ['Pure', 'Natura', 'Vera', 'Flora', 'Aura', 'Terra', 'Sylva', 'Vital', 'Alma', 'Sana'],
      suffixes: ['ea', 'ia', 'is', 'ana', 'elle', 'bio', 'ora', 'ens', 'a', 'um'],
      descriptions: [
        '🌿 Une sonorité douce et organique qui inspire bienveillance et authenticité.',
        '🍃 Une identité axée sur le respect du vivant et l’équilibre au quotidien.',
      ],
      strengths: ['Confiance immédiate', 'Chaleur humaine', 'Facile à adopter'],
      watchouts: ['Éviter le greenwashing dans la promesse produit'],
    },
    default: {
      icon: '💎',
      label: 'Marque Générale',
      bestFor: 'Produits et services grand public ou B2B',
      prefixes: ['Nova', 'Kaly', 'Velo', 'Mira', 'Zeno', 'Talis', 'Aven', 'Brio', 'Solv', 'Orbis'],
      suffixes: ['a', 'ix', 'or', 'on', 'is', 'um', 'io', 'ara', 'el', 'en'],
      descriptions: ['💎 Une marque équilibrée, moderne et facile à retenir.'],
    },
  },

  // 2. BUSINESS
  business: {
    consulting: {
      icon: '📊',
      label: 'Conseil & Stratégie',
      bestFor: 'Cabinets de conseil, stratégie de direction, finance et audit',
      prefixes: ['Vang', 'Strat', 'Axio', 'Veri', 'Opti', 'Capi', 'Merid', 'Pragm', 'Sovere', 'Intel'],
      suffixes: ['us', 'um', 'ia', 'is', 'on', 'ard', 'or', 'ic', 'al', 'ent'],
      descriptions: [
        '📊 Une appellation institutionnelle qui inspire rigueur et clairvoyance.',
        '🏛️ Une signature solide pour rassurer partenaires financiers et grands comptes.',
      ],
      groupTypes: ['Partners', 'Group', 'Associates', 'Advisors', 'Consulting'],
      strengths: ['Solide assise corporative', 'Plein de crédibilité', 'Déclinaison internationale'],
      watchouts: ['Veillez à ne pas paraître trop austère ou impersonnel'],
    },
    industrial: {
      icon: '🏗️',
      label: 'Industrie & Ingénierie',
      bestFor: 'Entreprises de construction, robotique, énergie et logistique',
      prefixes: ['Ferr', 'Titan', 'Vect', 'Dynam', 'Apex', 'Torq', 'Struct', 'Robo', 'Fort', 'Infr'],
      suffixes: ['ix', 'or', 'ex', 'on', 'ec', 'um', 'ax', 'tech', 'is', 'al'],
      descriptions: [
        '🏗️ Un nom robuste qui évoque la force industrielle et la précision d’ingénierie.',
      ],
      groupTypes: ['Industries', 'Systems', 'Technologies', 'Corporation'],
    },
    default: {
      icon: '🏢',
      label: 'Dénomination Entreprise',
      bestFor: 'PME, ETI et sociétés de services',
      prefixes: ['Alti', 'Vinci', 'Nexus', 'Opti', 'Kore', 'Soli', 'Inte', 'Clari', 'Valo', 'Pinn'],
      suffixes: ['is', 'or', 'um', 'ia', 'ex', 'on', 'al', 'ix', 'ard', 'us'],
      descriptions: ['🏢 Une raison sociale solide, claire et professionnelle.'],
    },
  },

  // 3. PRODUCT
  product: {
    gadget: {
      icon: '⚡',
      label: 'Hardware & Gadget',
      bestFor: 'Objets électroniques, montres connectées, écouteurs, accessoires',
      prefixes: ['Pulse', 'Beam', 'Nano', 'Sync', 'Flow', 'Echo', 'Core', 'Vibe', 'Luma', 'Glow'],
      suffixes: ['Pod', 'Pro', 'X', 'One', 'Air', 'Link', 'Band', 'Mate', 'Bud', 'Cast'],
      descriptions: ['📦 Un nom compact qui claque immédiatement sur un emballage.'],
    },
    sport: {
      icon: '🏃',
      label: 'Sport & Performance',
      bestFor: 'Équipements athlétiques, textile technique, vélos, baskets',
      prefixes: ['Aero', 'Stride', 'Sprint', 'Velo', 'Force', 'Kin', 'Boost', 'Apex', 'Grip', 'Flex'],
      suffixes: ['Runner', 'X', 'Racer', 'Pro', 'Stride', 'Shift', 'Core', 'Max', 'Edge', 'Track'],
      descriptions: ['🏃 Un nom plein d’adrénaline et de dépassement de soi.'],
    },
    default: {
      icon: '📦',
      label: 'Produit Universel',
      bestFor: 'Gammes de produits physiques ou digitaux',
      prefixes: ['Omni', 'Pure', 'Vera', 'Solo', 'Duo', 'Vita', 'Nova', 'Aura', 'Flex', 'Zen'],
      suffixes: ['Box', 'Pro', 'Mate', 'Pad', 'Craft', 'Lab', 'Set', 'Fit', 'Kit', 'Form'],
      descriptions: ['📦 Une proposition de valeur claire et attrayante.'],
    },
  },

  // 4. STARTUP
  startup: {
    ai: {
      icon: '🤖',
      label: 'IA & DeepTech',
      bestFor: 'Startups d’intelligence artificielle, LLM, vision par ordinateur',
      prefixes: ['Neur', 'Cogni', 'Synt', 'Sens', 'Infe', 'Deep', 'Axi', 'Gen', 'Logi', 'Omni'],
      suffixes: ['al', 'ix', 'ia', 'iq', 'fy', 'ai', 'on', 'ex', 'is', 'um'],
      descriptions: ['🤖 Un nom futuriste qui traduit la puissance de calcul et d’apprentissage.'],
      groupTypes: ['AI', 'Labs', 'Intelligence', 'Technologies'],
    },
    fintech: {
      icon: '💳',
      label: 'FinTech & Paiement',
      bestFor: 'Néobanques, cryptos, gestion de patrimoine, facturation',
      prefixes: ['Pay', 'Mint', 'Kred', 'Coin', 'Vault', 'Flow', 'Scal', 'Ledg', 'Fina', 'Soli'],
      suffixes: ['ly', 'io', 'fy', 'ex', 'is', 'iq', 'o', 'on', 'a', 'us'],
      descriptions: ['💳 Un nom fluide qui inspire sécurité monétaire et rapidité d’exécution.'],
    },
    default: {
      icon: '🚀',
      label: 'Tech & SaaS',
      bestFor: 'Startups numériques et modèles par abonnement',
      prefixes: ['Zap', 'Loop', 'Dash', 'Shift', 'Stack', 'Piv', 'Bolt', 'Sync', 'Flic', 'Dock'],
      suffixes: ['ly', 'ify', 'io', 'er', 'ster', 'able', 'iq', 'ox', 'ix', 'hub'],
      descriptions: ['🚀 Une jeune pousse agile, audacieuse et résolument tournée vers l’avenir.'],
    },
  },

  // 5. SHOP
  shop: {
    boutique: {
      icon: '👗',
      label: 'Boutique & Mode',
      bestFor: 'Prêt-à-porter, maroquinerie, accessoires chics',
      prefixes: ['L’Atelier', 'La Maison', 'Le Jardin', 'Studio', 'Comptoir', 'Galerie', 'L’Écrin', 'Parenthèse'],
      suffixes: ['d’Or', 'de Soie', 'Sauvage', 'Moderne', 'Élégant', 'Bohème', 'Chic', 'Secret'],
      descriptions: ['👗 Une enseigne chaleureuse qui sublime la sélection de vêtements et créations.'],
    },
    cafe: {
      icon: '☕',
      label: 'Café & Torréfaction',
      bestFor: 'Coffee shops, salons de thé, bars à douceurs',
      prefixes: ['Moka', 'Grain', 'Bulle', 'Arôme', 'Torré', 'Brume', 'Pause', 'Velours', 'Caffè', 'Ristretto'],
      suffixes: ['Lounge', 'Lab', 'Club', 'Roasters', 'Corner', 'Bar', 'Room', 'Spot'],
      descriptions: ['☕ Un havre de convivialité où déguster de précieux grains torréfiés.'],
    },
    default: {
      icon: '🛍️',
      label: 'Commerce de Proximité',
      bestFor: 'Boutiques locales, concept stores, artisanat',
      prefixes: ['Le Petit', 'L’Atelier', 'Comptoir', 'Maison', 'Bazar', 'Coin', 'Échoppe', 'Refuge'],
      suffixes: ['Gourmand', 'Curieux', 'Chic', 'Nomade', 'Urbain', 'Nature', 'Authentique'],
      descriptions: ['🛍️ Un commerce accueillant qui fidélise la clientèle de quartier.'],
    },
  },

  // 6. DOMAIN
  domain: {
    brandable: {
      icon: '🌐',
      label: 'Brandable .com',
      bestFor: 'Noms de domaine inventés, faciles à retenir et à taper',
      prefixes: ['Velo', 'Kalo', 'Zuri', 'Niva', 'Talo', 'Miro', 'Brio', 'Sola', 'Zeno', 'Vido'],
      suffixes: ['va', 'ly', 'go', 'do', 'na', 'ra', 'co', 'to', 'la', 'so'],
      descriptions: ['🌐 Une adresse web courte et fluide, idéale pour l’accès direct sans faute de frappe.'],
      groupTypes: ['.com', '.io', '.co', '.ai'],
    },
    tech: {
      icon: '⚡',
      label: 'Tech .io & .ai',
      bestFor: 'Services de développement, APIs, outils cloud',
      prefixes: ['Cloud', 'Dev', 'Code', 'Byte', 'Sync', 'Grid', 'Flow', 'Node', 'Pack', 'Stack'],
      suffixes: ['base', 'hub', 'flow', 'io', 'ai', 'net', 'stack', 'kit', 'box', 'lab'],
      descriptions: ['💻 Une URL ciblée pour développeurs et entreprises tech.'],
    },
    default: {
      icon: '🌐',
      label: 'Nom de Domaine Universel',
      bestFor: 'Sites vitrines, blogs et projets web',
      prefixes: ['Get', 'Try', 'Use', 'Go', 'The', 'My', 'Hey', 'Open', 'All', 'True'],
      suffixes: ['Hub', 'Spot', 'Site', 'Way', 'Zone', 'Point', 'Line', 'Base', 'Nest', 'Desk'],
      descriptions: ['🌐 Une combinaison naturelle prête pour une présence web claire.'],
    },
  },

  // 7. APP
  app: {
    productivity: {
      icon: '⚡',
      label: 'Productivité',
      bestFor: 'Gestionnaires de tâches, notes, calendriers, organisation',
      prefixes: ['Task', 'Focus', 'Plan', 'Flow', 'Note', 'Organ', 'Swift', 'Memo', 'Do', 'Zen'],
      suffixes: ['ify', 'ly', 'o', 'Sync', 'Up', 'Flow', 'Deck', 'Pad', 'Log', 'mate'],
      descriptions: ['📱 Une application intuitive pour accomplir davantage avec sérénité.'],
    },
    social: {
      icon: '💬',
      label: 'Social & Communication',
      bestFor: 'Messageries, partage de contenu, rencontres, réseaux',
      prefixes: ['Chat', 'Echo', 'Wave', 'Banter', 'Pulse', 'Loop', 'Link', 'Ping', 'Talk', 'Vibe'],
      suffixes: ['r', 'ly', 'me', 'in', 'us', 'app', 'gram', 'hub', 'box', 'zone'],
      descriptions: ['💬 Une appli vivante pour rapprocher les personnes et partager l’instant.'],
    },
    default: {
      icon: '📱',
      label: 'Application Mobile',
      bestFor: 'Tout type d’application smartphone',
      prefixes: ['Tap', 'Snap', 'Flic', 'Pocket', 'Easy', 'Smart', 'Insta', 'Quick', 'Mini', 'Micro'],
      suffixes: ['App', 'Go', 'X', 'Box', 'Pro', 'Lite', 'Plus', 'Kit', 'Now', 'Hub'],
      descriptions: ['📱 Un nom percutant qui s’affiche impeccablement sur l’écran d’accueil.'],
    },
  },

  // 8. FEATURE
  feature: {
    smart: {
      icon: '🧠',
      label: 'Smart & IA',
      bestFor: 'Fonctionnalités intelligentes, suggestions auto, calculs avancés',
      prefixes: ['Smart', 'Auto', 'Intelli', 'Hyper', 'Deep', 'Cogni', 'Neuro', 'Genius', 'Omni', 'Wise'],
      suffixes: ['Sync', 'Sense', 'Pilot', 'Match', 'Cast', 'Brain', 'View', 'Core', 'Track', 'Mind'],
      descriptions: ['⚙️ Une fonctionnalité moderne qui automatise l’effort de l’utilisateur.'],
    },
    security: {
      icon: '🔒',
      label: 'Sécurité & Contrôle',
      bestFor: 'Chiffrement, sauvegardes, coffre-fort, pare-feu',
      prefixes: ['Safe', 'Vault', 'Shield', 'Lock', 'Guard', 'Iron', 'Trust', 'Fort', 'Pillar', 'Defend'],
      suffixes: ['Pass', 'Key', 'Wall', 'Gate', 'Armor', 'Lock', 'Proof', 'Zone', 'Box', 'Safe'],
      descriptions: ['🔒 Un bouclier infaillible pour garantir l’intégrité des données sensibles.'],
    },
    default: {
      icon: '⚙️',
      label: 'Fonctionnalité Clé',
      bestFor: 'Options premium et modules logiciels',
      prefixes: ['Turbo', 'Magic', 'Power', 'Quick', 'Mega', 'True', 'Super', 'Ultra', 'Live', 'Pro'],
      suffixes: ['Mode', 'Boost', 'Flow', 'Cast', 'Grid', 'Scan', 'Sync', 'View', 'Port', 'Pad'],
      descriptions: ['⚙️ Un packaging marketing valorisant pour une innovation technique.'],
    },
  },

  // 9. SERVICE
  service: {
    premium: {
      icon: '⭐',
      label: 'Prestige & Conciergerie',
      bestFor: 'Accompagnement VIP, forfaits sur-mesure, assistance dédiée',
      prefixes: ['Prime', 'Apex', 'Privilège', 'Élite', 'Exclusiv', 'Majestic', 'Sovereign', 'Prestige'],
      suffixes: ['Care', 'Club', 'Circle', 'Concierge', 'Plus', 'Privé', 'Select', 'Signature'],
      descriptions: ['🤝 Une offre haut de gamme pour des clients aux exigences élevées.'],
    },
    audit: {
      icon: '🔍',
      label: 'Audit & Diagnostic',
      bestFor: 'Bilans de compétences, audits cyber, bilans carbone, conseil',
      prefixes: ['Scan', 'Check', 'Scope', 'Lens', 'Verif', 'Clarity', 'Audit', 'Diag', 'Vision', 'Probe'],
      suffixes: ['360', 'Pro', 'View', 'Check', 'Insight', 'Metric', 'Report', 'Map', 'Track', 'Compass'],
      descriptions: ['🔍 Un état des lieux rigoureux avec recommandations concrètes.'],
    },
    default: {
      icon: '🤝',
      label: 'Offre de Service',
      bestFor: 'Forfaits mensuels, prestations d’agence',
      prefixes: ['Flex', 'Smart', 'Start', 'Pro', 'Fast', 'Easy', 'All', 'True', 'Core', 'Next'],
      suffixes: ['Care', 'Pack', 'Service', 'Desk', 'Assist', 'Suite', 'Pass', 'Direct', 'Hub', 'Line'],
      descriptions: ['🤝 Un forfait clair et rassurant pour transformer des prospects en clients.'],
    },
  },

  // 10. SLOGAN
  slogan: {
    action: {
      icon: '⚡',
      label: 'Action Directe',
      bestFor: 'Appels à l’action, dépassement, dynamisme sportif ou tech',
      prefixes: ['Osez', 'Créez', 'Repoussez', 'Libérez', 'Révélez', 'Activez', 'Dominez', 'Conquérez'],
      suffixes: ['l’impossible', 'votre potentiel', 'l’avenir dès aujourd’hui', 'vos ambitions', 'le mouvement', 'la différence'],
      descriptions: ['📣 Une injonction enthousiasmante qui incite immédiatement au passage à l’acte.'],
    },
    vision: {
      icon: '💡',
      label: 'Vision & Promesse',
      bestFor: 'Manifestes de marques, identités d’entreprises inspirantes',
      prefixes: ['L’art de', 'Bâtir', 'Penser', 'Façonner', 'Inspirer', 'Partager', 'Réinventer', 'Harmoniser'],
      suffixes: ['le futur ensemble', 'l’exceptionnel', 'ce qui compte vraiment', 'la confiance durable', 'les nouveaux mondes'],
      descriptions: ['📣 Une déclaration solennelle qui unit collaborateurs et clients.'],
    },
    default: {
      icon: '📣',
      label: 'Accroche Culte',
      bestFor: 'Pages d’accueil, bannières et signatures',
      prefixes: ['Simplement', 'Toujours plus', 'Pour ceux qui', 'L’évidence', 'Au cœur de', 'Votre allié pour'],
      suffixes: ['mieux', 'plus loin', 'font bouger les lignes', 'l’innovation', 'chaque étape', 'le succès'],
      descriptions: ['📣 Une formule mémorable facile à répéter et à retenir.'],
    },
  },

  // 11. BOOK
  book: {
    thriller: {
      icon: '🔍',
      label: 'Thriller & Suspense',
      bestFor: 'Polars sombres, romans d’espionnage, énigmes psychologiques',
      prefixes: ['Le Silence des', 'L’Ombre du', 'La Dernière', 'Les Murmures de la', 'Le Pacte de', 'Dans les Yeux du', 'La Faille de'],
      suffixes: ['Miroirs', 'Nuit Blanche', 'Témoin', 'Verdict', 'Secret', 'Brume', 'Cendres', 'Pénitents', 'Châtiment'],
      descriptions: ['📚 Un titre haletant qui promet nuits blanches et rebondissements imprévisibles.'],
    },
    fantasy: {
      icon: '⚔️',
      label: 'Épopée & Fantasy',
      bestFor: 'Sagas médiévales, royaumes perdus, prophéties magiques',
      prefixes: ['Les Chroniques de', 'L’Héritage du', 'La Couronne de', 'Le Chant des', 'L’Épée d’', 'Les Maîtres du'],
      suffixes: ['Cendres', 'Feu Ancien', 'Étoiles Noires', 'Briseciel', 'Tempêtes', 'Reliques Oubliées', 'Sceaux Sacrés'],
      descriptions: ['📚 Un souffle épique digne des plus grandes sagas littéraires.'],
    },
    default: {
      icon: '📚',
      label: 'Titre Littéraire',
      bestFor: 'Romans contemporains, fables et récits de vie',
      prefixes: ['Au-delà des', 'Sous le Signe des', 'La Saison des', 'L’Écho des', 'Les Jardins de', 'Au Fil des', 'La Mémoire des'],
      suffixes: ['Songes', 'Promesses', 'Mirages', 'Lendemains', 'Chemins Croisés', 'Possibles', 'Silences', 'Retrouvailles'],
      descriptions: ['📚 Un intitulé poétique qui interpelle la sensibilité du lecteur.'],
    },
  },

  // 12. CHARACTER
  character: {
    protagonist: {
      icon: '🌟',
      label: 'Protagoniste Valeureux',
      bestFor: 'Héros courageux, explorateurs, défenseurs des faibles',
      prefixes: ['Théo', 'Alex', 'Valen', 'Lucien', 'Arthur', 'Gaspard', 'Émile', 'Julien', 'Bastien', 'Marin'],
      suffixes: ['Vandor', 'Beaufort', 'Lestrange', 'Castel', 'Rivière', 'Montcalm', 'Mercier', 'Rochebrune'],
      descriptions: ['👤 Un personnage attachant, guidé par ses valeurs et sa soif de justice.'],
      femaleStarts: ['Camille', 'Clara', 'Éléonore', 'Juliette', 'Rose', 'Adèle', 'Lucie', 'Victoire'],
      maleStarts: ['Théo', 'Alexandre', 'Valentin', 'Lucien', 'Arthur', 'Gaspard', 'Émile', 'Gabriel'],
    },
    antagonist: {
      icon: '🎭',
      label: 'Antagoniste Complexe',
      bestFor: 'Adversaires rusés, esprits froids, rivaux politiques',
      prefixes: ['Victor', 'Barnabé', 'Gédéon', 'Malor', 'Octave', 'Célestin', 'Léopold', 'Séverin'],
      suffixes: ['de Morval', 'Vanderbilt', 'Corbeau', 'Delaunay', 'Sombreval', 'Noirmont', 'Grisel'],
      descriptions: ['🎭 Une personnalité contrastée, calculatrice mais dotée de motifs fascinants.'],
    },
    default: {
      icon: '👤',
      label: 'Personnage Roman',
      bestFor: 'Tout personnage de fiction littéraire ou théâtrale',
      prefixes: ['Félix', 'Antoine', 'Léo', 'Robin', 'Sacha', 'Simon', 'Mathias', 'Paul', 'Hugo'],
      suffixes: ['Fontaine', 'Moreau', 'Lemoine', 'Dumont', 'Gauthier', 'Lambert', 'Marchand', 'Fabre'],
      descriptions: ['👤 Une identité réaliste et équilibrée pour ancrer votre narration.'],
    },
  },

  // 13. VIDEOGAME
  videogame: {
    action: {
      icon: '💥',
      label: 'Action & Frénésie',
      bestFor: 'Shooters, hack & slash, jeux de combat, brawlers',
      prefixes: ['Iron', 'Cyber', 'Neon', 'Blood', 'Shadow', 'Strike', 'Hyper', 'Rage', 'Void', 'Chaos'],
      suffixes: ['Trigger', 'Blade', 'Overdrive', 'Protocol', 'Surge', 'Breaker', 'Assault', 'Force', 'Vengeance'],
      descriptions: ['🕹️ Un titre qui transpire la vitesse de réflexe et l’impact des coups.'],
      titles: ['Overdrive', 'Resurrection', 'Armageddon', 'Protocol Zero', 'Unleashed'],
    },
    indie: {
      icon: '🌾',
      label: 'Indépendant & Poétique',
      bestFor: 'Jeux narratifs, métroidvanias d’ambiance, énigmes intimistes',
      prefixes: ['Hollow', 'Echoes of', 'Song of', 'Tiny', 'The Lost', 'Whispering', 'After', 'Paper', 'Spirit'],
      suffixes: ['Valley', 'Lantern', 'Wanderer', 'Tides', 'Spire', 'Grave', 'Memory', 'Journey', 'Seasons'],
      descriptions: ['🕹️ Un nom touchant qui promet une aventure visuelle et émotionnelle marquante.'],
    },
    default: {
      icon: '🕹️',
      label: 'Jeu Vidéo Général',
      bestFor: 'Titres consoles, PC et plateformes dématérialisées',
      prefixes: ['Project', 'Chronicles of', 'Tales of', 'Realm of', 'Legacy of', 'Dawn of', 'Beyond'],
      suffixes: ['Eternity', 'Shadows', 'Legends', 'Warriors', 'Origins', 'Horizon', 'Frontier'],
      descriptions: ['🕹️ Un univers interactif fascinant qui suscite le clic dans le catalogue.'],
    },
  },

  // 14. GUILD
  guild: {
    raid: {
      icon: '⚔️',
      label: 'Guilde PvE & Raid',
      bestFor: 'Progression de donjons, boss mythiques, haut niveau',
      prefixes: ['Vanguard', 'Apex', 'Titan', 'Immortal', 'Iron', 'Eclipse', 'Nexus', 'Sovereign', 'Resolute'],
      suffixes: ['Raiders', 'Order', 'Dawn', 'Legion', 'Crusade', 'Reign', 'Defiance', 'Protocol'],
      descriptions: ['🛡️ Une formation d’élite soudée pour terrasser les monstres les plus coriaces.'],
      groupTypes: ['Guild', 'Order', 'Legion', 'Vanguard', 'Syndicate'],
    },
    pvp: {
      icon: '🩸',
      label: 'Clan PvP & Tournoi',
      bestFor: 'Champs de bataille, guerres de factions, arènes esport',
      prefixes: ['Crimson', 'Shadow', 'Venom', 'Fatal', 'Reaper', 'Ruthless', 'Blood', 'Havoc', 'Vortex'],
      suffixes: ['Fangs', 'Hounds', 'Blades', 'Squad', 'Wrath', 'Strike', 'Cartel', 'Enclave'],
      descriptions: ['🛡️ Des combattants sans pitié dont l’approche fait trembler les serveurs adverses.'],
    },
    default: {
      icon: '🛡️',
      label: 'Bannière de Guilde',
      bestFor: 'MMO, serveurs communautaires et alliances',
      prefixes: ['Brotherhood of', 'Knights of', 'Keepers of', 'Children of', 'Circle of', 'Guardians of'],
      suffixes: ['Light', 'Honor', 'Valor', 'the North', 'Eternity', 'the Phoenix', 'the Realm'],
      descriptions: ['🛡️ Une confrérie loyale prête à braver tous les périls ensemble.'],
    },
  },

  // 15. YOUTUBE
  youtube: {
    tech: {
      icon: '💻',
      label: 'Tech & Déballage',
      bestFor: 'Tests matériel, astuces code, intelligence artificielle, comparatifs',
      prefixes: ['Tech', 'Code', 'Geek', 'Byte', 'Digital', 'Futur', 'Next', 'Hardware', 'Pixel', 'Cyber'],
      suffixes: ['Lab', 'Zone', 'Hub', 'Review', 'Corner', 'Show', 'Digest', 'Talk', 'Pulse', 'Scope'],
      descriptions: ['📹 Une chaîne claire et professionnelle pour passionnés de technologies.'],
    },
    gaming: {
      icon: '🎮',
      label: 'Gaming & Fun',
      bestFor: 'Let’s play déjantés, défis multijoueurs, walkthroughs',
      prefixes: ['Pixel', 'Game', 'Play', 'Loot', 'Quest', 'Level', 'Retro', 'Arcade', 'Boss', 'Respawn'],
      suffixes: ['Cast', 'Plays', 'Verse', 'Club', 'Box', 'Squad', 'Drop', 'Zone', 'Mania', 'Nation'],
      descriptions: ['📹 Du divertissement pur et une bonne humeur communicative à chaque épisode.'],
    },
    default: {
      icon: '📹',
      label: 'Chaîne Vidéo',
      bestFor: 'Vidéastes indépendants et créateurs de formats originaux',
      prefixes: ['Studio', 'La Minute', 'Le Coin de', 'Chroniques de', 'L’Atelier', 'Regards de', 'Focus'],
      suffixes: ['Media', 'TV', 'Vision', 'Scope', 'Story', 'Vibes', 'Mag', 'Vlog', 'Journal'],
      descriptions: ['📹 Un patronyme de chaîne sonore et distinctif pour fédérer les abonnés.'],
    },
  },

  // 16. PODCAST
  podcast: {
    talk: {
      icon: '☕',
      label: 'Talk-Show & Intimité',
      bestFor: 'Interviews au coin du feu, récits de vie, confidences',
      prefixes: ['Autour d’un', 'Paroles de', 'Entre Deux', 'La Table de', 'Confidentiel', 'Les Coulisses de', 'Café &'],
      suffixes: ['Café', 'Échanges', 'Miroirs', 'Voix', 'Passions', 'Destins', 'Murmures', 'Récits'],
      descriptions: ['🎙️ Une atmosphère chaleureuse où la parole se libère en toute authenticité.'],
    },
    growth: {
      icon: '💡',
      label: 'Développement & Affaires',
      bestFor: 'Conseils pour entrepreneurs, productivité, finances personnelles',
      prefixes: ['Mindset', 'Objectif', 'Cap vers', 'Les Clés de', 'Décideurs &', 'Stratégie', 'Le Déclic', 'Révolution'],
      suffixes: ['Impact', 'Succès', 'Vision', 'Pro', 'Avenir', 'Action', 'Horizon', 'Maîtrise'],
      descriptions: ['🎙️ Des astuces concrètes à écouter chaque matin pour accélérer sa trajectoire.'],
    },
    default: {
      icon: '🎙️',
      label: 'Émission Audio',
      bestFor: 'Podcasts culturels, décryptages et sagas narratives',
      prefixes: ['Les Ondes de', 'Micro Ouvert sur', 'Raconte-moi', 'Dans le Viseur de', 'Le Grand'],
      suffixes: ['Podcast', 'Hebdo', 'Mag', 'Story', 'Talk', 'Scope', 'Show', 'Feuilleton'],
      descriptions: ['🎙️ Un titre qui intrigue et donne envie de lancer la lecture immédiatement.'],
    },
  },

  // 17. HANDLE
  handle: {
    cyber: {
      icon: '⚡',
      label: 'Cyber & Minimal',
      bestFor: 'Twitter/X, Discord, Telegram, GitHub',
      prefixes: ['Neo', 'Zero', 'Kyo', 'Vex', 'Syn', 'Aero', 'Zeta', 'Nox', 'Lux', 'Ryn'],
      suffixes: ['dev', 'core', 'byte', 'wave', 'ix', 'link', 'sys', 'bit', 'net', 'run'],
      descriptions: ['✨ Un pseudo court, futuriste et élégant sans chiffres inutiles.'],
    },
    aesthetic: {
      icon: '🌸',
      label: 'Aesthetic & Poétique',
      bestFor: 'Instagram, Pinterest, portfolios créatifs',
      prefixes: ['Lune', 'Velours', 'Sora', 'Aura', 'Soleil', 'Brume', 'Étoile', 'Doux', 'Ciel', 'Ambre'],
      suffixes: ['pastel', 'miel', 'sylve', 'nuage', 'songes', 'doux', 'flora', 'lueur', 'rosée'],
      descriptions: ['✨ Une présence douce, soignée et visuellement harmonieuse.'],
    },
    default: {
      icon: '✨',
      label: 'Pseudonyme Universel',
      bestFor: 'Tout profil sur le web',
      prefixes: ['Mister', 'Captain', 'Dr', 'Sir', 'Lord', 'Agent', 'Saint', 'Wild', 'Iron', 'Shadow'],
      suffixes: ['Fox', 'Wolf', 'Owl', 'Hawk', 'Bear', 'Storm', 'Blade', 'Knight', 'Rider', 'Spark'],
      descriptions: ['✨ Un pseudonyme net et reconnaissable d’un seul coup d’œil.'],
    },
  },

  // 18. COMMUNITY
  community: {
    hub: {
      icon: '🌍',
      label: 'Hub & Foyer de Créateurs',
      bestFor: 'Serveurs d’entraide, collectifs de freelances, tiers-lieux',
      prefixes: ['Le Refuge des', 'L’Atelier des', 'Le Collectif', 'La Ruche des', 'Le Foyer des', 'Cercle des'],
      suffixes: ['Créateurs', 'Pionniers', 'Makers', 'Bâtisseurs', 'Esprits Libres', 'Talents', 'Innovateurs'],
      descriptions: ['🌍 Un espace accueillant où chacun trouve soutien, émulation et écoute.'],
    },
    default: {
      icon: '🌍',
      label: 'Communauté Fédératrice',
      bestFor: 'Clubs et associations',
      prefixes: ['Alliance', 'Confrérie', 'Ligue', 'Club', 'Union', 'Guilde', 'Société', 'Rassemblement'],
      suffixes: ['Solidaire', 'Moderne', 'Partage', 'Horizons', 'Futur', 'Espoir', 'Fraternité'],
      descriptions: ['🌍 Une bannière commune qui donne fierté et engagement aux membres.'],
    },
  },

  // 19. PLACENAME
  placename: {
    coastal: {
      icon: '⛵',
      label: 'Ports & Îles Mystiques',
      bestFor: 'Havres maritimes, baies rocheuses, phares isolés',
      prefixes: ['Port-', 'Baie-', 'Cap-', 'Île-', 'Havre-', 'Anse-', 'Pointe-', 'Roc-'],
      suffixes: ['des-Brumes', 'd’Azur', 'des-Mouettes', 'du-Vent', 'de-Tempête', 'Sauvage', 'du-Silence', 'd’Écume'],
      descriptions: ['🗺️ Une escale bercée par le ressac des vagues et les légendes de marins.'],
    },
    mountain: {
      icon: '🏔️',
      label: 'Pics & Forts Montagneux',
      bestFor: 'Gorges escarpées, bastions de pierre, cols vertigineux',
      prefixes: ['Mont-', 'Pic-', 'Val-', 'Col-', 'Fort-', 'Gorge-', 'Roc-', 'Puy-'],
      suffixes: ['de-Fer', 'des-Aigles', 'Gris', 'Glace', 'du-Loup', 'Perdu', 'des-Mages', 'Froid'],
      descriptions: ['🗺️ Une forteresse minérale défendue par le souffle glacial des cimes.'],
    },
    default: {
      icon: '🗺️',
      label: 'Lieu de Légende',
      bestFor: 'Villages, clairières et auberges de campagne',
      prefixes: ['Saint-', 'Bois-', 'Château-', 'Font-', 'Bel-', 'Neuf-', 'Grand-', 'Vieux-'],
      suffixes: ['bourg', 'val', 'mont', 'ville', 'chêne', 'gué', 'pont', 'moulin'],
      descriptions: ['🗺️ Un point sur la carte prêt à accueillir des aventures inoubliables.'],
    },
  },

  // 20. PLANET
  planet: {
    terrestrial: {
      icon: '🪐',
      label: 'Monde Habitable & Tellurique',
      bestFor: 'Colonies d’outre-espace, havres terraformés, biomes luxuriants',
      prefixes: ['Kepler-', 'Aethel', 'Vesper', 'Aurelia', 'Solaria', 'Eridan', 'Zephir', 'Terra-', 'Caelum'],
      suffixes: ['Prime', 'Major', 'IV', 'VII', 'Alpha', 'Borealis', 'Nova', 'Secundus', 'Australis'],
      descriptions: ['🪐 Un orbe bleuté suspendu dans l’abysse, promesse d’un nouveau foyer humain.'],
    },
    gas: {
      icon: '🌀',
      label: 'Géante Gazeuse & Anneaux',
      bestFor: 'Tempêtes titanesques, nuages d’ammoniac, forages spatiaux',
      prefixes: ['Jovi-', 'Chronos', 'Tiamat', 'Leviath', 'Nebul', 'Vortex', 'Styx', 'Boreas', 'Goliath'],
      suffixes: ['X', 'IX', 'Cyclops', 'Deep', 'Colossus', 'Omega', 'Eye', 'Storm', 'V'],
      descriptions: ['🪐 Une sphère colossale striée d’éclairs où dansent des anneaux de glace.'],
    },
    default: {
      icon: '🪐',
      label: 'Monde Stellaire',
      bestFor: 'Systèmes stellaires et corps célestes',
      prefixes: ['Sirius', 'Vega', 'Altair', 'Rigel', 'Deneb', 'Aldebaran', 'Polaris', 'Antares'],
      suffixes: ['III', 'Prime', 'B', 'C', 'Station', 'Outpost', 'Orbital', 'Halo'],
      descriptions: ['🪐 Des coordonnées galactiques prêtes pour le grand saut en hyperespace.'],
    },
  },

  // 21. PROJECT
  project: {
    secret: {
      icon: '🔒',
      label: 'Projet Secret & Codename',
      bestFor: 'Opérations confidentielles, R&D de rupture, missions tactiques',
      prefixes: ['Opération', 'Projet', 'Initiative', 'Protocole', 'Programme', 'Mission', 'Directive'],
      suffixes: ['Aurora', 'Némésis', 'Olympe', 'Phénix', 'Titan', 'Égide', 'Valkyrie', 'Chrysalide', 'Chimère'],
      descriptions: ['🎯 Un nom de code au mystère protecteur qui soude les équipes clés.'],
    },
    default: {
      icon: '🎯',
      label: 'Projet d’Entreprise',
      bestFor: 'Refontes d’envergure, migrations logicielles, déploiements',
      prefixes: ['Horizon', 'Cap', 'Élan', 'Passerelle', 'Tremplin', 'Envol', 'Renaissance', 'Impulsion'],
      suffixes: ['2030', 'Pro', 'Plus', 'Alpha', 'Next', 'Prime', 'One', 'Future'],
      descriptions: ['🎯 Une dynamique constructive qui balise clairement les étapes de réussite.'],
    },
  },

  // 22. FRAMEWORK
  framework: {
    method: {
      icon: '📐',
      label: 'Méthode & Matrice',
      bestFor: 'Modèles de management, grilles d’audit, processus d’agilité',
      prefixes: ['La Méthode', 'Le Modèle', 'La Matrice', 'Le Framework', 'Le Compas', 'Le Pilier', 'L’Échelle'],
      suffixes: ['Agile', 'Focus', 'Impact', 'Clarté', 'Horizon', 'Align', 'Synergie', 'Levier', 'Pulse'],
      descriptions: ['📐 Un système intellectuel structuré pour résoudre des problèmes complexes.'],
    },
    default: {
      icon: '📐',
      label: 'Système Conceptuel',
      bestFor: 'Formations professionnelles, livres blancs et boîtes à outils',
      prefixes: ['CORE', 'APEX', 'LEAP', 'FLOW', 'RISE', 'SEED', 'LIFT', 'SCALE', 'CRAFT'],
      suffixes: ['System', 'Matrix', 'Method', 'Toolkit', 'Engine', 'Canvas', 'Cycle'],
      descriptions: ['📐 Un acronyme percutant facile à mémoriser et à transmettre.'],
    },
  },

  // 23. EVENT
  event: {
    summit: {
      icon: '🎤',
      label: 'Sommet & Conférence',
      bestFor: 'Congrès d’experts, plénières internationales, forums professionnels',
      prefixes: ['Global', 'World', 'Future', 'Tech', 'Innovation', 'Impact', 'Summit', 'Forum', 'Horizon'],
      suffixes: ['Concorde', 'Vision', 'Next', 'Days', 'Congress', 'Connect', 'Leaders', 'Expo'],
      descriptions: ['🎪 Le rendez-vous annuel incontournable où convergent tous les décideurs.'],
    },
    festival: {
      icon: '🎨',
      label: 'Festival & Célébration',
      bestFor: 'Rencontres artistiques, hackathons créatifs, fêtes du jeu',
      prefixes: ['Nuits de', 'Fête de', 'Électro-', 'Lumières de', 'Le Grand', 'Printemps de', 'Festival des'],
      suffixes: ['Sons', 'Songes', 'Pixels', 'Mondes', 'Merveilles', 'Arts', 'Rêveurs', 'Créations'],
      descriptions: ['🎪 Une effervescence culturelle propice au partage et aux souvenirs mémorables.'],
    },
    default: {
      icon: '🎪',
      label: 'Événement d’Envergure',
      bestFor: 'Tout type de rassemblement public ou privé',
      prefixes: ['Les Rendez-vous de', 'La Soirée des', 'Le Défi', 'Le Carrefour de', 'Les Assises de'],
      suffixes: ['l’Avenir', 'la Création', 'l’Audace', 'la Tech', 'la Culture', 'l’Échange'],
      descriptions: ['🎪 Une affiche prestigieuse qui suscite les inscriptions dès l’annonce.'],
    },
  },

  // 24. AI_BOT
  ai_bot: {
    assistant: {
      icon: '💬',
      label: 'Copilote Bienveillant',
      bestFor: 'Assistants virtuels, chatbots clients, compagnons d’étude',
      prefixes: ['Aria', 'Kaly', 'Milo', 'Noa', 'Elio', 'Luma', 'Zara', 'Sacha', 'Orion', 'Soli'],
      suffixes: ['AI', 'Bot', 'Mate', 'Guide', 'Pal', 'Care', 'Mind', 'Wise', 'Copilot'],
      descriptions: ['🤖 Une présence attentive et rassurante qui simplifie chaque tâche.'],
    },
    autonomous: {
      icon: '🦾',
      label: 'Agent Autonome & Calcul',
      bestFor: 'Robots de surveillance, analyse quantitative, trading, sécurité',
      prefixes: ['Vect', 'Sentinel', 'Aegis', 'Titan', 'Cortex', 'Synapse', 'Nexus', 'Cipher', 'Vigil'],
      suffixes: ['Core', 'Unit', 'Prime', 'X', 'Zero', 'Alpha', 'Engine', 'Guard', 'Protocol'],
      descriptions: ['🤖 Une mécanique de haute précision qui veille sans relâche sur vos flux.'],
    },
    default: {
      icon: '🤖',
      label: 'Robot & Intelligence',
      bestFor: 'Tout agent numérique autonome',
      prefixes: ['Robo', 'Cyber', 'Omni', 'Auto', 'Cogni', 'Digi', 'Logic', 'Neura', 'Kinet'],
      suffixes: ['Bot', 'Droid', 'Agent', 'Mind', 'Unit', 'Craft', 'Spark', 'Link'],
      descriptions: ['🤖 Une étincelle d’intelligence artificielle façonnée pour vous servir.'],
    },
  },

  // 25. CULINARY
  culinary: {
    gourmet: {
      icon: '🍷',
      label: 'Haute Gastronomie',
      bestFor: 'Tables étoilées, menus dégustation, assiettes poétiques',
      prefixes: ['Déclinaison de', 'Miroir de', 'Symphonie de', 'Volupté de', 'Nacre de', 'Crémeux de', 'Fumée de'],
      suffixes: ['Homard Sauvage', 'Truffes Noires', 'Cèpes Dorés', 'Baies Sylvestres', 'Noisettes Torréfiées', 'Fleurs de Sel'],
      descriptions: ['🍲 Un intitule soigné qui promet un voyage gustatif inoubliable.'],
    },
    cocktail: {
      icon: '🍸',
      label: 'Cocktail Signature & Breuvage',
      bestFor: 'Bars à cocktails, potions féeriques, élixirs de fête',
      prefixes: ['Brume de', 'Larmes de', 'Élixir de', 'Nectar de', 'Rosée de', 'Le Secret de', 'Souffle de'],
      suffixes: ['Minuit', 'Saphir', 'L’Aventurier', 'Braise', 'Givre', 'Clair de Lune', 'Cacao Amer'],
      descriptions: ['🍲 Un breuvage envoûtant servi dans un verre givré aux parfums précieux.'],
    },
    default: {
      icon: '🍲',
      label: 'Plat de Tradition',
      bestFor: 'Recettes réconfortantes, ragoûts de taverne, desserts d’enfance',
      prefixes: ['Le Ragoût du', 'La Marmite de', 'Le Festin des', 'La Tourte de la', 'Le Délice de'],
      suffixes: ['Vieux Moulin', 'Garde-Chasse', 'Moine Rieur', 'Mère Denis', 'Vallée Verte'],
      descriptions: ['🍲 Une assiette généreuse qui réchauffe le cœur des convives.'],
    },
  },
};
