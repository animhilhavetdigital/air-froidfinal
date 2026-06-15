# Base UX UI - Super Admin et Utilisateurs

Document de travail pour preparer les maquettes UX/UI, valider les parcours et cadrer le developpement de la plateforme Air Froid Expert.

Sources exploitees :

- Cahier des charges Air Froid Expert du 07.05.2026.
- Document "elements pour creation super admin et utilisateurs".
- Sitemap VOL08 / sitemap AFE.
- Maquettes existantes B2B et dashboard B2B.
- Charte graphique et references visuelles importees.

## Synthese produit

Air Froid Expert doit etre pense comme une plateforme commerciale B2B / B2C, connectee a un showroom physique premium a Marrakech. Le projet ne correspond pas a un simple site vitrine : il doit devenir un outil de generation de demandes, de qualification commerciale, de suivi client, de gestion des devis et de pilotage.

La plateforme combine cinq couches :

- Front-office commercial premium : presentation, showroom, services, catalogue, formulaires, contact, SEO.
- Back-office de gestion : contenus, produits, leads, demandes, devis, utilisateurs, statuts.
- Espace B2B : comptes professionnels, documents, historique, demandes, devis, suivi.
- Automatisation et IA : qualification, orientation, relances, notifications, chatbot MadaTalk.
- Reporting : performance commerciale, leads, devis, conversions, activite WhatsApp.

Objectif central : aider un prospect ou client professionnel a comprendre l'offre, formuler une demande claire, etre rassure, puis etre suivi serieusement par Air Froid Expert.

## Hypotheses retenues

Les points suivants sont retenus comme hypotheses lorsqu'ils ne sont pas entierement detailles dans les documents :

- Le Super Administrateur cote client represente Air Froid Expert ou une organisation cliente disposant d'un acces global.
- L'administrateur global de plateforme, cote prestataire ou technique, est distinct du Super Administrateur Air Froid Expert.
- Les devis sont assistes par l'equipe commerciale ou technique, pas generes automatiquement dans tous les cas.
- Les comptes B2B doivent etre valides avant acces complet.
- Les utilisateurs rattaches sont limites par societe, equipe, agence, commercial ou portefeuille selon les droits attribues.
- Le client final B2C n'a pas forcement un espace complet en MVP ; son parcours prioritaire reste la demande de devis et le contact rapide.
- La V1 doit rester maitrisee et ne pas devenir un ERP, un outil SAV complet ou une application mobile native.
- Le systeme de qualification des leads a retenir est Mingler. MadaTalk reste une reference de maquette/chatbot si conservee, mais la qualification commerciale doit etre alignee sur Mingler.

## Decisions validees apres retour client

| Sujet | Decision |
|---|---|
| Roles MVP | Les roles prevus dans cette base UX sont valides pour le MVP. |
| Matrice de permissions | A definir plus precisement avec l'equipe projet. |
| Statuts devis / demande | Statuts retenus : devis en cours, devis finalise, devis envoye, puis statut de passage en definitif a preciser. |
| Champs fiche client B2B | Societe, adresse complete, numero ICE/identifiant entreprise Maroc, contacts rattaches, nom, prenom, email, telephone portable. |
| Champs fiche contact | Nom, prenom, adresse, email, telephone portable. |
| Champs produits / catalogue | Fiches completes avec caracteristiques techniques, normes, documents et informations fournies par Air Froid Expert. |
| Tarifs B2B visibles en V1 | Oui, les tarifs B2B sont visibles cote espace B2B. |
| Modele PDF devis | A definir, non encore fourni. |
| Regles d'affectation commerciale | Affectation liee aux clients, donnee par la direction ou directement selon organisation interne. |
| WhatsApp dans back-office | Non, WhatsApp ne remonte pas dans le back-office. |
| Qualification leads | Mingler qualifie les leads et peut alimenter le CRM si necessaire. |
| Limite MVP / V1 / evolutions | MVP/V1 = tout ce qui est marque dans la base actuelle ; les evolutions seront traitees plus tard. |

## Perimetre fonctionnel identifie

### Front-office

- Accueil premium.
- Presentation de l'entreprise.
- Showroom.
- Services et solutions : solaire, climatisation, ventilation, cuisines professionnelles, services associes.
- Catalogue ou base produits.
- Demandes de devis simples et avancees.
- Upload de photos ou documents si utile.
- WhatsApp flottant et messages pre-remplis.
- Blog / espace conseils.
- Pages locales et zones de couverture.
- Mentions legales, confidentialite, CGU, cookies, RGPD.

### Espace B2B

