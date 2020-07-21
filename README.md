# wc-carousel-lite

A web component that wraps HTML elements and forms a carousel slider out of them.

Live demo available [here.](http://51.38.51.120/wcmenuwrapper/)

## Features
Wc-carousel lite is a standalone vanilla JS web component that does not use shadow DOM.

Component features include:
- content agnostic: slide items should be able to contain any HTML
- responsive: adapts to different screen widths automatically
- infinite looping of slide items


## Usage
- create slide item containers by assigning item classes to them
- add content inside the containers
- wrap the item containers inside a carousel component

HTML example:

 ```html
     <wc-carousel-lite>
        <div class='item' style="width:200px">
          <img src="./myimage_1">
        </div>
        <div class='item' style="width:100px">
          <img src="./myimage_2">
        </div>
        <div class='item' style="width:300px">
          <img src="./myimage_3">
        </div>
     </wc-carousel-lite>    
 ```

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
        <div class='heading'> Menu </div>
        <div class='item'> 1st item </div>
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
   var menu = document.createElement('wc-carousel-lite')
   var heading = document.createElement('div')
   var item = document.createElement('div')
   heading.innerHTML = 'Menu'
   item.innerHTML = 'Item 1'
   heading.classList.add('heading')
   item.classList.add('item')
   menu.appendChild(heading)
   menu.appendChild(item)   
   document.body.appendChild(menu)
   ```


## Attributes

### mode

Defines how the menu can be toggled.

Menu can be toggled by clicking or hovering on it.

Attribute value must be either 'click' or 'hover'.

Default mode is 'click'.

HTML example:

```html
<wc-carousel-lite mode='hover'>
```
