import parser from '@bitsy/parser';

export default function merge(baseGamedata, addGamedata, prefix) {
	const a = parser.BitsyParser.parse(baseGamedata.replace(/\r\n/g, '\n').split('\n'));
	const b = parser.BitsyParser.parse(addGamedata.replace(/\r\n/g, '\n').split('\n'));

	const add = {
		variables: {},
		endings: {},
		exits: {},
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
		exits: {},
		dialogue: {},
		items: {},
		sprites: {},
		tiles: {},
		palettes: {},
		rooms: {},
	};

	[
		['endings', (oldId, newId) => Object.values(b.rooms).map(({
			endings
		}) => endings).filter(({
			id
		}) => id === oldId).forEach(ending => {
			ending.id = newId;
		})],
		['dialogue', (oldId, newId) => Object.values(b.items).concat(Object.values(b.sprites)).filter(({
			dialogueID
		}) => dialogueID === oldId).forEach(obj => {
			obj.dialogueID = newId;
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
		'exits',
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


	return a.toString();
}

