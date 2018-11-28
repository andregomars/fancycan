declare const bsplit: Bsplit 

export = bsplit 

interface Bsplit {
  (buf: Buffer, splitBuf: Buffer, includeDelim?: boolean): Buffer[]
}