- Connexion / inscription.
- Validation de compte professionnel.
- Tableau de bord client B2B.
- Profil professionnel.
- Demandes en cours.
- Historique de projets.
- Devis archives.
- Documents techniques.
- Conditions tarifaires ou tarifs specialises, si valides.
- Messagerie securisee ou centralisation des echanges.
- Catalogue professionnel.
- Demande de devis avancee.

### Back-office

- Dashboard administrateur.
- Gestion des devis.
- Qualification des demandes.
- Generation ou suivi PDF.
- Gestion clients.
- Gestion leads.
- Gestion produits, catalogue, categories, tarifs, stock si necessaire.
- Gestion contenus : pages, blog, FAQ, images.
- Gestion utilisateurs et roles.
- Automatisations, relances, notifications.
- Reporting.
- Parametres : horaires, disponibilites, tarifs, integrations, sauvegardes.

### Points issus de la map VOL08

- Structure front : accueil, presentation, services, catalogue, demandes et devis, espace B2B, blog, contact, pages locales, mentions legales.
- Espace B2B : connexion, dashboard, profil, demandes, historique, devis, documents, conditions tarifaires, interventions, messagerie.
- Back-office : devis, clients, produits, contenus, leads, utilisateurs, automatisation, reporting, parametres, support.
- Chatbot MadaTalk prevu sur front et parcours devis.
- WhatsApp rapide et messages pre-remplis par service.

## Roles et permissions

| Role | Peut voir | Peut creer | Peut modifier | Peut supprimer | Peut valider | Ne doit pas voir | Restrictions |
|---|---|---|---|---|---|---|---|
| Super Administrateur client | Toutes les donnees de sa societe, utilisateurs, clients, demandes, devis, documents, statistiques | Utilisateurs, roles, clients, demandes, devis, documents internes | Parametres societe, utilisateurs, affectations, statuts, fiches clients | Utilisateurs secondaires, documents non verrouilles, brouillons | Comptes B2B, devis, affectations, demandes sensibles | Donnees techniques globales hors societe, parametres plateforme prestataire | Limite a son organisation ou instance client |
| Administrateur secondaire | Donnees autorisees par le Super Admin | Utilisateurs limites, clients, demandes, documents | Donnees de son perimetre | Elements autorises uniquement | Validations deleguees | Parametres critiques, droits super admin | Societe, agence, equipe ou module |
| Commercial | Leads, clients, prospects, demandes et devis affectes | Demandes, notes, relances, brouillons de devis | Fiches affectees, statuts commerciaux, commentaires | Non recommande, sauf brouillon personnel | Etapes commerciales simples selon droits | Donnees des autres commerciaux, parametres, droits | Portefeuille, equipe, zone, client affecte |
| Utilisateur interne | Donnees operationnelles autorisees | Notes, documents, demandes internes selon role | Informations limitees | Non recommande | Non, sauf role specifique | Statistiques globales, droits, tarifs sensibles | Module, equipe, mission |
| Consultation seule | Tableaux, fiches, documents autorises | Rien | Rien | Rien | Rien | Actions, donnees sensibles non partagees | Lecture seule sur perimetre defini |
| Client final B2B | Son profil, ses demandes, devis, documents, historique | Demandes, messages, uploads | Profil, informations de demande avant traitement | Brouillons non soumis | Acceptation devis si prevu | Autres clients, back-office, statistiques internes | Compte professionnel valide |
| Client final B2C | Pages publiques, formulaire, contact, suivi minimal si cree | Demande de devis, upload photo | Informations avant envoi | Non | Acceptation devis si prevu | Espace B2B, tarifs pro, back-office | Public ou compte leger |
| Equipe interne plateforme / admin global | Configuration technique, tous espaces si necessaire | Parametres, comptes, modules | Parametres globaux | Actions techniques | Activation modules | Donnees client sauf besoin support encadre | Acces technique trace |

## Parcours UX Super Administrateur

### Connexion

Objectif : acceder a un espace securise.

- Etapes : saisie email, mot de passe, eventuel 2FA, redirection dashboard.
- Informations : logo, contexte Air Froid Expert, aide, mot de passe oublie.
- Actions : connexion, recuperation mot de passe.
- Regles : blocage apres tentatives excessives, acces selon role actif.
- Erreurs : identifiants invalides, compte suspendu, compte non valide.
- Ecrans : login, mot de passe oublie, reset password.

### Tableau de bord

Objectif : avoir une vision globale de l'activite.

- Informations : leads, demandes, devis, taux de conversion, alertes, actions en attente.
- Actions : creer demande, affecter lead, consulter devis, ouvrir reporting.
- Regles : indicateurs limites au perimetre de la societe.
- Erreurs : absence de donnees, probleme de synchronisation.
- Ecrans : dashboard Super Admin, details indicateur, liste actions.

### Gestion societe / organisation

