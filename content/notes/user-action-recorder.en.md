---
title: "A small recorder for repetitive mouse and keyboard work"
date: "2026-10-21"
summary: "CopyUserAction records mouse and keyboard actions, then replays them with the original timing — no script required."
tags: ["C#", "Avalonia", "Desktop"]
downloads:
  - label: "CopyUserAction for Windows (x64)"
    href: "/downloads/copyuseraction.exe"
    meta: "EXE · 19.7 MB"
---

**CopyUserAction** is a small Windows desktop app — the window is titled *User
Action Recorder*. Press **Record**, work normally, press **Stop**, then press
**Replay** and the app repeats the same mouse and keyboard sequence at roughly
the same pace.

It captures:

- mouse movement
- left, right and middle clicks (press and release)
- scroll wheel
- key presses and releases
- the delay between actions

Everything stays in memory. The app is for situations where writing a script is
more work than doing the task once by hand: filling the same form, stepping
through a test flow, rebuilding a demo, or repeating a short sequence in a game.

## The window

| Control | What it does |
| --- | --- |
| Record / Stop | Starts and stops capturing. |
| Replay / Stop Replay | Plays the captured sequence once or repeatedly. |
| Repeat iterations | Number of passes when Infinite is off. Minimum 1, default 1. |
| Infinite Replay | Repeats until you press the stop hotkey. |
| Stop Hotkey | A single key that cancels replay. Default `P`; `F1`, `Esc`, `Enter`, `Ctrl`, `Alt`, `Shift` also work. |
| Always on Top | Keeps the window above other apps. |
| Timer | Shows recording or replay time. |
| Total Replays | Counts completed passes in this session. |

## How to use it

1. Download and run `CopyUserAction.exe`. It is self-contained, so .NET does not
   need to be installed.
2. Click **Record**. The timer starts and the button becomes **Stop**.
3. Do the task once. Keep the pauses you want to keep — they are part of the
   recording.
4. Return to the window and click **Stop**.
5. Set **Repeat iterations**, or tick **Infinite Replay**.
6. Set a **Stop Hotkey** that the recorded sequence does not use.
7. Click **Replay** and let it run. Press the stop hotkey at any time to cancel.
8. Tick **Always on Top** if the window would otherwise be covered during
   replay.

## Things to know

- The recording is **not saved**. Closing the app clears it; there is no project
  file, export or import yet.
- Replay uses absolute screen coordinates. Changing the display resolution,
  scaling, monitor layout or window position can make the clicks land in the
  wrong place.
- There is no editor. To change one step, record the sequence again.
- The stop hotkey is a **single key**, not a combination, and it is global while
  replay runs. Do not choose a key the recorded sequence needs.
- Some elevated windows ignore synthetic input unless CopyUserAction is also
  running as administrator.
- The executable is unsigned, so Windows SmartScreen or an antivirus may ask for
  confirmation. Only run a copy you trust.
- It sends real mouse and keyboard input. Do not replay a recording you did not
  make.

## Under the hood

The app is written in C# on .NET 10 with an Avalonia UI. Global input capture and
simulation use [SharpHook](https://github.com/TolikPylypchuk/SharpHook), which
wraps libuiohook. It is published as a single-file, self-contained Windows x64
build, which is why the download is about 19.7 MB.

The executable is in the downloads section below. Try it on a short, harmless
sequence first.
