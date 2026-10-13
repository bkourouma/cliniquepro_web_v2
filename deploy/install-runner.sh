#!/usr/bin/env bash
# Installe le runner GitHub Actions du dépôt bkourouma/cliniquepro_web_v2 (site vitrine
# CliniquePro) sur le serveur « alliance », sur le modèle des runners existants (dossier
# ~/actions-runner-<nom>, service systemd, utilisateur deployer).
#
# À exécuter sur le serveur, UNE seule fois, en UNE connexion SSH (sshd coupe
# les connexions répétées) :
#
#   TOKEN=$(gh api -X POST repos/bkourouma/cliniquepro_web_v2/actions/runners/registration-token --jq .token)
#   ssh alliance 'bash -s' -- "$TOKEN" < deploy/install-runner.sh
#
# Le jeton d'enregistrement (valable 1 heure) est passé en argument : il n'est
# écrit nulle part. Aucun secret dans ce fichier.
set -euo pipefail

TOKEN="${1:?jeton enregistrement requis}"
REPO_URL="https://github.com/bkourouma/cliniquepro_web_v2"
DIR="$HOME/actions-runner-cliniquepro-site"
NAME="cliniquepro-site-runner"
LABEL="cliniquepro-site"
VERSION="2.337.0"   # même version que les runners existants (ils se mettent à jour seuls ensuite)

if [ -e "$DIR/.runner" ]; then
  echo "Un runner est déjà configuré dans $DIR : rien à faire." >&2
  exit 1
fi

mkdir -p "$DIR"
cd "$DIR"
curl -fsSL -o runner.tar.gz \
  "https://github.com/actions/runner/releases/download/v${VERSION}/actions-runner-linux-x64-${VERSION}.tar.gz"
tar -xzf runner.tar.gz
rm -f runner.tar.gz

./config.sh --unattended --url "$REPO_URL" --token "$TOKEN" --name "$NAME" --labels "$LABEL" --replace

if sudo -n true 2>/dev/null; then
  sudo ./svc.sh install "$(id -un)"
  sudo ./svc.sh start
  sleep 3
  sudo ./svc.sh status | head -5
else
  echo "sudo demande un mot de passe : runner configuré mais pas installé comme service." >&2
  echo "Terminer à la main : cd $DIR && sudo ./svc.sh install $(id -un) && sudo ./svc.sh start" >&2
  exit 2
fi
