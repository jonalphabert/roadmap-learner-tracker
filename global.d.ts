// Ambient module declarations for non-TypeScript imports.
//
// These are CSS-only / asset imports that have no type declarations of their
// own. Next.js resolves them through its bundler at build time, but the
// TypeScript language server needs these stubs so side-effect imports like
//   import "@fontsource-variable/inter";
//   import "./globals.css";
// don't raise TS2882 ("Cannot find module or type declarations...").

declare module "@fontsource-variable/*";
declare module "*.css";