Objectif : maintenir les informations de l'organisation.

- Informations : raison sociale, coordonnees, activite, agences, showroom, interlocuteurs.
- Actions : modifier fiche societe, ajouter agence, gerer conditions commerciales.
- Regles : certaines donnees peuvent etre verrouillees par admin global.
- Ecrans : fiche societe, agences, parametres organisation.

### Gestion utilisateurs et droits

Objectif : creer et piloter les comptes internes.

- Informations : liste utilisateurs, role, statut, derniere connexion, perimetre.
- Actions : inviter, creer, modifier, suspendre, reinitialiser mot de passe, attribuer droits.
- Regles : un utilisateur ne peut pas recevoir plus de droits que son createur.
- Erreurs : email deja utilise, role incomplet, perimetre manquant.
- Ecrans : liste utilisateurs, creation utilisateur, modification utilisateur, roles et permissions.

### Gestion commerciaux / equipes

Objectif : organiser l'affectation des demandes.

- Informations : commerciaux, equipes, zones, charge, performance, demandes affectees.
- Actions : affecter lead, changer responsable, filtrer par equipe.
- Regles : historique conserve lors d'un changement d'affectation.
- Ecrans : equipes, fiche commercial, affectation lead.

### Gestion clients / comptes

Objectif : centraliser la relation commerciale.

- Informations : typologie, coordonnees, historique, demandes, devis, documents, notes.
- Actions : creer fiche, modifier, qualifier, ajouter note, joindre document.
- Regles : doublons a detecter par email, telephone ou societe.
- Ecrans : liste clients, fiche client, historique client.

### Catalogue, produits et offres

Objectif : gerer l'offre visible et exploitable commercialement.

- Informations : categories, produits, fiches techniques, tarifs, disponibilite, visibilite B2B/B2C.
- Actions : creer produit, publier, archiver, associer document.
- Regles : tarifs B2B a masquer aux non autorises.
- Ecrans : catalogue admin, fiche produit, categories, tarifs.

### Demandes, devis, commandes

Objectif : piloter le workflow commercial.

- Etapes : demande entrante, qualification, affectation, analyse, devis, relance, validation, suivi.
- Informations : statut, origine, client, besoin, photos, notes, responsable, echeances.
- Actions : qualifier, affecter, demander complement, creer devis PDF, relancer, cloturer.
- Regles : devis assiste, validation interne si montant ou marge sensible.
- Ecrans : liste demandes, detail demande, creation devis, detail devis, generation PDF.

### Gestion documentaire

Objectif : retrouver les documents utiles.

- Informations : devis PDF, fiches techniques, contrats, photos, documents client.
- Actions : upload, telechargement, association a client, partage B2B.
- Regles : droits par type de document.
- Ecrans : documents, detail document, upload.

### Suivi activite, statistiques et reporting

Objectif : piloter la performance.

- Informations : volume leads, origine, B2B/B2C, devis generes, devis signes, pages consultees, activite WhatsApp.
- Actions : filtrer, exporter, comparer periodes.
- Regles : indicateurs MVP simples, reporting avance en V1/V2.
- Ecrans : reporting, statistiques commerciales.

### Notifications, support et journal d'activite

Objectif : ne pas perdre les actions importantes.

- Informations : nouvelles demandes, relances, comptes a valider, devis en attente.
- Actions : marquer comme traite, ouvrir l'objet lie.
- Regles : actions sensibles journalisees.
- Ecrans : centre notifications, support, journal d'activite.

## Parcours UX Utilisateur rattache

### Connexion et espace personnel

- Objectif : acceder uniquement a son espace.
- Etapes : login, redirection vers dashboard utilisateur.
- Informations : taches, demandes affectees, messages, raccourcis.
- Actions : consulter, traiter, relancer selon droits.
- Limites : pas de donnees hors perimetre.
- Ecrans : login, dashboard utilisateur, profil.

### Visualisation de son perimetre

- Objectif : voir uniquement ses clients, prospects, demandes ou dossiers.
- Informations : liste affectee, statuts, priorites, dates.
- Actions : filtrer, ouvrir, commenter, mettre a jour.
- Regles : aucune visibilite sur les autres commerciaux sauf droit explicite.
- Ecrans : mes clients, mes demandes, mes devis.

### Creation demande / devis / panier

- Objectif : initier ou formaliser une opportunite.
- Informations : client, besoin, service, localisation, pieces jointes, urgence.
- Actions : creer demande, ajouter produit, demander validation devis.
- Limites : validation finale selon role.
- Ecrans : creation demande, panier/devis, confirmation.

### Catalogue autorise

