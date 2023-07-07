## ![IZOWAVE](./docs/logotype.png)
[![Testing](https://github.com/neki-dev/izowave/actions/workflows/test.yml/badge.svg)](https://github.com/neki-dev/izowave/actions/workflows/test.yml)
[![Building](https://github.com/neki-dev/izowave/actions/workflows/build.yml/badge.svg)](https://github.com/neki-dev/izowave/actions/workflows/build.yml)

Your task is to survive in open world as many waves as possible. With each wave count of enemies and their characteristics will grow.

Between waves build walls to defend, towers to attack, generators to get resources, ammunitions to reload towers, and medics to replenish your health.

And also upgrade skills of your character and his assistant.

* ## __[Play now](https://izowave.neki.guru)__

![Preview 1](./docs/preview/full.png)
| ![Preview 2](./docs/preview/snap01.png) | ![Preview 3](./docs/preview/snap02.png) | ![Preview 4](./docs/preview/snap03.png) |
|---|---|---|

.

## __Technical info__

.

__Install:__

* `git clone git@github.com:neki-dev/izowave.git`
* `npm install`
* `npm start`

.

__Diagram:__ 

* https://miro.com/app/board/uXjVPG81flk=

.

__About:__ 

- Interface

For more convenient drawing of interface using [React](https://react.dev/) library. Сonnection of components with the game is implemented through the React context. State of components is updated using scene events.

- Map

To generate the map using [gen-biome](https://github.com/neki-dev/gen-biome) library, which is based on the perlin noise algorithm.
The output is a 3D matrix, which containing map tiles.

- NPC movement

Path search is implemented on [AStar](https://en.wikipedia.org/wiki/A*_search_algorithm) algorithm.

.

__Stack:__ 

* `TypeScript`, `Phaser`, `React`, `Styled-Components`