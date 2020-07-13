// Note: this.originalIndex is applicable only when this.infinite is truthy

class Customcarousel extends HTMLElement {
  constructor() {
    super();
    this.isInitialized = false;
    this.item = "item";
    this.initItem = 0;
    this.transitionDuration = 0;
    this.transitionType = "ease";
    this.interval = 1000;
    this.direction = "left";
    this.intervalId = null;
  }

  static get observedAttributes() {
    return [
      "infinite",
      "init-item",
      "center-between",
      "autoplay",
      "interval",
      "direction",
      "transition-duration",
      "transition-type",
      "item"
    ];
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "infinite") {
      this.infinite = true;
    } else if (name === "init-item") {
      this.initItem = parseInt(newValue);
    } else if (name === "center-between") {
      this.centerBetween = true;
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
    } else if (name === 'item') {
      this.item = newValue
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
      steps = this._swipeReducer("l",steps);
      if (
        (!this.centerBetween && this.currentlyCentered + (steps - 1) < this.itemsCount - 1) ||
        (this.centerBetween && this.currentlyCentered < this.itemsCount - 3)
      ) {
        this._stopTransition();
      }
      this._centerItemByIndex(this.currentlyCentered + steps);
      return;
    }

    if (parseInt(getComputedStyle(this.itemsContainer).left) < 0) {
      this._stopTransition();
      this._moveItemFromLeftToRight(steps);
      this._centerItemByIndex(this.currentlyCentered + steps);
      this._updateOriginalIndex(steps);
    }
  }

  prev(steps = 1) {
    if (steps === 0) {
      steps = 1;
    }

    if (!this.infinite) {
      steps = this._swipeReducer("r",steps);
      if (this.currentlyCentered < 0) {
        this._stopTransition();
      }
      this._centerItemByIndex(this.currentlyCentered - steps);
      return;
    }

    if (
      this.itemsContainer.offsetWidth + parseInt(getComputedStyle(this.itemsContainer).left) >
      this.offsetWidth
    ) {
      this._stopTransition();
      this._moveItemFromRightToLeft(steps);
      this._centerItemByIndex(this.currentlyCentered - steps);
      this._updateOriginalIndex(-steps);
    }
  }

  _stopTransition() {
    this.itemsContainer.style.left = getComputedStyle(this.itemsContainer).left;
  }

  _centerItemByIndex(index) {
    let center = this.offsetWidth / 2;
    let entries = this.itemsContainer.querySelectorAll("." + this.item);
    if ((this.centerBetween && index === entries.length - 1) || !entries[index]) {
      return;
    }
    let style, margin, sum = 0;
    for (let i = 0; i < index; i++) {
      style = window.getComputedStyle(entries[i]);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      sum += entries[i].offsetWidth + margin;
    }
    let initLeftMargin = parseFloat(window.getComputedStyle(entries[0]).marginLeft);
    let itemWidthHalf = this.centerBetween
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
      this._centerItemByIndex(index);
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
      this._moveItemFromRightToLeft(Math.abs(shortest));
    } else if (shortest > 0) {
      this._moveItemFromLeftToRight(Math.abs(shortest));
    }

    this._centerItemByIndex(this.currentlyCentered + shortest);
    this._updateOriginalIndex(shortest);
  }

  _freeShift(shift) {
    this.itemsContainer.style.left = parseInt(this.itemsContainer.style.left) + shift + "px";
  }

  _copyItems(factor) {
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

  _getItemWidth (item) {
    let style, margin;
    style = window.getComputedStyle(item);
    margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    let width = item.offsetWidth;
    return width + margin;
  }

  _moveItemFromLeftToRight(count = 1) {
    for (let i = 0; i < count; i++) {
      this.itemsContainer.style.transition = "";

      let itemToBeRemoved = this.itemsContainer.querySelectorAll("." + this.item)[0];
      this._freeShift(this._getItemWidth(itemToBeRemoved));
      this.itemsContainer.appendChild(this.itemsContainer.removeChild(itemToBeRemoved));
      this.currentlyCentered--;
    }
  }

  _moveItemFromRightToLeft(count = 1) {
    for (let i = 0; i < count; i++) {
      this.itemsContainer.style.transition = "";

      let itemToBeRemoved = [...this.itemsContainer.querySelectorAll("." + this.item)].pop();
      //let itemToBeRemoved = this.itemsContainer.querySelectorAll('.' + this.item)[this.itemsContainer.querySelectorAll('.' + this.item).length - 1]
      this._freeShift(-this._getItemWidth(itemToBeRemoved));
      this.itemsContainer.insertAdjacentElement(
        "afterbegin",
        this.itemsContainer.removeChild(itemToBeRemoved)
      );
      this.currentlyCentered++;
    }
  }

  _itemsInit() {

    if (!this.infinite) {
      this._centerItemByIndex(this.currentlyCentered);
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
      this._copyItems(factor);
      let index;
      if (this.currentlyCentered) {
        index = this.originalIndex;
      } else {
        index = this.initItem;
      }
      this._centerItemByIndex(this.originalEntries.length * (factor / 2) + index);
      this._checkItemBalance();
      this.currentFactor = factor;
      this.originalIndex = index;
    } else {
      this.gotoIndex(this.originalIndex);
    }
  }

  _checkItemBalance() {
    //negative offset implies right side shortage of items
    //positive offset implies left side shortage of items
    let offset = this.itemsCount / 2 - this.currentlyCentered;

    if (offset === 0) {
      return;
    }

    if (offset < 0) {
      this._moveItemFromLeftToRight();
    } else if (offset > 0) {
      this._moveItemFromRightToLeft();
    }

    // potentially dangerous recursion!
    this._checkItemBalance();
  }

  _updateOriginalIndex(update) {
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

  _autoplayHandler() {
    if (!this.infinite) {
      if (this.centerBetween && this.currentlyCentered >= this.itemsCount - 2) {
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
      this._autoplayHandler();
      this.intervalId = setInterval(() => {
        this._autoplayHandler();
      }, this.interval + this.transitionDuration);
    }
  }

  _swipeReducer(dir, steps) {
    let remaining;
    if (dir === "l") {
      remaining = this.originalEntries.length - (this.centerBetween ? 2 : 1) - this.currentlyCentered;
    }
    else{
      remaining = this.currentlyCentered;
    }

    if (remaining < steps) {
      return remaining;
    }
    return steps;
  }

  _getItemIndex(element) {
    if(!element) {
      return null;
    }
    let i = 0;
    while ((element = element.previousSibling) !== null) {
      i++;
    }
    return i;
  }

  _downEventHandler(event) {

    let closestElement = event.target.closest("." + this.item);
    this.downEventItemIndex = this._getItemIndex(closestElement);

    event.preventDefault();
    if (event.pageX) {
      this.x = event.pageX;
      this.y = event.pageY;
    } else if (event.targetTouches[0].pageX) {
      this.x = event.targetTouches[0].pageX;
      this.y = event.targetTouches[0].pageY;
    }
    this.startTime = new Date().getTime()
  }

  _upEventHandler(event) {
    let elem;
    if (event.changedTouches) {
      elem = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
    } else {
      elem = event.target;
    }

    let closestElement = elem.closest("." + this.item);
    let closestIndex = this._getItemIndex(closestElement);
    let shiftInItems;
    if( Number.isInteger(this.downEventItemIndex) && Number.isInteger(closestIndex) ) {
      shiftInItems = Math.abs(this.downEventItemIndex - closestIndex);
    } else {
      shiftInItems = 1;
    }

    let xShift = (event.pageX ? event.pageX : event.changedTouches[0].pageX) - this.x;
    let yShift = (event.pageY ? event.pageY : event.changedTouches[0].pageY) - this.y;

    let elapsedTime = new Date().getTime() - this.startTime;

    let velocity = Math.abs(xShift/elapsedTime);
    let touchVelocityLimit = 1.5; // pixels per millisecond
    let mouseVelocityLimit = 3.0; // pixels per millisecond

    if(velocity > touchVelocityLimit && event.changedTouches) {
      shiftInItems++; // boost touch swipe if it's above the velocity limit
    } else if( velocity  > mouseVelocityLimit) {
      shiftInItems++; // boost mouse swipe if it's above the velocity limit
    }

    // minimum x shift required to shift the item (pixels)
    let minxShiftRequired = 30;
    if ( Math.abs(xShift) > minxShiftRequired && Math.abs(xShift) > Math.abs(yShift) ) {
      event.preventDefault();
      this.preventClick = true;
      if (xShift < -minxShiftRequired ) {
        this.next(shiftInItems);
      } else if (xShift > minxShiftRequired ) {
        this.prev(shiftInItems);
      }
    }
  }

  _clickHandler (event) {
    if(this.preventClick) {
      event.preventDefault();
    }
    this.preventClick = false;
    this.focus()
  }

  _keyDownEventHandler (event) {
    if(event.key === "ArrowRight") {
      this.prev();
    } else if(event.key === "ArrowLeft") {
      this.next();
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
    this.originalEntries = this.querySelectorAll("." + this.item);

    if (this.initItem + 1 > this.originalEntries.length) {
      throw "centered item value too big";
    }

    let style, margin;
    this.initItemsWidth = 0;
    for (let i = 0; i < this.originalEntries.length; i++) {
      style = getComputedStyle(this.originalEntries[i]);
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      this.initItemsWidth += this.originalEntries[i].offsetWidth + margin;
    }

    this.tabIndex = 0;
    this.ontouchstart = this._downEventHandler;
    this.ontouchstart = this.ontouchstart.bind(this);

    this.ontouchend = this._upEventHandler;
    this.ontouchend = this.ontouchend.bind(this);
    /*
    this.ontouchcancel = this._upEventHandler
    this.ontouchcancel = this.ontouchcancel.bind(this)
    */
    this.onmousedown = this._downEventHandler;
    this.onmousedown = this.onmousedown.bind(this);

    this.onmouseup = this._upEventHandler;
    this.onmouseup = this.onmouseup.bind(this);

    this.onclick = this._clickHandler;
    this.onclick = this.onclick.bind(this);

    this.onkeydown = this._keyDownEventHandler
    this.onkeydown = this.onkeydown.bind(this)

    if (!this.infinite) {
      this._copyItems(1);
      this._centerItemByIndex(this.initItem);
    } else {
      this._itemsInit();
    }
    window.addEventListener("resize", () => this._itemsInit() );

    if (this.autoplay) {
      this.startAutoplay();
    }
  }
}

customElements.define("wc-carousel-lite", Customcarousel);
