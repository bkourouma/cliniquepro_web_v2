// Questions fréquentes. Réponses limitées à ce que l'application fait ; les points commerciaux ou techniques
// non documentés (hébergement, essai, formation…) renvoient vers la démonstration (voir docs/PROMPTS-CONTENU.md).

export type FaqGroup = { title: string; items: { q: string; a: string }[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "Offre et tarifs",
    items: [
      {
        q: "Quels sont les packs CliniquePro ?",
        a: "Deux packs : la Gestion opérationnelle (35 000 FCFA HT par mois) qui couvre le parcours patient, médical et assurance, et la Gestion financière et comptable (45 000 FCFA HT par mois) qui couvre la facturation, la caisse, les honoraires médecins et la comptabilité.",
      },
      {
        q: "Puis-je prendre les deux packs ?",
        a: "Oui. Les deux packs sont complémentaires : souscrits ensemble, vous bénéficiez de 10 % de remise sur le moins cher des deux, soit 76 500 FCFA HT par mois au lieu de 80 000.",
      },
      {
        q: "Y a-t-il une période d'essai ?",
        a: "Oui : le premier mois est offert sur tous les packs, sans engagement.",
      },
      {
        q: "Quel pack choisir pour démarrer ?",
        a: "Si votre priorité est d'organiser l'accueil, l'agenda, les consultations et les examens, commencez par la Gestion opérationnelle. Si votre priorité est de sécuriser la caisse, la facturation et la comptabilité, choisissez la Gestion financière et comptable. Une démonstration permet de valider le bon périmètre.",
      },
    ],
  },
  {
    title: "Fonctionnalités",
    items: [
      {
        q: "CliniquePro est-il adapté à l'ophtalmologie ?",
        a: "Oui. L'application intègre l'acuité visuelle, la pression intraoculaire, la réfraction, le fond d'œil, l'OCT, le champ visuel, la biométrie, les ordonnances de lunettes et des modèles de consultation spécialisés.",
      },
      {
        q: "Comment sont gérées les assurances ?",
        a: "Les assurances sont rattachées aux patients et aux dossiers de réception. La demande de prise en charge est envoyée à l'assurance, qui valide ou rejette prestation par prestation via un portail accessible par lien sécurisé. L'historique des décisions est conservé.",
      },
      {
        q: "Quels moyens de paiement la caisse accepte-t-elle ?",
        a: "Espèces, carte, mobile money, virement, chèque ou paiement direct par l'assurance, avec gestion de la monnaie rendue, remboursements encadrés, fermeture de caisse et suivi des écarts.",
      },
      {
        q: "La comptabilité est-elle conforme au SYSCOHADA ?",
        a: "L'application intègre un plan de comptes SYSCOHADA simplifié et un journal en partie double immuable alimenté automatiquement par les encaissements, remboursements, écarts de caisse et honoraires, avec grand livre, balance et clôtures de période.",
      },
      {
        q: "Peut-on communiquer avec les patients par WhatsApp ?",
        a: "Oui, un module permet d'envoyer des messages WhatsApp depuis l'interface (confirmations, rappels, informations pratiques selon votre politique).",
      },
    ],
  },
  {
    title: "Sécurité et utilisation",
    items: [
      {
        q: "Qui peut voir quoi dans l'application ?",
        a: "Chaque utilisateur dispose d'un rôle et de permissions adaptés à son métier (direction, médecin, accueil, caisse, comptabilité, assurance, administrateur). Les actions importantes sont associées aux utilisateurs, aux dates et aux statuts dans un journal d'audit.",
      },
      {
        q: "Faut-il installer un logiciel ?",
        a: "Non. CliniquePro est une application web moderne, accessible depuis un navigateur.",
      },
      {
        q: "Puis-je l'utiliser sur tablette ou téléphone ?",
        a: "Oui, l'application s'utilise depuis un navigateur et son interface s'adapte aux petits écrans, avec un menu dédié sur mobile.",
      },
      {
        q: "Mes données sont-elles sauvegardées ?",
        a: "Oui : une sauvegarde automatique quotidienne de la base de données est réalisée.",
      },
      {
        q: "Puis-je récupérer mes données si je mets fin au contrat ?",
        a: "Oui. Vous pouvez récupérer vos données à la fin du contrat, sur simple demande. L'application permet déjà d'exporter le dossier d'un patient (JSON, XML ou CSV) et plusieurs états de caisse et de comptabilité (CSV, PDF).",
      },
      {
        q: "Comment obtenir une démonstration ?",
        a: "Utilisez le bouton « Demander une démo » : un échange de 30 minutes permet de voir l'application appliquée à votre organisation, sans engagement.",
      },
    ],
  },
];