- Objectif : consulter les produits utiles a la vente.
- Informations : categories, produits, fiches techniques, disponibilite, documents.
- Actions : rechercher, filtrer, ajouter a demande.
- Limites : tarifs ou marges selon droits.
- Ecrans : catalogue utilisateur, fiche produit.

### Historique, documents et notifications

- Objectif : suivre ses actions et ses dossiers.
- Informations : historique, messages, documents partages, alertes.
- Actions : telecharger, commenter, relancer.
- Limites : documents sensibles selon droit.
- Ecrans : historique, documents, notifications.

## Liste des ecrans a maquettiser

| Ecran | Profil | Objectif | Composants principaux | Donnees | Actions | Filtres / tri | Etats | Permission | Priorite |
|---|---|---|---|---|---|---|---|---|---|
| Login | Tous comptes | Acces securise | Formulaire, logo, aide | Email, mot de passe | Connexion | Non | Erreur identifiants, compte bloque | Public | MVP |
| Mot de passe oublie | Tous comptes | Recuperer acces | Email, confirmation | Email | Envoyer lien | Non | Email inconnu, succes | Public | MVP |
| Dashboard Super Admin | Super Admin | Piloter activite | KPIs, alertes, tableaux, raccourcis | Leads, devis, demandes, CA si dispo | Ouvrir, affecter, creer | Periode, statut, canal | Vide, chargement, erreur | Super Admin | MVP |
| Dashboard utilisateur | Commercial/interne | Gerer son travail | Taches, demandes, messages | Dossiers affectes | Traiter, relancer | Statut, date, priorite | Vide, erreur | Perimetre utilisateur | MVP |
| Gestion societe | Super Admin | Gerer organisation | Formulaire, agences, contacts | Societe, showroom, coordonnees | Modifier | Agence | Donnees manquantes | Super Admin | V1 |
| Liste utilisateurs | Super Admin/Admin | Piloter comptes | Tableau, statuts, roles | Nom, email, role, statut | Inviter, suspendre | Role, statut | Aucun utilisateur | Admin autorise | MVP |
| Creation utilisateur | Super Admin/Admin | Ajouter compte | Formulaire, role, droits | Identite, email, role, perimetre | Creer, inviter | Non | Email deja utilise | Admin autorise | MVP |
| Modification utilisateur | Super Admin/Admin | Ajuster droits | Formulaire, historique | Role, statut, permissions | Modifier, suspendre | Non | Role invalide | Admin autorise | MVP |
| Roles et permissions | Super Admin | Controler acces | Matrice, toggles | Modules, droits, perimetres | Activer/desactiver | Role | Conflit permission | Super Admin | MVP |
| Liste clients/prospects | Admin/Commercial | Suivre relation | Tableau, tags, statut | Nom, type, canal, responsable | Ouvrir, creer | Type, statut, responsable | Vide | Perimetre | MVP |
| Fiche client/compte | Admin/Commercial | Centraliser donnees | Resume, onglets, timeline | Coordonnees, demandes, devis, docs | Modifier, noter, joindre | Non | Donnees incompletes | Perimetre | MVP |
| Catalogue produits/offres | Tous autorises | Consulter offre | Grille/liste, categories | Produits, docs, tarifs | Consulter, ajouter | Categorie, service | Aucun produit | Selon role | MVP |
| Creation demande/devis | B2B/Admin/Commercial | Formaliser besoin | Wizard, upload, recap | Service, client, besoin, photos | Soumettre, sauvegarder | Non | Champs manquants | Selon role | MVP |
| Detail demande/devis | Admin/Commercial/B2B | Suivre statut | Timeline, infos, documents | Statut, responsable, PDF | Qualifier, relancer, accepter | Non | Devis absent | Selon role | MVP |
| Generation PDF | Admin/Commercial | Produire devis | Apercu, modele, actions | Client, lignes, conditions | Generer, telecharger | Non | Donnees manquantes | Droit devis | V1 |
| Suivi statuts | Admin/Commercial/B2B | Comprendre avancement | Timeline, badges | Statuts, dates, commentaires | Changer statut | Statut | Incoherence statut | Selon role | MVP |
| Statistiques | Super Admin/Admin | Mesurer performance | Graphiques, tableaux | Leads, devis, conversion | Filtrer, exporter | Periode, canal | Pas de donnees | Admin | V1 |
| Notifications | Tous comptes | Suivre alertes | Liste, badges | Type, date, objet | Marquer lu, ouvrir | Type | Vide | Selon role | MVP |
| Parametres | Super Admin/Admin global | Configurer | Formulaires, modules | Horaires, tarifs, integrations | Modifier | Module | Erreur sauvegarde | Admin | V1 |
| Support | Tous comptes | Demander aide | Formulaire, messages | Sujet, message, fichier | Envoyer | Statut | Vide | Compte connecte | V1 |
| Profil utilisateur | Tous comptes | Gerer compte | Infos, securite | Nom, email, telephone | Modifier, changer mdp | Non | Erreur validation | Proprietaire | MVP |
| Journal activite | Super Admin/Admin | Tracer actions | Timeline, filtres | Action, auteur, date, cible | Consulter, exporter | Auteur, date | Vide | Admin | V1 |
| Validation comptes B2B | Super Admin/Admin | Controler acces pro | Liste, fiche societe | Societe, justificatifs, demande | Valider/refuser | Statut | Dossier incomplet | Admin | MVP |
| Documents techniques | B2B/Admin | Partager ressources | Bibliotheque | Fiches, PDF, categories | Upload, telecharger | Categorie | Aucun document | Selon role | V1 |
| Messagerie securisee | B2B/Admin | Centraliser echanges | Fil, pieces jointes | Messages, auteur, dates | Repondre | Dossier | Vide | Selon role | V1 |

