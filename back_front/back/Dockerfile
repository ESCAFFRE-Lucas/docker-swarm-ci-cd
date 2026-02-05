FROM node:18-alpine

 # Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

 # Copier les fichiers de dépendances et installer les paquets
COPY package*.json ./
RUN npm install

 # Copier le reste du code source
COPY . .

 # Exposer le port que l'application écoute
EXPOSE 3000

 # Définir la commande à exécuter au lancement du conteneur
CMD [ "npm", "start" ]