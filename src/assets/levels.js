import { v4 as uuidv4 } from 'uuid'
import streets1 from "./bgs/streets1.jpg"
import streets2 from "./bgs/streets2.jpg"
import streets3 from "./bgs/streets3.jpg"
import streets4 from "./bgs/streets4.jpg"
import woods1 from "./bgs/woods1.jpeg"
import woods2 from "./bgs/woods2.jpeg"
import woods3 from "./bgs/woods3.jpeg"
import woods4 from "./bgs/woods4.jpeg"

export const levelData = {
  "streets-1": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -4,
      "z2": 6
    },
    "img": streets1,
    "next": "streets-2",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,0],
        type: "ZFem",
        health: 100,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [-1, 0, -2],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, -3.5],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [-2.5, 0, -2.25],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 2.5],
        lifeSpan: -99,
        scale: 1.5,
      },
    ],
    "collectables": [
      {
        id: uuidv4(),
        name: "health kit",
        type: "HealthKit",
        pos: [1,0,3],
        amount: 1,
      },
      {
        id: uuidv4(),
        name: "slime spray",
        type: "Spray",
        pos: [-1.5,0,-3.5],
        amount: 3,
      },
    ]
  },
  "streets-2": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -3,
      "z2": 6
    },
    "img": streets2,
    "next": "streets-3",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,2],
        type: "ZMale",
        health: 100,
      },
      {
        id: uuidv4(),
        position: [1,0,0],
        type: "ZFem",
        health: 100,
      },
      {
        id: uuidv4(),
        position: [5,0,2],
        type: "ZMale",
        health: 100,
      },
      {
        id: uuidv4(),
        position: [8,0,0],
        type: "ZFem",
        health: 100,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [1, 0, -2],
        lifeSpan: -99,
        scale: 1.9,
      },
      {
        id: uuidv4(),
        position: [-1, 0, -2.5],
        lifeSpan: -99,
        scale: 2.5,
      },
      {
        id: uuidv4(),
        position: [2.5, 0, -2.25],
        lifeSpan: -99,
        scale: 1.8,
      },
      {
        id: uuidv4(),
        position: [0, 0, 2.5],
        lifeSpan: -99,
        scale: 1.7,
      },
    ],
  },
  "streets-3": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -1,
      "z2": 6
    },
    "img": streets3,
    "next": "streets-4",
    "slimes": [
      {
        id: uuidv4(),
        position: [-1, 0, -0],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 2.5],
        lifeSpan: -99,
        scale: 1.9,
      },
      {
        id: uuidv4(),
        position: [2.5, 0, 3.25],
        lifeSpan: -99,
        scale: 3.5,
      },
      {
        id: uuidv4(),
        position: [3, 0, 0],
        lifeSpan: -99,
        scale: 2.5,
      },
    ],
  },
  "streets-4": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -1,
      "z2": 6
    },
    "img": streets1,
    "next": "streets-5",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,0],
        type: "ZFem",
        health: 100,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [-1, 0, -1],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 3.5],
        lifeSpan: -99,
        scale: 3.5,
      },
      {
        id: uuidv4(),
        position: [-1.5, 0, 2.25],
        lifeSpan: -99,
        scale: 2.5,
      },
      {
        id: uuidv4(),
        position: [3, 0, 2.5],
        lifeSpan: -99,
        scale: 2.5,
      },
    ],
  },
  "streets-5": {
    "arena": {
      "x1": -3,
      "x2": 4,
      "z1": -1,
      "z2": 6
    },
    "img": streets4,
    "next": "woods-1",
    "zombies": [
      {
        id: uuidv4(),
        position: [3,0,0],
        type: "Neutrophil",
        health: 500,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [-1, 0, -1],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 2.5],
        lifeSpan: -99,
        scale: 1.9,
      },
      {
        id: uuidv4(),
        position: [2.5, 0, -0.25],
        lifeSpan: -99,
        scale: 3.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 1.5],
        lifeSpan: -99,
        scale: 2.5,
      },
    ],
  },
  "woods-1": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -1.5,
      "z2": 6
    },
    "img": woods1,
    "next": "woods-2",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,0],
        type: "ZFem",
        health: 100,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [-1, 0, -1],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 3.5],
        lifeSpan: -99,
        scale: 3.5,
      },
      {
        id: uuidv4(),
        position: [-1.5, 0, 2.25],
        lifeSpan: -99,
        scale: 2.5,
      },
      {
        id: uuidv4(),
        position: [3, 0, 2.5],
        lifeSpan: -99,
        scale: 2.5,
      },
    ],
  },
  "woods-2": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -3,
      "z2": 6
    },
    "img": woods2,
    "next": "woods-3",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,2],
        type: "ZMale",
        health: 100,
      },
      {
        id: uuidv4(),
        position: [1,0,0],
        type: "ZFem",
        health: 100,
      },
      {
        id: uuidv4(),
        position: [5,0,2],
        type: "ZMale",
        health: 100,
      },
      {
        id: uuidv4(),
        position: [8,0,0],
        type: "ZFem",
        health: 100,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [1, 0, 2],
        lifeSpan: -99,
        scale: 1.9,
      },
      {
        id: uuidv4(),
        position: [-1, 0, 4.5],
        lifeSpan: -99,
        scale: 2.5,
      },
      {
        id: uuidv4(),
        position: [2.5, 0, 2.25],
        lifeSpan: -99,
        scale: 1.8,
      },
      {
        id: uuidv4(),
        position: [0, 0, 0.5],
        lifeSpan: -99,
        scale: 1.7,
      },
    ],
  },
  "woods-3": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -1,
      "z2": 6
    },
    "img": woods3,
    "next": "woods-4",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,0],
        type: "ZFem",
        health: 100,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [3, 0, 0],
        lifeSpan: -99,
        scale: 2.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 3.5],
        lifeSpan: -99,
        scale: 1.9,
      },
      {
        id: uuidv4(),
        position: [-1.5, 0, 2.25],
        lifeSpan: -99,
        scale: 1.8,
      },
      {
        id: uuidv4(),
        position: [3, 0, 3.5],
        lifeSpan: -99,
        scale: 1.9,
      },
    ],
  },
  "woods-4": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -1,
      "z2": 6
    },
    "img": woods1,
    "next": "woods-5",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,0],
        type: "ZFem",
        health: 100,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [1, 0, 4],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [-1.8, 0, -0.5],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0.5, 0, 0],
        lifeSpan: -99,
        scale: 2.8,
      },
      {
        id: uuidv4(),
        position: [3, 0, 0.5],
        lifeSpan: -99,
        scale: 2.5,
      },
    ],
  },
  "woods-5": {
    "arena": {
      "x1": -3,
      "x2": 4,
      "z1": -1,
      "z2": 6
    },
    "img": woods4,
    "next": null,
    "zombies": [
      {
        id: uuidv4(),
        position: [3,0,0],
        type: "Neutrophil",
        health: 500,
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [-1, 0, -0],
        lifeSpan: -99,
        scale: 1.5,
      },
      {
        id: uuidv4(),
        position: [0, 0, 2.5],
        lifeSpan: -99,
        scale: 1.9,
      },
      {
        id: uuidv4(),
        position: [2.5, 0, 3.25],
        lifeSpan: -99,
        scale: 3.5,
      },
      {
        id: uuidv4(),
        position: [3, 0, 0],
        lifeSpan: -99,
        scale: 2.5,
      },
    ],
  },
}