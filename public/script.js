//preconditie: i, z apartin [0,299]; selected=0, totalReserved= val din (0,300)
//postconditie: aux=1 -locul ocupat, selected >0, totalReserved>=totalReserved initial
//invariantul: aux;
//de verificat corectitudinea: la selectarea unui loc sa se faca conversia dupa formula si butonul sa se faca rosu, loc_selectat sa fie egal cu numarul de locuri selectate  si total reserved = loc rezervat + locurile din BD
//finitudinea

//Pp ca aux=1
var total_locuri_sala = 299;
function f(z) {
  x = document.getElementById("locuri");
  y = x.getElementsByTagName("td");

  //determinarea complexitatii in functie ordinea alegerii locului
  //caz favorabil: daca sala este goala vectorul z este gol, z.length=0 => O(n);
  //caz nefavorabil: daca sala este deja aproape plina, z.length se apropie de total_locuri_sala =>O(n^2)

  //preconditie: aux=0 pentru orice i de la 0-299
  //postconditie: aux=1 pentru z[j]=i, i de la 0-299, j de la 0-length(z)-1, aux[i]=0 z[j]!=i
  //invariantul: aux,
  //Pp ca aux=0

  //pas k :Pp ca k=z[j] =>aux =1

  //pas k+1:aux=1, z[j]=k+1,
  //aux=0, z[j]!=k+1, oricare ar fi j din 0-length(z)
  //finitudine: ciclu 1 :fct descrescatoare tatal_locuri_sala +1-i
  // ciclu 2 :fct descrescatoare z.length +1-j

  for (i = 0; i <= total_locuri_sala; i++) {
    aux = 0;

    for (j = 0; j < z.length; j++) {
      if (i == z[j]) {
        aux = 1;
      }
    }
    if (aux == 0) {
      p = y[i];

      p.setAttribute("data-ticketdb", "0");
      p.setAttribute("data-rezervat", "0");
    } else {
      p = y[i];
      //
      p.setAttribute("data-ticketdb", "1");
      p.setAttribute("data-rezervat", "1");
      loc_ocupat_total++;
    }
  } //selectare locuri
  // preconditie: loc_ocupat=0, loc_ocupat_total=z.length, loc_ocupat<loc_acupat_total,
  // pentru fiecare loc p ce nu apartine lui z p.dataset.rezervat=0;
  // postconditie:loc_ocupat=numarul de locuri selectate de user (p.dataset.rezervat=1), unde p.data.rezervat!=p.data.ticketDB,
  // loc_ocupat_total=z.length + loc_ocupat ,  pentru fiecare loc p selectat de user  p.dataset.rezervat=1;
  // invariantul: loc_ocupat
  // pas 1 :loc_ocupat=0; p.data.rezervat=0; oricare ar fi p.data.rezervat!=p.data.ticketDB
  // pp ca userul selecteaza k locuri, unde p.data.ticketDB==0 && p.data.rezervat=0 , pentru orice p din cele k locuri selectate
  // pas k:p.data.rezervat=1,pentru orice p din cele k locuri selectate, loc_ocupat[k]=k,  loc_ocupat_total=z.length +k; pentru orice p,
  // k<total_locuri_sala-loc_ocupat_total
  // pas k+1: pp ca userul deselecteaza j locuri  din cele k selectate, p.data.rezervat=0, pentru oricare p din cele j locuri
  // loc_ocupat[k+1]=loc_ocupat[k]-j,  loc_ocupat_total-=j , j<k;
  // finitudine: ciclu 1 :fct descrescatoare tatal_locuri_sala +1-i
  // caz favorabil:  daca userul doar selecteaza locurile => O(n);
  // caz nefavorabil: daca userul selecteaza locurile, dar se razgandeste si apoi le deselecteaza =>O(n^2)
  // Observatie: complexitatea se calculeaza in functie nr de apeluri a functiei  p.addEventListener('click') pentru selectarea/deselectarea locurilor din interfata

  for (i = 0; i <= total_locuri_sala; i++) {
    p = y[i];
    let rez = p.getAttribute("data-rezervat");
    prelucrare_loc(p, i);
    p.addEventListener("click", function () {
      if (this.dataset.rezervat == 1 && this.dataset.ticketdb == 0) {
        loc_ocupat--; 
        loc_ocupat_total--;
        this.dataset.rezervat = 0;
        let rez = 1;
        prelucrare_loc(this, i);
        document.getElementById("numarloc").innerHTML = loc_ocupat;
        document.getElementById("numarloct").innerHTML = loc_ocupat_total;
      } else {
        if (this.dataset.rezervat == 0 && this.dataset.ticketdb == 0) {
          loc_ocupat++;
          loc_ocupat_total++;
          let rez = 0;
          this.dataset.rezervat = 1;
          prelucrare_loc(this, i);
          document.getElementById("numarloc").innerHTML = loc_ocupat;
          document.getElementById("numarloct").innerHTML = loc_ocupat_total;
        }
      }

      vect = [];
      for (i = 0; i <= 299; i++) {
        p = y[i];
        if (p.dataset.rezervat == 1) {
          vect.push(i);
        }
      }

      vect2 = [];
      for (i = 0; i < vect.length; i++) {
        aux2 = 0;
        for (j = 0; j < z.length; j++) {
          if (vect[i] == z[j]) {
            aux2 = 1;
          }
        }
        if (aux2 == 0) {
          vect2.push(vect[i]);
        }
      }
      vectl = [];
      vectc = [];
      mesajloc = "";
      for (i = 0; i < vect2.length; i++) {
        x1 = ((vect2[i] % 15) + 1).toFixed(0);
        x2 = ((vect2[i] - x1) / 15 + 1).toFixed(0);
        vectl.push(x2);
        vectc.push(x1);
      }
      for (i = 0; i < vectl.length; i++) {
        mesajloc = mesajloc + vectl[i] + "/" + vectc[i] + "; ";
      }
      document.getElementById("mesajlocuri").innerHTML = mesajloc;
    });
  }
  document.getElementById("numarloc").innerHTML = loc_ocupat;
  document.getElementById("numarloct").innerHTML = loc_ocupat_total;
}

var loc_ocupat = 0;
var loc_ocupat_total = 0;

function prelucrare_loc(p, rez) {
  if (
    p.style.backgroundColor == "red" &&
    p.getAttribute("data-ticketdb") == 1
  ) {
    alert("Locul selectat este deja ocupat.");
    //d = document.getElementsByTagName("td");
  } else {
    if (
      p.style.backgroundColor == "red" &&
      p.getAttribute("data-ticketdb") == 0 &&
      p.getAttribute("data-rezervat") == 1
    ) {
      p.style.backgroundColor = "MediumSeaGreen";
    } else {
      if (p.dataset.rezervat == 0) {
        p.style.backgroundColor = "MediumSeaGreen";
      } else {
        p.style.backgroundColor = "red";
      }
    }
  }
}
//Incarcare asincrona AJAX
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "desprenoi", true);
  xhttp.send();
}
