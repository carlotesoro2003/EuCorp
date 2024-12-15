

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CAABuPDV.js","_app/immutable/chunks/disclose-version.DTAQul2H.js","_app/immutable/chunks/runtime.B4QXH2CN.js","_app/immutable/chunks/snippet.BozOjFMd.js"];
export const stylesheets = [];
export const fonts = [];
