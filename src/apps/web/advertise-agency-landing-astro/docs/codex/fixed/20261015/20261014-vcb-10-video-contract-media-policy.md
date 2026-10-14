# VCB-10 — VideoBlock contract and media policy

Date: 2026-10-15. Status: fixed. Completed: 2026-10-15.

Added the video ContentBlock contract and Zod schema. The contract includes
src, optional poster, alt, intrinsic width/height, caption, transcript,
kind, and inherited provenance/status metadata. Sources are root-relative or
HTTP(S) URLs ending in .mp4, .webm, or .ogg; dimensions must be positive
integers and blank text is rejected. Autoplay is not part of the contract or
renderer.

Verification: Astro diagnostics contain no errors for the changed files and
the style checker passes. The repository's existing check cannot finish
because three pre-existing acceptance fixture files are absent.
