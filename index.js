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

