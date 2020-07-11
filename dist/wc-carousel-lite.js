class Customcarousel extends HTMLElement {
  constructor() {
    super();
    this.isInitialized = false;
    this.item = "item";
    this.centeredItem = 0;
    this.currentlyCentered;
    this.transitionDuration = 0;
    this.transitionType = "ease";
    this.itemsCount;
    this.initItemsWidth;
    this.interval = 1000;
    this.direction = "left";
    this.intervalId = null;
  }

  static get observedAttributes() {
    return [
      "infinite",
      "centered-item",
      "even-centering",
      "autoplay",
      "interval",
      "direction",
      "transition-duration",
      "transition-type"
    ];
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "infinite") {
      this.infinite = true;
    } else if (name === "centered-item") {
      this.centeredItem = parseInt(newValue);
    } else if (name === "even-centering") {
      this.evenCentering = true;
    } else if (name === "transition-duration") {
      this.transitionDuration = parseInt(newValue);
    } else if (name === "transition-type") {
      this.transitionType = newValue;
    } else if (name === "autoplay") {
      this.autoplay = true;
    } else if (name === "interval") {
      this.interval = parseInt(newValue);
    } else if (name === "direction") {
      this.direction = newValue;
    }
  }

  connectedCallback() {
    // https://stackoverflow.com/questions/58676021/accessing-custom-elements-child-element-without-using-slots-shadow-dom
    setTimeout(() => {
      this._init();
    }, 0);
  }

  next(steps = 1) {
    if (steps === 0) {
      steps = 1;
    }

    if (!this.infinite) {
      if (
        (!this.evenCentering && this.currentlyCentered + (steps - 1) < this.itemsCount - 1) ||
        (this.evenCentering && this.currentlyCentered < this.itemsCount - 3)
      ) {
        this.stopTransition();
      }
      this.centerItemByIndex(this.currentlyCentered + steps);
      return;
    }

    if (parseInt(getComputedStyle(this.itemsContainer).left) < 0) {
      this.stopTransition();
      this.moveItemFromLeftToRight(steps);
      this.centerItemByIndex(this.currentlyCentered + steps);
      this.updateOriginalIndex(steps);
    }
  }

  prev(steps = 1) {
    if (steps === 0) {
      steps = 1;
    }

    if (!this.infinite) {
      if (this.currentlyCentered < 0) {
        this.stopTransition();
      }
      this.centerItemByIndex(this.currentlyCentered - steps);
      return;
    }

    if (
      this.itemsContainer.offsetWidth + parseInt(getComputedStyle(this.itemsContainer).left) >
      this.offsetWidth
    ) {
      this.stopTransition();
      this.moveItemFromRightToLeft(steps);
      this.centerItemByIndex(this.currentlyCentered - steps);
      this.updateOriginalIndex(-steps);
    }
  }

  stopTransition() {
    this.itemsContainer.style.left = getComputedStyle(this.itemsContainer).left;
  }

  centerItemByIndex(index) {
    let center = this.offsetWidth / 2;
    let entries = this.itemsContainer.querySelectorAll("." + this.item);
    if ((this.evenCentering && index === entries.length - 1) || !entries[index]) {
      return;
    }
    let sum = 0;
    let style, margin;
    for (let i = 0; i < index; i++) {
      style = window.getComputedStyle(entries[i]);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      sum += entries[i].offsetWidth + margin;
    }
    let initLeftMargin = parseFloat(window.getComputedStyle(entries[0]).marginLeft);
    let itemWidthHalf = this.evenCentering
      ? entries[index].offsetWidth
      : entries[index].offsetWidth / 2;
    let left = center - (sum + initLeftMargin + itemWidthHalf);
    this.itemsContainer.style.transition = "left " + this.transitionDuration + "ms";
    this.itemsContainer.style.transitionTimingFunction = this.transitionType;
    this.itemsContainer.style.left = left + "px";
    this.currentlyCentered = index;
  }

  gotoIndex(index) {
    if (index > this.originalEntries.length - 1) {
      return;
    }

    if (!this.infinite) {
      this.centerItemByIndex(index);
      return;
    }

    let distance, distance_2;
    distance = index - this.originalIndex;

    if (index > this.originalIndex) {
      distance_2 = index - this.originalIndex - this.originalEntries.length;
    } else {
      distance_2 = index - this.originalIndex + this.originalEntries.length;
    }

    let shortest = Math.abs(distance) <= Math.abs(distance_2) ? distance : distance_2;

    if (shortest < 0) {
      this.moveItemFromRightToLeft(Math.abs(shortest));
    } else if (shortest > 0) {
      this.moveItemFromLeftToRight(Math.abs(shortest));
    }

    this.centerItemByIndex(this.currentlyCentered + shortest);
    this.updateOriginalIndex(shortest);
  }

  freeShift(shift) {
    let currentPosition = parseInt(this.itemsContainer.style.left);
    this.itemsContainer.style.left = currentPosition + shift + "px";
  }

  copyItems(factor) {
    while (this.itemsContainer.firstChild) {
      this.itemsContainer.firstChild.remove();
    }

    let items = this.querySelectorAll("." + this.item);

    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        this.itemsContainer.appendChild(items[i]);
      }
      factor--;
    }

    for (let ii = 0; ii < factor; ii++) {
      for (let i = 0; i < this.originalEntries.length; i++) {
        this.itemsContainer.appendChild(this.originalEntries[i].cloneNode(true));
      }
    }

    this.itemsCount = this.itemsContainer.querySelectorAll("." + this.item).length;
  }

  moveItemFromLeftToRight(count = 1) {
    for (let i = 0; i < count; i++) {
      this.itemsContainer.style.transition = "";

      let itemToBeRemoved = this.itemsContainer.querySelectorAll("." + this.item)[0];

      let sum, style, margin;
      style = window.getComputedStyle(itemToBeRemoved);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      let width = itemToBeRemoved.offsetWidth;
      sum = width + margin;

      this.freeShift(sum);
      this.itemsContainer.appendChild(this.itemsContainer.removeChild(itemToBeRemoved));
      this.currentlyCentered--;
    }
  }

  moveItemFromRightToLeft(count = 1) {
    for (let i = 0; i < count; i++) {
      this.itemsContainer.style.transition = "";

      let itemToBeRemoved = [...this.itemsContainer.querySelectorAll("." + this.item)].pop();
      //let itemToBeRemoved = this.itemsContainer.querySelectorAll('.' + this.item)[this.itemsContainer.querySelectorAll('.' + this.item).length - 1]

      let sum, style, margin;
      style = getComputedStyle(itemToBeRemoved);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      let width = itemToBeRemoved.offsetWidth;
      sum = width + margin;

      this.freeShift(0 - sum);
      this.itemsContainer.insertAdjacentElement(
        "afterbegin",
        this.itemsContainer.removeChild(itemToBeRemoved)
      );
      this.currentlyCentered++;
    }
  }

  itemsInit() {
    if (!this.infinite) {
      this.copyItems(1);
      this.centerItemByIndex(this.centeredItem);
      return;
    }

    let factor = parseInt((2.5 * this.offsetWidth) / this.initItemsWidth);

    if (this.originalEntries.length < 3) {
      factor += 3;
    }
    if (factor === 0) {
      factor++;
    }
    if (factor % 2) {
      factor++;
    }

    if (factor !== this.currentFactor) {
      this.copyItems(factor);
      let index;
      if (this.currentlyCentered) {
        index = this.originalIndex;
      } else {
        index = this.centeredItem;
      }
      this.centerItemByIndex(this.originalEntries.length * (factor / 2) + index);
      this.checkItemMoving();
      this.currentFactor = factor;
      this.originalIndex = index;
    } else {
      this.gotoIndex(this.originalIndex);
    }
  }

  checkItemMoving() {
    //negative offset implies right side shortage of items
    //positive offset implies left side shortage of items
    let offset = this.itemsCount / 2 - this.currentlyCentered;

    if (offset === 0) {
      return;
    }

    if (offset < 0) {
      this.moveItemFromLeftToRight();
    } else if (offset > 0) {
      this.moveItemFromRightToLeft();
    }

    this.checkItemMoving();
  }

  updateOriginalIndex(update) {
    for (let i = 0; i < Math.abs(update); i++) {
      if (update > 0) {
        if (this.originalIndex + 1 === this.originalEntries.length) {
          this.originalIndex = 0;
        } else {
          this.originalIndex++;
        }
      }
      if (update < 0) {
        if (this.originalIndex === 0) {
          this.originalIndex = this.originalEntries.length - 1;
        } else {
          this.originalIndex--;
        }
      }
    }
  }

  autoplayHandler() {
    if (!this.infinite) {
      if (this.evenCentering && this.currentlyCentered >= this.itemsCount - 2) {
        this.direction = "right";
      } else if (this.currentlyCentered >= this.itemsCount - 1) {
        this.direction = "right";
      } else if (this.currentlyCentered === 0) {
        this.direction = "left";
      }
    }

    if (this.direction === "right") {
      this.prev();
    } else {
      this.next();
    }
  }

  stopAutoplay() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  startAutoplay() {
    if (this.intervalId === null) {
      this.autoplayHandler();
      this.intervalId = setInterval(() => {
        this.autoplayHandler();
      }, this.interval + this.transitionDuration);
    }
  }

  swipeReducer(dir, steps) {
    if (this.infinite) {
      return steps;
    }
    let subtraction = this.evenCentering ? 2 : 1;
    let remaining;
    if (dir === "l") {
      remaining = this.originalEntries.length - subtraction - this.currentlyCentered;
      if (remaining < steps) {
        return remaining;
      }
      return steps;
    }
    if (dir === "r") {
      remaining = this.currentlyCentered;
      if (remaining < steps) {
        return remaining;
      }
      return steps;
    }
  }

  getItemIndex(element) {
    let i = 0;
    while ((element = element.previousSibling) !== null) {
      i++;
    }
    return i;
  }

  downEventHandler(event) {

    let closestElement = event.target.closest(".item");
    this.downEventItemIndex = this.getItemIndex(closestElement);

    event.preventDefault();
    if (event.pageX) {
      this.x = event.pageX;
      this.y = event.pageY;
    } else if (event.targetTouches[0].pageX) {
      this.x = event.targetTouches[0].pageX;
      this.y = event.targetTouches[0].pageY;
    }
  }

  upEventHandler(event) {
    let elem;
    if (event.changedTouches) {
      elem = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
    } else {
      elem = event.target;
    }

    let closestElement = elem.closest(".item");
    let shiftInItems = Math.abs(this.downEventItemIndex - this.getItemIndex(closestElement));
    let xShift = (event.pageX ? event.pageX : event.changedTouches[0].pageX) - this.x;
    let yShift = (event.pageY ? event.pageY : event.changedTouches[0].pageY) - this.y;

    if (xShift < 0 && Math.abs(xShift) > Math.abs(yShift)) {
      this.next(this.swipeReducer("l", shiftInItems));
    } else if (xShift > 0 && Math.abs(xShift) > Math.abs(yShift)) {
      this.prev(this.swipeReducer("r", shiftInItems));
    }
  }

  _init() {
    this.style.backgroundColor = "lightgray";
    this.style.display = "flex";
    this.style.overflow = "hidden";

    this.itemsContainer = this.appendChild(document.createElement("div"));
    this.itemsContainer.style.display = "inline-flex";
    this.itemsContainer.style.position = "relative";
    this.itemsContainer.overflow = "hidden";
    console.log(this.transitionType);

    this.originalEntries = this.querySelectorAll("." + this.item);

    if (this.centeredItem + 1 > this.originalEntries.length) {
      throw "centered item value too big";
    }

    let style, margin;
    this.initItemsWidth = 0;
    for (let i = 0; i < this.originalEntries.length; i++) {
      style = getComputedStyle(this.originalEntries[i]);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      this.initItemsWidth += this.originalEntries[i].offsetWidth + margin;
    }

    this.ontouchstart = this.downEventHandler;
    this.ontouchstart = this.ontouchstart.bind(this);

    this.ontouchend = this.upEventHandler;
    this.ontouchend = this.ontouchend.bind(this);
    /*
    this.ontouchcancel = this.upEventHandler
    this.ontouchcancel = this.ontouchcancel.bind(this)
*/
    this.onmousedown = this.downEventHandler;
    this.onmousedown = this.onmousedown.bind(this);

    this.onmouseup = this.upEventHandler;
    this.onmouseup = this.onmouseup.bind(this);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.itemsInit();
      }
    });
    resizeObserver.observe(this);
    if (this.autoplay) {
      this.startAutoplay();
    }
  }
}

customElements.define("wc-carousel-lite", Customcarousel);
