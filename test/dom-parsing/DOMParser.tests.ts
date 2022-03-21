import * as slimdom from '../../src/index';

describe('DOMParser', () => {
	it('can parse an XML document', () => {
		const parser = new slimdom.DOMParser();
		const source = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html>
				<head>
					<title>Test document</title>
				</head>
				<body lang="en">
					<h1>Hello &lt;world&gt;!</h1>
					<!-- Comments are awesome! -->
					<?pi can be useful as well?>
					<![CDATA[<not>an<element/>!]]>
				</body>
			</html>`;
		const doc = parser.parseFromString(source, 'text/xml');
		expect(slimdom.serializeToWellFormedString(doc)).toBe(source);
	});

	it('can parse an XML document with namespaces', () => {
		const parser = new slimdom.DOMParser();
		const source = `<root xmlns="ns1" xmlns:pre="ns2"><pre:bla attr="value" pre:attr="another" xmlns="ns3"><blup/></pre:bla><bla/></root>`;
		const doc = parser.parseFromString(source, 'text/xml');
		expect(doc.documentElement?.namespaceURI).toBe('ns1');
		expect(
			doc.documentElement?.firstElementChild?.getAttributeNode('pre:attr')?.namespaceURI
		).toBe('ns2');
		expect(doc.documentElement?.firstElementChild?.firstElementChild?.namespaceURI).toBe('ns3');
		expect(slimdom.serializeToWellFormedString(doc)).toBe(source);
	});

	it('returns an error document if parsing fails', () => {
		const parser = new slimdom.DOMParser();
		const doc = parser.parseFromString('NOT A VALID DOCUMENT', 'text/xml');
		expect(slimdom.serializeToWellFormedString(doc)).toMatchInlineSnapshot(
			`"<parsererror xmlns=\\"http://www.mozilla.org/newlayout/xml/parsererror.xml\\">Error: Error parsing document at offset 0: expected one of \\"&lt;\\", \\"&lt;\\" but found \\"N\\"</parsererror>"`
		);
	});

	it('returns an error document if the document is not well-formed', () => {
		const parser = new slimdom.DOMParser();
		const doc = parser.parseFromString('<root></toot>', 'text/xml');
		expect(slimdom.serializeToWellFormedString(doc)).toMatchInlineSnapshot(
			`"<parsererror xmlns=\\"http://www.mozilla.org/newlayout/xml/parsererror.xml\\">Error: non-well-formed element: found end tag toot but expected root</parsererror>"`
		);
	});

	it("doesn't support HTML parsing", () => {
		const parser = new slimdom.DOMParser();
		expect(() => parser.parseFromString('<p>hello!</p>', 'text/html')).toThrow(
			'not implemented'
		);
	});

	it('throws when asked for an unsupported mime type', () => {
		const parser = new slimdom.DOMParser();
		expect(() => parser.parseFromString('<p>hello!</p>', 'image/png')).toThrow(
			'not a valid value'
		);
	});
});
