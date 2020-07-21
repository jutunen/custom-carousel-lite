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
