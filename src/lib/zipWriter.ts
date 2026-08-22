/* ------------------------------------------------------------------
 * Minimal, dependency-free ZIP writer.
 * Uses DEFLATE via the browser's CompressionStream when available and
 * falls back to STORE otherwise. Small enough to bundle inline, so the
 * download path never depends on a separately loaded chunk.
 * ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const encoder = new TextEncoder();

async function deflateRaw(data: Uint8Array): Promise<Uint8Array | null> {
  const Ctor = (
    globalThis as unknown as {
      CompressionStream?: new (
        format: string
      ) => ReadableWritablePair<Uint8Array, Uint8Array>;
    }
  ).CompressionStream;
  if (typeof Ctor !== "function") return null;
  try {
    const slice = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;
    const compressed = new Blob([slice]).stream().pipeThrough(
      new Ctor("deflate-raw") as unknown as ReadableWritablePair<
        Uint8Array,
        Uint8Array
      >
    );
    const buf = await new Response(
      compressed as unknown as ReadableStream<Uint8Array>
    ).arrayBuffer();
    const out = new Uint8Array(buf);
    return out.length > 0 && out.length < data.length ? out : null;
  } catch {
    return null;
  }
}

interface Entry {
  nameBytes: Uint8Array;
  method: number;
  crc: number;
  compressedSize: number;
  uncompressedSize: number;
  localOffset: number;
}

export class ZipWriter {
  private parts: Uint8Array[] = [];
  private entries: Entry[] = [];
  private offset = 0;
  private dosTime: number;
  private dosDate: number;

  constructor() {
    const d = new Date();
    this.dosTime =
      (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
    this.dosDate =
      ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  }

  private push(bytes: Uint8Array) {
    this.parts.push(bytes);
    this.offset += bytes.length;
  }

  async addFile(name: string, data: Uint8Array): Promise<void> {
    const nameBytes = encoder.encode(name);
    const crc = crc32(data);
    const deflated = await deflateRaw(data);
    const method = deflated ? 8 : 0;
    const payload = deflated ?? data;

    const header = new DataView(new ArrayBuffer(30));
    header.setUint32(0, 0x04034b50, true); // local file header signature
    header.setUint16(4, 20, true); // version needed
    header.setUint16(6, 0x0800, true); // UTF-8 names
    header.setUint16(8, method, true);
    header.setUint16(10, this.dosTime, true);
    header.setUint16(12, this.dosDate, true);
    header.setUint32(14, crc, true);
    header.setUint32(18, payload.length, true);
    header.setUint32(22, data.length, true);
    header.setUint16(26, nameBytes.length, true);
    header.setUint16(28, 0, true);

    this.entries.push({
      nameBytes,
      method,
      crc,
      compressedSize: payload.length,
      uncompressedSize: data.length,
      localOffset: this.offset,
    });

    this.push(new Uint8Array(header.buffer));
    this.push(nameBytes);
    this.push(payload);
  }

  build(): Blob {
    const cdStart = this.offset;

    for (const e of this.entries) {
      const cd = new DataView(new ArrayBuffer(46));
      cd.setUint32(0, 0x02014b50, true); // central directory signature
      cd.setUint16(4, 20, true); // version made by
      cd.setUint16(6, 20, true); // version needed
      cd.setUint16(8, 0x0800, true);
      cd.setUint16(10, e.method, true);
      cd.setUint16(12, this.dosTime, true);
      cd.setUint16(14, this.dosDate, true);
      cd.setUint32(16, e.crc, true);
      cd.setUint32(20, e.compressedSize, true);
      cd.setUint32(24, e.uncompressedSize, true);
      cd.setUint16(28, e.nameBytes.length, true);
      cd.setUint32(42, e.localOffset, true);
      this.push(new Uint8Array(cd.buffer));
      this.push(e.nameBytes);
    }
    const cdSize = this.offset - cdStart;

    const eocd = new DataView(new ArrayBuffer(22));
    eocd.setUint32(0, 0x06054b50, true); // end of central directory
    eocd.setUint16(8, this.entries.length, true);
    eocd.setUint16(10, this.entries.length, true);
    eocd.setUint32(12, cdSize, true);
    eocd.setUint32(16, cdStart, true);
    this.push(new Uint8Array(eocd.buffer));

    const buffers = this.parts.map(
      (p) =>
        p.buffer.slice(p.byteOffset, p.byteOffset + p.byteLength) as ArrayBuffer
    );
    return new Blob(buffers, { type: "application/zip" });
  }
}
