---
title: "Seven open source creative apps, and which ones are worth reusing"
date: "2026-10-29"
summary: "Seven open source creative apps with their real licences and status: four usable now, two worth caution, one already dead."
tags: ["Open source", "License", "Tools"]
---

An X thread listed seven "open source creative apps". I opened all seven to check the licence and whether the repo is still alive, because those two things decide whether you can reuse the code or only look at it.

## Overview

| Repo | What it does | Licence | Status |
| --- | --- | --- | --- |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | Program animations in TypeScript, with a preview editor | MIT | Slowed down since Feb 2025 |
| [Blockbench](https://github.com/JannisX11/blockbench) | Low-poly 3D modelling, on the web and desktop | GPL-3.0 | Active, v5.2.2 (Oct 2026) |
| [Material Maker](https://github.com/RodZill4/material-maker) | Procedural textures via node graphs, PBR output | MIT | Active, v1.8 (Oct 2026) |
| [MyPaint](https://github.com/mypaint/mypaint) | Painting, brush engine for tablets | GPL | Still used |
| [Redlamp](https://github.com/pdcgomes/redlamp) | Native RAW editor for macOS | MPL-2.0 | Alpha 0.3.4 |
| [Powermove](https://trypowermove.com) | Motion editor with an agent that writes extensions | Unclear | Could not confirm |
| [Haiku Animator](https://github.com/HaikuTeam/animator) | Figma/Sketch → animation code | AGPL | Dead since Oct 2021 |

## What is actually reusable

- **Motion Canvas (MIT)** — the most permissive licence here: embedding it in a commercial product does not force you to publish anything. Its `player` package is a custom element, so dropping an animation into a page is trivial. The trade-off: the repo has barely moved since February 2025, so bugs are yours to fix.
- **Material Maker (MIT)** — the code and the ideas are both usable. The whole node-graph editor is GDScript on Godot; reading it to learn how a graph editor is built is probably more practical than forking the app.
- **Blockbench (GPL-3.0)** — free to use as a tool; the GPL only bites when you publish a modified fork. Plugins against its API may stay closed.
- **Redlamp (MPL-2.0)** — MPL only requires you to publish the files you changed, the rest can stay closed, which makes it easier to reuse than the GPL. It is a Swift/Metal macOS app, so the value is at the engineering level: a hand-written RAW pipeline, colour science, on-device AI masks.
- **MyPaint (GPL)** — a good brush engine, but the GPL spreads to the whole product if you embed it. Use it as a standalone app, or read the algorithms and write your own.

## Do not count on these

- **Haiku Animator** — AGPL, and dead: Haiku shut down in August 2021, the last commit is 13 October 2021, and the README itself says *"in its current state it has deep flaws"*.
- **Powermove** — the site mentions no licence and no repository. There is no evidence it is open source, so it does not belong on a reuse list yet.
