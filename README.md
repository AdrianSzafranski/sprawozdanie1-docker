# Zadanie 1. Część obowiązkowa.

**Podpunkt 3.**

a. Zbudowanie opracowanego obrazu kontenera:<br />
```docker build -t local/sprawozdanie1 .```

b. Uruchomienie kontenera na podstawie zbudowanego obrazu:<br />
```docker run -d --rm --name spr1 -p 5100:8080 local/sprawozdanie1```

c. Sposób uzyskania informacji, które wygenerował serwer w trakcie uruchamiania kontenera:<br />
```docker logs spr1```

d. Sprawdzenie, ile warstw posiada zbudowany obraz:<br />
```docker image inspect local/sprawozdanie1 | jq '.[].RootFS.Layers'```

Zrzut ekranu okna przeglądarki, potwierdzający poprawne działanie systemu:
![zrzut okna przeglądarki](https://github.com/AdrianSzafranski/chmurki/blob/main/chmurki_dziala.png)

**Podpunkt 4.**

Tak, można zbudować obraz wykorzystując bezpośredni link do Dockerfile umieszczonego na Github oraz przenieść stworzony obraz na swoje konto DockerHub.<br />
Do zbudowania takiego obrazu, można użyć komendy:<br />
```docker build -t <hub-user>/<repo-name>[:<tag>] <url-do-repozytorium>.git#[<nazwa brancha>]>```<br />
- Przykład: ```docker build -t adrianszafranski/studia:test https://github.com/AdrianSzafranski/test.git#main```, gdzie: <br />
jeżeli chcemy przesłać obraz na DockerHub potrzebujemy nazwać obraz według schematu ```<hub-user>/<repo-name>[:<tag>]```, gdzie 'hub-user' to nazwa użytkownika DockerHub, 'repo-name' to nazwa repozytorium, a 'tag' to tag obrazu

Do przeniesienia stworzonego obrazu na swoje konto trzeba użyć komendy: <br />
```docker push <hub-user>/<repo-name>:<tag>``` <br />
- Przykład: ```docker push adrianszafranski/studia:test```

# Zadanie 1. Część dodatkowa.

**Podpunkt 1.**

a. Uruchomienie rejestru w taki sposób by był on dostępny na porcie 6677:<br />
```docker run -d -p 6677:6677 --restart always --name myregistry registry:2```

b. <br />
Pobranie ubuntu w najnowszej wersji:<br />
```docker pull ubuntu```<br />
Zmienienie nazwy pobranego obrazu:<br />
```docker tag ubuntu localhost:6677/ubuntu.local```<br />
Wgranie obrazu do prywatnego rejestru:<br />
```docker push localhost:6677/ubuntu.local```

**Podpunkt 2.**

Uzupełnienie rozwiązania z punktu 1 części dodatkowej zadania 1 o możliwość kontroli dostępu poprzez standardowy mechanizm htpasswd.<br />
- Stworzenie katalogu certyfikatów:<br />
```mkdir -p certs```
- Skopiowanie plików domain.crt i domain.key z urzędu certyfikacji do katalogu certs.
- Zatrzymanie rejestru, jeżeli jest aktualnie uruchomiony:<br />
```docker container stop registry```
- Stworzenie katalogu przechowującego plik z hasłem:<br />
```mkdir auth```
- Stworzenie pliku z hasłem dla użytkownika ```testuser```, z hasłem ```testpassword```:<br />
```docker run --entrypoint htpasswd httpd:2 -Bbn testuser testpassword > auth/htpasswd```
- Uruchomienie rejestru z uwierzytelnianiem podstawowym: 
```
 docker run -d \
  -p 6677:6677 \
  --restart=always \
  --name myregistry \
  -v "$(pwd)"/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  -v "$(pwd)"/certs:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  registry:2
```
