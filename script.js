"use strict";

// I don't really understand what I'm getting when I interact with the dom
const buttons = document.querySelectorAll("button");
console.log(buttons);

const checkForItem = (id) =>
  document.getElementById(`item-${id[id.length - 1]}-cart`);

function updateQuantity(item, line, increment = true) {
  // grab elements
  console.log(item);
  console.log(line);
  const price = getPrice(item);
  const quantityElement = line.querySelector(".item-quantity");
  const itemTotalPrice = line.querySelector(".item-cost-label");
  const overallTotalPrice = document.getElementById("total-price");

  // extract and transform to numbers
  let newQuantity = Number(quantityElement.textContent.replace("x", ""));
  let newItemTotal = Number(itemTotalPrice.textContent.replace("$", ""));
  let newOverallTotal = Number(
    overallTotalPrice.textContent.replace("Total: $", "")
  );

  // update the numbers
  increment ? newQuantity++ : newQuantity--;
  increment ? (newItemTotal += price) : (newItemTotal -= price);
  increment ? (newOverallTotal += price) : (newOverallTotal -= price);

  // update the dom
  overallTotalPrice.textContent = "Total: $" + newOverallTotal;
  if (newQuantity > 0) {
    quantityElement.textContent = "x" + newQuantity;
    itemTotalPrice.textContent = "$" + newItemTotal;
  } else {
    console.log("need to remove this line from the cart-viewer completely");
    line.remove();
  }
}

function createLine(item) {
  const itemId = item.id[item.id.length - 1];
  const price = getPrice(item);
  const cartViewer = document.querySelector(".cart-viewer");
  const cartItemHtml = `
      <div class="item-cart-container" id="item-${itemId}-cart">
        <div class="item-cart-label">Item ${itemId}</div>
        <div class="item-quantity">x1</div>
        <div class="item-cost-label">$${price}</div>
        <div class="increment-decrement-container">
          <button class="increment" id="inc-btn-1">+</button>
          <button class="decrement" id="dec-btn-1">-</button>
        </div>
      </div>
    `;
  const totalPriceElement = cartViewer.querySelector("#total-price");
  totalPriceElement.insertAdjacentHTML("beforebegin", cartItemHtml);

  let newOverallTotal = Number(
    totalPriceElement.textContent.replace("Total: $", "")
  );
  // update Total field
  newOverallTotal += price;
  totalPriceElement.textContent = "Total: $" + newOverallTotal;

  // apply eventlistener to the new buttons?
  const incrementButtons = document.getElementsByClassName("increment");
  const decrementButtons = document.getElementsByClassName("decrement");

  console.log([...incrementButtons]);

  [...incrementButtons].forEach((button) =>
    button.addEventListener("click", addToCart)
  );
  [...decrementButtons].forEach((button) =>
    // todo pass a param to this or handle the idea it makes count -- in some way
    button.addEventListener("click", addToCart)
  );
}

const getPrice = (item) => {
  const idValue = item.id.split("-");
  const classToQuery = "item " + idValue[idValue.length - 1];
  parent = document.getElementsByClassName(classToQuery)[0];
  const priceElement = parent.querySelector(".item-price").textContent;
  const price = parseFloat(priceElement.replace("Price: ", ""));
  return price;
};

function addToCart() {
  console.log(this.id);
  const line = checkForItem(this.id[this.id.length - 1]);
  console.log(Boolean(line));
  // can I determine if from increment or decrement in here then just pass to updateQuantiy?
  line ? updateQuantity(this, line) : createLine(this);
}

buttons.forEach(function (button) {
  button.addEventListener("click", addToCart);
});
