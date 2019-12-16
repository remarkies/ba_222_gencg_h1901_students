![di logo](https://raw.githubusercontent.com/digitalideation/ba_222_gencg_h1901/master/docs/assets/images/di-logo-small.jpg "di logo")

# Generative Computer Graphics - Winter 2019

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/webslides/webslides.svg?style=social)](https://twitter.com/digideation)

This repo hold students' work for the class "I.BA_222_GENCG.H1901 - Winter 2019" it is built on github pages (Jekyll).

## Circles

Circles with same diameter, random color & opacity & random starting direction bouncing of the walls. Movement speed depends on circles near by.
More circles => slower. This leads to small groups.

[![Circles](https://ibb.co/9bJwW5X)](https://remarkies.github.io/ba_222_gencg_h1901_students/Projects/01_Circles/index.html)

## Connections

"Connections" is the next step of "Circles". Circles diameter a lot smaller but create a line to all near by circles. Color of lines are equal to the root circle.

[![Connections](https://ibb.co/C9htbMG)](https://remarkies.github.io/ba_222_gencg_h1901_students/Projects/02_Connections/index.html)

## Fading

"Fading" is the next step of "Connections". Allowed distance to draw a line is a lot bigger but not nearly as many points are being generated.

Following code creates the fade effect:
```
blendMode(LIGHTEST);
noStroke();
fill(0, 0, 0, fade);
rect(0, 0, width, height);
```
`blendMode(LIGHTEST)` = color + color => brighter color

[![Fading](https://ibb.co/ctK9xrC)](https://remarkies.github.io/ba_222_gencg_h1901_students/Projects/03_Fading/index.html)

## Grass

Project in between. Tried to animate grass.

[![Grass](https://ibb.co/FzmLNnQ)](https://remarkies.github.io/ba_222_gencg_h1901_students/Projects/04_Grass/index.html)

## Atom

Combination of "Circles", "Connections" & "Fading" including a gravitation hole.

[![Atom](https://ibb.co/Csg1gfR)](https://remarkies.github.io/ba_222_gencg_h1901_students/Projects/05_Atom/index.html)

## Fluid

Basic attempt bringing lines to flow. Fading added to receive stardust. Due to random speed it looks after a while like it has multiple layers.

[![Atom](https://ibb.co/vPmxwJy)](https://remarkies.github.io/ba_222_gencg_h1901_students/Projects/06_Fluid/index.html)
