// Note: This is using th WASM implementation of tiktoken which is 60x faster
import cl100k_base from "tiktoken/encoders/cl100k_base.json";
import { Tiktoken } from "tiktoken/lite";
import type { Tokenizer } from "./types.js";
import { Tokenizers } from "./types.js";

class TokenizerSingleton {
  private defaultTokenizer: Tokenizer;

  constructor() {
    const encoding = new Tiktoken(
      cl100k_base.bpe_ranks,
      cl100k_base.special_tokens,
      cl100k_base.pat_str,
    );

    this.defaultTokenizer = {
      encode: (text: string) => {
        return encoding.encode(text);
      },
      decode: (tokens: Uint32Array) => {
        const text = encoding.decode(tokens);
        return new TextDecoder().decode(text);
      },
    };
  }

  tokenizer(encoding?: Tokenizers) {
    if (encoding && encoding !== Tokenizers.CL100K_BASE) {
      throw new Error(`Tokenizer encoding ${encoding} not yet supported`);
    }

    return this.defaultTokenizer;
  }
}

export const tokenizers = new TokenizerSingleton();
export { Tokenizers, type Tokenizer };
