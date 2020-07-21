# wc-carousel-lite

A web component that wraps HTML elements and forms a carousel slider out of them.

Live demo available [here.](http://51.38.51.120/wcmenuwrapper/)

## Features
Wc-carousel-lite is a standalone vanilla JS web component that does not use shadow DOM.

Component features include:
- content agnostic: slide items should be able to contain any HTML
- responsive: adapts to different screen widths automatically
- infinite looping of slide items


## Usage
- create slide item containers by assigning item class to them
- add content inside the containers
- wrap the item containers inside a carousel component

HTML example:

 ```html
     <wc-carousel-lite>
        <div class='item' style="width:200px">
          <img src="./myimage_1.png">
        </div>
        <div class='item' style="width:100px">
          <img src="./myimage_2.png">
        </div>
        <div class='item' style="width:300px">
          <img src="./myimage_3.png">
        </div>
     </wc-carousel-lite>    
 ```
 Styling the carousel:

 ```css
   wc-carousel-lite {
    height: 200px;
    width: 500px;
    margin: auto;
  }
```

2nd HTML example, using images directly as items:

 ```html
     <wc-carousel-lite>
       <img src="./myimage_1.png" class="item" width="200">
       <img src="./myimage_2.png" class="item" width="100">
       <img src="./myimage_3.png" class="item" width="300">
     </wc-carousel-lite>    
 ```

#### Note! Carousel item widths should always be set explicitly.

## Including the component to an HTML file

1. Import polyfill, this is not needed for modern browsers:

    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements/1.4.1/custom-elements.min.js"></script>
    ```

2. Import custom element:

    ```html
    <script defer src='wc-carousel-lite.min.js'></script>
    ```

3. Start using it!

    ```html
     <wc-carousel-lite>
       <img src="https://placekitten.com/g/400/200" class="item" width="400">
       <img src="https://placekitten.com/g/300/200" class="item" width="300">
       <img src="https://placekitten.com/g/250/200" class="item" width="250">      
     </wc-carousel-lite>    
    ```
## Including the component from NPM

1. Install and import polyfill, this is not needed for modern browsers:

   See https://www.npmjs.com/package/@webcomponents/custom-elements

2. Install wc-menu-wrapper NPM package:

    ```console
    npm i @vanillawc/wc-carousel-lite
    ```

3. Import custom element:

    ```javascript
    import '@vanillawc/wc-carousel-lite'
    ```

4. Start using it:

   ```javascript
   let carousel = document.createElement("wc-carousel-lite");
   carousel.transitionDuration = 1000;
   carousel.infinite = true;
   carousel.autoplay = true;
   carousel.centerBetween = true;
   
   let img = document.createElement("img");
   img.setAttribute("src", "./myimage_1.png");
   img.setAttribute("width", 300);
   img.classList.add("item");
   carousel.appendChild(img);   
   
   let img_2 = document.createElement("img");
   img_2.setAttribute("src", "./myimage_2.png");
   img_2.setAttribute("width", 300);
   img_2.classList.add("item");
   carousel.appendChild(img_2);
   
   document.body.appendChild(carousel);
   ```


## Attributes

### infinite

If defined, the carousel will be in infinite looping mode.

By default, the carousel will not be in infinite looping mode.

This attribute is a boolean attribute, also known as a valueless attribute.

HTML example:

```html
<wc-carousel-lite infinite>
```

### init-item

Defines which item will be initially centered to be visible to the use.

Item numbering begins from zero.

Default value is 0.

HTML example:

```html
<wc-carousel-lite init-item=1>
```

### center-between

If defined, the carousel view will be centered between the items. (even centering)

By default, the view will be centered to the middle of the item. (odd centering)

This attribute is a boolean attribute, also known as a valueless attribute.

HTML example:

```html
<wc-carousel-lite center-between>
```

### autoplay

If defined, the carousel will automatically shift items.

By default, the the carousel will not shift items automatically.

This attribute is a boolean attribute, also known as a valueless attribute.

HTML example:

```html
<wc-carousel-lite autoplay>
```

### interval

Defines autoplay shift interval in milliseconds.

Default value is 1000 ms.

HTML example:

```html
<wc-carousel-lite interval=2000>
```

### direction

Defines autoplay shift direction.

Attribute value must be either 'right' or 'left'

Default value is left (items will shift to left).

HTML example:

```html
<wc-carousel-lite direction='right'>
```

### transition-duration

Defines item shift duration in milliseconds.

Default value is 0 ms, meaning that that the shift takes place instantly.

HTML example:

```html
<wc-carousel-lite transition-duration=1000>
```

### transition-type

Defines the speed curve of the item shift transition effect.

For possible attribute values, see https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp

Default value is 'ease'.

HTML example:

```html
<wc-carousel-lite transition-type='linear'>
```
