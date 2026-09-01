import { WordEntry } from '../types';

// ---------------------------------------------------------------------------
// Word library — nested by category, then by difficulty.
// This structure is the source of truth and is designed for easy expansion:
// add a category by adding a key, add words by extending an array.
// The flat `fallbackWords` export (consumed by the game hook) is derived below.
//
// Normalization rules:
// - Letters A–Z only (no accents, punctuation, apostrophes, hyphens, quotes).
// - Title Case for single words; PascalCase for concatenated phrases.
// - No duplicate words across the entire library.
//
// Difficulty is based on vocabulary frequency, spelling familiarity, letter
// rarity (J/Q/V/X/Y/Z are harder), and letter-combination patterns — not
// word length alone.
// ---------------------------------------------------------------------------

export const CATEGORIES = ['Animals', 'Food', 'Holidays', 'Spring', 'Desserts', 'Entertainment'] as const;
export type Category = typeof CATEGORIES[number];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

type WordLibrary = Record<Category, Record<Difficulty, string[]>>;

const wordLibrary: WordLibrary = {
  Animals: {
    easy: [
      'Rabbit', 'Bunny', 'Bear', 'Tiger', 'Lion', 'Horse', 'Zebra', 'Monkey',
      'Panda', 'Otter', 'Koala', 'Beaver', 'Kitten', 'Puppy', 'Goose', 'Duck',
      'Chicken', 'Rooster', 'Donkey', 'Turtle',
    ],
    medium: [
      'Flamingo', 'Penguin', 'Kangaroo', 'Hedgehog', 'Butterfly', 'Woodpecker',
      'Bluebird', 'Porcupine', 'Raccoon', 'Pelican', 'Peacock',
      'Ladybug', 'Firefly', 'Caterpillar', 'Octopus', 'Starfish', 'Jellyfish',
      'Seahorse', 'Dolphin', 'Dragonfly',
    ],
    hard: [
      'Chameleon', 'Armadillo', 'Axolotl', 'Orangutan', 'Narwhal', 'Platypus',
      'Wolverine', 'Crocodile', 'Alligator', 'Hippopotamus', 'Chimpanzee',
      'Hummingbird', 'Barracuda', 'Cuttlefish', 'Kingfisher',
      'Mantis', 'Opossum', 'Warthog', 'Gazelle', 'Squirrel',
    ],
  },

  Food: {
    easy: [
      'Pizza', 'Burger', 'Taco', 'Apple', 'Banana', 'Carrot', 'Potato',
      'Orange', 'Grapes', 'Cheese', 'Bread', 'Pasta', 'Rice', 'Bacon',
      'Celery', 'Steak', 'Sausage', 'Tomato', 'Onion', 'Pepper',
    ],
    medium: [
      'Avocado', 'Broccoli', 'Pineapple', 'Watermelon', 'Blueberry',
      'Strawberry', 'Asparagus', 'Cauliflower', 'Artichoke', 'Zucchini',
      'Cucumber', 'Spinach', 'Mushroom', 'Pretzel', 'Popcorn', 'Meatball',
      'Lasagna', 'Burrito', 'Sandwich', 'Eggplant',
    ],
    hard: [
      'Jalapeno', 'Sauerkraut', 'Prosciutto',
      'Gnocchi', 'Fettuccine', 'Ciabatta', 'Baguette', 'Gazpacho',
      'Edamame', 'Ratatouille', 'Bouillabaisse', 'Capicola', 'Kimchi',
      'Escargot', 'Risotto', 'Pierogi', 'Shakshuka', 'Tabbouleh',
      'Brussels', 'Quesadilla',
    ],
  },

  Holidays: {
    easy: [
      'Easter', 'Halloween', 'Christmas', 'Hanukkah', 'Holiday',
      'Parade', 'Turkey', 'Firework', 'Costume', 'Pumpkin', 'Eggnog',
      'Cupid', 'Sleigh', 'Basket', 'Candy', 'Snowman', 'Reindeer',
      'Lantern', 'Party', 'Heart',
    ],
    medium: [
      'Valentine', 'Thanksgiving', 'Fireworks', 'Shamrock',
      'Leprechaun', 'Menorah', 'Stocking', 'Wreath', 'Ornament',
      'Jackolantern', 'Confetti', 'Countdown', 'Celebration',
      'Resolution', 'Ribbon', 'Bonfire', 'Cornucopia',
      'Cranberry', 'Gingerbread', 'Kwanzaa', 'Harvest',
    ],
    hard: [
      'Independence', 'Mistletoe', 'Nutcracker', 'Poinsettia',
      'Candelabra', 'Evergreen', 'Noisemaker', 'Masquerade',
      'Groundhog', 'Hanukkiah', 'Peppermint', 'Caroling', 'Tradition',
      'Decoration', 'Festival', 'Commemoration',
      'Tablecloth', 'Centerpiece',
    ],
  },

  Spring: {
    easy: [
      'Tulip', 'Robin', 'Nest', 'Bloom', 'Rain', 'Grass', 'Bee', 'Bug',
      'Sun', 'Cloud', 'Puddle', 'Leaf', 'Seed', 'Plant', 'Wind', 'Kite',
      'Duckling', 'Chick', 'Fawn', 'Garden',
    ],
    medium: [
      'Rainbow', 'Blossom', 'Meadow', 'Iris', 'Petunia', 'Azalea',
      'Daffodil', 'Sunshine', 'Raindrop', 'Birdhouse', 'Wildflower',
      'Buttercup', 'Picnic', 'Lavender', 'Sprout', 'Clover', 'Songbird',
      'Treehouse', 'Watering', 'Flowerpot',
    ],
    hard: [
      'Hyacinth', 'Forsythia', 'Crocus', 'Bluebell', 'Primrose', 'Dogwood',
      'Magnolia', 'Trillium', 'Bloodroot', 'Honeysuckle', 'CherryBlossom',
      'Coltsfoot', 'Snowdrop', 'Sweetpea', 'Pollination',
      'Photosynthesis', 'Bumblebee', 'Greenhouse', 'Wisteria', 'Jonquil',
    ],
  },

  Desserts: {
    easy: [
      'Cookie', 'Brownie', 'Cupcake', 'Donut', 'Fudge', 'Muffin',
      'Sundae', 'Gelato', 'Sorbet', 'Pudding', 'Pie', 'Tart', 'Truffle',
      'Bonbon', 'Eclair', 'Parfait', 'Cobbler', 'Taffy', 'Waffle',
      'Caramel',
    ],
    medium: [
      'Cheesecake', 'Cannoli', 'Macaron', 'Biscotti', 'Baklava',
      'Meringue', 'Creampuff', 'Souffle', 'Shortbread', 'Marshmallow',
      'Croissant', 'Churro', 'Profiterole', 'Ganache', 'Madeleine',
      'Crumble', 'Strudel', 'Napoleon', 'Pavlova', 'Tiramisu',
      'Opera',
    ],
    hard: [
      'Semifreddo', 'Clafoutis', 'Financier', 'Charlotte', 'Millefeuille',
      'Cannele', 'Frangipane', 'Zabaglione', 'Florentine', 'Panettone',
      'Amaretti', 'Sachertorte', 'Kouignamann', 'Marzipan',
      'Diplomat', 'Dacquoise', 'Bienenstich', 'Pannacotta', 'Galette',
    ],
  },

  Entertainment: {
    easy: [
      'Movie', 'Cinema', 'Actor', 'Actress', 'Comedy', 'Drama', 'Hero',
      'Villain', 'Cartoon', 'Family', 'Magic', 'Robot', 'Pirate',
      'Wizard', 'Castle', 'Dragon', 'Princess', 'Monster', 'Detective',
      'Adventure',
    ],
    medium: [
      'Animated', 'Director', 'Screenplay', 'Superhero', 'Treasure',
      'Spaceship', 'TimeTravel', 'Kingdom', 'Mystery', 'Fantasy',
      'Explorer', 'Sidekick', 'Soundtrack', 'Premiere', 'Hollywood',
      'Television', 'Champion', 'Creature', 'Journey',
    ],
    hard: [
      'Blockbuster', 'Documentary', 'Cinematography', 'Choreography',
      'Transformation', 'Apocalypse', 'Archaeologist', 'Screenwriter',
      'Production', 'Illusionist', 'Multiverse', 'Adventureland',
      'Interstellar', 'Constellation', 'Expedition', 'Labyrinth',
      'Enchantment', 'Mythology', 'Legendary', 'Imagination',
    ],
  },
};

