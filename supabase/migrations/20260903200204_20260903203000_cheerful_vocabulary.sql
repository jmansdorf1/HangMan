-- Replace overly technical/obscure/depressing words with cheerful alternatives

-- Animals: Barracuda -> Quokka, Cuttlefish -> Quail, Warthog -> Lynx
UPDATE words SET word = 'Quokka' WHERE word = 'Barracuda' AND category = 'Animals' AND difficulty = 'hard';
UPDATE words SET word = 'Quail' WHERE word = 'Cuttlefish' AND category = 'Animals' AND difficulty = 'hard';
UPDATE words SET word = 'Lynx' WHERE word = 'Warthog' AND category = 'Animals' AND difficulty = 'hard';

-- Food: Bouillabaisse -> Pomegranate, Capicola -> Pistachio, Shakshuka -> Macadamia,
--       Tabbouleh -> Jujube, Brussels -> Kumquat
UPDATE words SET word = 'Pomegranate' WHERE word = 'Bouillabaisse' AND category = 'Food' AND difficulty = 'hard';
UPDATE words SET word = 'Pistachio' WHERE word = 'Capicola' AND category = 'Food' AND difficulty = 'hard';
UPDATE words SET word = 'Macadamia' WHERE word = 'Shakshuka' AND category = 'Food' AND difficulty = 'hard';
UPDATE words SET word = 'Jujube' WHERE word = 'Tabbouleh' AND category = 'Food' AND difficulty = 'hard';
UPDATE words SET word = 'Kumquat' WHERE word = 'Brussels' AND category = 'Food' AND difficulty = 'hard';

-- Holidays: Commemoration -> Jubilee, Tablecloth -> Nativity
UPDATE words SET word = 'Jubilee' WHERE word = 'Commemoration' AND category = 'Holidays' AND difficulty = 'hard';
UPDATE words SET word = 'Nativity' WHERE word = 'Tablecloth' AND category = 'Holidays' AND difficulty = 'hard';

-- Spring: Forsythia -> Zinnia, Bloodroot -> Sunflower, Coltsfoot -> Daisy,
--         Pollination -> Jasmine, Photosynthesis -> Violet
UPDATE words SET word = 'Zinnia' WHERE word = 'Forsythia' AND category = 'Spring' AND difficulty = 'hard';
UPDATE words SET word = 'Sunflower' WHERE word = 'Bloodroot' AND category = 'Spring' AND difficulty = 'hard';
UPDATE words SET word = 'Daisy' WHERE word = 'Coltsfoot' AND category = 'Spring' AND difficulty = 'hard';
UPDATE words SET word = 'Jasmine' WHERE word = 'Pollination' AND category = 'Spring' AND difficulty = 'hard';
UPDATE words SET word = 'Violet' WHERE word = 'Photosynthesis' AND category = 'Spring' AND difficulty = 'hard';

-- Desserts: Financier -> Cinnamonroll, Diplomat -> ZebraCake
UPDATE words SET word = 'Cinnamonroll' WHERE word = 'Financier' AND category = 'Desserts' AND difficulty = 'hard';
UPDATE words SET word = 'ZebraCake' WHERE word = 'Diplomat' AND category = 'Desserts' AND difficulty = 'hard';

-- Entertainment: Cinematography -> Jukebox, Choreography -> Marquee, Apocalypse -> Voyager
UPDATE words SET word = 'Jukebox' WHERE word = 'Cinematography' AND category = 'Entertainment' AND difficulty = 'hard';
UPDATE words SET word = 'Marquee' WHERE word = 'Choreography' AND category = 'Entertainment' AND difficulty = 'hard';
UPDATE words SET word = 'Voyager' WHERE word = 'Apocalypse' AND category = 'Entertainment' AND difficulty = 'hard';
