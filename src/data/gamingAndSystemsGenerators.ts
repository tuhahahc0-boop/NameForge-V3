import { GeneratorId, GeneratorMeta, SubcategoryData } from '../types';

export const GAMING_SYSTEMS_METADATA: Record<
  | 'gamertag'
  | 'boss'
  | 'weapon'
  | 'spell'
  | 'tavern'
  | 'dungeon'
  | 'starship'
  | 'mecha'
  | 'cyberpunk'
  | 'steampunk'
  | 'alien_species'
  | 'mythic_creature'
  | 'crypto_token'
  | 'server_cluster'
  | 'os_system',
  GeneratorMeta
> = {
  // 1. GAMERTAG
  gamertag: {
    id: 'gamertag',
    title: 'Générateur de GamerTags & Pseudos eSport',
    shortTitle: 'GamerTag',
    icon: '🎮',
    badge: 'ESPORT & STREAMING',
    h1a: 'Générateur de Pseudos &',
    h1b: 'GamerTags eSport',
    description: 'Forgez des pseudonymes percutants, agressifs et ultra-mémorables pour FPS, MOBA, Twitch, Discord et tournois eSport compétitifs.',
    generatorTitle: 'Identité Compétitive & Pseudos de Légende',
    generatorSubtitle: 'Syllabes tranchantes, consonnes percutantes et préfixes de sniper.',
    category: 'creative',
    advantages: ['Mémorisation instantanée en leaderboard', 'Sonorités courtes et impactantes', 'Idéal sur Twitch, Steam et Xbox Live'],
    limits: ['Certains pseudos très courts peuvent nécessiter des chiffres sur de très vieilles plateformes'],
    guideTitle: 'Comment choisir un GamerTag inoubliable ?',
    guide: [
      { h: '1. Privilégiez 2 syllabes percutantes', p: 'Les meilleurs pseudos de champions (S1mple, Faker, TenZ) se prononcent en un clin d’œil.' },
      { h: '2. Évitez les caractères superflus', p: 'Les « xX_ » vieillissent mal. Préférez un radical propre avec du relief phonétique.' },
      { h: '3. Testez la prononciation en callout', p: 'Vos coéquipiers doivent pouvoir crier votre pseudo en une fraction de seconde.' },
    ],
    cardsTitle: 'Scènes & Plateformes Recommandées',
    cards: [
      { icon: '🎯', h: 'FPS & Shooters (Valorant, CS2)', p: 'Pseudos vifs et chirurgicaux pour snipers et duelistes d’élite.' },
      { icon: '🏆', h: 'MOBA & Battle Royale', p: 'Noms percutants pour grimper les échelons classés et briller en tournoi.' },
      { icon: '📺', h: 'Streaming Twitch & Kick', p: 'Une marque de créateur reconnaissable entre mille par votre communauté.' },
    ],
    faqTitle: 'Questions fréquentes sur les GamerTags',
    faq: [
      { q: 'Ces pseudos sont-ils libres sur Steam et Discord ?', a: 'Sur Steam et Discord avec tag, oui sans problème. Pour les jeux avec pseudo unique, testez dès la génération.' },
      { q: 'Puis-je l’utiliser comme nom de chaîne YouTube ?', a: 'Oui, ce sont d’excellents alias courts pour créer votre identité multimédia.' },
    ],
    footer: 'Dominez le tableau des scores avec NameForge.',
  },

  // 2. BOSS
  boss: {
    id: 'boss',
    title: 'Générateur de Boss & Némésis Épiques',
    shortTitle: 'Boss de Fin',
    icon: '👹',
    badge: 'RAID BOSS & NÉMÉSIS',
    h1a: 'Générateur de Noms de',
    h1b: 'Boss & Némésis',
    description: 'Donnez vie à des souverains ténébreux, demi-dieux corrompus et titans ancestraux capables de faire trembler vos joueurs.',
    generatorTitle: 'Terreur des Abysses & Seigneurs de Raid',
    generatorSubtitle: 'Titres imposants, sonorités gutturales et épithètes destructrices.',
    category: 'fantasy',
    advantages: ['Atmosphère d’intimidation immédiate', 'Titres honorifiques de destruction', 'Parfait pour D&D et Souls-like'],
    limits: ['Trop imposant pour de simples serviteurs ou PNJ secondaires'],
    guideTitle: 'Concevoir un boss inoubliable',
    guide: [
      { h: '1. L’épithète de terreur', p: 'Associez un titre de ruine (« le Briseur d’Âmes », « l’Éternel Banni ») à un prénom guttural.' },
      { h: '2. L’évocation de son élément', p: 'Le givre, le sang, l’éther ou le néant doivent transparaître dans les syllabes.' },
    ],
    cardsTitle: 'Idéal pour',
    cards: [
      { icon: '💀', h: 'Raids & Donjons MMORPG', p: 'Le boss de palier qui marque des années de souvenirs de guilde.' },
      { icon: '⚔️', h: 'Campagnes JDR & JdR solo', p: 'Le grand antagoniste final poursuivi pendant des mois de quête.' },
      { icon: '🎮', h: 'Jeux Vidéo Indépendants', p: 'Nommez les boss de chapitres avec une aura terrifiante.' },
    ],
    faqTitle: 'FAQ Boss de jeu',
    faq: [{ q: 'Sont-ils adaptés aux jeux de plateau ?', a: 'Totalement, ils apportent un lore immersif dès l’ouverture de la boîte.' }],
    footer: 'Faites trembler vos aventuriers.',
  },

  // 3. WEAPON
  weapon: {
    id: 'weapon',
    title: 'Générateur d’Armes Légendaires & Artefacts',
    shortTitle: 'Armes & Artefacts',
    icon: '🗡️',
    badge: 'FORGE DES RELIQUES',
    h1a: 'Générateur d’Armes',
    h1b: 'Légendaires & Artefacts',
    description: 'Lames gravées de runes anciennes, arcs solaires et artefacts divins prêts à forger le destin des héros.',
    generatorTitle: 'Acier Runique & Reliques Forgées',
    generatorSubtitle: 'Noms poétiques et tranchants pour lames ancestrales et boucliers sacrées.',
    category: 'fantasy',
    advantages: ['Grande poésie héroïque', 'Impact direct dans la description d’inventaire', 'Polyvalent : épées, arcs, marteaux, reliques'],
    limits: ['Moins adapté aux armes blanches contemporaines réalistes'],
    guideTitle: 'L’art de baptiser une arme légendaire',
    guide: [
      { h: 'Le verbe ou le souffle', p: 'Les meilleures armes évoquent une action définitive : Fendoir, Tranche-Nuit, Chante-Mort.' },
      { h: 'Le matériau céleste', p: 'Faites écho au mithril, à l’ambre solaire ou au fer stellaire.' },
    ],
    cardsTitle: 'Usages recommandés',
    cards: [
      { icon: '⚔️', h: 'Loot & Tables de trésor JDR', p: 'Récompensez vos joueurs avec des armes dont le nom fait rêver.' },
      { icon: '📖', h: 'Romans de Fantasy', p: 'L’épée héritée du roi défunt qui traverse les générations.' },
      { icon: '🛡️', h: 'Arbres de compétences de RPG', p: 'Nommez les pièces d’équipement légendaires et reliques divines.' },
    ],
    faqTitle: 'Questions sur les armes mythiques',
    faq: [{ q: 'Les noms conviennent-ils aux armes de science-fiction ?', a: 'Oui, les styles plasma et prototypes énergétiques couvrent la sci-fi.' }],
    footer: 'Forgez l’acier de la légende.',
  },

  // 4. SPELL
  spell: {
    id: 'spell',
    title: 'Générateur de Sorts & Magie Arcanique',
    shortTitle: 'Sorts & Magie',
    icon: '🔮',
    badge: 'GRIMOIRE DES ARCANES',
    h1a: 'Générateur de Sorts &',
    h1b: 'Incantations Magiques',
    description: 'Rituels occultes, météores flamboyants, soins divins et miroirs temporels pour vos grimoires et systèmes de magie.',
    generatorTitle: 'Paroles de Puissance & Miroir des Éléments',
    generatorSubtitle: 'Incantations mélodiques, formules mystiques et conjurations élémentaires.',
    category: 'fantasy',
    advantages: ['Harmonie phonétique mystique', 'Adapté aux 8 écoles de magie D&D', 'Clarté de l’effet invoqué'],
    limits: ['Très axé sur le registre ésotérique et arcanique'],
    guideTitle: 'Comment structurer une formule magique ?',
    guide: [
      { h: '1. L’élément et le vecteur', p: 'Combinez la matière (Flamme, Givre, Foudre) avec sa propagation (Onde, Lance, Vole).' },
      { h: '2. L’auteur de la formule', p: 'Accoler le nom d’un mage illustre (« le Rayon de Velkiel ») ajoute une profondeur historique.' },
    ],
    cardsTitle: 'Applications',
    cards: [
      { icon: '📜', h: 'Grimoires de JDR', p: 'Complétez les listes de sorts de sorciers, druides et clercs.' },
      { icon: '✨', h: 'Systèmes de magie de roman', p: 'Établissez des conventions magiques crédibles pour votre lore.' },
      { icon: '🎮', h: 'Jeux Vidéo & Cartes TCG', p: 'Titres évocateurs pour vos cartes de sorts et compétences ultimes.' },
    ],
    faqTitle: 'FAQ Magie & Arcanes',
    faq: [{ q: 'Peut-on générer des malédictions sombres ?', a: 'Oui, le filtre de style Nécromancie produit des sorts funestes.' }],
    footer: 'Que la trame magique réponde à votre appel.',
  },

  // 5. TAVERN
  tavern: {
    id: 'tavern',
    title: 'Générateur d’Auberges & Lieux de Rencontre',
    shortTitle: 'Auberge & Taverne',
    icon: '🍺',
    badge: 'HALTES & CANTINAS',
    h1a: 'Générateur de Noms d’',
    h1b: 'Auberges & Tavernes',
    description: 'Enseignes chaleureuses, tripots de contrebandiers et cantinas spatiales où démarrent les plus grandes quêtes.',
    generatorTitle: 'Le Repaire du Voyageur & Chopes d’Ambre',
    generatorSubtitle: 'Enseignes à double nom pittoresques, rumeurs de comptoir et haltes conviviales.',
    category: 'fantasy',
    advantages: ['Convivialité immédiate', 'Formules « L’Animal et l’Objet » traditionnelles', 'Idéal pour démarrer une aventure'],
    limits: ['Spécifique aux débits de boisson, relais et auberges'],
    guideTitle: 'La tradition des enseignes médiévales',
    guide: [
      { h: 'L’association pittoresque', p: 'Associer une créature à un ustensile (« Le Dragon Boiteux », « La Chope d’Argent ») est la clé.' },
      { h: 'L’atmosphère du quartier', p: 'Une taverne portuaire aura des relents de sel et de kraken, celle des nobles des dorures et des cygnes.' },
    ],
    cardsTitle: 'Idéal pour',
    cards: [
      { icon: '🗺️', h: 'Points de départ JDR', p: 'Le célèbre « Vous vous retrouvez dans une taverne animée... » avec du caractère.' },
      { icon: '⚓', h: 'Ports & Cités Franches', p: 'Lieux de recel, guets-apens et négociations secrètes.' },
      { icon: '🚀', h: 'Cantinas Cyberpunk & Sci-Fi', p: 'Bars enfumés de stations spatiales et tripots néon.' },
    ],
    faqTitle: 'FAQ Enseignes',
    faq: [{ q: 'Y a-t-il des enseignes humoristiques ?', a: 'Oui, l’archétype pittoresque propose des alliances savoureuses.' }],
    footer: 'Prenez une table près de l’âtre.',
  },

  // 6. DUNGEON
  dungeon: {
    id: 'dungeon',
    title: 'Générateur de Donjons & Cryptes Oubliées',
    shortTitle: 'Donjon & Crypte',
    icon: '🏰',
    badge: 'LABYRINTHES & RUINES',
    h1a: 'Générateur de Donjons &',
    h1b: 'Cryptes Ancestrales',
    description: 'Gouffres sans fond, mausolées hantés et forteresses englouties regorgeant de pièges et de trésors perdus.',
    generatorTitle: 'Ombres Souterraines & Pierres Maudites',
    generatorSubtitle: 'Toponymie funeste et labyrinthes titanesques pour explorateurs intrépides.',
    category: 'fantasy',
    advantages: ['Sens du mystère et du danger', 'Évocation immédiate de l’architecture souterraine', 'Parfait pour cartographes de JDR'],
    limits: ['Marqué par l’obscurité et les périls souterrains'],
    guideTitle: 'Nommer un donjon mémorable',
    guide: [
      { h: 'La cause de l’abandon', p: 'Le nom doit suggérer pourquoi le lieu est maudit ou déserté (fléau, siège, folie).' },
      { h: 'Le relief géologique', p: 'Abîme, Gouffre, Crypte, Ossuaire précisent la géographie du site.' },
    ],
    cardsTitle: 'Applications',
    cards: [
      { icon: '🧭', h: 'Donjon Crawlers & D&D', p: 'Donnez un nom glaçant au complexe exploré case par case par vos joueurs.' },
      { icon: '📜', h: 'Cartes Anciennes de Fantasy', p: 'Remplissez les zones inexplorées de votre carte avec des ruines légendaires.' },
      { icon: '🎮', h: 'Jeux Vidéo Roguelike', p: 'Nommez les biomes et étages procéduraux de votre aventure.' },
    ],
    faqTitle: 'FAQ Donjons',
    faq: [{ q: 'Convient-il pour des installations sci-fi abandonnées ?', a: 'Oui, avec les styles Complexes Technologiques et Bunkers secrets.' }],
    footer: 'Allumez votre torche et descendez.',
  },

  // 7. STARSHIP
  starship: {
    id: 'starship',
    title: 'Générateur de Vaisseaux Spatiaux & Flottes',
    shortTitle: 'Vaisseau Spatial',
    icon: '🚀',
    badge: 'FLOTTES STELLAIRES',
    h1a: 'Générateur de Noms de',
    h1b: 'Vaisseaux Spatiaux',
    description: 'Croiseurs d’assaut, frégates d’exploration, cargos intergalactiques et chasseurs stellaires pour la conquête du cosmos.',
    generatorTitle: 'Sillages d’Étoiles & Blindage Composite',
    generatorSubtitle: 'Noms majestueux inspirés de l’astronomie, de la mythologie et de l’aéronautique militaire.',
    category: 'creative',
    advantages: ['Prestiges naval et spatial', 'Préfixes de registre d’immatriculation (USS, SS, Icarus)', 'Parfait pour space-operas'],
    limits: ['Spécifique aux technologies spatiales et maritimes de pointe'],
    guideTitle: 'Concevoir un baptême naval interstellaire',
    guide: [
      { h: 'Le rôle tactique du navire', p: 'Un vaisseau scientifique portera un nom d’idéal ou d’astronome, un cuirassé un nom de vertu martiale.' },
      { h: 'L’immatriculation', p: 'Associer un sigle de corporation ou de fédération amplifie le réalisme.' },
    ],
    cardsTitle: 'Recommandé pour',
    cards: [
      { icon: '🌌', h: 'Romans Space-Opera', p: 'Le vaisseau-mère emblématique de votre saga galactique.' },
      { icon: '🕹️', h: 'Simulateurs Spatiaux & RPG', p: 'Baptisez votre navire personnel dans Starfield, Elite ou No Man’s Sky.' },
      { icon: '🎲', h: 'JDR de Science-Fiction', p: 'Donnez une âme à la carcasse de tôle qui sert de foyer à votre équipage.' },
    ],
    faqTitle: 'FAQ Flottes',
    faq: [{ q: 'Y a-t-il des noms de flottes pirates ?', a: 'Oui, l’archétype Corsaires de l’Espace produit des noms rebelles et menaçants.' }],
    footer: 'Cap vers les confins de la galaxie.',
  },

  // 8. MECHA
  mecha: {
    id: 'mecha',
    title: 'Générateur de Mechas & Titans Robotiques',
    shortTitle: 'Mecha & Titan',
    icon: '🤖',
    badge: 'COLOSSES DE MÉTAL',
    h1a: 'Générateur de Mechas &',
    h1b: 'Titans Robotiques',
    description: 'Armures assistées, mechas bipèdes de première ligne, prototypes expérimentaux et colosses orbitaux.',
    generatorTitle: 'Blindage Lourd & Réacteurs à Fusion',
    generatorSubtitle: 'Noms tranchants évoquant puissance hydraulique, désignations militaires et légendes mécanisées.',
    category: 'creative',
    advantages: ['Codes tactiques et surnoms militaires', 'Idéal pour science-fiction militaire et anime mecha', 'Énergie cinétique puissante'],
    limits: ['Très marqué robotique lourde et armement cinétique'],
    guideTitle: 'Comment baptiser un colosse mécha ?',
    guide: [
      { h: 'Le code matricule et le nom de baptême', p: 'Associez un code alphanumérique (« MK-IV ») à un nom de fauve ou de divinité.' },
      { h: 'Le gabarit du châssis', p: 'Les unités légères de reconnaissance porteront des noms d’oiseaux ou de vent, les colosses des noms de monts ou de dieux de la guerre.' },
    ],
    cardsTitle: 'Idéal pour',
    cards: [
      { icon: '🛡️', h: 'Jeux de Mecha (Armored Core, Battletech)', p: 'Pour vos builds personnalisés et escadrons d’élite.' },
      { icon: '🎨', h: 'Webtoons & Anime Sci-Fi', p: 'Le mecha piloté par le protagoniste lors de la guerre planétaire.' },
      { icon: '🎲', h: 'Jeux de Figurines & Wargames', p: 'Baptisez vos pièces maîtresses d’infanterie lourde.' },
    ],
    faqTitle: 'FAQ Mecha',
    faq: [{ q: 'Convient-il pour les exosquelettes de super-héros ?', a: 'Parfaitement, notamment via le style Armure Assistée Prototype.' }],
    footer: 'Systèmes armés, réacteur enclenché.',
  },

  // 9. CYBERPUNK
  cyberpunk: {
    id: 'cyberpunk',
    title: 'Générateur d’Identités & Cités Cyberpunk',
    shortTitle: 'Cyberpunk',
    icon: '🕶️',
    badge: 'HIGH-TECH LOW-LIFE',
    h1a: 'Générateur Cyberpunk &',
    h1b: 'Ruelles Néon',
    description: 'Alleys sombres, mégacorporations omnipotentes, hackers de la matrice et mercenaires augmentés au chrome.',
    generatorTitle: 'Chrome Brisé, Néons & Réseau Noir',
    generatorSubtitle: 'Noms percutants mêlant haute technologie, jargon de rue et désillusions dystopiques.',
    category: 'creative',
    advantages: ['Immersion dystopique immédiate', 'Mélange anglo-nippon authentique au genre', 'Sonorités sales et futuristes'],
    limits: ['Esthétique très spécifique au genre cyberpunk et dystopies technologiques'],
    guideTitle: 'Les règles de la rue cybernétique',
    guide: [
      { h: 'L’argot du chrome', p: 'Glissez des termes d’implants, de réseaux (« Data », « Syn », « Wire », « Ghost »).' },
      { h: 'Le contraste mégacorpo vs rue', p: 'Une corpo adopte un nom propre et glacial, un runner un pseudonyme éphémère de terminal.' },
    ],
    cardsTitle: 'Scénarios Recommandés',
    cards: [
      { icon: '🌆', h: 'Cyberpunk 2077 & Shadowrun', p: 'Pseudos de netrunners, fixers, bars clandestins et mégacorporations.' },
      { icon: '💻', h: 'Thrillers Techno & Romans', p: 'Donnez un nom crédible aux intelligences artificielles renégates et virus matriciels.' },
      { icon: '🕹️', h: 'Jeux Indépendants Néo-Rétro', p: 'Titres de niveaux, armes chromées et factions urbaines.' },
    ],
    faqTitle: 'FAQ Cyberpunk',
    faq: [{ q: 'Y a-t-il des noms de corporations ?', a: 'Oui, l’archétype Mégacorporations produit des conglomérats glacials.' }],
    footer: 'Ne faites confiance à personne sur le réseau.',
  },

  // 10. STEAMPUNK
  steampunk: {
    id: 'steampunk',
    title: 'Générateur Steampunk & Cités Rétro-Futuristes',
    shortTitle: 'Steampunk',
    icon: '⚙️',
    badge: 'ROUAGUES & VAPEUR',
    h1a: 'Générateur Steampunk &',
    h1b: 'Machines à Vapeur',
    description: 'Dirigeables cuivrés, académies d’inventeurs victoriennes, automates à engrenages et brevets alchimiques.',
    generatorTitle: 'Vapeur Haute Pression & Cuivre Ciselé',
    generatorSubtitle: 'Élégance de l’ère victorienne, science romantique et rouages complexes.',
    category: 'creative',
    advantages: ['Charme anachronique victorien', 'Alliances de cuivre, laiton et vapeur', 'Parfait pour l’uchronie et la fantasy industrielle'],
    limits: ['Ne s’applique pas aux univers futuristes laser ou ultra-modernes'],
    guideTitle: 'Baptiser une invention steampunk',
    guide: [
      { h: 'Le brevet et le patronyme', p: 'Associer un nom d’ingénieur distingué à un mécanisme (« Le Différentiel de Sterling »).' },
      { h: 'Les métaux nobles de l’industrie', p: 'Bronze, Laiton, Cuivre et Vapeur insufflent le charme mécanique.' },
    ],
    cardsTitle: 'Applications',
    cards: [
      { icon: '🎩', h: 'Romans Uchroniques & Aventures', p: 'Nommez les zeppelins majestueux qui sillonnent le ciel victorien.' },
      { icon: '⚙️', h: 'JDR Steampunk & Horloge', p: 'Ateliers clandestins d’horlogers et automates intelligents.' },
      { icon: '🎪', h: 'Événements & Cosplay', p: 'Trouvez un nom d’aventurier dandy ou d’inventeur fou pour votre costume.' },
    ],
    faqTitle: 'FAQ Steampunk',
    faq: [{ q: 'Peut-on nommer des dirigeables ?', a: 'Absolument, les vaisseaux aériens à vapeur sont l’un des styles phares.' }],
    footer: 'Réglez vos montres à gousset.',
  },

  // 11. ALIEN_SPECIES
  alien_species: {
    id: 'alien_species',
    title: 'Générateur d’Espèces Aliens & Mondes Lointains',
    shortTitle: 'Espèces Aliens',
    icon: '👽',
    badge: 'XÉNOBIOLOGIE STELLAIRE',
    h1a: 'Générateur d’Espèces',
    h1b: 'Aliens & Xénomorphes',
    description: 'Civilisations stellaires avancées, essaims insectoïdes, entités plasmiques et prédateurs d’exoplanètes.',
    generatorTitle: 'Exobiologie & Premiers Contacts',
    generatorSubtitle: 'Phonétique non-humaine, cliquetis xénobiologiques et consonances stellaires.',
    category: 'creative',
    advantages: ['Altérité phonétique marquée', 'Évite les stéréotypes humains', 'Idéal pour le worldbuilding d’exoplanètes'],
    limits: ['Prononciation volontairement singulière pour marquer la xénobiologie'],
    guideTitle: 'Créer un peuple extraterrestre crédible',
    guide: [
      { h: 'La physiologie vocale de l’espèce', p: 'Une espèce reptilienne aura des sibilantes (S, Z, X), un essaim des consonnes gutturales et claquées.' },
      { h: 'La structure sociale', p: 'Les entités d’essaim n’ont pas de prénoms individuels mais des désignations de caste.' },
    ],
    cardsTitle: 'Applications',
    cards: [
      { icon: '🛸', h: 'Sagas d’Exploration Spatiale', p: 'Peuplez vos quadrants stellaires d’espèces aux coutumes fascinantes.' },
      { icon: '🎮', h: 'Jeux 4X & Stratégie Galactique', p: 'Nommez les factions jouables de votre prochain jeu spatial (Stellaris, Master of Orion).' },
      { icon: '🧪', h: 'JDR Scientifique & Premier Contact', p: 'L’inconnu complet face à une intelligence radicalement différente.' },
    ],
    faqTitle: 'FAQ Xénobiologie',
    faq: [{ q: 'Y a-t-il des espèces amicales et diplomatiques ?', a: 'Oui, l’archétype Civilisation Céleste génère des sonorités douces et philosophiques.' }],
    footer: 'Nous ne sommes plus seuls.',
  },

  // 12. MYTHIC_CREATURE
  mythic_creature: {
    id: 'mythic_creature',
    title: 'Générateur de Créatures Mythiques & Chimères',
    shortTitle: 'Bêtes Mythiques',
    icon: '🦄',
    badge: 'BESTIAIRE ANCESTRAL',
    h1a: 'Générateur de Créatures',
    h1b: 'Mythiques & Chimères',
    description: 'Bêtes sacrées, léviathans des profondeurs, gardiens de forêts millénaires et chimères spectrales.',
    generatorTitle: 'Le Bestiaire Fabuleux des Origines',
    generatorSubtitle: 'Racines folkloriques, échos gréco-nordiques et résonances animales magiques.',
    category: 'fantasy',
    advantages: ['Évocation immédiate de la silhouette de la bête', 'Richesse folklorique ancestrale', 'Idéal pour monstres de légende'],
    limits: ['Moins adapté aux animaux réels de compagnie ordinaire'],
    guideTitle: 'L’art du bestiaire fantastique',
    guide: [
      { h: 'La fusion chimérique', p: 'Associez deux règnes (plume et écaille, corne et ombre) pour éveiller l’imagination.' },
      { h: 'Le rôle mythologique', p: 'Est-ce un protecteur bienveillant ou une calamité venue punir les mortels ?' },
    ],
    cardsTitle: 'Idéal pour',
    cards: [
      { icon: '🐾', h: 'Bestiaires de Campagne JDR', p: 'Complétez votre manuel des monstres avec des créatures inédites.' },
      { icon: '📚', h: 'Contes & Récits Mythologiques', p: 'La bête sacrée que les chevaliers doivent amadouer ou vaincre.' },
      { icon: '🎴', h: 'Jeux de Cartes de Monstres', p: 'Noms accrocheurs pour vos cartes d’invocation et familiers de combat.' },
    ],
    faqTitle: 'FAQ Bestiaire',
    faq: [{ q: 'Convient-il aux familiers de mages ?', a: 'Tout à fait, le style Esprit Gardien est parfait pour les compagnons magiques.' }],
    footer: 'Écoutez le rugissement de la forêt.',
  },

  // 13. CRYPTO_TOKEN
  crypto_token: {
    id: 'crypto_token',
    title: 'Générateur de Tokens Crypto & Web3',
    shortTitle: 'Crypto & Tokens',
    icon: '🪙',
    badge: 'FINANCE DÉCENTRALISÉE',
    h1a: 'Générateur de Tokens &',
    h1b: 'Projets Crypto Web3',
    description: 'Tickers percutants (3-5 lettres), protocoles DeFi, tokens utilitaires, réseaux Layer 2 et DAOs communautaires.',
    generatorTitle: 'Livre Ouvert, Tickers & Protocoles',
    generatorSubtitle: 'Désignations courtes, modernes et prêtes pour CoinMarketCap et Uniswap.',
    category: 'innovation',
    advantages: ['Génération automatique du Ticker boursier ($TICK)', 'Modernité technologique évidente', 'Adapté aux smart contracts'],
    limits: ['Vérifiez la disponibilité sur GitHub, CoinGecko et Twitter avant lancement'],
    guideTitle: 'Choisir une identité Web3 viable',
    guide: [
      { h: 'Le Ticker mémorable', p: 'Un ticker de 3 à 4 lettres majuscules ($ETH, $SOL, $AAVE) est le premier point de contact des traders.' },
      { h: 'La crédibilité technologique', p: 'Évitez les noms de pur hype si votre projet porte une innovation d’infrastructure réelle.' },
    ],
    cardsTitle: 'Applications',
    cards: [
      { icon: '📈', h: 'Protocoles DeFi & DApps', p: 'Identité solide pour protocoles de prêt, DEX et pools de liquidité.' },
      { icon: '🌐', h: 'Réseaux & Layer 2', p: 'Noms axés sur la vitesse, la scalabilité et la cryptographie.' },
      { icon: '💎', h: 'Tokens Utilitaires & Gaming Web3', p: 'Monnaie in-game décentralisée pour vos écosystèmes ludiques.' },
    ],
    faqTitle: 'FAQ Crypto & Web3',
    faq: [{ q: 'Fournit-il le ticker boursier ?', a: 'Oui, chaque nom est accompagné d’un symbole court suggéré.' }],
    footer: 'Forgez le futur décentralisé.',
  },

  // 14. SERVER_CLUSTER
  server_cluster: {
    id: 'server_cluster',
    title: 'Générateur de Noms de Serveurs & Clusters Cloud',
    shortTitle: 'Serveur & Cluster',
    icon: '🖥️',
    badge: 'INFRASTRUCTURE & CLOUD',
    h1a: 'Générateur de Serveurs &',
    h1b: 'Clusters Haute Dispo',
    description: 'Nœuds Kubernetes, clusters haute disponibilité, serveurs de production sécurisés et machines de calcul distribué.',
    generatorTitle: 'Nœuds de Calcul & Datacenters Sécurisés',
    generatorSubtitle: 'Conventions de nommage cohérentes basées sur les étoiles, les éléments et la cyber-défense.',
    category: 'innovation',
    advantages: ['Idéal pour conventions sysadmin et DevOps', 'Conventions de sous-domaines (prod, edge, db)', 'Mémorisation facile lors d’incidents'],
    limits: ['Orienté ingénierie système, infrastructure et architectures IT'],
    guideTitle: 'Les bonnes pratiques de nommage de serveurs',
    guide: [
      { h: 'La cohérence thématique', p: 'Nommer ses clusters selon une même mythologie (constellations, dieux celtes) facilite la navigation.' },
      { h: 'L’inclusion du rôle et de la zone', p: 'Combinez le nom poétique avec un indicateur d’environnement (-prod, -eu1).' },
    ],
    cardsTitle: 'Idéal pour',
    cards: [
      { icon: '☁️', h: 'Clusters Kubernetes & Docker', p: 'Nommez vos nœuds maîtres et workers avec élégance.' },
      { icon: '🔒', h: 'Serveurs d’Entreprise & Datacenters', p: 'Identifiez rapidement vos machines critiques en salle des serveurs.' },
      { icon: '🎮', h: 'Serveurs Dédiés de Jeux Multijoueurs', p: 'Noms prestigieux pour vos serveurs de communauté (Minecraft, Rust, Ark).' },
    ],
    faqTitle: 'FAQ Infrastructure',
    faq: [{ q: 'Peut-on utiliser ces noms en DNS ?', a: 'Absolument, ils respectent les normes d’adresses réseau (caractères alphanumériques).' }],
    footer: 'Uptime 99.999% garanti.',
  },

  // 15. OS_SYSTEM
  os_system: {
    id: 'os_system',
    title: 'Générateur de Systèmes d’Exploitation & Protocoles',
    shortTitle: 'OS & Protocole Tech',
    icon: '⚡',
    badge: 'NOYAUX & ARCHITECTURES',
    h1a: 'Générateur d’OS &',
    h1b: 'Protocoles Système',
    description: 'Distributions Linux épurées, micro-noyaux temps réel, protocoles de chiffrement et runtimes d’intelligence artificielle.',
    generatorTitle: 'Micro-noyaux, Runtimes & Protocoles',
    generatorSubtitle: 'Suffixes technologiques élégants (-ix, -os, -core) et racines minimalistes pour projets d’ingénierie logicielle.',
    category: 'innovation',
    advantages: ['Allure open-source et recherche académique', 'Forte crédibilité technique', 'Idéal sur GitHub et documentation d’API'],
    limits: ['Destiné aux logiciels système, langages et bibliothèques de base'],
    guideTitle: 'Comment baptiser un projet système ?',
    guide: [
      { h: 'La tradition UNIX et micro-noyaux', p: 'Les désinences en -ix, -os, -net sont universellement reconnues par les développeurs.' },
      { h: 'La promesse de performance', p: 'Évoquez la légèreté, la résilience ou la vitesse d’exécution.' },
    ],
    cardsTitle: 'Applications',
    cards: [
      { icon: '🐧', h: 'Distributions Linux & Noyaux', p: 'Baptisez votre projet de système d’exploitation ou distribution personnalisée.' },
      { icon: '📡', h: 'Protocoles Réseau & Chiffrement', p: 'Donnez un nom officiel à vos RFCs et spécifications techniques.' },
      { icon: '🧠', h: 'Moteurs & Frameworks d’IA', p: 'Identifiez votre runtime de calcul de tenseurs ou agent autonome.' },
    ],
    faqTitle: 'FAQ Systèmes',
    faq: [{ q: 'Ces noms sont-ils adaptés aux dépôts GitHub ?', a: 'Oui, ils forment d’excellents noms de répertoires courts et percutants.' }],
    footer: 'Compilez l’avenir de l’informatique.',
  },
};

