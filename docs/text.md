# Overlaying Text and Captions

This is a new feature in 0.11.0.

Captions for images are created using YAML front matter (inside the ` ``` `), while text overlays can be achieved in two ways: either by specifying a `descriptions` array in the front matter or by including the text within a markdown image link like `![Some Description](image.jpg)`. Although UI support for these features is planned for future updates, they currently require manual setup.

Text overlays appear when hovering over an image, and captions are displayed beneath the image set. It is also possible to make the overlay show up permanently by setting `permanentOverlay: true` in the front matter.

````
```image-layout-b
---
caption: Image Layout B
descriptions:
- Sunset on the sea
- Our spot for the night
permanentOverlay: true # the default is false
---

![](sunset-sailing.png)
![](serene-spot.png)
```
````

![Overlaying text and captions](captions-and-overlay.png)
