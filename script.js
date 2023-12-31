const countries_el = document.getElementById("countries");
const darkmode_btn = document.getElementById("dark-mode");
const search_el = document.getElementById("search");
const filter_btn = document.getElementById("filter");
const filter_region = filter_btn.querySelectorAll("li");
const modal = document.getElementById("modal");
const close_btn = document.getElementById("close");

get_countries();

function sort_by_key(array) {
  return array.sort(function (a, b) {
    var x = a.name.common;
    var y = b.name.common;

    return x < y ? -1 : x > y ? 1 : 0;
  });
}

async function get_countries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  sort_by_key(countries);
  display_countries(countries);
}

function display_countries(countries) {
  countries_el.innerHTML = "";

  countries.forEach((country) => {
    const country_el = document.createElement("div");

    country_el.classList.add("card");

    country_el.innerHTML = `
            <div class="card-header">
                <img src="${country.flags.svg}" alt="Peru">
            </div>
            <div class="card-body">
                <h2 class="country-name m16 m24">
                    ${country.name.common}
                </h2>
                <p class="country-codes" style="display: none">
                    <b>Codes: </b>${country.cca2}, ${country.cca3}
                </p><br />
                <p class="country-capital">
                    <b>Capital: </b>${country.capital}
                </p><br />
                <p class="country-region">
                    <b>Region: </b>${country.region}
                </p><br />
                <p class="country-population">
                    <b>Population: </b>${country.population.toLocaleString()}
                </p>
            </div>
        `;

    country_el.addEventListener("click", () => {
      modal.style.display = "flex";
      show_country_details(country);
    });

    countries_el.appendChild(country_el);
  });
}

function show_country_details(country) {
  const modal_body = modal.querySelector(".modal-body");
  const modal_img = modal.querySelector("img");

  modal_img.src = country.flags.png;

  {
    currencies = Object.keys(country.currencies);
    var currencies_list = "";
    currencies.forEach((key) => {
      currencies_list = currencies_list + country.currencies[key].name + ", ";
    });
    currencies_list = currencies_list.slice(0, -2);
  }

  {
    languages = Object.keys(country.languages);
    var languages_list = "";
    languages.forEach((key) => {
      languages_list = languages_list + country.languages[key] + ", ";
    });
    languages_list = languages_list.slice(0, -2);
  }

  modal_body.innerHTML = `
        <h2 class=country-name">${country.name.common}</h2>
        <div style="
        margin-top: 40px;
        display: flex;
        flex-direction: row;
        gap: 40px;
        flex-wrap: wrap;
        font-size: 14px;
        margin-bottom: 20px">
            <div style="
        display: flex;
        flex-direction: column;
        gap: 4px;">
                <p>
                    <b>Native Name:</b>
                    ${country.altSpellings[1]}
                </p>
                <p>
                    <b>Population:</b>
                    ${country.population.toLocaleString()}
                </p>
                <p>
                    <b>Region:</b>
                    ${country.region}
                </p>
                <p>
                    <b>Sub Region:</b>
                    ${country.subregion}
                </p>
                <p>
                    <b>Capital:</b>
                    ${country.capital}
                </p>
            </div>
            <div style="
            display: flex;
            flex-direction: column;
            gap: 4px;">
                <p>
                    <b>Top Level Domain:</b>
                    ${country.tld}
                </p>
                <p>
                    <b>Currencies:</b>
                    ${currencies_list}
                </p>
                <p>
                    <b>Languages:</b>
                    ${languages_list}
                </p>
            </div>
        </div>
        <p>
            <b>Border Countries:</b>
            ${country.borders}
        </p>
    `;
}

document.body.classList.toggle("dark");

darkmode_btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

filter_btn.addEventListener("click", () => {
  filter_btn.classList.toggle("open");
});

close_btn.addEventListener("click", () => {
  modal.style.display = "none";
});

search_el.addEventListener("input", (e) => {
  const search_term = e.target.value;
  const query_list = document.querySelectorAll(".country-name");

  var results_count = 0;

  query_list.forEach((i) => {
    if (i.innerText.toLowerCase().includes(search_term.toLowerCase())) {
      i.parentElement.parentElement.style.display = "block";
      results_count++;
    } else {
      i.parentElement.parentElement.style.display = "none";
    }
  });

  if (results_count == 0) {
    console.log("No results!");
  }
});

filter_region.forEach((filter) => {
  filter.addEventListener("click", (e) => {
    filter_value = filter.innerHTML;
    const query_list = document.querySelectorAll(".country-region");
    query_list.forEach((i) => {
      console.log("innerText: " + i.innerText);
      if (i.innerText.includes(filter_value) || filter_value === "All") {
        i.parentElement.parentElement.style.display = "block";
      } else {
        i.parentElement.parentElement.style.display = "none";
      }
    });
  });
});
