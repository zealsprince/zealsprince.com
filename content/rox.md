---
title: rox - A Modern Desktop Music Player in Rust
navigation: rox
heading: rox
description: A desktop music player for large, carefully tagged local libraries. Rust on gpui, gapless playback, panels you compose yourself. The end of a ten year road that started as a foobar2000 theme.
date: 2026-07-26
scene: SceneCubes
order: 10
category: Projects
draft: true
links:
  - name: Website
    icon: globe
    url: https://rox.music
  - name: GitHub
    icon: github
    url: https://github.com/zealsprince/rox
---

# If Foobar2000 was made in the current year

rox is a desktop music player for people with large, carefully tagged local libraries. The UI is panels you compose yourself, duplicate with independent configs, and pop out into real OS windows. Themes are token sets you can share as a single file. Tagging is deep enough to trust with a real collection, and it stays fast at tens of thousands of tracks.

Built in Rust on [gpui](https://www.gpui.rs/), the same UI framework behind Zed. Linux, macOS and Windows are all first-class, and it launches in about a third of a second. If it doesn't start in under a second, it isn't rox.

## Ten years of the same argument

This is not the first time I have tried to build this player. It is the third.

It started as **CaTRoX**, a foobar2000 configuration I did not write but lived in. Then it became **NekoRoX**, my fork of it, maintained for years under my older handle Catlinman. NekoRoX was a full configuration rather than a skin: custom panels, bundled plugins, a dark interface, cover flow, synced lyrics, Discord rich presence, Last.fm. It worked the moment you installed it, which was the entire point. It is still the most-starred thing I have put on GitHub, and it picked up a fork of its own in AlphaRoX, a light counterpart to the dark original.

foobar2000 is remarkable software and its component system goes further than anyone expects. But a theme is a guest. Layout is bounded by what the host exposes, performance is bounded by decisions made a decade before you arrived, and none of it leaves Windows. There came a point where every remaining thing I wanted to fix lived below the layer I was allowed to touch.

So rox is the same set of opinions with the constraint removed. The name is not a coincidence. CaTRoX, then NekoRoX, then rox.

## What's in it

| Area | What's there |
| --- | --- |
| Library | Parallel scanner reading full tags and true durations, live folder watching that survives renames, folder tree, filters and search |
| Playback | Gapless single-stream engine, queue with shuffle and repeat, recovery when an audio device disappears, media keys on all three platforms |
| Panels | Two dozen panel types composed freely, duplicated with independent configs, popped out into OS windows |
| Theming | Workspaces as single shareable files, palette tinting from the playing album's cover, light and dark following cover brightness |
| Tagging | Full editor with atomic writes and batch edits, ratings stored in the files themselves, lookup through MusicBrainz, iTunes and Deezer |
| Lyrics | Synced and plain lyrics from sidecar files, tags or lrclib, with an editor that writes back where it read from |
| History | A full listen log driving the history panel and stats window, plus Last.fm scrobbling |
| Playlists | Favourites, drag reorder across playlists, m3u import and export, entries that survive their files leaving and returning |

## Where it is

Shipping steadily. Free and open source under AGPL-3.0, one binary, portable mode if you want it.

The [website](https://rox.music) has screenshots, benchmarks and downloads for all three platforms.