## Architecture de navigation

### Menu Super Administrateur

- Tableau de bord
- Demandes et devis
  - Nouvelles demandes
  - Demandes en cours
  - Devis a valider
  - Devis archives
- Clients et prospects
  - Tous les comptes
  - Comptes B2B
  - Comptes B2C
  - Validation comptes B2B
- Catalogue
  - Produits
  - Categories
  - Documents techniques
  - Tarifs / conditions
- Equipes et utilisateurs
  - Utilisateurs
  - Roles et permissions
  - Commerciaux
  - Affectations
- Contenus
  - Pages
  - Blog
  - FAQ
  - Images / galeries
- Reporting
  - Leads
  - Devis
  - Conversions
  - Activite WhatsApp
- Notifications
- Support
- Parametres
- Journal d'activite

### Menu utilisateur commercial / collaborateur

- Tableau de bord
- Mes demandes
- Mes clients / prospects
- Catalogue
- Creer une demande / devis
- Mes documents
- Notifications
- Support
- Mon profil

### Menu client B2B

- Vue d'ensemble
- Catalogue Pro
- Demande de devis
- Suivi et historique
- Documents techniques
- Messagerie / Support dedie
- Mon profil professionnel

## Dashboards recommandes

### Dashboard Super Administrateur

| Indicateur | Source | Utilite metier | Priorite | Affichage recommande |
|---|---|---|---|---|
| Nouvelles demandes | Formulaires, WhatsApp, back-office | Traiter rapidement les leads | MVP | Carte KPI + liste prioritaire |
| Devis en attente | Module devis | Eviter les blocages | MVP | Carte alerte |
| Comptes B2B a valider | Inscriptions B2B | Controler les acces pro | MVP | Liste d'action |
| Taux de transformation | Devis signes / demandes | Mesurer performance | V1 | Graphique simple |
| Origine des leads | Formulaires, canaux, UTM | Prioriser acquisition | V1 | Donut ou barres |
| Activite par commercial | Affectations et statuts | Suivre charge et performance | V1 | Tableau |
| Documents recents | Bibliotheque | Retrouver les pieces utiles | V1 | Liste |
| Alertes | Notifications | Eviter oublis | MVP | Bloc alertes |

### Dashboard utilisateur

| Indicateur | Source | Utilite metier | Priorite | Affichage recommande |
|---|---|---|---|---|
| Mes demandes en cours | Affectations | Prioriser travail | MVP | Liste avec statuts |
| Actions a faire | Relances, devis, messages | Ne rien oublier | MVP | Checklist |
| Mes devis en attente | Module devis | Suivre conversion | MVP | Carte + liste |
| Messages recents | Support / messagerie | Repondre vite | V1 | Liste |
| Performance individuelle | Statuts, devis signes | Pilotage commercial | V1 | Mini KPI |

## Donnees necessaires par ecran

| Ecran | Champs obligatoires | Champs facultatifs | Donnees calculees | Relations |
|---|---|---|---|---|
| Utilisateur | Nom, email, role, statut | Telephone, photo, equipe | Derniere connexion | Societe, role, permissions |
| Societe | Nom, type, coordonnees | Agences, showroom, logo | Nombre utilisateurs | Utilisateurs, clients, documents |
| Client/prospect | Nom, type, telephone/email | Adresse, secteur, notes | Score priorite si IA | Demandes, devis, commercial |
| Compte B2B | Societe, interlocuteur, email, statut validation | Conditions, documents | Anciennete, volume demandes | Utilisateurs B2B, devis |
| Produit | Nom, categorie, service, statut | Photos, fiche technique, tarif | Popularite, demandes liees | Catalogue, devis |
| Demande | Client, service, description, localisation, statut | Photos, urgence, budget | Age demande, priorite | Client, commercial, devis |
| Devis | Client, lignes, statut, date | Conditions, remise, notes | Total, validite | Demande, PDF, documents |
| Notification | Type, destinataire, objet | Priorite | Lu/non lu | Utilisateur, demande/devis |
| Journal | Auteur, action, cible, date | IP, commentaire | Non | Tous objets sensibles |

