const cards = (sessionStorage.getItem("cards")!= null)? JSON.parse(sessionStorage.getItem("cards")):[];
/*Input Section */
const add_cards = document.querySelector(".add_cards");
const clear_inputs = document.querySelector(".clear_inputs");
const submit_cards = document.querySelector(".submit_cards");
const summary_cards = document.querySelector("#summary_cards");

const inputs = document.querySelectorAll(".card_inputs input");
const inputs_validators = document.querySelectorAll(".card_inputs span");
const added_msg = document.getElementById("msg");

const clearValues = (ev) => {
  ev.preventDefault();
  for (let index = 0; index < inputs.length; index++) {
    inputs[index].value = "";
  }
  added_msg.textContent = "";
};

const validateInputs = () => {
  let f = true;
  inputs.forEach((input,i) => {
    if(input.value === ''){      
      inputs_validators[i].style.display = "block";
      f = false; 
    }
    else{
      inputs_validators[i].style.display = "none";
    }
  });
  return f;
}

const addValues = (ev) => {
  ev.preventDefault();
  if (validateInputs()) {
    let obj = {
      'id' : Math.random(), //?
      'title': inputs[0].value,
      'description': inputs[1].value,
      'date': inputs[2].value,
    };
    cards.push(obj);
    clearValues(ev);
    display_section.style.visibility = "hidden";
    added_msg.textContent = "Added Successfully.";
    added_msg.style.color = 'green';
  }
};

const goToSummary = (ev) => {
  sessionStorage.setItem("cards", JSON.stringify(cards));
}

add_cards.addEventListener("click", (ev) => addValues(ev));
clear_inputs.addEventListener("click", (ev) => clearValues(ev));
submit_cards.addEventListener("click", (ev) => displayCards(ev));
summary_cards.addEventListener("click", (ev) => goToSummary(ev))

/*Display Section */
const display_section = document.querySelector(".display_section");
const display_cards = document.querySelector(".cards_display");
const display_card = document.querySelector(".cards_display > .display_card");
const displaying_inputs = document.querySelectorAll(
  ".display_card > input[type=text]"
);
const delete_selected = document.querySelector(".display_section > .delete_buttons > .delete_selected");
const delete_all = document.querySelector(".display_section > .delete_buttons > .delete_all");

const displayCards = (ev) => {
  if(ev) ev.preventDefault();
  if (cards.length) {
    display_section.style.visibility = "visible";
    display_cards.innerHTML = '';
    cards.forEach((obj, i) => {

      display_cards.appendChild(display_card.cloneNode(true));
      let title = document.querySelector(`.display_card:nth-child(${i + 1}) .card_details > h3`);
      let description = document.querySelector(`.display_card:nth-child(${i + 1}) .card_details > p`);
      let date = document.querySelector(`.display_card:nth-child(${i + 1}) .card_details > input[type=date]`);
      let id = document.querySelector(`.display_card:nth-child(${i + 1}) .card_details > input[type=hidden]`);


      date.style.paddingLeft = '45px';
      date.style.textAlign = 'center';

      let edit_card = document.querySelector(`.display_card:nth-child(${i + 1}) .edit_card_buttons button`);
      edit_card.addEventListener('click', ev => editCard(ev));

      [id.value, title.textContent, description.textContent, date.value] = Object.values(obj);

    })
  }
};

const editCard = (ev) => {

  let target_card = ev.target.parentNode.parentNode;

  let title = target_card.childNodes[3].childNodes[1];
  let description = target_card.childNodes[3].childNodes[3];
  let date = target_card.childNodes[3].childNodes[5];
  let id = target_card.childNodes[3].childNodes[7];


  if(ev.target.textContent === 'Edit'){ //Edit
    title.contentEditable = true;
    description.contentEditable = true;
    date.disabled = false;

    ev.target.textContent = 'Save';
  }
  else{ //Save 
    title.contentEditable = false;
    description.contentEditable = false;
    date.disabled = true;

    let selected_card = cards.findIndex(c => c.id == id.value);
    cards[selected_card].title = title.textContent;
    cards[selected_card].description = description.textContent;
    cards[selected_card].date = date.value;

    ev.target.textContent = 'Edit';
  }
}

const deleteAll = () => {
  cards.splice(0,cards.length);
  display_section.style.visibility = "hidden";
}

const deleteSelected = () => {
  let checkboxes = document.querySelectorAll(".display_section .display_card input[type=checkbox]");
  let d = 0;
  checkboxes.forEach((ch, i) => {
    if(ch.checked){
      cards.splice(i-d,1);
      d++;
    }
  })

  if(cards.length)
    displayCards();
  else
    display_section.style.visibility = "hidden";
}

delete_all.addEventListener('click', deleteAll);
delete_selected.addEventListener('click', deleteSelected);
