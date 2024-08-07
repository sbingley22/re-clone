import { v4 as uuidv4 } from 'uuid'
import streets1 from "./bgs/streets1.jpg"
import streets2 from "./bgs/streets2.jpg"
import streets3 from "./bgs/streets3.jpg"
import streets4 from "./bgs/streets4.jpg"

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
  },
  "streets-4": {
    "arena": {
      "x1": -3,
      "x2": 4,
      "z1": -1,
      "z2": 6
    },
    "img": streets4,
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
}