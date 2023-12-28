// --> Syncing ...............................................................
// #.Saving
function saveData() {
    const saving = JSON.stringify([...persons]);
    localStorage.setItem("persons", saving);
}

// #.Loading
function loadData() {
    const loading = new Map(JSON.parse(localStorage.getItem("persons")));
    return loading;
}

// --> Varibles ...............................................................
// #.Constants
var START_DATE = 2;
var LENGTH_OF_MONTH = 31-START_DATE;
var chptr = 0;

// #.Variables
var persons = new Map();
var listen = new Map();

listen.set(1, "أحمد");
listen.set(2, "الشيخ أنس");
listen.set(3, "حمزة");
listen.set(4, "سعد");
listen.set(5, "سعد");
listen.set(6, "عبدالله");
listen.set(7, "عبد الرحمن");
listen.set(8, "حاتم | عبدالعزيز");


var submit = document.getElementById("submit");
var generate = document.getElementById("generate");
var sync = document.getElementById("sync");
var remove = document.getElementById("delete_button");
var save = document.getElementById("save");
var print = document.getElementById("print");

var chapters = document.getElementById("chapters");
var person_name = document.getElementById("name");
var delete_key = document.getElementById("delete_field");

var table = document.getElementById("table");
var ftable = document.getElementById("ftable");

// --> Functions ...............................................................
// #.Helper Functions  
function addRow(table, index, ...args) {
    let newRow;
    if (index == -1) {
        newRow = table.insertRow();
    } else {
        newRow = table.insertRow(index);
    }

    for (let i = 0; i < args.length; i++) {
        let cell = newRow.insertCell(i);
        cell.innerHTML = args[i];
    }
}

function updateRow(...args) {
    document.querySelectorAll("td").forEach((td) => {
        if (td.innerHTML == args[0]) {
            td.nextSibling.innerHTML = args[1];
        }
    });
}

function showData() {

    for (let [key, value] of persons) {
        addRow(table, -1, key, value);
    }
}

function shiftMap(map) {
    let newMap = new Map();
    let keys = [...map.keys()];
    let values = [...map.values()];

    let lastKey = keys[keys.length - 1];
    let lastValue = values[values.length - 1];

    newMap.set(lastKey, lastValue);
    for (let i = 0; i < keys.length; i++) {
        newMap.set(keys[i], values[i]);
    }

    return newMap;
}

// #.Events Functions
// Buttons
function addPerson() {
    if (persons.has(person_name.value)) {
        persons.set(person_name.value, chapters.value);

        updateRow(person_name.value, chapters.value);
    } else {
        persons.set(person_name.value, chapters.value);
        addRow(table, -1, person_name.value, chapters.value);
    }
}

function createTable() {
    // Clearing Table
    while (ftable.rows.length > 1) {
        ftable.deleteRow(1);
    }

    let day = START_DATE;
    let chapter = chptr;
    let number_of_epchos = 0;
    let number_of_chapters_inOneDay = 0;
    let percent = 0;
    let f_shift = false
    let lisn = 1;

    let = number_of_chapters_inOneDay = [...persons.values()].reduce((total, num) => {
        return total + parseInt(num);
    }, 0);

    let values = [...persons.values()];
    let keys = [...persons.keys()];


    for (let i = 0; i < LENGTH_OF_MONTH; i++) {
        for (let i = 0; i < persons.size; i++) {

            let value = "";

            if (f_shift & i == 0) {
                persons = shiftMap(persons);
                values = [...persons.values()];
                keys = [...persons.keys()];
                f_shift = false;
            }

            for (let j = 0; j < values[i]; j++) {

                chapter++;
                percent++;

                if (chapter > 60) {
                    chapter = 1;
                    number_of_epchos++;
                    f_shift = true;
                }


                if (percent > 60) percent = percent - 60;

                value = value + "," + Math.ceil(chapter);
                value = value.replace(/^,/, "");

            }
            if (lisn > 8) lisn = 1;
            addRow(ftable, -1, day, keys[i], value,listen.get(lisn++));
        }

        day++;
    }
    percent = percent / 60 * 100;
    //alert("Number of Epchos: " + (number_of_epchos + (percent / 100))
    //    + "\nNumber of Chapters in One Day: " + number_of_chapters_inOneDay / 2
    //    + "\nPercent: " + (percent) + "%")
    spanCell();
}

function syncData() {
    persons = loadData();
    showData();
}

function deleteData() {
    let key = delete_key.value;
    persons.delete(key);
    document.querySelectorAll("td").forEach((td) => {
        if (td.innerHTML == key) {
            td.parentNode.remove();
        }
    }
    );
}

function spanCell() {
// Spanning Cells & Coloring
    let td = document.querySelectorAll("#ftable tr td:first-child");
    let inc = 2 ; 
    for (let i = 0; i < td.length - 1; i++) {

        if (td[i].innerHTML == td[i + 1].innerHTML) {
            td[i].setAttribute("rowspan", persons.size);

            td[i].style.backgroundColor = "#2f75b5";
            td[i].style.color = "white";

            td[i + 1].remove();
        }
    }

// Add Break page on printing 
    let tr = document.querySelectorAll(`#ftable tr:not(:first-child)`);
    for (let i = 1; i < (tr.length / persons.size)-persons.size*2+(START_DATE) ; i++) {
        let x = (i * persons.size) + persons.size*i
        tr[x].style.pageBreakBefore = "always";
    }
}

function printTable() {
    $(document.querySelector(".cont")).printThis();

}
// --> Events ...............................................................
// #.Buttons
submit.addEventListener("click", addPerson);
generate.addEventListener("click", createTable);
sync.addEventListener("click", syncData);
remove.addEventListener("click", deleteData);
save.addEventListener("click", saveData);
print.addEventListener("click", printTable);


// #.keyDown
chapters.addEventListener("keydown", event => event.key === "Enter" ? addPerson() : null);
person_name.addEventListener("keydown", event => event.key === "Enter" ? addPerson() : null);
delete_key.addEventListener("keydown", event => event.key === "Enter" ? deleteData() : null);

// Temporary
syncData();
createTable();