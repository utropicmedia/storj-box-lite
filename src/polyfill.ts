import { Buffer } from "buffer";
import nextTick from "next-tick";

(window as any).global = window;
global.Buffer = Buffer;
global.process = {
  env: { DEBUG: undefined },
  version: "",
  nextTick,
} as any;
