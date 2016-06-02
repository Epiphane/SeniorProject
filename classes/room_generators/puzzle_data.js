var easy_puzzle1 = {
   rows: 4,
   cols: 4,
   offset_x: -4,
   offset_y: -4,

   data: "#oo#oooooooo#oo#"
};

var med_puzzle1 = {
   rows: 5,
   cols: 5,
   offset_x: -5,
   offset_y: -4,

   data: ".#o#.\
##o##\
ooooo\
#oo#.\
.#o.."
};

var med_puzzle2 = {
   rows: 7,
   cols: 6,
   offset_x: -6,
   offset_y: -4,

   data: ".####.\
#oooo#\
#oooo#\
#oooo#\
.##oo#\
.oooo.\
.####."
};

var hard_puzzle1 = {
   rows: 11,
   cols: 10,
   offset_x: -5,
   offset_y: -5,

   data: "#ooooo#oo#\
#ooo#o#oo#\
#o###o#oo#\
#o###o#oo#\
.oooo.ooo.\
#ooo#.#oo#\
#o#ooo#oo#\
#o######o#\
#oooooooo#"
};

var hard_puzzle2 = {
   rows: 10,
   cols: 12,
   offset_x: -6,
   offset_y: -5,
data: ".....o......\
.....#......\
.....o......\
o#o######o#o\
...#....o...\
...#....#...\
...oo####...\
#o##....o...\
...o....#...\
...#....#..."
};

var hard_puzzle3 = {
   rows: 6,
   cols: 6,
   offset_x: -3,
   offset_y: -3,
data: "oooooo\
oo#ooo\
oooooo\
ooo.#o\
o#oooo\
oooooo"
};

var med_puzzles = [med_puzzle1, med_puzzle2];
var hard_puzzles = [hard_puzzle3];
var all_puzzles = [easy_puzzle1, med_puzzle1, med_puzzle2, hard_puzzle1, hard_puzzle2, hard_puzzle3];
