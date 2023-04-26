async function addMovieForm() {
  const { value: formValues } = await Swal.fire({
    title: "Add movie",
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Title">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Author">' +
      '<input id="swal-input3" class="swal2-input" placeholder="Release date">',
    focusConfirm: false,
    preConfirm: async () => {
      try {
        const titulo = document.getElementById("swal-input1").value;
        const autor = document.getElementById("swal-input2").value;
        const estreno = parseInt(document.getElementById("swal-input3").value);
        const jwt = localStorage.getItem("token");
        const response = await fetch("/peliculas", {
          method: "POST",
          body: JSON.stringify({ titulo, autor, estreno }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        });

        if (response.ok) {
          console.log("ok");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (formValues) {
    Swal.fire("Success", "The movie was added", "success");
  }
}

function autocomplete(inp) {
  // the function take two arguments, the input data field and the data
  var currentFocus;
  inp.addEventListener("input", async function (e) {
    var a,
      b,
      i,
      movies,
      val = this.value;

    const response = await fetch("/peliculas?s=" + encodeURIComponent(val), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      movies = await response.json();
      console.log(movies);
    }

    closeAllLists(); // close any already open lists of autocompleted values
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV"); // div that will contain the items (values)
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a); // append the div as a child of the autocomplete container
    for (i = 0; i < movies.length; i++) {
      b = document.createElement("DIV"); // div element for each matching element
      // make the matching letters bold
      if (movies[i].titulo.toUpperCase().indexOf(val.toUpperCase()) > -1) {
        // create a div element for each matching element
        b = document.createElement("DIV");
        // bold the matching substrings
        let name = movies[i].titulo;
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
        b.innerHTML += "<input type='hidden' value='" + movies[i].titulo + "'>";
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
      b.innerHTML += "<input type='hidden' value='" + movies[i].titulo + "'>";
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

autocomplete(document.getElementById("myInput"));

// Checking for a valid user

function logOut() {
  localStorage.removeItem("token");
  window.location = "/login.html";
}

if (localStorage.getItem("token")) {
  document.querySelector(".login").innerHTML = `
  <div style="font-weight: bold;" id="loginText">Log Out</div>
  <div class="icon-container">
	  <a onclick="logOut()"class="icon" style="cursor: pointer"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
			  <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
		  </svg></a>
  </div>`;
} else {
  document.querySelector(
    ".login"
  ).innerHTML = ` <div style="font-weight: bold;" id="loginText">Log In</div>
  <div class="icon-container">
	  <a href="/login.html" class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
			  <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
		  </svg></a>
  </div>`;
}

if (localStorage.getItem("token")) {
  document.querySelector(
    ".crud-container"
  ).innerHTML = `        <a onclick="addMovieForm()" class="addMovie">Add</a>
  <a onclick="">Delete</a>`;
}

document
  .getElementById("selectedMovie")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("aqui");
    try {
      const movieName = document.getElementById("myInput").value;
      const response = await fetch("/peliculas/" + movieName, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const infoMovie = await response.json();
        document.getElementById("infoMovie").innerHTML = infoMovie.autor;
      }
    } catch (error) {
      console.log(error);
    }
  });
