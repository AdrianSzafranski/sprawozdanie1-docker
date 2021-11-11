//import modułów
import node_iplocate from 'node-iplocate';
import public_ip from 'public-ip';
import http from 'http';

//pozostawienie w logach informacji o dacie uruchomienia, autorze 
//oraz porcie TCP, na którym serwer nasłuchuje na zgłoszenia klienta
console.log("Data uruchomienia: " + new Date().toLocaleString('pl-PL'));
console.log("Autor serwera: Adrian Szafrański");
console.log("port TCP: 8080");

//Utworzenie serwera HTTP, który nasłuchuje porty serwera i zwraca odpowiedź klientowi
http.createServer(async function (req, res) {

    //pobranie ip v4 klienta
    var ip = await public_ip.v4();

    //zawarcie adresu IP klienta w odpowiedzi
    res.write('adres IP klienta: ' + ip + "\n");

    //znalezienie danych geolokalizacyjnych z adresu IP klienta
    await node_iplocate(ip).then(function(results) {

        //zawarcie daty i godziny strefy czasowej klienta w odpowiedzi
        res.write("Data i godzina w strefie czasowej klienta: " +
        new Date().toLocaleString('pl-PL', results.time_zone));
    });

    //zakończenie odpowiedzi
    res.end();

}).listen(8080); //obiekt serwera nasluchuje na porcie 8080
