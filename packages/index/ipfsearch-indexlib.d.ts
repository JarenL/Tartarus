export declare class Indexer {
    invertedindex: Map<string, Token>;
    index: Map<string, Document>;
    constructor();
    /**
     * Saves invinx and inx to cwd, and
     * @param invinxFilename relative to cwd. If blocksize set, will be appended by number.
     * @param indexFilename relative to cwd. If blocksize set, will be appended by number.
     * @param baseURL the start of the URL for invinxFilename and indexFilename.
     * The meta.json file will be placed in indexFilename + ".meta.json"
     * @param blocksize If you don't provide a blocksize, files won't be split up.
     */
    persist(invinxFilename: string, indexFilename: string, author: string, indexname: string, baseURL: string, blocksize?: number): void;
    private addDocumentToInvertedIndex;
    private addTokenToInvertedIndex;
    /**
     * Add a document to the index AND invertedindex.
     * @param document
     */
    addToIndex(document: Document): void;
}
/**
 * Tokenizes a text, filters out stopwords and stems the tokens.
 * shouldn't really be an export function, but for tests, it has to...
 * @param text
 * @param separators? optional by what chars to split the string while tokenizing
 */
export declare function tokenizeAndFilter(name: string): string[];
export declare class Token {
    name: string;
    documents: Array<string>;
    constructor(token: string, documents: string[]);
    /**
     * Add a document to the token. Silently doesn't add a duplicit one.
     * @param documentid
     */
    addDocument(documentid: string): void;
    toString(): never;
}
/**
 * Represents a document in the index.
 * Subclass this if you require specific fields and override getText method to return all text that should get indexed.
 * id will be used for sorting when breaking it up.
 * @param id should be UNIQUE across the whole index.
 */
export declare class Document {
    id: string;
    text: string;
    constructor(id: string, text: string);
    /**
     * Return text for tokenization and adding to the inverted index.
     */
    getText(): string;
}
/**
 * @param index index in array form
 * @return alphabetically sorted index array
 */
export declare function sortInvertedIndex(index: Array<Token>): Array<Token>;
/**
 * @param index index in array form
 * @return alphabetically sorted index array
 */
export declare function sortIndex(index: Array<Document>): Array<Document>;
/**
 * Put all values from a Map into an Array.
 * @param map
 */
export declare function mapToArray(map: Map<string, any>): Array<any>;
/**
 * Save index to files, breaking it up.
 * @param index
 * @param filenamestub
 * @param blocksize How many documents to store in one file
 */
export declare function saveIndexToFiles(index: Array<Document>, filenamestub: string, blocksize: number): string[];
/**
 * Save whole inverted index (sorted array) to a file.
 *
 * Format of the file for inverted index:
 * first line is the file format version number (currently 1)
 * more lines are in the following format:
 * token,documentid,documentid...
 *
 * Tokens are separated by newlines.
 * Tokens are urlencoded.
 *
 * Async.
 * @returns void
 */
export declare function saveInvertedIndexToFile(invindex: Array<Token>, filename: string): void;
/**
 * Load inverted index from file
 * @param filename
 * @param callback
 */
export declare function loadIndexFromFile(filename: string, callback: IndexCallback): void;
export interface IndexCallback {
    (index: Array<Token>): void;
}
