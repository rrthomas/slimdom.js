import { ChildNode } from './mixins';
import Document from './Document';
import Node from './Node';
import { NodeType } from './util/NodeType';

export default class DocumentType extends Node implements ChildNode {
	// Node

	public get nodeType(): number {
		return NodeType.DOCUMENT_TYPE_NODE;
	}

	public get nodeName(): string {
		return this.name;
	}

	public get nodeValue(): string | null {
		return null;
	}

	public set nodeValue(newValue: string | null) {
		// Do nothing.
	}

	// DocumentType

	/**
	 * The name of the doctype.
	 */
	public name: string;

	/**
	 * The public ID of the doctype.
	 */
	public publicId: string;

	/**
	 * The system ID of the doctype.
	 */
	public systemId: string;

	/**
	 * (non-standard) Use DOMImplementation#createDocumentType instead.
	 *
	 * @param name     The name of the doctype
	 * @param publicId The public ID of the doctype
	 * @param systemId The system ID of the doctype
	 */
	constructor(document: Document, name: string, publicId: string = '', systemId: string = '') {
		super(document);

		this.name = name;
		this.publicId = publicId;
		this.systemId = systemId;
	}

	/**
	 * (non-standard) Creates a copy of the context object, not including its children.
	 *
	 * @param document The node document to associate with the copy
	 *
	 * @return A shallow copy of the context object
	 */
	public _copy(document: Document): DocumentType {
		// Set copy’s name, public ID, and system ID, to those of node.
		return new DocumentType(document, this.name, this.publicId, this.systemId);
	}
}
