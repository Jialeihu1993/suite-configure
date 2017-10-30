﻿// Following reducers initialState to define key
module.exports = {
  //Breadcrumbs
  "breadcrumbs.configuration":"Configuration",
  "breadcrumbs.accounts":"Comptes",
  "breadcrumbs.ldap":"LDAP",
  "breadcrumbs.debug":"Débogage",
  "breadcrumbs.logLevel":"Niveau de consignation",
  "breadcrumbs.email":"Serveur de messagerie",
  "breadcrumbs.operation":"Opération",
  "breadcrumbs.changePassword":"Modifier le mot de passe",
  "breadcrumbs.smart":"Smart Analytics",
  // labels
  "appTitle": "SUITE ITSMA",
  "logout": "Déconnexion",
  "configuration": "CONFIGURATION",
  "operation": "OPÉRATION",
  "accounts": "Comptes",
  "ldap": "LDAP",
  "ldap.settings": "Configuration LDAP",
  "ldap.external": "Externe",
  "ldap.ip": "Nom d’hôte/adresse IP",
  "ldap.port": "Port",
  "ldap.userName": "ID d’utilisateur",
  "ldap.password": "Mot de passe",
  "ldap.baseDN": "Nom unique de base",
  "ldap.uidName": "Attribut de nom d’utilisateur",
  "ldap.ssl": "Activer SSL",
  "ldap.cmdb": "Autres paramètres pour CMDB",
  "ldap.groupBaseFilter": "Filtre de base de groupe",
  "ldap.rootGroupFilter": "Filtre de groupe racine",
  "ldap.defaultGroup": "Groupe par défaut",
  "ldap.userFilter": "Filtre de l’utilisateur",
  "ldap.groupClass": "Classe du groupe",
  "ldap.userClass": "Classe de l’utilisateur",
  "admin": "Modifier le mot de passe",
  "admin.changePassword": "Modifier le mot de passe de \"sysadmin\"",
  "admin.oldPassword": "Ancien mot de passe",
  "admin.password": "Nouveau mot de passe",
  "admin.confirmPassword": "Confirmer le nouveau mot de passe",
  "admin.showInfo": "Modifier le mot de passe de l’utilisateur prédéfini nommé sysadmin, qui dispose de privilèges d’administration complets.",
  "admin.newPasswordCheckInfo":"Le mot de passe doit comprendre entre 10 et 30 caractères et doit contenir tous les caractères suivants : majuscules, minuscules, chiffres et caractères spéciaux.",
  "logLevel.LogLevel":"Niveau de consignation",
  "debug": "Débogage",
  "logLevel.Value": "Valeur",
  "logLevel.Paramater":"Paramètre",
  "logLevel.Module":"Module",
  "logLevel":"Niveau de consignation",
  "logLevel.update":"Mettre à jour",
  "email": "Service de messagerie",
  "email.host": "Hôte du serveur SMTP",
  "email.port": "Port du serveur SMTP",
  "email.username": "Nom d’utilisateur",
  "email.password": "Mot de passe",
  "email.address": "Adresse SMTP",
  "email.ssl": "Activer SSL et TLS",
  "email.from": "E-mail de l’expéditeur",
  "sma": "Smart Analytics",
  "smarta.scaling": "Mise à l’échelle du groupe de contenu",
  "menu": "Menu",
  //buttons
  "test": "Tester",
  "apply": "Appliquer",
  "save": "Mettre à jour",
  "confirm": "Confirmer",
  "cancel": "Annuler",
  "revert": "Rétablir",
  "ok":"OK",
  "close":"Fermer",
  "yes": "Quitter cette page",
  "no": "Rester sur cette page",
  // messages
  "dataLoading": "Initialiser le chargement des données...",
  "admin.password.notMatch": "Les mots de passe ne correspondent pas !",
  "test.error": "Erreur de test !",
  "test.warning": "Avertissement",
  "validation.empty": "{name} est null !",
  "validation.match": "{name} ne correspond pas !",
  "validation.null": "Entrez une valeur pour ce champ.",
  "validation.port": "Entrez un nombre entre 1 et 65535.",
  "test.succeeded": "Test réussi !",
  "test.failed": "Échec du test !",
  "test.ldap.succeeded": "Connexion LDAP réussie.",
  "test.ldap.failed": "Échec de la connexion LDAP.",
  "warning": "Voulez-vous vraiment quitter cette page ? Tout travail non enregistré sera perdu. ",
  "test.email.succeeded": "Connexion SMTP réussie.",
  "test.email.failed" : "Échec de la connexion SMTP.",
  "update.succeeded":"Mise à jour réussie !",
  "change.password.succeeded":"Réinitialisation du mot de passe réussie.",
  "update.failed":"Échec de la mise à jour !",
  "change.password.failed":"Échec de la réinitialisation du mot de passe.",
  //http code
  "code.400" :"Requête incorrecte",
  "code.401":"Non autorisée",
  "code.403" :"Interdite",
  "code.404":"Introuvable",
  "code.408" :"Requête",
  "code.500":"Erreur interne de serveur",
  "code.502" :"Passerelle incorrecte",
  "code.503":"Service non disponible",
  "code.504":"Expiration du délai pour la passerelle",
  "common.error":"Erreur interne de serveur",
  //apply
  "change.items":"Modifier les éléments",
  "change.services":"Services",
  "apply.succeed":"Configuration appliquée !",
  "apply.confirmApply":"Remarques : cliquez sur OK pour appliquer vos modifications au serveur !",
  "apply.error":"Erreur de serveur !",
  "apply.confirmWarning":"Remarque : un redémarrage des services concernés peut être nécessaire pour que les modifications apportées à la configuration prennent effet. Pour appliquer les modifications et redémarrer les services concernés immédiatement, cliquez sur Confirmer. Pour revenir à la page de configuration, cliquez sur Annuler.",
  "apply.restart":"Avertissement : impossible d’appliquer vos modifications, car le système est toujours en train de traiter une modification de configuration précédente. Fermez la fenêtre ou patientez jusqu’à ce que le système ait appliqué toutes les modifications précédentes.",
  "apply.revertError":"Erreur de rétablissement !",
  "apply.applying":"Application de la configuration",
  "apply.reverting":"Rétablissement de la configuration",
  "apply.confirmApply":"Remarques : cliquez sur OK pour appliquer vos modifications au serveur !",
  "apply.confirmed":"Configuration appliquée !",
  "apply.revert":"Avertissement : le système n’est pas parvenu à redémarrer certains services, et doit revenir à son état précédent. Veuillez cliquer sur Rétablir pour annuler toutes les modifications qui viennent juste d’être apportées."
}

