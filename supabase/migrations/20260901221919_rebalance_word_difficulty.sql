/*
  # Rebalance word difficulty levels

  ## Summary
  Reassigns a handful of words between difficulty tiers based on vocabulary
  frequency, spelling familiarity, letter rarity (J/Q/V/X/Y/Z), and letter
  combinations — not word length alone.

  ## Word moves
  ### Animals
  - Squirrel: medium → hard  (QU digraph, double R; uncommon spelling pattern)
  - Dragonfly: hard → medium (compound of two common words, all common letters)

  ### Food
  - Eggplant: hard → medium   (very common word, all common letters)
  - Quesadilla: medium → hard (Q start, double L, Spanish spelling, uncommon)

  ### Holidays
  - Heart: medium → easy      (5 letters, all common letters, trivial spelling)
  - Kwanzaa: easy → medium    (KW cluster, double A; less universally familiar)
  - Harvest: hard → medium    (all common letters, well-known vocabulary)

  ### Desserts
  - Opera: hard → medium      (5 letters, all common letters, trivial spelling)

  All other words remain in their current difficulty tier.
  RLS already enabled with public read policy — no policy changes needed.
*/

-- Animals: Squirrel medium → hard
UPDATE words SET difficulty = 'hard' WHERE word = 'Squirrel' AND category = 'Animals' AND difficulty = 'medium';

-- Animals: Dragonfly hard → medium
UPDATE words SET difficulty = 'medium' WHERE word = 'Dragonfly' AND category = 'Animals' AND difficulty = 'hard';

-- Food: Eggplant hard → medium
UPDATE words SET difficulty = 'medium' WHERE word = 'Eggplant' AND category = 'Food' AND difficulty = 'hard';

-- Food: Quesadilla medium → hard
UPDATE words SET difficulty = 'hard' WHERE word = 'Quesadilla' AND category = 'Food' AND difficulty = 'medium';

-- Holidays: Heart medium → easy
UPDATE words SET difficulty = 'easy' WHERE word = 'Heart' AND category = 'Holidays' AND difficulty = 'medium';

-- Holidays: Kwanzaa easy → medium
UPDATE words SET difficulty = 'medium' WHERE word = 'Kwanzaa' AND category = 'Holidays' AND difficulty = 'easy';

-- Holidays: Harvest hard → medium
UPDATE words SET difficulty = 'medium' WHERE word = 'Harvest' AND category = 'Holidays' AND difficulty = 'hard';

-- Desserts: Opera hard → medium
UPDATE words SET difficulty = 'medium' WHERE word = 'Opera' AND category = 'Desserts' AND difficulty = 'hard';
