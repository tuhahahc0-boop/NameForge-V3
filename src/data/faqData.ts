export interface FAQItem {
  q: string;
  a: string;
  category: 'general' | 'features' | 'legal' | 'technical';
}

export const COMPREHENSIVE_FAQ_LIST: FAQItem[] = [
  {
    category: 'general',
    q: 'Comment fonctionne un générateur de noms comme NameForge ?',
    a: 'NameForge combine des racines linguistiques, des syllabes harmonieuses et des règles morphologiques spécifiques à chaque univers (fantasy, tech, branding, récits). Contrairement aux générateurs aléatoires basiques qui produisent des suites de lettres imprononçables, notre moteur linguistique évalue le rythme, la prononciation et la pertinence thématique de chaque proposition.',
  },
  {
    category: 'general',
    q: 'Comment choisir un nom véritablement adapté à mon projet ?',
    a: 'Définissez d’abord votre tonalité (prestigieuse, tranchante, mystérieuse, conviviale). Testez la prononciation à voix haute : un nom percutant se retient après une seule écoute. Assurez-vous que la longueur est adaptée à vos supports (par exemple court pour une application mobile, ou plus évocateur pour une saga littéraire).',
  },
  {
    category: 'general',
    q: 'Comment créer un nom original et mémorable ?',
    a: 'Privilégiez les associations inattendues de syllabes ou les mots-valises légers. Évitez les clichés usés jusqu’à la corde et les suites de chiffres inutiles. Utilisez l’option de longueur « Court » pour des créations tranchantes et « Moyen » pour un équilibre parfait.',
  },
  {
    category: 'general',
    q: 'Comment éviter les noms trop similaires entre deux générations ?',
    a: 'NameForge intègre un bouclier anti-répétition : les 100 derniers noms générés sont placés dans une mémoire glissante locale. Lors d’une nouvelle session, le moteur écarte ces propositions récentes pour vous offrir des combinaisons fraîches et diversifiées.',
  },
  {
    category: 'features',
    q: 'Puis-je générer des noms dans plusieurs langues et sonorités ?',
    a: 'Oui ! Chaque générateur dispose d’un sélecteur dédié « Langue de génération » (Français, Anglais, Japonais/Anime, Arabe/Oriental, Latin/Elfe, Nordique, Tech). Cela modifie les racines phonétiques utilisées sans changer la langue de l’interface du site.',
  },
  {
    category: 'features',
    q: 'Comment fonctionne le choix de style et de longueur ?',
    a: 'La longueur influence directement la structure morphologique : « Court » produit 1 à 2 syllabes percutantes, « Moyen » offre 2 à 3 syllabes équilibrées, et « Long » génère des noms composés ou narratifs. Le style ajuste les sonorités dominantes et l’archétype voulu.',
  },
  {
    category: 'features',
    q: 'Comment copier, enregistrer et retrouver mes noms ?',
    a: 'Chaque carte de nom dispose d’un bouton « Copier » en un clic, d’un bouton « Enregistrer » pour l’ajouter à vos favoris, et d’un bouton « J’aime ». Retrouvez tous vos noms sélectionnés dans l’espace « Mes Noms » accessible depuis la barre de navigation.',
  },
  {
    category: 'features',
    q: 'Comment fonctionnent les favoris, les collections et les notes privées ?',
    a: 'Dans « Mes Noms », vous pouvez créer des dossiers thématiques (collections personnalisées) pour regrouper vos noms par projet. Vous pouvez également rédiger des notes privées sur chaque nom pour vous souvenir d’une idée ou d’un rôle précis.',
  },
  {
    category: 'features',
    q: 'Comment sont calculées les étoiles et le classement des meilleurs noms ?',
    a: 'Vous pouvez attribuer de 1 à 5 étoiles à chaque proposition. Le classement des meilleurs noms met en avant les créations les mieux notées dans votre espace de travail, enrichi des pépites phares de la forge, sans inventer de faux votes fictifs.',
  },
  {
    category: 'features',
    q: 'Puis-je exporter ou importer mes listes de noms ?',
    a: 'Oui. Dans « Mes Noms », vous pouvez exporter l’intégralité de vos sauvegardes en fichier JSON (sauvegarde complète avec notes et collections) ou en fichier CSV (tableur). Vous pouvez également restaurer une sauvegarde JSON antérieure en toute sécurité.',
  },
  {
    category: 'technical',
    q: 'Mes données personnelles sont-elles conservées sur mon appareil ?',
    a: 'Absolument. NameForge fonctionne selon une architecture 100% locale : aucun compte utilisateur n’est requis, aucun mot de passe n’est demandé, et vos noms sauvegardés, notes et préférences restent strictement confinés dans la mémoire de votre navigateur.',
  },
  {
    category: 'technical',
    q: 'Les noms générés sont-ils garantis uniques au monde ?',
    a: 'Le moteur combine des milliers de racines pour produire des millions de combinaisons rares. Toutefois, aucune plateforme algorithmique ne peut prétendre à l’unicité absolue mondiale, certains mots pouvant exister par hasard dans d’autres langues.',
  },
  {
    category: 'legal',
    q: 'Puis-je utiliser un nom généré pour mon entreprise ou mon produit ?',
    a: 'Oui, les propositions sont générées sans redevance pour votre usage créatif. Cependant, vous devez impérativement vérifier que le nom n’a pas déjà été déposé comme marque dans votre secteur d’activité auprès de l’institut officiel (INPI, EUIPO, USPTO).',
  },
  {
    category: 'legal',
    q: 'Comment vérifier la disponibilité d’un nom de domaine internet ?',
    a: 'Une fois un nom sélectionné, saisissez-le sur un bureau d’enregistrement officiel de domaines (comme OVH, Namecheap ou Google Domains) pour vérifier si l’extension .com, .fr ou .io est libre à l’achat.',
  },
  {
    category: 'legal',
    q: 'Dois-je vérifier les marques déposées avant d’utiliser un nom ?',
    a: 'Oui, c’est une étape indispensable avant d’investir dans du branding, un logo ou une immatriculation de société. NameForge ne certifie aucune disponibilité juridique et propose des idées d’inspiration.',
  },
  {
    category: 'technical',
    q: 'Le site fonctionne-t-il sur téléphone et tablette ?',
    a: 'Oui, l’interface a été méticuleusement conçue en Responsive Design pour offrir une prise en main fluide et rapide sur smartphone, tablette tactile et grand écran d’ordinateur.',
  },
  {
    category: 'general',
    q: 'Que faire si un résultat ne me plaît pas ?',
    a: 'Cliquez à nouveau sur le bouton « Forger de nouveaux noms » ou appuyez sur la touche « G » de votre clavier. N’hésitez pas à changer d’archétype, de longueur ou de langue de génération pour explorer un autre registre sonore.',
  },
  {
    category: 'general',
    q: 'Comment signaler un problème ou proposer une amélioration ?',
    a: 'NameForge évolue constamment grâce aux retours de la communauté. Vous pouvez partager vos suggestions via le dépôt du projet ou proposer de nouveaux archétypes pour enrichir les prochaines versions.',
  },
];
