function othello() {
    "use strict";

    let Steen={
        leeg : 0,
        zwart : 1,
        wit : 2,
        vijand: kleur => {
            return kleur===Steen.wit ? Steen.zwart : kleur === Steen.zwart ? Steen.wit : kleur; 
       }
    };    
    let geldigeZetten = 0;
    let spelerKleur;
    let spelersituatie;
    let nieuweRij;
    let nieuweKol;


    class Richting {
        constructor(naam, deltaRij, deltaKol) {
            this.naam = naam;
            this.deltaRij = deltaRij;
            this.deltaKol = deltaKol;
        }
    }

    let richtingen=[
        new Richting("noord",1,0),
        new Richting("noordoost",1,1),    
        new Richting("oost",0,1),
        new Richting("zuidoost",-1,1),
        new Richting("zuid",-1,0),
        new Richting("zuidwest",-1,-1),
        new Richting("west",0,-1),
        new Richting("noordwest",1,-1),
    ]

    class Bord {
        constructor(rijen, kolommen) {
            this.rijen = rijen;
            this.kolommen = kolommen;
            this.stenen = getStenen();
            this.islStenenRij = [];
            this.islStenenKol = [];
            this.aantal1=0;
            this.aantal2=0;
            this.zwartPast = false;
            this.witPast = false;

            function getStenen() {
                let result = [];
                for (let rij = 0; rij < rijen; rij++) {
                    result.push([]);
                    for (let kol = 0; kol < kolommen; kol++) {
                        result[rij].push(Steen.leeg);
                    }
                }
                return result;
            }
        }
        isGeldigeZetZonderZet(rij, kol, kleur) {
            if(this.isInBord(rij, kol) && this.isLeeg(rij, kol)&& this.sluitViandInZZ(rij, kol, kleur)){
                return true;
            }
            else
                return false;
        }
        sluitViandInZZ(rij, kol, kleur) {
            let ingeslotenviand = false;
            for (let richting of richtingen) {
                if (this.sluitViandInRichting(richting, rij, kol, kleur)) {
                    ingeslotenviand = true;
                }
            }
            this.islStenenRij.length = 0;
            this.islStenenKol.length = 0;
            if(ingeslotenviand)
                return true;
            else
                return false;
        }
        isGeldigeZet(rij, kol, kleur) {
            if(this.isInBord(rij, kol) && this.isLeeg(rij, kol)&& this.sluitViandIn(rij, kol, kleur)){
                return true;
            }
            else
                return false;
        }        
        isLeeg(rij, kol) {
            if (bord.stenen[rij][kol] === Steen.leeg)
                return true;
            else
                return false;
        }
        isInBord(rij, kol) {
            if (0<=rij <= bord.rijen && 0<=kol <= bord.rijen)
                return true;
            else
                return false;
        }
        sluitViandIn(rij, kol, kleur) {
            let ingeslotenviand = false;
            for (let richting of richtingen) {
                if (this.sluitViandInRichting(richting, rij, kol, kleur)) {
                    let kle = kleur;
                    for(let i=0;i<this.islStenenKol.length;i++){
                        if(kle===Steen.wit)
                        this.stenen[this.islStenenRij[i]][this.islStenenKol[i]] = Steen.wit;
                    if(kle === Steen.zwart)
                        this.stenen[this.islStenenRij[i]][this.islStenenKol[i]] = Steen.zwart;
                    ingeslotenviand = true;
                    }
                }
            }
            this.islStenenRij.length = 0;
            this.islStenenKol.length = 0;
            if(ingeslotenviand)
                return true;
            else
                return false;
        }
        sluitViandInRichting(richting, rij, kol, kleur) {
            if ( this.viandInRichting(rij, kol, richting, kleur))   
                return this.eigenSteenInRichting(rij, kol, richting, kleur) ? true : false;               
            else
                return false;
        }
        viandInRichting(rij, kol, richting, kleur) {
            let vijand = Steen.vijand(kleur);
            let nieuweSteen = Positie(rij, kol, richting);
            if(nieuweSteen === vijand){
                return  true;
            }
            else{
                return false;
            }
        }
        eigenSteenInRichting(rij, kol, richting, kleur) {
            let vijand = Steen.vijand(kleur);
            do{
            let nieuweSteen  = Positie(rij,kol,richting);
            if(nieuweSteen === vijand){
                this.islStenenRij.push(nieuweRij);
                this.islStenenKol.push(nieuweKol);
            }
            if(nieuweSteen === kleur){
                return true;
            }
            if(nieuweSteen===0){
                this.islStenenRij.length = 0;
                this.islStenenKol.length = 0;
                return false;
            }
            rij = nieuweRij;
            kol = nieuweKol;
            }while(0<rij<this.rijen && 0<kol<this.kolommen);
            this.islStenenRij.length = 0;
            this.islStenenKol.length = 0;
            return false;           
        }
        


        initBord() {
            let rij = this.rijen / 2 - 1;
            let kol = this.kolommen / 2 - 1;
            this.stenen[rij][kol] = Steen.wit;
            this.stenen[rij + 1][kol + 1] = Steen.wit;
            this.stenen[rij][kol + 1] = Steen.zwart;
            this.stenen[rij + 1][kol] = Steen.zwart;
        }
        doeZet(rij,kol,kleur){
                this.stenen[rij][kol] = kleur;
                this.zwartPast = false;
                this.witPast = false;
                tekenBord();
                geldigeZetten++;
                console.log(geldigeZetten + "Zetten zetten");
        }
        isGeldigeZetMog(){
            for (let rij = 0; rij < this.rijen; rij++) {
                for (let kol = 0; kol < this.kolommen; kol++) {
                    if(this.isGeldigeZetZonderZet(rij,kol,spelerKleur)){
                        return true;
                    }                    
                }
            }
            return false;
        }
        passen(){
            if(spelerKleur===Steen.wit)
            {if(this.witPast === false)
                {alert("Geen zet mogelijk voor wit. Je moet passen.");
                geldigeZetten++;
                console.log(geldigeZetten+"Passen Wit");
                }
            this.witPast = true;
            }
            if(spelerKleur===Steen.zwart)
            {if(this.zwartPast === false)
                {alert("Geen zet mogelijk voor zwart. Je moet passen.");
                geldigeZetten++;
                console.log(geldigeZetten+" Passen zwart");
            }
            this.zwartPast = true;
            }
        }
        spelGedaan(){
            this.aantal1 = 0;
            this.aantal2 = 0;
            let aantal0 = 0;
            for (let rij = 0; rij < this.rijen; rij++) {
                for (let kol = 0; kol < this.kolommen; kol++) {
                    if(this.stenen[rij][kol] === 1)
                        this.aantal1++;
                    if(this.stenen[rij][kol] === 2)
                        this.aantal2++;
                    if(this.stenen[rij][kol] === 0)
                        aantal0++;
                }                    
            }
            if(aantal0 === 0)
                return true;
            if(this.witPast&&this.zwartPast){
                return true;
            }
            return false;
        }
        winaarBepalen(){
                if(this.aantal1>this.aantal2){
                    alert("zwart wint");
                    return true;
                }
                if(this.aantal1<this.aantal2){
                    alert("wit wint");
                    return true;
                }
                if(this.aantal1===this.aantal2){
                    alert("gelijk stand");
                    return true;
                }
                return false;
        }
        leegmaken(){
            for (let rij = 0; rij < this.rijen; rij++) {
                for (let kol = 0; kol < this.kolommen; kol++) {
                    this.stenen[rij][kol] = Steen.leeg;
                }
            }
        }
    }
    let bord = new Bord(8,8);
    const grootte = 75;

    let canvas = document.getElementById("bordCanvas");
    let ctx = canvas.getContext("2d");
    changeSpelersituatie();
    changeBordgrootte();
    document.getElementById("myBtn").addEventListener("click", function(){
        newGame();
        alert("Nieuw spel begint als je op oke drukt")
      });    
    bord.initBord();
    tekenBord();

    function tekenBord() {
        canvas.width = grootte * bord.kolommen;
        canvas.height = grootte * bord.rijen;
        ctx.strokeStyle = "silver";
        for (let rij = 0; rij < bord.rijen; rij++) {
            for (let kol = 0; kol < bord.kolommen; kol++) {
                tekenVak(rij,kol);
                let steen = bord.stenen[rij][kol];
                if(steen===Steen.wit||steen===Steen.zwart)
                { tekenSteen(rij,kol,steen);}
            }
        }
    }

    function tekenSteen(rij,kol,steen) {
        let straal = grootte/ 5 * 2;
        let offset = grootte/2;
        ctx.beginPath();
        ctx.fillStyle = steen === Steen.wit ? "white" : "black";
        ctx.arc(kol * grootte + offset, rij * grootte + offset, straal, 0, Math.PI * 2);
        ctx.fill();
    }

    function tekenVak(rij,kol) {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.rect(kol * grootte,rij * grootte, grootte, grootte);
        ctx.stroke();
        ctx.fill();
    }

    function bordKlik(event){
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        let rij = Math.floor(y / grootte);
        let kol = Math.floor(x / grootte);
        if(spelersituatie == "2spelers"){        
            if(geldigeZetten%2===0)
                {spelerKleur = 1;
                if(bord.isGeldigeZetMog()){
                    if(bord.isGeldigeZet(rij,kol,spelerKleur))
                        bord.doeZet(rij,kol,spelerKleur)
                    else
                        alert("Je zet is ongeldig.")
                }
                else
                    bord.passen();
                if(bord.spelGedaan())
                    bord.winaarBepalen();}
            else
                {spelerKleur = 2;
                if(bord.isGeldigeZetMog()){
                    if(bord.isGeldigeZet(rij,kol,spelerKleur))
                        bord.doeZet(rij,kol,spelerKleur)
                    else
                        alert("Je zet is ongeldig.")
                }
                else
                    bord.passen();
                if(bord.spelGedaan())
                    bord.winaarBepalen();}
        }
        if(spelersituatie == "1speler"){
            if(geldigeZetten%2===0){
                spelerKleur = 1;
                if(bord.isGeldigeZetMog()){
                    if(bord.isGeldigeZet(rij,kol,spelerKleur)){ 
                        bord.doeZet(rij,kol,spelerKleur)
                        if(bord.spelGedaan())
                            bord.winaarBepalen();
                        var TimeOut = setTimeout(function(){  
                        spelerKleur =2;
                        if(bord.isGeldigeZetMog())
                            ComputerZet();
                        else
                            bord.passen();
                        if(bord.spelGedaan())
                        {   clearTimeout(TimeOut);
                            bord.winaarBepalen();}
                        },1000);
                    }
                    else
                        alert("Je zet is ongeldig.")
                }
                else{
                    bord.passen();
                    if(bord.spelGedaan())
                            bord.winaarBepalen();
                    var TimeOut = setTimeout(function(){  
                    spelerKleur =2;
                    if(bord.isGeldigeZetMog())
                        ComputerZet();
                    else
                        bord.passen();
                    if(bord.spelGedaan())
                    {   clearTimeout(TimeOut);
                        bord.winaarBepalen();}
                    },1000);
                }
                
            }
        }
    }
    
    
    function Positie(rij,kol,richting){
        nieuweRij=rij+richting.deltaRij;
        nieuweKol=kol+richting.deltaKol;
        if(nieuweKol<0||nieuweRij<0||nieuweKol>(bord.kolommen-1)||nieuweRij>(bord.rijen-1))
            return 0;
        return bord.stenen[nieuweRij][nieuweKol];
    }

    function newGame(){
        geldigeZetten = 0;
        bord.leegmaken();
        bord.initBord();
        tekenBord();
    }
    function ComputerZet(){
        let geldigeZet = false;
        let randomRij;
        let randomKol;
        do{
            randomRij = Math.floor(Math.random()*bord.rijen);
            randomKol = Math.floor(Math.random()*bord.kolommen);
            console.log("rij " + randomRij, "kolom " +randomKol);
            if(bord.isGeldigeZet(randomRij,randomKol,spelerKleur))
                geldigeZet=true;
            console.log(geldigeZet?"Geldige Zet" : "Ongeldige Zet")
        }while(!geldigeZet)
        if(geldigeZet){
            bord.doeZet(randomRij,randomKol,spelerKleur); 
        }
    }
    function changeSpelersituatie(){
        var rad = document.myForm.spelersituatie;
        var situ = null;
        var inter;
        for (var i = 0; i < rad.length; i++) {
            rad[i].addEventListener('change', function() {
                (situ) ? console.log(situ.value): null;
                newGame();
                if(inter!== undefined){
                    clearInterval(inter);}
                if (this !== situ) {
                    situ = this;
                }
                if(this.value == "2spelers"){
                    canvas.addEventListener("click" , bordKlik, false);
                    spelersituatie = this.value;
                }
                if(this.value == "1speler"){        
                    canvas.addEventListener("click" , bordKlik, false);
                    spelersituatie = this.value;
                }
                if(this.value == "2computers"){
                    inter = setInterval(() => {           
                        if(geldigeZetten%2 ===0){
                            spelerKleur = 1;
                            if(bord.isGeldigeZetMog()){
                                ComputerZet();
                            }
                            else{
                                bord.passen();
                            }
                            if(bord.spelGedaan())
                                {bord.winaarBepalen();
                                clearInterval(inter);}                       
                        }
                        else
                        {
                            spelerKleur = 2;
                            if(bord.isGeldigeZetMog()){
                                ComputerZet();
                            }
                            else{
                                bord.passen();
                            }
                            if(bord.spelGedaan())
                                {bord.winaarBepalen();
                                clearInterval(inter);}
                        }                                          
                    }, 1000);
                }
            });
        }
    }
    function changeBordgrootte(){
        var rad = document.getElementById('bordgrootte');
        var situ = null;
        rad.addEventListener('change', function() {
            (situ) ? console.log(situ.value): null;
                if (this !== situ) {
                    situ = this;
                }
                if(this.value === "4X4"){
                    bord= new Bord(4,4);
                    newGame();
                }
                if(this.value === "6X6"){
                    bord= new Bord(6,6);
                    newGame();
                }
                if(this.value === "8X8"){        
                    bord= new Bord(8,8);
                    newGame();
                }
                if(this.value === "10X10"){
                    bord= new Bord(10,10);
                    newGame();
                }
                if(this.value === "12X12"){
                    bord= new Bord(12,12);
                    newGame();
                }
                if(this.value === "14X14"){
                    bord= new Bord(14,14);
                    newGame();
                }
                if(this.value === "16X16"){
                    bord= new Bord(16,16);
                    newGame();
                }
            });
        
    }   
}