## Regles metier

| Regle | Profil concerne | Ecran | Impact UX | Impact dev | Priorite | Source |
|---|---|---|---|---|---|---|
| Les droits doivent limiter la visibilite par role et perimetre | Tous comptes | Tous espaces connectes | Masquer menus et actions non autorises | RBAC + filtres serveur | MVP | Cahier des charges |
| Un compte B2B doit pouvoir etre valide avant acces complet | B2B/Admin | Validation B2B | Statut clair et ecran attente | Workflow validation | MVP | Sitemap / CDC |
| Le devis est assiste, pas toujours automatique | Admin/Commercial | Demande/devis | Wizard + etape analyse | Statuts et brouillons devis | MVP | CDC |
| Les actions sensibles doivent etre tracees | Admin/Commercial | Journal | Historique visible | Audit log | V1 | CDC securite |
| Les tarifs B2B ou conditions personnalisees doivent etre proteges | B2B/Admin | Catalogue/devis | Badges et masquage selon role | Permissions prix | V1 | CDC B2B |
| WhatsApp est un canal majeur | Public/Admin | Front/demandes | CTA visible et messages pre-remplis | Capture source canal | MVP | CDC |
| Les demandes doivent etre affectees a un responsable | Admin/Commercial | Demandes | Champ responsable obligatoire apres qualification | Affectation + historique | MVP | CDC |
| Les documents PDF doivent etre historises | Admin/B2B | Devis/documents | Telechargement et historique | Stockage document lie | V1 | CDC |
| Le B2C doit rester simple | Public/B2C | Front/devis simple | Formulaire court | Flux simplifie | MVP | CDC |
| Le reporting V1 doit rester simple | Admin | Reporting | KPIs lisibles | Agregations basiques | V1 | CDC |
| WhatsApp ne remonte pas dans le back-office | Public/Admin | Front/contact | CTA externe clair, pas de suivi BO WhatsApp | Pas d'integration conversationnelle BO en MVP | MVP | Retour client |
| Mingler qualifie les leads | Admin/Commercial | Demandes/leads | Mentionner source/score si disponible | Integration CRM ou lead scoring a prevoir si active | V1 | Retour client |
| Les tarifs B2B sont visibles en V1 | B2B/Admin | Catalogue B2B | Affichage tarif pro cote espace B2B | Permissions tarifaires par profil | V1 | Retour client |

## Preconisations UX/UI pour le designer

Logique generale :

- Interface sobre, premium, claire, technique et rassurante.
- Priorite aux actions metier : demander un devis, qualifier, affecter, relancer, telecharger.
- Ne pas transformer l'espace admin en ERP dense des la premiere version.
- Utiliser la charte : bleu fonce dominant, accents or et vert, univers solaire/climatisation/ventilation.
- Bien distinguer public, B2B, commercial et admin.

Elements visibles immediatement :

- CTA demande de devis.
- Statut de chaque demande/devis.
- Responsable affecte.
- Prochaine action.
- Documents utiles.
- Alertes importantes.

Composants reutilisables :

- Cartes KPI.
- Tableaux filtrables.
- Badges statut.
- Timeline demande/devis.
- Panneau de details client.
- Wizard de demande/devis.
- Upload documents/photos.
- Centre de notifications.
- Matrice de permissions.

### Premquettes textuelles des ecrans cles

#### Dashboard Super Administrateur

- Header : recherche globale, notifications, profil, bouton nouvelle demande.
- Menu lateral : dashboard, demandes, clients, catalogue, utilisateurs, reporting, parametres.
- Bloc haut : KPIs demandes, devis, comptes B2B a valider, relances.
- Bloc central : demandes recentes avec statut, origine, responsable.
- Bloc droit : alertes et taches.
- Bloc bas : performance commerciale et activite recente.

#### Gestion utilisateurs

- Header : titre, bouton inviter utilisateur.
- Tableau : nom, email, role, perimetre, statut, derniere connexion.
- Filtres : role, statut, equipe.
- Actions : modifier, suspendre, reinitialiser, voir historique.
- Message systeme : confirmation avant suspension.

#### Fiche client / compte

- Header : nom client, type B2B/B2C, statut, responsable.
- Onglets : resume, demandes, devis, documents, messages, historique.
- Colonne info : coordonnees, societe, secteur, conditions.
- Actions : creer demande, ajouter note, joindre document, affecter.

