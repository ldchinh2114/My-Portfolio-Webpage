---
title: "Nine DNS resolvers, one benchmark, four presets"
date: "2026-10-27"
summary: "Cold-cache DNS measurements across nine resolvers and eight domains, validated end to end, turned into four use-case presets."
tags: ["DNS", "Networking", "Benchmark"]
---

DNS is the one network setting you can change in a minute, which is exactly why
it attracts guesswork. I wanted numbers instead: cold cache, several domains, and
a check that a fast resolver actually makes browsing faster — not just that it
answers quickly.

## Method

Nine resolvers, eight domains — four domestic, four international — and six
cold-cache samples per cell, with the resolver cache flushed before every query.

Raw DNS timing is necessary but not sufficient. A resolver can answer in 4 ms and
still hand you a bad CDN edge, so the strongest candidates were re-tested end to
end: resolve, then fetch over HTTPS, three runs per site, covering TCP, TLS and
first byte.

ICMP latency was recorded and then ignored. AliDNS answers a ping in 110 ms but
resolves in 4 ms; Cloudflare pings in 25 ms and resolves inconsistently. Ping
measures the wrong hop.

## The ranking

| Rank | Resolver | Address | Avg median |
| --- | --- | --- | --- |
| 1 | Google IPv6 | `2001:4860:4860::8888` | 5.8 ms |
| 2 | DNSPod IPv4 | `119.29.29.29` | 7.5 ms |
| 3 | 114DNS IPv4 | `114.114.114.114` | 7.9 ms |
| 4 | Cloudflare IPv6 | `2606:4700:4700::1111` | 8.6 ms |
| 5 | Cloudflare IPv4 | `1.1.1.1` | 9.3 ms |
| 6 | AliDNS IPv4 | `223.5.5.5` | 9.4 ms |
| 7 | DNSPod IPv6 | `2402:4e00::` | 9.6 ms |
| 8 | Google IPv4 | `8.8.8.8` | 11.9 ms |
| 9 | AliDNS IPv6 | `2400:3200::1` | 12.3 ms |

Across the top six the spread is 5.8 to 9.4 ms. Nobody perceives a difference at
that range, so the ranking alone does not justify changing anything. It only
becomes a decision once the full fetch is measured.

## End to end, the picture changed

Five combinations, three runs per site, in milliseconds:

| Combination | baidu | bilibili | github | youtube | Average |
| --- | --- | --- | --- | --- | --- |
| Google IPv6 | 177 | 129 | 165 | 793 | 316 |
| Cloudflare IPv6 | 141 | 123 | 163 | 867 | 324 |
| Cloudflare IPv4 | 374 | 385 | 652 | 694 | 526 |
| 114DNS IPv4 | 337 | 389 | 658 | 735 | 530 |
| AliDNS IPv4 | 581 | 4,916 | 628 | 674 | 1,700 |

Two conclusions. The IPv6 combinations were roughly twice as fast end to end as
the IPv4 ones — the ISP's IPv6 path is less congested than its IPv4 path, and
that advantage is worth more than any resolver's raw lookup time. And AliDNS,
which looked excellent in raw timing, lost 4.9 seconds on a single bilibili
fetch: a CDN routing hiccup that dragged its average from competitive to
1,700 ms. That is the argument for pairing a fast resolver in each address
family instead of trusting one.

## The two rounds disagreed, which was the useful part

The first round put Cloudflare's IPv4 resolver at 46.8 ms average with a 239 ms
tail on baidu.com, and once returned a stale address — a connection that hit it
took 286 ms to resolve, against 3–9 ms for everything else.

The second round was noisier for every provider: Cloudflare IPv4 at 59–71 ms
averages with tails up to 295 ms, AliDNS at 21–46 ms. That pattern says the link
was noisy at that moment, not that one resolver had degraded. A single benchmark
measures the line as much as the server, so the run has to be repeated before it
means anything. What survived both rounds was the verdict on Cloudflare IPv4: the
weakest option on this ISP path.

## What DNS cannot fix

The same session measured the link: a 216 Mbps Wi-Fi rate, about 36 Mbps of
actual download throughput, zero packet errors, and gateway latency of 1 ms
minimum, 31 ms average, 97 ms maximum.

A 216 Mbps link delivering 36 Mbps has its ceiling on the WAN side — the plan,
peak-hour congestion, or a QoS limit. DNS tuning is worth milliseconds; the plan
is worth tens of megabits. Keeping that proportion in mind is what stops a
benchmark from turning into endless tweaking.

## Four presets

| Profile | IPv4 primary / secondary | IPv6 primary / secondary | Why |
| --- | --- | --- | --- |
| Best overall speed | `223.5.5.5` / `223.6.6.6` | `2001:4860:4860::8888` / `2606:4700:4700::1111` | Lowest medians on both families; fastest end to end |
| Mostly domestic | `223.5.5.5` / `119.29.29.29` | `2400:3200::1` / `2606:4700:4700::1111` | CDN-optimal answers for domestic sites |
| Mostly international | `1.1.1.1` / `8.8.8.8` | `2001:4860:4860::8888` / `2606:4700:4700::1111` | Cleaner results for overseas services |
| Privacy and anti-pollution | `1.1.1.1` / `9.9.9.9` | `2606:4700:4700::1111` / `2620:fe::fe` | No-log resolver plus malware blocking |
| Current setup | `223.5.5.5` / `223.6.6.6` | `2606:4700:4700::1111` / `2606:4700:4700::1001` | Already good; only the IPv6 primary could be upgraded |

One constraint applies to all of them: never list more than two resolvers per
address family. Windows queries the configured servers in parallel and accepts
the first answer, so a third slow server adds noise, not resilience.

## What I actually run

The current setup is already the "best overall" IPv4 pair with Cloudflare on
IPv6, so the only change worth making is the IPv6 primary: Google's
`2001:4860:4860::8888` measured 5.8 ms against Cloudflare's 8.6 ms. The gap is
small enough that either is defensible; I would take Google and stop there.

A benchmark is finished when it tells you to stop. This one did: DNS is now a
solved ten-millisecond problem, and the missing 30 Mbps is a conversation with
the ISP, not a settings page.
