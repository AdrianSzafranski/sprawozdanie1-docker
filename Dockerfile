#wybranie bazowego obrazu
FROM node:alpine

#informacja o autorze pliku
LABEL autor = 'Adrian Szafrański'

#ustawienie katalogu roboczego
WORKDIR /usr/app

#skopiowanie plików package.json oraz package-lock.json do obrazu
COPY package*.json ./

#instalacja npm
RUN npm install

#skopiowanie reszty plików do obrazu
COPY ./ ./

#ustawienie portu
EXPOSE 8080
#uruchomienie serwera
CMD ["node", "serwer.js"]
