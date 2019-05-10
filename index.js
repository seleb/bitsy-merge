import parser from '@bitsy/parser';

export default function merge(baseGamedata, addGamedata, prefix) {
	const a = parser.BitsyParser.parse(baseGamedata.replace(/\r\n/g, '\n').split('\n'));
	const b = parser.BitsyParser.parse(addGamedata.replace(/\r\n/g, '\n').split('\n'));

	const add = {
		variables: {},
		endings: {},
		dialogue: {},
		items: {},
		sprites: {},
		tiles: {},
		palettes: {},
		rooms: {},
	};
	const skip = {
		variables: {},
		endings: {},
		dialogue: {},
		items: {},
		sprites: {},
		tiles: {},
		palettes: {},
		rooms: {},
	};

	// check for overlaps
	// [map name, fn to update references]
	[
		// variable overlaps are a fatal error
		['variables', oldId => {
			throw new Error(`Couldn't merge: both games define a starting value for "${oldId}"; please resolve this conflict externally.`);
		}],
		// endings are referenced by rooms' ending list
		['endings', (oldId, newId) => Object.values(b.rooms).map(({
			endings
		}) => endings).filter(({
			id
		}) => id === oldId).forEach(ending => {
			ending.id = newId;
		})],
		// dialogue is referenced by sprites and items
		['dialogue', (oldId, newId) => Object.values(b.items).concat(Object.values(b.sprites)).filter(({
			dialogueID
		}) => dialogueID === oldId).forEach(obj => {
			obj.dialogueID = newId;
		})],
		// items are referenced by rooms' item list
		['items', (oldId, newId) => Object.values(b.rooms).map(({
			items
		}) => items).filter(({
			id
		}) => id === oldId).forEach(obj => {
			obj.id = newId;
		})],
		// sprites aren't referenced
		['sprites', () => {}],
		// tiles are referenced by rooms' tilemap
		['tiles', (oldId, newId) => Object.values(b.rooms).map(({
			tiles
		}) => tiles).forEach(tiles => {
			tiles.forEach(row => {
				row.forEach((tile, idx) => {
					if (tile === oldId) {
						row[idx] = newId;
					}
				});
			});
		})],
		// palettes are referenced by rooms
		['palettes', (oldId, newId) => Object.values(b.rooms).filter(({
			palette
		}) => palette === oldId).forEach(room => {
			room.palette = newId;
		})],
		// rooms are referenced by rooms' exits
		['rooms', (oldId, newId) => Object.values(b.rooms).map(({
			exits
		}) => exits).filter(({
			to
		}) => to === oldId).forEach(exit => {
			exit.to = newId;
		})],
	].forEach(([map, updateReferences]) => {
		for (let id in b[map]) {
			const vb = b[map][id];
			const va = a[map][id]
			if (!va) {
				add[map][id] = vb;
			} else if (va.toString() === vb.toString()) {
				skip[map][id] = vb;
			} else {
				const newId = `${prefix}${id}`;
				vb.id = newId;
				add[map][newId] = vb;
				updateReferences(id, newId);
			}
		}
	});

	// do the merge
	[
		'variables',
		'endings',
		'dialogue',
		'items',
		'sprites',
		'tiles',
		'palettes',
		'rooms',
	].forEach(map => {
		for (let id in add[map]) {
			a[map][id] = add[map][id];
		}
	});

	return {
		gamedata: a.toString(),
		added: add,
		skipped: skip,
		toString: function() {
			return this.gamedata;
		},
	};
}