export const GAMING_SYSTEMS_SUBCATEGORIES: Record<string, Record<string, SubcategoryData>> = {
  // GAMERTAG
  gamertag: {
    esport: {
      icon: '🏆',
      label: 'eSport Pro & Striker',
      bestFor: 'Joueurs compétitifs, snipers, duelistes et champions de tournois',
      prefixes: ['Vex', 'Kyo', 'Zyt', 'Apex', 'Rift', 'Nox', 'Kael', 'Zen', 'Velo', 'Aero', 'Fier', 'Stri', 'Kro', 'Taz', 'Raze'],
      suffixes: ['or', 'yx', 'en', 'ex', 'er', 'ix', 'al', 'ar', 'on', 'ic', 'ak', 'os', 'in', 'ax', 'ez'],
      descriptions: ['⚡ Un GamerTag ultra-percutant qui claque immédiatement au tableau des scores.'],
      titles: ['Pro', 'Aim', 'Prime', 'Apex', 'Clutch', 'Elite', 'God'],
      groupTypes: ['Team', 'Clan', 'Squad', 'eSports', 'Gaming'],
    },
    stealth: {
      icon: '🎯',
      label: 'Sniper & Ombre Furtive',
      bestFor: 'Snipers, assassins, infiltrateurs et joueurs furtifs',
      prefixes: ['Ghost', 'Shad', 'Wraith', 'Silent', 'Spect', 'Phantom', 'Dusk', 'Void', 'Noct', 'Mist'],
      suffixes: ['shot', 'hawk', 'eye', 'strike', 'wind', 'blade', 'fang', 'veil', 'wire', 'shade'],
      descriptions: ['🌑 Un pseudo glacial pour sniper invisible et joueur millimétré.'],
    },
    cyber: {
      icon: '👾',
      label: 'Cyber & Glitch',
      bestFor: 'Streamers tech, hackers de lobby et joueurs rétro-futuristes',
      prefixes: ['Byte', 'Pixel', 'Glitch', 'Cyber', 'Neon', 'Vapor', 'Zero', 'Chro', 'Synt', 'Kinet'],
      suffixes: ['core', 'bot', 'byte', 'link', 'sys', 'hack', 'bit', 'net', 'pulse', 'grid'],
      descriptions: ['🕹️ Une identité numérique moderne pensée pour le streaming et Discord.'],
    },
  },

  // BOSS
  boss: {
    void_lord: {
      icon: '🌑',
      label: 'Seigneur du Néant',
      bestFor: 'Antagonistes ultimes, entités d’annihilation et sorciers corrompus',
      prefixes: ['Mor', 'Mal', 'Vex', 'Zul', 'Nox', 'Khar', 'Drak', 'Bael', 'Azar', 'Gor', 'Vor', 'Kael', 'Xar'],
      suffixes: ['ok', 'gath', 'or', 'thul', 'zar', 'vash', 'khan', 'grim', 'rak', 'morn', 'drak', 'ash', 'gor'],
      descriptions: ['💀 Un seigneur funeste dont la seule évocation fait fuir les mortels.'],
      titles: ['le Dévoreur d’Âmes', 'le Fléau Éternel', 'l’Inflexible', 'le Souverain Corrompu', 'le Sans-Visage'],
      groupTypes: ['Ordre de', 'Légion de', 'Culte de'],
    },
    ancient_titan: {
      icon: '🌋',
      label: 'Titan Ancestral',
      bestFor: 'Colosses de pierre, wyrms telluriques et gardiens élémentaires millénaires',
      prefixes: ['Gron', 'Bront', 'Krag', 'Tor', 'Gol', 'Magn', 'Titan', 'Thal', 'Rok', 'Urz'],
      suffixes: ['or', 'oth', 'as', 'ur', 'on', 'um', 'rak', 'dor', 'kahn', 'os'],
      descriptions: ['🌋 Une force titanesque forgée aux premiers âges du monde.'],
      titles: ['Brise-Montagnes', 'le Réveillé', 'l’Indestructible', 'le Gardien Tellurique'],
    },
  },

  // WEAPON
  weapon: {
    blade: {
      icon: '🗡️',
      label: 'Lame Héroïque & Runique',
      bestFor: 'Épées longues, katanas runiques et dagues de maîtres',
      prefixes: ['Aero', 'Chante', 'Tranche', 'Bris', 'Brûle', 'Fend', 'Aube', 'Nuit', 'Éclair', 'Givre'],
      suffixes: ['lame', 'ciel', 'vent', 'fer', 'mort', 'rune', 'cœur', 'garde', 'croc', 'fléau'],
      descriptions: ['⚔️ Une lame forgée dans un métal légendaire capable de trancher l’acier et les sorts.'],
      titles: ['des Anciens', 'du Premier Roi', 'des Tempêtes', 'des Ombres', 'Céleste'],
    },
    artifact: {
      icon: '✨',
      label: 'Artefact Divin & Sceptre',
      bestFor: 'Reliques magiques, orbes arcaniques et sceptres souverains',
      prefixes: ['Sol', 'Astra', 'Ael', 'Lumi', 'Omni', 'Cosmo', 'Cael', 'Aeth', 'Divi', 'Arca'],
      suffixes: ['orbe', 'sceptre', 'calice', 'sceau', 'miroir', 'relique', 'couronne', 'anneau'],
      descriptions: ['🔮 Un artefact imprégné du souffle des déesses fondatrices.'],
    },
  },

  // SPELL
  spell: {
    arcane: {
      icon: '🔮',
      label: 'Arcanes & Cosmologie',
      bestFor: 'Sorts de téléportation, projectiles d’éther et distorsions temporelles',
      prefixes: ['Astra', 'Arca', 'Chrono', 'Éther', 'Cosmo', 'Nova', 'Penta', 'Velo', 'Cael', 'Flux'],
      suffixes: ['sphère', 'onde', 'trait', 'miroir', 'chute', 'barrière', 'faille', 'lance', 'vortex'],
      descriptions: ['✨ Une formule d’école arcanique supérieure enseignée dans les plus hautes académies.'],
      titles: ['Majeur', 'Suprême', 'd’Oblitération', 'des Étoiles', 'de Puissance'],
    },
    elemental: {
      icon: '🔥',
      label: 'Feu, Foudre & Givre',
      bestFor: 'Boules de feu, lances de foudre, blizzards et tremblements élémentaires',
      prefixes: ['Pyro', 'Cryo', 'Fulgur', 'Ignis', 'Glaci', 'Torren', 'Sismo', 'Tempest', 'Brasier'],
      suffixes: ['souffle', 'frappe', 'onde', 'tempête', 'colère', 'cataclysme', 'jaillissement', 'déluge'],
      descriptions: ['🔥 La fureur déchaînée d’un élément primaire pur.'],
    },
  },

  // TAVERN
  tavern: {
    cozy_inn: {
      icon: '🍺',
      label: 'Auberge Chaleureuse & Pittoresque',
      bestFor: 'Relais de route, auberges de village et haltes d’aventuriers',
      prefixes: ['Le Dragon', 'Le Cerf', 'La Chope', 'Le Poney', 'Le Sanglier', 'L’Épée', 'Le Griffon', 'La Lanterne', 'Le Corbeau'],
      suffixes: ['d’Or', 'Boiteux', 'Joyeux', 'Fringant', 'd’Argent', 'Brave', 'qui Chante', 'du Voyageur', 'Rieur'],
      descriptions: ['🍻 Un feu qui crépite, une bière fraîche et des rumeurs de donjons au comptoir.'],
    },
    smuggler: {
      icon: '⚓',
      label: 'Repaire & Tripot Portuaire',
      bestFor: 'Auberges de corsaires, docks brumeux et coupe-gorges',
      prefixes: ['L’Ancre', 'Le Kraken', 'Le Requin', 'Le Chacal', 'Le Tonneau', 'Le Gobelin', 'Le Sabre'],
      suffixes: ['Borgne', 'Ébréché', 'Rouillé', 'Noyé', 'Échoué', 'Sanguin', 'Fumé'],
      descriptions: ['⚓ Là où les contrebandiers négocient leurs butins loin des patrouilles.'],
    },
  },

  // DUNGEON
  dungeon: {
    catacomb: {
      icon: '💀',
      label: 'Cryptes & Catacombes',
      bestFor: 'Mausolées maudits, ossuaires et tombes de rois oubliés',
      prefixes: ['Crypte', 'Mausolée', 'Ossuaire', 'Tombeau', 'Nécropole', 'Caveau', 'Fosse'],
      suffixes: ['des Damnés', 'du Roi Déchu', 'des Ombres', 'de Cendres', 'des Silences', 'Oublié', 'Funeste'],
      descriptions: ['⚰️ Un lieu scellé il y a des siècles sous de lourdes dalles gravées de sceaux protecteurs.'],
    },
    abyss: {
      icon: '🕳️',
      label: 'Gouffres & Labyrinthes',
      bestFor: 'Failles titanesques, mines corrompues et citadelles englouties',
      prefixes: ['Gouffre', 'Abîme', 'Labyrinthe', 'Citadelle', 'Caverne', 'Gorge', 'Crevasse'],
      suffixes: ['d’Ébène', 'Sans Fond', 'du Dragon Noir', 'de la Peur', 'Éternel', 'Souterrain', 'de Braise'],
      descriptions: ['🌑 Un dédale obscur grouillant d’embuscades et de secrets interdits.'],
    },
  },

  // STARSHIP
  starship: {
    warship: {
      icon: '🚀',
      label: 'Cuirassé & Flotte Militaire',
      bestFor: 'Croiseurs d’assaut, destroyers et navires amiraux',
      prefixes: ['USS', 'SS', 'HMS', 'Vanguard', 'Dread', 'Titan', 'Iron', 'Apex', 'Nova', 'Aegis'],
      suffixes: ['Defiance', 'Valor', 'Glory', 'Tempest', 'Horizon', 'Vindicator', 'Invictus', 'Centurion', 'Sovereign'],
      descriptions: ['🛸 Un cuirassé lourd doté d’écrans déflecteurs de pointe et de canons à antimatière.'],
    },
    explorer: {
      icon: '🌌',
      label: 'Exploration & Fret Lointain',
      bestFor: 'Navires scientifiques, éclaireurs stellaires et vaisseaux marchands',
      prefixes: ['Pioneer', 'Endeavour', 'Voyager', 'Odyssey', 'Starlight', 'Celeste', 'Explorer', 'Pathfinder'],
      suffixes: ['Prime', 'One', 'Seven', 'Nova', 'Alpha', 'Infinity', 'Aurora', 'Dawn'],
      descriptions: ['✨ Conçu pour franchir les trous de ver et cartographier les bras inexplorés de la galaxie.'],
    },
  },

  // MECHA
  mecha: {
    heavy: {
      icon: '🤖',
      label: 'Mecha Lourd & Titan de Ligne',
      bestFor: 'Châssis bipèdes de siège, armures de combat colossales',
      prefixes: ['Goliath', 'Titan', 'Vanguard', 'Ares', 'Colossus', 'Iron', 'Brimstone', 'Odin', 'Mammoth'],
      suffixes: ['MK-I', 'MK-IV', 'Prime', 'Custom', 'Unit', 'Breaker', 'Juggernaut', 'Buster', 'Siege'],
      descriptions: ['⚙️ Un monstre de blindage multicouche capable d’encaisser des tirs d’artillerie lourde.'],
    },
    striker: {
      icon: '⚡',
      label: 'Unité Véloce & Prototype',
      bestFor: 'Mechas d’interception, duelistes légers et armures de voltige',
      prefixes: ['Strike', 'Falcon', 'Swift', 'Aero', 'Zephyr', 'Phantom', 'Mirage', 'Scythe', 'Raptor'],
      suffixes: ['X', 'Custom', 'Zero', 'Kai', 'Dash', 'Wing', 'Ghost', 'Blade'],
      descriptions: ['⚡ Propulseurs verticaux haute cadence pour manœuvres d’évitement supersoniques.'],
    },
  },

  // CYBERPUNK
  cyberpunk: {
    netrunner: {
      icon: '🕶️',
      label: 'Mercenaires & Netrunners',
      bestFor: 'Pseudos de hackers, runners du bitume et pistoleros augmentés',
      prefixes: ['Zero', 'Glitch', 'Kiro', 'Neon', 'Chrome', 'Wire', 'Spike', 'Ghost', 'Syn', 'Vex', 'Pulse'],
      suffixes: ['lock', 'runner', 'drive', 'byte', 'blade', 'wire', 'jack', 'deck', 'punk', 'shift'],
      descriptions: ['🕶️ Une réputation forgée dans les bas-fonds de Night City et sur les terminaux de glace noire.'],
    },
    megacorp: {
      icon: '🏢',
      label: 'Mégacorporations',
      bestFor: 'Conglomérats glacials, fabricants d’implants et cartels pharmaceutiques',
      prefixes: ['Arasa', 'Militech', 'Omni', 'Neuro', 'Bio', 'Synt', 'Kinet', 'Hyper', 'Zeta', 'Apex'],
      suffixes: ['corp', 'tech', 'dine', 'ceuticals', 'systems', 'global', 'dynamics', 'industries'],
      descriptions: ['🌐 Une corporation tentaculaire qui contrôle l’eau, le réseau et les gouvernements.'],
    },
  },

  // STEAMPUNK
  steampunk: {
    airship: {
      icon: '🎈',
      label: 'Dirigeables & Aéronefs',
      bestFor: 'Zeppelins cuivrés, flottes royales aériennes et corsaires des nuages',
      prefixes: ['L’Aéro', 'Le Céleste', 'L’Impérial', 'Le Victoria', 'L’Albatros', 'Le Zéphyr', 'Le Nautilus', 'L’Horloger'],
      suffixes: ['d’Airain', 'des Nuées', 'à Vapeur', 'Volant', 'de Laiton', 'Mécanique', 'Invincible', 'du Ciel'],
      descriptions: ['🎈 Un vaisseau majestueux gonflé d’hélium fendant les nuages au son de ses pistons.'],
    },
    clockwork: {
      icon: '⚙️',
      label: 'Automates & Machines Victoriennes',
      bestFor: 'Automates d’échecs, différences logiques et générateurs à charbon',
      prefixes: ['Le Chrono', 'L’Engrenage', 'Le Piston', 'Le Régulateur', 'L’Alchimiste', 'Le Balancier'],
      suffixes: ['de Babbage', 'de Lovelace', 'Perpétuel', 'de Sterling', 'de Watt', 'à Ressort'],
      descriptions: ['⚙️ Des milliers d’engrenages minutieusement calibrés pour une précision absolue.'],
    },
  },

  // ALIEN_SPECIES
  alien_species: {
    hivemind: {
      icon: '🦗',
      label: 'Essaim Xénomorphe & Biologique',
      bestFor: 'Ruches stellaires, créatures biomécaniques et prédateurs d’exoplanètes',
      prefixes: ['Xen', 'Kry', 'Zor', 'Gla', 'Vrak', 'Chit', 'Ska', 'Zyx', 'Kra', 'Vor'],
      suffixes: ['id', 'ath', 'or', 'ax', 'ith', 'on', 'rak', 'khor', 'vash', 'is'],
      descriptions: ['👽 Une espèce mue par une conscience collective impitoyable et une adaptabilité biologique totale.'],
    },
    ascended: {
      icon: '✨',
      label: 'Civilisation Céleste & Éthérée',
      bestFor: 'Êtres de pure énergie, anciens navigateurs cosmiques et diplomates stellaires',
      prefixes: ['Ael', 'Orix', 'Cael', 'Xylo', 'Astral', 'Lumi', 'Erid', 'Solv', 'Vesper'],
      suffixes: ['ian', 'ari', 'el', 'aen', 'on', 'iis', 'ora', 'um', 'ea'],
      descriptions: ['🌌 Une civilisation millénaire qui a dépassé le plan matériel pour voyager parmi les nébuleuses.'],
    },
  },

  // MYTHIC_CREATURE
  mythic_creature: {
    chimera: {
      icon: '🦁',
      label: 'Chimères & Monstres Colossaux',
      bestFor: 'Bêtes fabuleuses, léviathans marins et gardiens de sanctuaires',
      prefixes: ['Pég', 'Gryf', 'Chim', 'Lév', 'Basili', 'Cér', 'Hydr', 'Manti', 'Sphin', 'Wyv'],
      suffixes: ['or', 'ion', 'us', 'as', 'anth', 'cor', 'eon', 'oth', 'rak', 'al'],
      descriptions: ['🦁 Une créature légendaire née de l’union des bêtes souveraines et des enchantements oubliés.'],
    },
  },

  // CRYPTO_TOKEN
  crypto_token: {
    defi: {
      icon: '🪙',
      label: 'Protocole DeFi & Ticker',
      bestFor: 'Tokens de gouvernance, stablecoins algorithmiques et yield farming',
      prefixes: ['Aera', 'Velo', 'Synt', 'Kinet', 'Aura', 'Zeta', 'Omni', 'Hyper', 'Nova', 'Pulse'],
      suffixes: ['Fi', 'Swap', 'Chain', 'Dex', 'Protocol', 'Dao', 'Net', 'Lend', 'Yield'],
      descriptions: ['🪙 Un actif liquide avec tokenomique déflationniste et utilité on-chain.'],
      titles: ['$VELO', '$AERA', '$SYNT', '$AURA', '$PULS', '$ZETA', '$OMNI'],
    },
  },

  // SERVER_CLUSTER
  server_cluster: {
    datacenter: {
      icon: '🖥️',
      label: 'Cluster Haute Disponibilité',
      bestFor: 'Nœuds Kubernetes, clusters de bases de données et datacenters',
      prefixes: ['Atlas', 'Orion', 'Polaris', 'Zeus', 'Titan', 'Hyperion', 'Aegis', 'Nexus', 'Prometheus'],
      suffixes: ['Node-01', 'Master', 'Cluster', 'Vault', 'Core', 'Edge', 'Gateway', 'Proxy', 'Primary'],
      descriptions: ['🖥️ Machine haute disponibilité avec tolérance aux pannes et réplication continue.'],
    },
  },

  // OS_SYSTEM
  os_system: {
    kernel: {
      icon: '⚡',
      label: 'Noyaux & Systèmes d’Exploitation',
      bestFor: 'Micro-noyaux, distributions UNIX et runtimes de calcul',
      prefixes: ['Aero', 'Zephyr', 'Nova', 'Quantum', 'Syn', 'Omni', 'Apex', 'Velo', 'Kinet', 'Flux'],
      suffixes: ['ix', 'OS', 'Core', 'Net', 'RTOS', 'Linux', 'BSD', 'Kernel', 'Flow'],
      descriptions: ['⚡ Architecture système minimaliste conçue pour la faible latence et la sécurité mémoire.'],
    },
  },
};