// ---------------------------------------------------------------------------
// Derived flat list consumed by the game hook.
// The hook filters by category and difficulty, so the shape of this array
// (flat WordEntry[]) is preserved for backwards compatibility.
// ---------------------------------------------------------------------------

let idCounter = 0;
function makeId(category: string, difficulty: string, index: number): string {
  return `${category[0].toLowerCase()}${difficulty[0]}${index}`;
}

export const fallbackWords: WordEntry[] = CATEGORIES.flatMap(category =>
  DIFFICULTIES.flatMap(difficulty =>
    wordLibrary[category][difficulty].map((word) => ({
      id: makeId(category, difficulty, idCounter++),
      word,
      category,
      difficulty,
    }))
  )
);

// Get words filtered by category and weighted by difficulty
export function getWordsForDifficulty(words: WordEntry[], difficulty: Difficulty): WordEntry[] {
  // Weighted selection: mostly target difficulty, some from adjacent
  const targetWords = words.filter(w => w.difficulty === difficulty);
  const adjacentWords = words.filter(w => w.difficulty !== difficulty);

  // Return target words, padded with some adjacent if needed
  if (targetWords.length >= 10) {
    return targetWords;
  }
  return [...targetWords, ...adjacentWords.slice(0, 20 - targetWords.length)];
}
