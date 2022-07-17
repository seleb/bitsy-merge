'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dist = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BitsyParser = exports.BitsyBlip = exports.BitsyTune = exports.BitsyVariable = exports.BitsyEnding = exports.BitsyDialogue = exports.BitsyRoom = exports.BitsyPalette = exports.BitsyItem = exports.BitsySprite = exports.BitsyTile = exports.BitsyObjectBase = exports.BitsyResourceBase = exports.BitsyWorld = void 0;

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
      this.bitsyVersionMajor = 0;
      this.bitsyVersionMinor = 0;
      this.roomFormat = 1;
      this.dialogCompatibility = 0;
      this.textMode = 0;
      this.rooms = {};
      this.palettes = {};
      this.tiles = {};
      this.sprites = {};
      this.items = {};
      this.dialogue = {};
      this.endings = {};
      this.variables = {};
      this.tunes = {};
      this.blips = {};
    }

    toString() {
      return `${this.title}

# BITSY VERSION ${this.bitsyVersion}

${this.bitsyVersionMajor >= 8 ? `! VER_MAJ ${this.bitsyVersionMajor}
! VER_MIN ${this.bitsyVersionMinor}
! ROOM_FORMAT ${this.roomFormat}
! DLG_COMPAT ${this.dialogCompatibility}
! TXT_MODE ${this.textMode}` : `! ROOM_FORMAT ${this.roomFormat}`}

${[this.palettes, this.rooms, this.tiles, this.sprites, this.items, this.dialogue, this.endings, this.variables, this.tunes, this.blips].map(map => Object.values(map).map(i => i.toString()).join('\n\n')).filter(i => i).join('\n\n')}`;
    }

  }

  exports.BitsyWorld = BitsyWorld;

  class BitsyResourceBase {
    constructor(world) {
      this.world = world;
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

  exports.BitsyResourceBase = BitsyResourceBase;
  BitsyResourceBase.typeName = "";

  class BitsyObjectBase extends BitsyResourceBase {
    constructor(...args) {
      super(...args);
      this.graphic = [];
      this.dialogueID = "";
      this.wall = false;
      this.blip = "";
      this.palette = this.type.paletteDefault;
      this.paletteBackground = this.type.paletteBackgroundDefault;
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

      if (this.paletteBackground !== this.type.paletteBackgroundDefault) {
        props.push(`BGC ${this.paletteBackground}`);
      }

      if (this.blip) {
        props.push(`BLIP ${this.blip}`);
      }

      return props.join('\n');
    }

  }

  exports.BitsyObjectBase = BitsyObjectBase;
  BitsyObjectBase.paletteBackgroundDefault = 0;
  BitsyObjectBase.paletteDefault = 1;

  class BitsyTile extends BitsyObjectBase {}

  exports.BitsyTile = BitsyTile;
  BitsyTile.paletteDefault = 1;
  BitsyTile.typeName = "TIL";

  class BitsySprite extends BitsyObjectBase {}

  exports.BitsySprite = BitsySprite;
  BitsySprite.paletteDefault = 2;
  BitsySprite.typeName = "SPR";

  class BitsyItem extends BitsyObjectBase {}

  exports.BitsyItem = BitsyItem;
  BitsyItem.paletteDefault = 2;
  BitsyItem.typeName = "ITM";

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
      return `${[super.toString(), this.world.bitsyVersionMajor < 8 && this.name && `NAME ${this.name}`, ...this.colors.map(({
        r,
        g,
        b
      }) => `${r},${g},${b}`), this.world.bitsyVersionMajor >= 8 && this.name && `NAME ${this.name}`].filter(i => i).join('\n')}`;
    }

  }

  exports.BitsyPalette = BitsyPalette;
  BitsyPalette.typeName = "PAL";

  class BitsyRoom extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      this.tiles = [];
      this.legacyWalls = [];
      this.items = [];
      this.exits = [];
      this.endings = [];
      this.palette = "";
      this.avatar = "";
      this.tune = "";
    }

    toString() {
      return [super.toString(), ...this.tiles.map(row => row.join(",")), this.name && `NAME ${this.name}`, this.legacyWalls.length && `WAL ${this.legacyWalls.join(',')}`, ...this.items.map(({
        id,
        x,
        y
      }) => `ITM ${id} ${x},${y}`), ...this.exits.map(({
        from,
        to,
        transition,
        dialog
      }) => ['EXT', `${from.x},${from.y}`, to.room, `${to.x},${to.y}`, transition && `FX ${transition}`, dialog && `DLG ${dialog}`].filter(i => i).join(' ')), ...this.endings.map(({
        id,
        x,
        y
      }) => `END ${id} ${x},${y}`), this.palette && `PAL ${this.palette}`, this.avatar && `AVA ${this.avatar}`, this.tune && `TUNE ${this.tune}`].filter(i => i).join('\n');
    }

  }

  exports.BitsyRoom = BitsyRoom;
  BitsyRoom.typeName = "ROOM";

  class BitsyDialogue extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      this.script = "";
    }

    toString() {
      return `${[super.toString(), this.script, this.name && `NAME ${this.name}`].filter(i => i).join('\n')}`;
    }

  }

  exports.BitsyDialogue = BitsyDialogue;
  BitsyDialogue.typeName = "DLG";

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

  exports.BitsyEnding = BitsyEnding;
  BitsyEnding.typeName = "END";

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

  exports.BitsyVariable = BitsyVariable;
  BitsyVariable.typeName = "VAR";

  class BitsyTune extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      /** value is currently just the raw data as a string, not the actual parameters */
      // TODO: parse actual parameters

      this.value = "";
    }

    toString() {
      return `${super.toString()}
${this.value}`;
    }

  }

  exports.BitsyTune = BitsyTune;
  BitsyTune.typeName = "TUNE";

  class BitsyBlip extends BitsyResourceBase {
    constructor() {
      super(...arguments);
      /** value is currently just the raw data as a string, not the actual parameters */
      // TODO: parse actual parameters

      this.value = "";
    }

    toString() {
      return `${super.toString()}
${this.value}`;
    }

  }

  exports.BitsyBlip = BitsyBlip;
  BitsyBlip.typeName = "BLIP";

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

      while (!this.done && !this.checkLine("! ")) {
        this.skipLine();
      }

      if (this.checkLine("! VER_MAJ")) this.world.bitsyVersionMajor = parseInt(this.takeSplitOnce("! VER_MAJ ")[1], 10);else this.world.bitsyVersionMajor = parseInt(this.world.bitsyVersion.split('.')[0], 10);
      if (this.checkLine("! VER_MIN")) this.world.bitsyVersionMinor = parseInt(this.takeSplitOnce("! VER_MIN ")[1], 10);else this.world.bitsyVersionMinor = parseInt(this.world.bitsyVersion.split('.')[1], 10);
      if (this.checkLine("! ROOM_FORMAT")) this.world.roomFormat = parseInt(this.takeSplitOnce("! ROOM_FORMAT ")[1], 10);
      if (this.checkLine("! DLG_COMPAT")) this.world.dialogCompatibility = parseInt(this.takeSplitOnce("! DLG_COMPAT ")[1], 10);
      if (this.checkLine("! TXT_MODE")) this.world.textMode = parseInt(this.takeSplitOnce("! TXT_MODE ")[1], 10);

      while (!this.done) {
        if (this.checkLine("PAL")) this.takePalette();else if (this.checkLine("ROOM")) this.takeRoom();else if (this.checkLine("TIL")) this.takeTile();else if (this.checkLine("SPR")) this.takeSprite();else if (this.checkLine("ITM")) this.takeItem();else if (this.checkLine("END")) this.takeEnding();else if (this.checkLine("DLG")) this.takeDialogue();else if (this.checkLine("VAR")) this.takeVariable();else if (this.checkLine("TUNE")) this.takeTune();else if (this.checkLine("BLIP")) this.takeBlip();else {
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
      return this.currentLine ? this.currentLine.startsWith(check) : false;
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
      const [r, g, b] = this.takeLine().split(',').map(component => parseInt(component, 10));
      return {
        r,
        g,
        b
      };
    }

    takeResourceID(resource) {
      resource.id = this.takeSplitOnce(" ")[1];
    }

    tryTakeResourceName(resource) {
      resource.name = this.checkLine("NAME") ? this.takeSplitOnce(" ")[1] : resource.name;
    }

    tryTakeObjectPalette(object) {
      if (this.checkLine("COL")) {
        object.palette = parseInt(this.takeSplitOnce(" ")[1]);
      }
    }

    tryTakePaletteBackground(object) {
      if (this.checkLine("BGC")) {
        const bgc = this.takeSplitOnce(" ")[1];
        object.paletteBackground = bgc === '*' ? '*' : parseInt(bgc);
      }
    }

    tryTakeBlip(object) {
      if (this.checkLine("BLIP")) {
        object.blip = this.takeSplitOnce(" ")[1];
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
      const palette = new BitsyPalette(this.world);
      this.takeResourceID(palette);
      this.tryTakeResourceName(palette);

      while (!this.checkBlank() && !this.checkLine("NAME ")) {
        palette.colors.push(this.takeColor());
      }

      this.tryTakeResourceName(palette);
      this.world.palettes[palette.id] = palette;
    }

    takeRoom() {
      const room = new BitsyRoom(this.world);
      this.takeResourceID(room);
      this.takeRoomTiles(room);
      this.tryTakeResourceName(room);

      while (this.checkLine("WAL")) {
        this.takeRoomLegacyWalls(room);
      }

      while (this.checkLine("ITM")) {
        this.takeRoomItem(room);
      }

      while (this.checkLine("EXT")) {
        this.takeRoomExit(room);
      }

      while (this.checkLine("END")) {
        this.takeRoomEnding(room);
      }

      if (this.checkLine("PAL ")) room.palette = this.takeSplitOnce(" ")[1];
      if (this.checkLine("AVA ")) room.avatar = this.takeSplitOnce(" ")[1];
      if (this.checkLine("TUNE ")) room.tune = this.takeSplitOnce(" ")[1];
      this.world.rooms[room.id] = room;
    }

    takeRoomTiles(room) {
      for (let i = 0; i < 16; ++i) {
        const row = this.takeSplit(",");
        room.tiles.push(row);
      }
    }

    takeRoomLegacyWalls(room) {
      const walls = this.takeSplitOnce(" ")[1];
      room.legacyWalls.push(...walls.split(","));
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
      const [from, toRoom, toPos, ...rest] = exit.split(" ");
      const [, transition, dialog] = rest.join(' ').match(/(?:FX\s(.*))?\s?(?:DLG\s(.*))?/) || [];
      room.exits.push({
        from: parsePosition(from),
        to: Object.assign({
          room: toRoom
        }, parsePosition(toPos)),
        transition,
        dialog
      });
    }

    takeRoomEnding(room) {
      const ending = this.takeSplitOnce(" ")[1];
      const [id, pos] = ending.split(" ");
      room.endings.push(Object.assign({
        id
      }, parsePosition(pos)));
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

      this.tryTakeResourceName(dialogue);
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
      const tile = new BitsyTile(this.world);
      this.takeResourceID(tile);
      this.takeObjectGraphic(tile);
      this.tryTakeResourceName(tile);
      this.tryTakeTileWall(tile);
      this.tryTakeObjectPalette(tile);
      this.tryTakePaletteBackground(tile);
      this.world.tiles[tile.id] = tile;
    }

    takeSprite() {
      const sprite = new BitsySprite(this.world);
      this.takeResourceID(sprite);
      this.takeObjectGraphic(sprite);
      this.tryTakeResourceName(sprite);
      this.tryTakeObjectDialogueID(sprite);
      this.tryTakeSpritePosition(sprite);
      this.tryTakeObjectPalette(sprite);
      this.tryTakePaletteBackground(sprite);
      this.tryTakeBlip(sprite);
      this.world.sprites[sprite.id] = sprite;
    }

    takeItem() {
      const item = new BitsyItem(this.world);
      this.takeResourceID(item);
      this.takeObjectGraphic(item);
      this.tryTakeResourceName(item);
      this.tryTakeObjectDialogueID(item);
      this.tryTakeObjectPalette(item);
      this.tryTakePaletteBackground(item);
      this.tryTakeBlip(item);
      this.world.items[item.id] = item;
    }

    takeEnding() {
      const ending = new BitsyEnding(this.world);
      this.takeResourceID(ending);
      this.takeDialogueScript(ending);
      this.world.endings[ending.id] = ending;
    }

    takeDialogue() {
      const dialogue = new BitsyDialogue(this.world);
      this.takeResourceID(dialogue);
      this.takeDialogueScript(dialogue);
      this.world.dialogue[dialogue.id] = dialogue;
    }

    takeVariable() {
      const variable = new BitsyVariable(this.world);
      this.takeResourceID(variable);
      variable.value = this.takeLine();
      this.world.variables[variable.id] = variable;
    }

    takeTune() {
      const tune = new BitsyTune(this.world);
      this.takeResourceID(tune);
      const lines = [];

      while (!this.checkBlank()) {
        lines.push(this.takeLine());
      }

      tune.value = lines.join('\n');
      this.world.tunes[tune.id] = tune;
    }

    takeBlip() {
      const blip = new BitsyBlip(this.world);
      this.takeResourceID(blip);
      const lines = [];

      while (!this.checkBlank()) {
        lines.push(this.takeLine());
      }

      blip.value = lines.join('\n');
      this.world.blips[blip.id] = blip;
    }

  }

  exports.BitsyParser = BitsyParser;
});
var parser = unwrapExports(dist);
dist.BitsyParser;
dist.BitsyBlip;
dist.BitsyTune;
dist.BitsyVariable;
dist.BitsyEnding;
dist.BitsyDialogue;
dist.BitsyRoom;
dist.BitsyPalette;
dist.BitsyItem;
dist.BitsySprite;
dist.BitsyTile;
dist.BitsyObjectBase;
dist.BitsyResourceBase;
dist.BitsyWorld;

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
    blips: {},
    items: {},
    sprites: {},
    tiles: {},
    palettes: {},
    tunes: {},
    rooms: {}
  };
  var skip = {
    variables: {},
    endings: {},
    dialogue: {},
    blips: {},
    items: {},
    sprites: {},
    tiles: {},
    palettes: {},
    tunes: {},
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
  }], // blips are referenced by sprites/items
  ['blips', function (oldId, newId) {
    return Object.values(b.sprites).concat(Object.values(b.items)).filter(function (_ref4) {
      var blip = _ref4.blip;
      return blip === oldId;
    }).forEach(function (obj) {
      obj.blip = newId;
    });
  }], // items are referenced by rooms' item list
  ['items', function (oldId, newId) {
    return Object.values(b.rooms).forEach(function (_ref5) {
      var items = _ref5.items;
      items.filter(function (_ref6) {
        var id = _ref6.id;
        return id === oldId;
      }).forEach(function (obj) {
        obj.id = newId;
      });
    });
  }], // sprites are referenced by rooms' avatar
  ['sprites', function (oldId, newId) {
    return Object.values(b.rooms).filter(function (_ref7) {
      var avatar = _ref7.avatar;
      return avatar === oldId;
    }).forEach(function (room) {
      room.avatar = newId;
    });
  }], // tiles are referenced by rooms' tilemap
  ['tiles', function (oldId, newId) {
    return Object.values(b.rooms).map(function (_ref8) {
      var tiles = _ref8.tiles;
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
    return Object.values(b.rooms).filter(function (_ref9) {
      var palette = _ref9.palette;
      return palette === oldId;
    }).forEach(function (room) {
      room.palette = newId;
    });
  }], // tunes are referenced by rooms
  ['tunes', function (oldId, newId) {
    return Object.values(b.rooms).filter(function (_ref10) {
      var tune = _ref10.tune;
      return tune === oldId;
    }).forEach(function (room) {
      room.tune = newId;
    });
  }], // rooms are referenced by rooms' exits and by sprites' positions
  ['rooms', function (oldId, newId) {
    Object.values(b.rooms).forEach(function (_ref11) {
      var exits = _ref11.exits;
      exits.filter(function (_ref12) {
        var room = _ref12.to.room;
        return room === oldId;
      }).forEach(function (exit) {
        exit.to.room = newId;
      });
    });
    Object.values(b.sprites).map(function (_ref13) {
      var position = _ref13.position;
      return position;
    }).filter(function (p) {
      return p;
    }).filter(function (_ref14) {
      var room = _ref14.room;
      return room === oldId;
    }).forEach(function (position) {
      position.room = newId;
    });
  }]].forEach(function (_ref15) {
    var _ref16 = _slicedToArray(_ref15, 2),
        map = _ref16[0],
        updateReferences = _ref16[1];

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

  ['variables', 'endings', 'dialogue', 'blips', 'items', 'sprites', 'tiles', 'palettes', 'tunes', 'rooms'].forEach(function (map) {
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

exports.merge = merge;
