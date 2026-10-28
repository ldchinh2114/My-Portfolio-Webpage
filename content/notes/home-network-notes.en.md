---
title: "Two router faults that made pages hang"
date: "2026-10-28"
summary: "A PPPoE MSS mismatch and a half-configured IPv6 WAN — each enough to break browsing alone, and together they hid each other."
tags: ["Networking", "IPv6", "DNS", "MTU"]
---

Pages hung for several seconds before loading, or never finished at all. Some
sites worked and others did not. Speed tests reported normal numbers whenever
they ran, which made the fault look random. It was worse in the evening.

Two independent configuration faults were behind it. Each is enough on its own to
break browsing, and together they masked each other.

## Before changing anything

- Do not clamp MSS on an IPoE/DHCP WAN with an MTU of 1500. Clamping to 1432
  there costs throughput for nothing. Clamp only on PPPoE (1492), or when a
  measurement proves the path MTU is lower.
- Do not enable IPv6 if the ISP does not delegate a prefix. A router advertising
  a prefix it cannot route is worse than IPv6 being off: clients prefer IPv6,
  stall, then fall back.
- Do not enable QoS on a line with flat bufferbloat. A policer on a connection
  that already holds latency under load only adds failure modes.
- Do not trust ICMP loss when diagnosing a home router. The router rate-limits
  traffic addressed to itself, so those loss figures mean nothing.

## Fault one: MTU and MSS

PPPoE costs 8 bytes of overhead, so the real path MTU is 1492. Client machines
still assume 1500 and send full-size packets. With the router's MSS setting on
Auto and no clamping, oversized packets are dropped, the ICMP "fragmentation
needed" reply is lost, and Path MTU Discovery fails silently.

The symptom is specific: TLS handshakes never complete. Small requests work,
large responses hang.

| Packet size | Result |
| --- | --- |
| 1500 bytes (payload 1472) | "Packet needs to be fragmented but DF set" |
| 1492 bytes (payload 1464) | Replies normally |

The fix is MSS set to Custom, value 1432 — 1492 minus 40 bytes of IPv6 header and
20 bytes of TCP header.

## Fault two: IPv6 half-configured

The LAN side was right: router advertisements on, SLAAC on, stateless DHCPv6,
Other flag on, Managed flag off. That is the standard "addresses by SLAAC, DNS by
DHCPv6" design.

The WAN side was set to SLAAC. SLAAC only listens for router advertisements; it
cannot request a delegated prefix. Prefix Delegation was enabled but silently
ignored.

The result was a ULA prefix advertised with no global prefix and no default
route — IPv6 half-on. Setting the WAN IPv6 mode to DHCPv6 fixed it.

## The DNS rule that mattered

Two rules matter more than which provider you pick.

**Use one provider for both stacks.** If IPv4 points at one operator and IPv6 at
another, A and AAAA answers come from different network viewpoints and CDN
routing breaks. On a single hostname I measured 25 ms from one resolver and
193 ms from another, same domain, same moment.

**Judge CDN routing, not lookup speed.** Every resolver answered in 3 to 9 ms.
That number tells you nothing. What matters is which CDN node the answer points
at.

| Resolver | Apple | Shopee | Verdict |
| --- | --- | --- | --- |
| Google | 85 ms | 27 ms | Best balance |
| ISP resolver | 25 ms | 75 ms | Fast on Apple, weak on Shopee |
| Cloudflare | 191 ms | 27 ms | Good Shopee, poor Apple |
| Quad9 | 192 ms | 76 ms | Weak on both |

Google primary with Cloudflare secondary, in the same order for IPv4 and IPv6.
Choose Cloudflare only if privacy outweighs routing, or the ISP resolver only if
Apple services dominate your traffic.

## Making IPv6 actually work

1. WAN connection, Get IPv6 Address: DHCPv6, not SLAAC.
2. Prefix Delegation: on.
3. LAN, Enable RA: on.
4. LAN, Enable SLAAC: on.
5. DHCPv6 server: stateless, Other flag on, Managed flag off.
6. Save, then reconnect the WAN so the prefix delegation is requested again.

## How to verify

- **MSS:** repeated HTTPS requests must succeed every time. Test with HTTPS, not
  ping — MSS only affects TCP, and ping will keep failing.
- **IPv6:** a global address exists, `::/0` appears in the routing table, the
  gateway neighbour state reads Reachable rather than Incomplete or Probe, and a
  public IPv6 address replies to ping.
- **Health:** latency idle versus under full load should stay within a few
  milliseconds, and the TCP retransmission counter should barely move across a
  large download.

## What I left alone: QoS

The default DSCP class table matches almost nothing real. Normal traffic is
DSCP 0 plus TCP, which matches none of the four default rules. The uplink
bandwidth may be set well below the real line rate. And funnelling all traffic
into a single low-weight queue is the one edit that can backfire: if the firmware
does not redistribute unused queue weight, it caps the connection for no reason.

Leave the page at defaults unless there is a measured problem it solves.

## What is still wrong

Throughput still drops in the evening. A traceroute shows 1 ms to the router,
about 25 ms to the ISP backbone and 37 ms to the far side, with zero packet loss
and zero TCP retransmissions.

That pattern is congestion inside the ISP. Nothing on the local network causes
it, and nothing local will fix it. Keep a log of throughput and latency if it
needs to be reported.