#### Catalogue

- Header : recherche, filtres, bouton ajouter produit selon role.
- Zone filtres : categorie, service, disponibilite, visibilite B2B/B2C.
- Liste : image, nom, categorie, documents, statut.
- Fiche produit : description, photos, fiche technique, documents, association devis.

#### Creation demande / devis

- Wizard : client, service, besoin, localisation, documents/photos, recapitulatif.
- Actions : enregistrer brouillon, soumettre, affecter, generer devis si autorise.
- Messages : champs manquants, demande envoyee, validation necessaire.

#### Dashboard utilisateur

- Header : mes actions, notifications, profil.
- Menu : dashboard, mes demandes, mes clients, catalogue, documents.
- Bloc haut : demandes en cours, relances, devis en attente.
- Bloc central : liste des dossiers affectes.
- Bloc droit : messages recents et raccourcis.

## Preconisations fonctionnelles pour le developpement

Modules fonctionnels a creer :

- Authentification et recuperation mot de passe.
- Gestion roles et permissions.
- Gestion organisations / societes.
- Gestion utilisateurs.
- Gestion clients / prospects / comptes B2B.
- Gestion demandes.
- Gestion devis et PDF.
- Catalogue produits / offres.
- Documents et pieces jointes.
- Notifications.
- Reporting.
- Journal d'activite.
- Integrations WhatsApp, formulaires, chatbot MadaTalk.
- Integration Mingler pour qualification des leads, avec eventuelle synchronisation CRM.

Dependances :

- Les roles et permissions doivent etre poses avant les ecrans connectes.
- La gestion clients doit exister avant demandes et devis.
- Les produits/catalogues alimentent les devis.
- Les statuts demandes/devis alimentent dashboards, notifications et reporting.
- Les documents doivent pouvoir etre lies a client, demande, devis, produit.

Endpoints ou fonctions a prevoir :

- Auth : login, logout, reset password, current user.
- Users : list, create, update, suspend, assign role.
- Roles : list, update permissions, assign scope.
- Clients : list, create, update, detail, history.
- B2B accounts : request, validate, reject.
- Requests : create, qualify, assign, update status, attach file.
- Quotes : create draft, update, validate, generate PDF, archive.
- Products : list, create, update, publish, archive.
- Documents : upload, download, share, link to entity.
- Notifications : list, mark read.
- Reporting : KPIs, leads by source, quote conversion.
- Audit : list actions, filter by user/entity.

Securite :

- Permissions verifiees cote serveur.
- Journalisation des actions sensibles.
- Protection des comptes administrateurs.
- Sauvegardes.
- Limitation des uploads.
- Gestion des donnees personnelles.
- Separation admin global / Super Admin client.

## Decoupage MVP / V1 / V2

### MVP obligatoire

| Fonctionnalite | Description | Profil | Ecrans | Dependances | Complexite | Risque si absent |
|---|---|---|---|---|---|---|
| Authentification | Connexion et reset password | Tous | Login | Utilisateurs | Faible | Aucun espace connecte |
| Roles de base | Super Admin, commercial, B2B | Admin | Roles | Auth | Moyenne | Donnees exposees |
| Dashboard Super Admin | Vue globale operationnelle | Super Admin | Dashboard | Demandes, devis | Moyenne | Pilotage faible |
| Gestion utilisateurs | Creer et limiter les comptes | Super Admin | Utilisateurs | Roles | Moyenne | Pas de delegation |
| Gestion clients | Centraliser clients/prospects | Admin/Commercial | Clients | Auth | Moyenne | Suivi disperse |
| Demande de devis | Capter et structurer le besoin | Public/B2B/Admin | Formulaire | Clients | Moyenne | Perte de leads |
| Workflow demande | Statuts, affectation, suivi | Admin/Commercial | Demandes | Users | Moyenne | Pas de traitement clair |
| Catalogue consultable | Base produits/offres | Public/B2B/Admin | Catalogue | Produits | Moyenne | Offre peu lisible |
| Espace B2B minimal | Dashboard, demandes, documents | B2B | B2B dashboard | Auth, demandes | Moyenne | Axe strategique absent |
| WhatsApp visible | Contact rapide | Public | Front | Non | Faible | Conversion reduite |
| Tarifs B2B visibles | Afficher les prix professionnels dans l'espace B2B | B2B | Catalogue B2B | Permissions | Moyenne | Offre B2B incomplete |

### V1 complete

- Generation PDF de devis.
- Documents techniques partages.
- Validation avancee comptes B2B.
- Statistiques commerciales simples.
- Journal d'activite.
- Messagerie ou centralisation support.
- Conditions tarifaires B2B si confirmees.
- Gestion contenus blog / FAQ / pages locales.
- Notifications internes.
- Reporting origine leads et conversion.
- Qualification leads via Mingler, si l'integration est disponible.

