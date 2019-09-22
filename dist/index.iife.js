var bitsyMerge = (function () {
  'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var colourUtils = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    function numToRgbString(num) {
      return `${num >> 16 & 255},${num >> 8 & 255},${num & 255}`;
    }

    exports.numToRgbString = numToRgbString;

    function rgbStringToNum(str) {
      const [r, g, b] = str.split(",");
      return parseInt(b, 10) << 0 | parseInt(g, 10) << 8 | parseInt(r, 10) << 16;
    }

    exports.rgbStringToNum = rgbStringToNum;
  });
  unwrapExports(colourUtils);
  var colourUtils_1 = colourUtils.numToRgbString;
  var colourUtils_2 = colourUtils.rgbStringToNum;

  var dist = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    function parsePosition(str) {
      const [x, y] = str.split(",").map(n => parseInt(n, 10));
      return {
        x,
        y
      };
    }

    class BitsyWorld {
      constructor() {
        this.title = "";
        this.bitsyVersion = "";
        this.roomFormat = 1;
        this.rooms = {};
        this.palettes = {};
        this.tiles = {};
        this.sprites = {};
        this.items = {};
        this.dialogue = {};
        this.endings = {};
        this.variables = {};
      }

      toString() {
        function valuesToString(obj) {
          return Object.keys(obj).map(s => obj[s].toString()).join('\n\n');
        }

        return `${this.title}

# BITSY VERSION ${this.bitsyVersion}

! ROOM_FORMAT ${this.roomFormat}

${valuesToString(this.palettes)}

${valuesToString(this.rooms)}

${valuesToString(this.tiles)}

${valuesToString(this.sprites)}

${valuesToString(this.items)}

${valuesToString(this.dialogue)}

${valuesToString(this.endings)}

${valuesToString(this.variables)}`;
      }

    }

    exports.BitsyWorld = BitsyWorld;

    class BitsyResourceBase {
      constructor() {
        this.id = "";
        this.name = "";
      }

      get type() {
        const brb = this.constructor;
        return brb;
      }

      toString() {
        return `${this.type.typeName} ${this.id}`;
      }

    }

    BitsyResourceBase.typeName = "";
    exports.BitsyResourceBase = BitsyResourceBase;

    class BitsyObjectBase extends BitsyResourceBase {
      constructor() {
        super();
        this.graphic = [];
        this.dialogueID = "";
        this.wall = false;
        this.palette = this.type.paletteDefault;
      }

      get type() {
        const bob = this.constructor;
        return bob;
      }

      toString() {
        const props = [];
        props.push(super.toString());
        props.push(this.graphic.map(g => g.map(b => b ? 1 : 0).join('').replace(/(.{8})/g, '$1\n').trim()).join('\n>\n'));

        if (this.name) {
          props.push(`NAME ${this.name}`);
        }

        if (this.dialogueID) {
          props.push(`DLG ${this.dialogueID}`);
        }

        if (this.position) {
          props.push(`POS ${this.position.room} ${this.position.x},${this.position.y}`);
        }

        if (this.wall) {
          props.push(`WAL true`);
        }

        if (this.palette !== this.type.paletteDefault) {
          props.push(`COL ${this.palette}`);
        }

        return props.join('\n');
      }

    }

    BitsyObjectBase.paletteDefault = 1;
    exports.BitsyObjectBase = BitsyObjectBase;

    class BitsyTile extends BitsyObjectBase {}

    BitsyTile.paletteDefault = 1;
    BitsyTile.typeName = "TIL";
    exports.BitsyTile = BitsyTile;

    class BitsySprite extends BitsyObjectBase {}

    BitsySprite.paletteDefault = 2;
    BitsySprite.typeName = "SPR";
    exports.BitsySprite = BitsySprite;

    class BitsyItem extends BitsyObjectBase {}

    BitsyItem.paletteDefault = 2;
    BitsyItem.typeName = "ITM";
    exports.BitsyItem = BitsyItem;

    class BitsyPalette extends BitsyResourceBase {
      constructor() {
        super(...arguments);
        this.colors = [];
      }

      get background() {
        return this.colors[0];
      }

      get tile() {
        return this.colors[1];
      }

      get sprite() {
        return this.colors[2];
      }

      toString() {
        return `${super.toString()}
${this.colors.map(colourUtils.numToRgbString).join('\n')}`;
      }

    }

    BitsyPalette.typeName = "PAL";
    exports.BitsyPalette = BitsyPalette;

    class BitsyRoom extends BitsyResourceBase {
      constructor() {
        super(...arguments);
        this.tiles = [];
        this.items = [];
        this.exits = [];
        this.endings = [];
        this.palette = "";
      }

      toString() {
        return [super.toString(), ...this.tiles.map(row => row.join(",")), ...this.items.map(({
          id,
          x,
          y
        }) => `ITM ${id} ${x},${y}`), ...this.exits.map(({
          from,
          to,
          transition
        }) => `EXT ${from.x},${from.y} ${to.room} ${to.x},${to.y}${transition ? ` FX ${transition}` : ""}`), ...this.endings.map(({
          id,
          x,
          y
        }) => `END ${id} ${x},${y}`), `PAL ${this.palette}`].join('\n');
      }

    }

    BitsyRoom.typeName = "ROOM";
    exports.BitsyRoom = BitsyRoom;

    class BitsyDialogue extends BitsyResourceBase {
      constructor() {
        super(...arguments);
        this.script = "";
      }

      toString() {
        return `${super.toString()}
${this.script}`;
      }

    }

    BitsyDialogue.typeName = "DLG";
    exports.BitsyDialogue = BitsyDialogue;

    class BitsyEnding extends BitsyResourceBase {
      constructor() {
        super(...arguments);
        this.script = "";
      }

      toString() {
        return `${super.toString()}
${this.script}`;
      }

    }

    BitsyEnding.typeName = "END";
    exports.BitsyEnding = BitsyEnding;

    class BitsyVariable extends BitsyResourceBase {
      constructor() {
        super(...arguments);
        this.value = "";
      }

      toString() {
        return `${super.toString()}
${this.value}`;
      }

    }

    BitsyVariable.typeName = "VAR";
    exports.BitsyVariable = BitsyVariable;

    class BitsyParser {
      constructor() {
        this.world = new BitsyWorld();
        this.lineCounter = 0;
        this.lines = [];
      }

      static parse(lines) {
        const parser = new BitsyParser();
        parser.parseLines(lines);
        return parser.world;
      }

      reset() {
        this.lineCounter = 0;
        this.lines = [];
        this.world = new BitsyWorld();
      }

      parseLines(lines) {
        this.reset();
        this.lines = lines;
        this.world.title = this.takeLine();

        while (!this.done && !this.checkLine("# BITSY VERSION ")) {
          this.skipLine();
        }

        this.world.bitsyVersion = this.takeSplitOnce("# BITSY VERSION ")[1];

        while (!this.done && !this.checkLine("! ROOM_FORMAT ")) {
          this.skipLine();
        }

        this.world.roomFormat = parseInt(this.takeSplitOnce("! ROOM_FORMAT ")[1], 10);

        while (!this.done) {
          if (this.checkLine("PAL")) this.takePalette();else if (this.checkLine("ROOM")) this.takeRoom();else if (this.checkLine("TIL")) this.takeTile();else if (this.checkLine("SPR")) this.takeSprite();else if (this.checkLine("ITM")) this.takeItem();else if (this.checkLine("END")) this.takeEnding();else if (this.checkLine("DLG")) this.takeDialogue();else if (this.checkLine("VAR")) this.takeVariable();else {
            while (!this.checkBlank()) {
              this.skipLine();
            }

            this.skipLine();
          }
        }
      }

      get done() {
        return this.lineCounter >= this.lines.length;
      }

      get currentLine() {
        return this.lines[this.lineCounter];
      }

      checkLine(check) {
        return this.currentLine.startsWith(check);
      }

      checkBlank() {
        return this.done || this.currentLine.trim().length == 0;
      }

      takeLine() {
        const line = this.currentLine;
        this.lines[this.lineCounter] = "";
        this.lineCounter += 1;
        return line;
      }

      skipLine() {
        this.takeLine();
      }

      takeSplit(delimiter) {
        return this.takeLine().split(delimiter);
      }

      takeSplitOnce(delimiter) {
        const line = this.takeLine();
        const i = line.indexOf(delimiter);
        return [line.slice(0, i), line.slice(i + delimiter.length)];
      }

      takeColor() {
        return colourUtils.rgbStringToNum(this.takeLine());
      }

      takeResourceID(resource) {
        resource.id = this.takeSplitOnce(" ")[1];
      }

      tryTakeResourceName(resource) {
        resource.name = this.checkLine("NAME") ? this.takeSplitOnce(" ")[1] : "";
      }

      tryTakeObjectPalette(object) {
        if (this.checkLine("COL")) {
          object.palette = parseInt(this.takeSplitOnce(" ")[1]);
        }
      }

      tryTakeObjectDialogueID(object) {
        if (this.checkLine("DLG")) {
          object.dialogueID = this.takeSplitOnce(" ")[1];
        }
      }

      tryTakeSpritePosition(sprite) {
        if (this.checkLine("POS")) {
          const [room, pos] = this.takeSplitOnce(" ")[1].split(" ");
          sprite.position = Object.assign({
            room
          }, parsePosition(pos));
        }
      }

      tryTakeTileWall(tile) {
        if (this.checkLine("WAL")) {
          tile.wall = this.takeSplitOnce(" ")[1] === "true";
        }
      }

      takePalette() {
        const palette = new BitsyPalette();
        this.takeResourceID(palette);
        this.tryTakeResourceName(palette);

        while (!this.checkBlank()) {
          palette.colors.push(this.takeColor());
        }

        this.world.palettes[palette.id] = palette;
      }

      takeRoom() {
        const room = new BitsyRoom();
        this.takeResourceID(room);
        this.takeRoomTiles(room);
        this.tryTakeResourceName(room);

        while (this.checkLine("ITM")) {
          this.takeRoomItem(room);
        }

        while (this.checkLine("EXT")) {
          this.takeRoomExit(room);
        }

        while (this.checkLine("END")) {
          this.takeRoomEnding(room);
        }

        this.takeRoomPalette(room);
        this.world.rooms[room.id] = room;
      }

      takeRoomTiles(room) {
        for (let i = 0; i < 16; ++i) {
          const row = this.takeSplit(",");
          room.tiles.push(row);
        }
      }

      takeRoomItem(room) {
        const item = this.takeSplitOnce(" ")[1];
        const [id, pos] = item.split(" ");
        room.items.push(Object.assign({
          id
        }, parsePosition(pos)));
      }

      takeRoomExit(room) {
        const exit = this.takeSplitOnce(" ")[1];
        const [from, toRoom, toPos, _, transition] = exit.split(" ");
        room.exits.push({
          from: parsePosition(from),
          to: Object.assign({
            room: toRoom
          }, parsePosition(toPos)),
          transition
        });
      }

      takeRoomEnding(room) {
        const ending = this.takeSplitOnce(" ")[1];
        const [id, pos] = ending.split(" ");
        room.endings.push(Object.assign({
          id
        }, parsePosition(pos)));
      }

      takeRoomPalette(room) {
        room.palette = this.takeSplitOnce(" ")[1];
      }

      takeDialogueScript(dialogue) {
        if (this.checkLine('"""')) {
          const lines = [this.takeLine()];

          while (!this.checkLine('"""')) {
            lines.push(this.takeLine());
          }

          lines.push(this.takeLine());
          dialogue.script = lines.join('\n');
        } else dialogue.script = this.takeLine();
      }

      takeFrame() {
        const frame = new Array(64).fill(false);

        for (let i = 0; i < 8; ++i) {
          const line = this.takeLine();

          for (let j = 0; j < 8; ++j) {
            frame[i * 8 + j] = line.charAt(j) == "1";
          }
        }

        return frame;
      }

      takeObjectGraphic(object) {
        const graphic = [];
        let moreFrames;

        do {
          graphic.push(this.takeFrame());
          moreFrames = this.checkLine(">");

          if (moreFrames) {
            this.skipLine();
          }
        } while (moreFrames);

        object.graphic = graphic;
      }

      takeTile() {
        const tile = new BitsyTile();
        this.takeResourceID(tile);
        this.takeObjectGraphic(tile);
        this.tryTakeResourceName(tile);
        this.tryTakeTileWall(tile);
        this.tryTakeObjectPalette(tile);
        this.world.tiles[tile.id] = tile;
      }

      takeSprite() {
        const sprite = new BitsySprite();
        this.takeResourceID(sprite);
        this.takeObjectGraphic(sprite);
        this.tryTakeResourceName(sprite);
        this.tryTakeObjectDialogueID(sprite);
        this.tryTakeSpritePosition(sprite);
        this.tryTakeObjectPalette(sprite);
        this.world.sprites[sprite.id] = sprite;
      }

      takeItem() {
        const item = new BitsyItem();
        this.takeResourceID(item);
        this.takeObjectGraphic(item);
        this.tryTakeResourceName(item);
        this.tryTakeObjectDialogueID(item);
        this.tryTakeObjectPalette(item);
        this.world.items[item.id] = item;
      }

      takeEnding() {
        const ending = new BitsyEnding();
        this.takeResourceID(ending);
        this.takeDialogueScript(ending);
        this.world.endings[ending.id] = ending;
      }

      takeDialogue() {
        const dialogue = new BitsyDialogue();
        this.takeResourceID(dialogue);
        this.takeDialogueScript(dialogue);
        this.world.dialogue[dialogue.id] = dialogue;
      }

      takeVariable() {
        const variable = new BitsyVariable();
        this.takeResourceID(variable);
        variable.value = this.takeLine();
        this.world.variables[variable.id] = variable;
      }

    }

    exports.BitsyParser = BitsyParser;
  });
  var parser = unwrapExports(dist);
  var dist_1 = dist.BitsyWorld;
  var dist_2 = dist.BitsyResourceBase;
  var dist_3 = dist.BitsyObjectBase;
  var dist_4 = dist.BitsyTile;
  var dist_5 = dist.BitsySprite;
  var dist_6 = dist.BitsyItem;
  var dist_7 = dist.BitsyPalette;
  var dist_8 = dist.BitsyRoom;
  var dist_9 = dist.BitsyDialogue;
  var dist_10 = dist.BitsyEnding;
  var dist_11 = dist.BitsyVariable;
  var dist_12 = dist.BitsyParser;

  function parse(gamedata) {
    try {
      return parser.BitsyParser.parse(gamedata.replace(/\r\n/g, '\n').split('\n'));
    } catch (err) {
      throw new Error("Failed to parse gamedata: ".concat(err.message));
    }
  }

  function merge(baseGamedata, addGamedata, prefix) {
    var a = parse(baseGamedata);
    var b = parse(addGamedata);
    var add = {
      variables: {},
      endings: {},
      dialogue: {},
      items: {},
      sprites: {},
      tiles: {},
      palettes: {},
      rooms: {}
    };
    var skip = {
      variables: {},
      endings: {},
      dialogue: {},
      items: {},
      sprites: {},
      tiles: {},
      palettes: {},
      rooms: {}
    }; // check for overlaps
    // [map name, fn to update references]

    [// variable overlaps are a fatal error
    ['variables', function (oldId) {
      throw new Error("Couldn't merge: both games define a starting value for \"VAR ".concat(oldId, "\"; please resolve this conflict externally."));
    }], // endings are referenced by rooms' ending list
    ['endings', function (oldId, newId) {
      return Object.values(b.rooms).map(function (_ref) {
        var endings = _ref.endings;
        return endings;
      }).filter(function (_ref2) {
        var id = _ref2.id;
        return id === oldId;
      }).forEach(function (ending) {
        ending.id = newId;
      });
    }], // dialogue is referenced by sprites and items
    ['dialogue', function (oldId, newId) {
      return Object.values(b.items).concat(Object.values(b.sprites)).filter(function (_ref3) {
        var dialogueID = _ref3.dialogueID;
        return dialogueID === oldId;
      }).forEach(function (obj) {
        obj.dialogueID = newId;
      });
    }], // items are referenced by rooms' item list
    ['items', function (oldId, newId) {
      return Object.values(b.rooms).forEach(function (_ref4) {
        var items = _ref4.items;
        items.filter(function (_ref5) {
          var id = _ref5.id;
          return id === oldId;
        }).forEach(function (obj) {
          obj.id = newId;
        });
      });
    }], // sprites aren't referenced
    ['sprites', function () {}], // tiles are referenced by rooms' tilemap
    ['tiles', function (oldId, newId) {
      return Object.values(b.rooms).map(function (_ref6) {
        var tiles = _ref6.tiles;
        return tiles;
      }).forEach(function (tiles) {
        tiles.forEach(function (row) {
          row.forEach(function (tile, idx) {
            if (tile === oldId) {
              row[idx] = newId;
            }
          });
        });
      });
    }], // palettes are referenced by rooms
    ['palettes', function (oldId, newId) {
      return Object.values(b.rooms).filter(function (_ref7) {
        var palette = _ref7.palette;
        return palette === oldId;
      }).forEach(function (room) {
        room.palette = newId;
      });
    }], // rooms are referenced by rooms' exits and by sprites' positions
    ['rooms', function (oldId, newId) {
      Object.values(b.rooms).forEach(function (_ref8) {
        var exits = _ref8.exits;
        exits.filter(function (_ref9) {
          var room = _ref9.to.room;
          return room === oldId;
        }).forEach(function (exit) {
          exit.to.room = newId;
        });
      });
      Object.values(b.sprites).map(function (_ref10) {
        var position = _ref10.position;
        return position;
      }).filter(function (p) {
        return p;
      }).filter(function (_ref11) {
        var room = _ref11.room;
        return room === oldId;
      }).forEach(function (position) {
        position.room = newId;
      });
    }]].forEach(function (_ref12) {
      var _ref13 = _slicedToArray(_ref12, 2),
          map = _ref13[0],
          updateReferences = _ref13[1];

      for (var id in b[map]) {
        var vb = b[map][id];
        var va = a[map][id];

        if (!va) {
          add[map][id] = vb;
        } else if (va.toString() === vb.toString()) {
          skip[map][id] = vb;
        } else {
          var newId = "".concat(prefix).concat(id);
          vb.id = newId;
          add[map][newId] = vb;
          updateReferences(id, newId);
        }
      }
    }); // do the merge

    ['variables', 'endings', 'dialogue', 'items', 'sprites', 'tiles', 'palettes', 'rooms'].forEach(function (map) {
      for (var id in add[map]) {
        a[map][id] = add[map][id];
      }
    });
    return {
      gamedata: a.toString(),
      added: add,
      skipped: skip,
      toString: function toString() {
        return this.gamedata;
      }
    };
  }

  return merge;

}());
