function autocomplete(inp, data) {
  // the function take two arguments, the input data field and the data
  console.log(data.nombre);
  var currentFocus;
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    closeAllLists(); // close any already open lists of autocompleted values
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV"); // div that will contain the items (values)
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a); // append the div as a child of the autocomplete container
    for (i = 0; i < data.length; i++) {
      if (
        // check if the item include the same letters as the text field value
        data[i].nombre.toUpperCase().includes(val.toUpperCase())
      ) {
        b = document.createElement("DIV"); // div element for each matching element
        // make the matching letters bold
        if (data[i].nombre.toUpperCase().indexOf(val.toUpperCase()) > -1) {
          // create a div element for each matching element
          b = document.createElement("DIV");
          // bold the matching substrings
          let name = data[i].nombre;
          let index = name.toUpperCase().indexOf(val.toUpperCase());
          let matchedSubstring = name.substr(index, val.length);
          let beforeSubstring = name.substr(0, index);
          let afterSubstring = name.substr(index + val.length);
          // concatenate the substrings with the bold tag
          b.innerHTML =
            beforeSubstring +
            "<strong>" +
            matchedSubstring +
            "</strong>" +
            afterSubstring;
          // insert an input field that will hold the current data item's value:
          b.innerHTML += "<input type='hidden' value='" + data[i].nombre + "'>";
          // execute a function when someone clicks on the item value (DIV element):
          b.addEventListener("click", function (e) {
            // insert the value for the autocomplete text field:
            inp.value = this.getElementsByTagName("input")[0].value;
            // close the list of autocompleted values, (or any other open lists of autocompleted values):
            closeAllLists();
          });
          // append the DIV element to the autocomplete container:
          a.appendChild(b);
        }

        /*insert a input field that will hold the current dataay item's value:*/
        b.innerHTML += "<input type='hidden' value='" + data[i].nombre + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
										(or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the dataow DOWN key is pressed,
						increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the dataow UP key is pressed,
						decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
				except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

async function loadMovies() {
  const response = await fetch("/peliculas", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const movies = await response.json();
    console.log(movies);

    autocomplete(document.getElementById("myInput"), movies);
  }
}

loadMovies();
