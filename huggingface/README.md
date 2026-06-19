---
license: agpl-3.0
language:
  - en
tags:
  - finance
  - stocks
  - portfolio
  - geopolitics
  - critical-minerals
  - energy-security
  - supply-chain
  - local-llm
  - privacy
  - dashboard
pretty_name: StockMonitor — stocks wired to critical minerals, energy & chokepoints
---

# StockMonitor

> *This repository is **not** a model.* It is the **project home / card** for
> [StockMonitor](https://github.com/sinhaankur/Stockmonitor) — a stock-monitoring
> dashboard that maps the real geopolitical supply-chain wiring behind every stock
> you hold. The runnable code lives on GitHub; nothing here downloads weights.

A stock-focused layer on top of the [World Monitor](https://worldmonitor.app)
global-intelligence dashboard. Beyond "where is this company headquartered?",
StockMonitor models the **critical minerals** and **key energy** a business depends
on, traces them to the countries that mine and refine them, and flags the **maritime
chokepoints** the supply must transit.

## What it does

- **Geo-Dependency Engine** — maps every stock to its critical-mineral and
  key-energy inputs, the producer/processor countries that dominate them, and the
  maritime chokepoints its supply transits, with a 0–100 dependency score. Country
  concentration is derived from a curated mine, refinery, and chokepoint dataset —
  not guesswork.
- **Persistent portfolio** — add/edit/remove holdings or upload CSV; shares, cost
  basis, buy dates, and tunable alert/risk thresholds are saved locally and ride
  settings export/sync.
- **Stock Global Intelligence** — AI synthesis enriched with the modeled mineral,
  energy, and chokepoint supply-chain risks.
- **Live map** — producer countries and at-risk chokepoints light up on the globe
  when you select a stock.

## Example wirings

| Stock | Critical inputs | Chokepoint |
| --- | --- | --- |
| NVDA | Rare earths · copper | Taiwan Strait |
| TSLA | Lithium · cobalt · nickel | — |
| ASML | Tin (EUV) · rare earths | — |
| XOM / ENB | Crude · LNG | Strait of Hormuz |
| BA | Aluminum · nickel superalloys | — |

## Links

- **Live app:** <https://sinhaankur.github.io/Stockmonitor/>
- **Overview page:** <https://sinhaankur.github.io/Stockmonitor/marketing/>
- **Source:** <https://github.com/sinhaankur/Stockmonitor>

## License

AGPL-3.0, inherited from [World Monitor](https://github.com/koala73/worldmonitor),
the upstream project this builds on.
