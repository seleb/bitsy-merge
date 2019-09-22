import merge from "../..";
import base from './base';
import add from './add';

test('exit difference', () => {
	const merged = merge(base, add, 'test_');
	expect(merged.toString()).toMatchSnapshot();
});