### V2 evolutions

- SAV avance.
- Planification interventions.
- Espace techniciens.
- Application mobile.
- Signature electronique.
- Paiement en ligne.
- Simulateurs de besoins.
- IA technique enrichie.
- Automatisation marketing avancee.
- Geolocalisation.
- Marketplace ou fournisseurs.

## Risques et points de vigilance

- Derive vers un ERP complet trop tot.
- Permissions mal cadrees avant design des ecrans.
- Statuts demandes/devis non valides avec le client.
- Tarifs B2B et conditions commerciales flous.
- Workflow devis trop automatique alors que le metier demande une analyse technique.
- Multiplication des canaux sans centralisation : WhatsApp, email, reseaux sociaux, telephone.
- Trop de dashboards avant d'avoir des donnees fiables.
- Uploads photos/documents sans limites ni structure.
- Confusion entre Super Admin client et admin global plateforme.
- Confusion entre client B2B, utilisateur interne et client final B2C.

## Elements manquants a fournir

| Element manquant | Pourquoi necessaire | Impact UX | Impact dev | Bloquant |
|---|---|---|---|---|
| Liste definitive des roles | Les roles de la base sont valides pour le MVP, mais les libelles finaux peuvent etre confirmes | Menus et actions fiables | RBAC propre | Non/Moyen |
| Matrice exacte des permissions | Eviter acces non autorises | Masquage correct | Regles serveur | Oui |
| Statut final apres devis envoye | Completer la timeline apres envoi | Clarte suivi | Workflow | Oui |
| Format exact fiche client B2B | Les champs principaux sont valides, le format final reste a designer | Fiche exploitable | Modele donnees | Non/Moyen |
| Gabarit fiche produit | Le contenu attendu est valide, le format exact reste a structurer | Fiches produit completes | Modele catalogue | Non/Moyen |
| Modele PDF devis | Produire document coherent | Apercu devis | Generation PDF | Oui si PDF en V1 |
| Validation interne devis | Savoir qui approuve | Boutons et statuts | Workflow validation | Non/Moyen |
| Details des regles d'affectation commerciale | La direction affecte ou definit les regles, il faut formaliser les cas | Assignation claire | Automatisation | Oui |
| Notifications attendues | Eviter surcharge | Centre notification | Triggers | Non |
| Contraintes juridiques Maroc/RGPD | Pages conformite | Consentements | Stockage donnees | Oui |
| Priorites business exactes | La base actuelle est validee, mais l'ordre de maquettage peut etre confirme | Maquettes ciblees | Backlog | Non |
| Contenus finaux | Maquettes realistes | Textes/images | Integration | Non mais important |

## Questions a poser au client / chef de projet

1. Quelle est la matrice de permissions definitive par role ?
2. Quel statut exact utiliser apres "devis envoye" : accepte, refuse, signe, transforme, commande ?
3. Les comptes B2B sont-ils valides manuellement ou automatiquement ?
4. Le devis PDF doit-il etre genere depuis la plateforme en MVP ou seulement prepare en V1 ?
5. Quel modele graphique et quelles mentions doivent apparaitre sur le PDF devis ?
6. Quels documents techniques doivent etre partages aux B2B ?
7. Mingler doit-il seulement qualifier les leads ou aussi pousser les donnees vers le CRM automatiquement ?
8. Quelles donnees doivent apparaitre sur le dashboard direction ?
9. Faut-il une messagerie interne ou un simple historique de commentaires ?
10. Quelles zones geographiques doivent etre gerees en priorite ?

## Checklist finale avant maquettage

- Roles valides.
- Permissions validees.
- Statuts demandes/devis valides, y compris statut final apres envoi.
- Champs principaux clients, comptes B2B, contacts et produits valides.
- Navigation Super Admin validee.
- Navigation utilisateur rattache validee.
- Navigation B2B validee.
- Priorites MVP/V1 confirmees.
- Charte graphique disponible.
- Sitemap valide.
- Maquettes existantes B2B prises en compte.
- Contenus critiques identifies.
- Questions bloquantes envoyees au chef de projet.

## Checklist finale avant developpement

- Modele donnees valide.
- Matrice roles/permissions validee.
- Workflows demandes/devis documentes.
- Regles d'affectation commerciales validees.
- Regles de validation devis validees.
- Endpoints principaux listes.
- Regles securite et audit definies.
- Strategie upload documents/photos definie.
- Strategie PDF definie.
- Reporting MVP defini.
- Integrations WhatsApp / Mingler clarifiees.
- Hors perimetre V1 confirme.
