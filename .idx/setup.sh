# unset NPM_CONFIG_PREFIX

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

source ~/.bashrc

nvm use

corepack enable

corepack use pnpm@@10.0.0-beta.0