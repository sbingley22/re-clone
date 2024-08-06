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
      "z1": -3,
      "z2": 6
    },
    "img": streets1,
    "next": "streets-2",
    "zombies": [
      {
        id: uuidv4(),
        position: [2,0,2]
      },
      {
        id: uuidv4(),
        position: [1,0,0]
      },
    ],
    "slimes": [
      {
        id: uuidv4(),
        position: [-2, 0, -2],
      }
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
  },
  "streets-3": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -3,
      "z2": 6
    },
    "img": streets3,
    "next": "streets-4",
  },
  "streets-4": {
    "arena": {
      "x1": -4,
      "x2": 4,
      "z1": -3,
      "z2": 6
    },
    "img": streets4,
    "next": null
  },
}