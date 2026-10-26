/* ==========================================================================
   Career Assembly Line
   Data-driven isometric career pipeline
   ========================================================================== */

(function () {
	'use strict';

	var root = document.getElementById('career-assembly');
	if (!root) return;

	var svg = document.getElementById('al-svg');
	var panel = document.getElementById('al-panel');
	var tabsHost = document.getElementById('al-tabs');
	var stage = document.getElementById('al-stage');

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var mobileQuery = window.matchMedia('(max-width: 980px)');

	var STATIONS = [
		{
			id: 'quality',
			index: '01',
			phase: 'Data Quality',
			tag: 'QUALITY ENGINE',
			tabLabel: 'Quality',
			company: 'LexisNexis Risk Solutions',
			shortCompany: 'LEXISNEXIS',
			role: 'Data Quality Analyst',
			accent: '#ff2e63',
			accentRgb: '255, 46, 99',
			status: 'Operational',
			stack: ['SQL', 'Karate', 'Cucumber', 'Gherkin', 'DB Optimization'],
			metrics: [
				{ value: '50%', label: 'less manual QA' },
				{ value: '40%', label: 'faster queries' },
				{ value: '90%', label: 'fewer data errors' }
			],
			achievements: [
				'Automated QA test suites reducing manual testing time by <strong>50%</strong>.',
				'Restructured database architecture, reducing query response times by <strong>40%</strong>.',
				'Built SQL reconciliation frameworks reducing identity &amp; payment data errors by <strong>90%</strong>.'
			],
			icon: 'database'
		},
		{
			id: 'network',
			index: '02',
			phase: 'Network Infrastructure',
			tag: 'NETWORK NODE',
			tabLabel: 'Network',
			company: 'University of Utah',
			shortCompany: 'UNIV. OF UTAH',
			role: 'Network Operation Engineer',
			accent: '#35e6ff',
			accentRgb: '53, 230, 255',
			status: 'Operational',
			stack: ['PowerShell', 'Orion', 'Kali Linux', 'ServiceNow'],
			metrics: [
				{ value: '25%', label: 'fewer outages' },
				{ value: '40%', label: 'fewer intrusions' },
				{ value: '30%', label: 'less downtime' }
			],
			achievements: [
				'Managed network audits and VLAN configurations, reducing outages by <strong>25%</strong>.',
				'Implemented firewall security updates, reducing unauthorized access attempts by <strong>40%</strong>.',
				'Resolved <strong>50+</strong> tickets weekly, lowering downtime by <strong>30%</strong>.'
			],
			icon: 'network'
		},
		{
			id: 'finance',
			index: '03',
			phase: 'Financial Data',
			tag: 'FINANCE PIPELINE',
			tabLabel: 'Finance',
			company: 'Morgan Stanley',
			shortCompany: 'MORGAN STANLEY',
			role: 'Financial Data Engineer',
			accent: '#ff5c9e',
			accentRgb: '255, 92, 158',
			status: 'Operational',
			stack: ['Kafka', 'AWS Glue', 'Redshift', 'Data Contracts', 'CDC', 'PyTest', 'Great Expectations'],
			metrics: [
				{ value: '35%', label: 'faster reporting' },
				{ value: '10+', label: 'data sources' },
				{ value: '30%', label: 'fewer failures' }
			],
			achievements: [
				'Built large-scale ETL pipelines integrating financial data from <strong>10+ sources</strong>, boosting reporting speed by <strong>35%</strong>.',
				'Implemented <strong>data contracts</strong> and <strong>CDC pipelines</strong> for trade data ingestion.',
				'Automated CI/CD data quality checks in <strong>Jenkins / GitLab</strong>, reducing pipeline failures by <strong>30%</strong>.'
			],
			icon: 'pipeline'
		},
		{
			id: 'ai',
			index: '04',
			phase: 'AI & Developer Platform',
			tag: 'AI PLATFORM',
			tabLabel: 'AI Platform',
			company: 'DTE Energy',
			shortCompany: 'DTE ENERGY',
			role: 'Data Engineer II — Developer Platform & PUAR',
			accent: '#d8f8ff',
			accentRgb: '216, 248, 255',
			status: 'Current',
			stack: ['Alteryx', 'Python', 'Rancher Desktop', 'Docker', 'Kubernetes', 'LLMs', 'SOX / NERC'],
			metrics: [
				{ value: 'AI', label: 'LLM code review' },
				{ value: 'K8s', label: 'containerized envs' },
				{ value: 'SOX', label: 'NERC / PUAR' }
			],
			achievements: [
				'Architected <strong>Alteryx ETL pipelines</strong> normalizing complex entitlement datasets across the enterprise.',
				'Contributed to company-wide <strong>AI-powered PR Review</strong> app performing LLM code analysis.',
				'Provisioned containerized developer environments via <strong>Docker</strong> and <strong>Kubernetes</strong>.',
				'Enforced <strong>SOX &amp; NERC</strong> compliance through Periodic User Access Review (PUAR) operations.'
			],
			icon: 'chip'
		}
	];

	var ICONS = {
		database: '<ellipse cx="0" cy="-8" rx="12" ry="4.5"/><path d="M-12 -8v8c0 2.5 5.4 4.5 12 4.5s12-2 12-4.5v-8"/><path d="M-12 0v8c0 2.5 5.4 4.5 12 4.5s12-2 12-4.5V0"/>',
		network: '<circle cx="0" cy="-11" r="3.6"/><circle cx="-12" cy="9" r="3.6"/><circle cx="12" cy="9" r="3.6"/><path d="M-2.2 -7.4 -9.8 5.4M2.2 -7.4 9.8 5.4M-8.4 9h16.8"/>',
		pipeline: '<path d="M-14 -8h7l7 16h14"/><rect x="-17" y="-11" width="6" height="6" rx="1"/><rect x="10" y="5" width="6" height="6" rx="1"/><circle cx="0" cy="0" r="2.6"/>',
		chip: '<rect x="-9" y="-9" width="18" height="18" rx="2.5"/><rect x="-3.5" y="-3.5" width="7" height="7" rx="1"/><path d="M-13 -5h-3M-13 0h-3M-13 5h-3M13 -5h3M13 0h3M13 5h3M-5 -13v-3M0 -13v-3M5 -13v-3M-5 13v3M0 13v3M5 13v3"/>'
	};

	var ISO_X = Math.cos(Math.PI / 6);
	var ISO_Y = Math.sin(Math.PI / 6);
	var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

	var pinnedId = STATIONS[0].id;
	var previewId = null;
	var activeId = pinnedId;
	var panelTimer = 0;
	var lastMobile = mobileQuery.matches;

	function esc(value) {
		return String(value).replace(/[&<>"']/g, function (char) {
			return ESC[char];
		});
	}

	function getStation(id) {
		for (var i = 0; i < STATIONS.length; i++) {
			if (STATIONS[i].id === id) return STATIONS[i];
		}
		return STATIONS[0];
	}

	function stationIndex(id) {
		for (var i = 0; i < STATIONS.length; i++) {
			if (STATIONS[i].id === id) return i;
		}
		return 0;
	}

	function accentStyle(station) {
		return '--accent:' + station.accent + ';--accent-rgb:' + station.accentRgb;
	}

	function iso(cx, cy, x, y, z) {
		z = z || 0;
		return {
			x: cx + (x - y) * ISO_X,
			y: cy + (x + y) * ISO_Y - z
		};
	}

	function point(p) {
		return p.x.toFixed(2) + ',' + p.y.toFixed(2);
	}

	function polygon(points, attrs) {
		return '<polygon points="' + points.map(point).join(' ') + '" ' + (attrs || '') + '/>';
	}

	function box(cx, cy, hx, hy, z0, z1) {
		function top(x, y) { return iso(cx, cy, x, y, z1); }
		function bottom(x, y) { return iso(cx, cy, x, y, z0); }

		var A = top(-hx, -hy);
		var B = top(hx, -hy);
		var C = top(hx, hy);
		var D = top(-hx, hy);
		var A0 = bottom(-hx, -hy);
		var B0 = bottom(hx, -hy);
		var C0 = bottom(hx, hy);
		var D0 = bottom(-hx, hy);

		return {
			top: [A, B, C, D],
			left: [D, C, C0, D0],
			right: [C, B, B0, C0],
			frontEdges: [D0, C0, B0]
		};
	}

	function getLayout() {
		if (mobileQuery.matches) {
			return {
				mobile: true,
				w: 540,
				h: 940,
				points: [172, 382, 592, 802].map(function (y) { return { x: 114, y: y }; }),
				hx: 52,
				hy: 52,
				mh: 54,
				tagW: 300,
				tagH: 70,
				tagSide: 'right',
				fontNum: 11.5,
				fontTitle: 22,
				fontCompany: 15,
				iconScale: 0.98,
				gridU: 36,
				gridN: 24,
				gridCx: 270,
				gridCy: 470,
				linkMode: 'vertical',
				sparkCount: 28
			};
		}

		return {
			mobile: false,
			w: 1280,
			h: 540,
			points: [190, 490, 790, 1090].map(function (x) { return { x: x, y: 333 }; }),
			hx: 58,
			hy: 58,
			mh: 62,
			tagW: 242,
			tagH: 68,
			tagSide: 'above',
			fontNum: 10,
			fontTitle: 17,
			fontCompany: 10.5,
			iconScale: 1.12,
			gridU: 44,
			gridN: 16,
			gridCx: 640,
			gridCy: 352,
			linkMode: 'horizontal',
			sparkCount: 36
		};
	}

	function buildDefs(L) {
		var stationDefs = STATIONS.map(function (station) {
			return '<linearGradient id="al-top-' + station.id + '" x1="0" y1="0" x2="0.85" y2="1">' +
					'<stop offset="0" stop-color="#2a1420"/>' +
					'<stop offset="0.55" stop-color="#160d18"/>' +
					'<stop offset="1" stop-color="#0a070e"/>' +
				'</linearGradient>' +
				'<linearGradient id="al-left-' + station.id + '" x1="0" y1="0" x2="1" y2="1">' +
					'<stop offset="0" stop-color="#0d0910"/>' +
					'<stop offset="1" stop-color="#060509"/>' +
				'</linearGradient>' +
				'<linearGradient id="al-right-' + station.id + '" x1="0" y1="0" x2="1" y2="1">' +
					'<stop offset="0" stop-color="rgba(' + station.accentRgb + ',0.2)"/>' +
					'<stop offset="0.55" stop-color="rgba(' + station.accentRgb + ',0.07)"/>' +
					'<stop offset="1" stop-color="#07050a"/>' +
				'</linearGradient>' +
				'<radialGradient id="al-halo-' + station.id + '" cx="50%" cy="50%" r="50%">' +
					'<stop offset="0" stop-color="rgba(' + station.accentRgb + ',0.38)"/>' +
					'<stop offset="0.5" stop-color="rgba(' + station.accentRgb + ',0.12)"/>' +
					'<stop offset="1" stop-color="rgba(' + station.accentRgb + ',0)"/>' +
				'</radialGradient>' +
				'<radialGradient id="al-packet-' + station.id + '" cx="50%" cy="50%" r="50%">' +
					'<stop offset="0" stop-color="#ffffff"/>' +
					'<stop offset="0.22" stop-color="rgba(' + station.accentRgb + ',0.95)"/>' +
					'<stop offset="0.55" stop-color="rgba(' + station.accentRgb + ',0.4)"/>' +
					'<stop offset="1" stop-color="rgba(' + station.accentRgb + ',0)"/>' +
				'</radialGradient>';
		}).join('');

		var linkDefs = STATIONS.slice(0, -1).map(function (station, index) {
			var next = STATIONS[index + 1];
			var x2 = L.linkMode === 'vertical' ? 0 : 1;
			var y2 = L.linkMode === 'vertical' ? 1 : 0;
			return '<linearGradient id="al-link-grad-' + index + '" x1="0" y1="0" x2="' + x2 + '" y2="' + y2 + '">' +
					'<stop offset="0" stop-color="' + station.accent + '"/>' +
					'<stop offset="1" stop-color="' + next.accent + '"/>' +
				'</linearGradient>';
		}).join('');

		return '<defs>' +
			'<radialGradient id="al-bg-grad" cx="50%" cy="42%" r="75%">' +
				'<stop offset="0" stop-color="#160b13"/>' +
				'<stop offset="0.55" stop-color="#0a0710"/>' +
				'<stop offset="1" stop-color="#050409"/>' +
			'</radialGradient>' +
			'<radialGradient id="al-glow-pink" cx="50%" cy="50%" r="50%">' +
				'<stop offset="0" stop-color="#ff2e63" stop-opacity="0.2"/>' +
				'<stop offset="0.55" stop-color="#ff2e63" stop-opacity="0.05"/>' +
				'<stop offset="1" stop-color="#ff2e63" stop-opacity="0"/>' +
			'</radialGradient>' +
			'<radialGradient id="al-glow-cyan" cx="50%" cy="50%" r="50%">' +
				'<stop offset="0" stop-color="#35e6ff" stop-opacity="0.16"/>' +
				'<stop offset="1" stop-color="#35e6ff" stop-opacity="0"/>' +
			'</radialGradient>' +
			'<radialGradient id="al-floor-fade" cx="50%" cy="50%" r="55%">' +
				'<stop offset="0" stop-color="#ffffff" stop-opacity="1"/>' +
				'<stop offset="0.7" stop-color="#ffffff" stop-opacity="0.55"/>' +
				'<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>' +
			'</radialGradient>' +
			'<mask id="al-floor-mask"><rect width="' + L.w + '" height="' + L.h + '" fill="url(#al-floor-fade)"/></mask>' +
			stationDefs +
			linkDefs +
		'</defs>';
	}

	function buildFloor(L) {
		var cx = L.gridCx;
		var cy = L.gridCy;
		var u = L.gridU;
		var n = L.gridN;
		var lines = '';

		for (var i = -n; i <= n; i++) {
			var a = iso(cx, cy, i * u, -n * u, 0);
			var b = iso(cx, cy, i * u, n * u, 0);
			var c = iso(cx, cy, -n * u, i * u, 0);
			var d = iso(cx, cy, n * u, i * u, 0);
			var cls = i % 4 === 0 ? 'al-grid-line al-grid-line--major' : 'al-grid-line';

			lines += '<line class="' + cls + '" x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/>';
			lines += '<line class="' + cls + '" x1="' + c.x.toFixed(1) + '" y1="' + c.y.toFixed(1) + '" x2="' + d.x.toFixed(1) + '" y2="' + d.y.toFixed(1) + '"/>';
		}

		return '<g class="al-floor" mask="url(#al-floor-mask)">' + lines + '</g>';
	}

	function buildSparks(L) {
		var seed = 17;

		function rand() {
			seed = (seed * 1664525 + 1013904223) % 4294967296;
			return seed / 4294967296;
		}

		var out = '';
		for (var i = 0; i < L.sparkCount; i++) {
			var x = rand() * L.w;
			var y = rand() * L.h * 0.75;
			var r = 0.7 + rand() * 1.5;
			var fill = i % 6 === 0 ? '#35e6ff' : (i % 4 === 0 ? '#ff2e63' : '#ffffff');
			var delay = (rand() * 6).toFixed(2);
			out += '<circle class="al-spark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + fill + '" style="animation-delay:' + delay + 's"/>';
		}

		return '<g class="al-sparks">' + out + '</g>';
	}

	function buildPackets(pathId, station, L, index) {
		if (reduceMotion) return '';

		var count = L.mobile ? 2 : 3;
		var out = '';

		for (var k = 0; k < count; k++) {
			var dur = (3.2 + k * 0.7 + index * 0.15).toFixed(2);
			var begin = (-(k * 1.1 + index * 0.45)).toFixed(2);

			out += '<g class="al-packet">' +
				'<circle r="9" fill="url(#al-packet-' + station.id + ')" opacity="0.85"/>' +
				'<circle r="2.4" fill="#ffffff"/>' +
				'<animateMotion dur="' + dur + 's" begin="' + begin + 's" repeatCount="indefinite" rotate="auto">' +
					'<mpath href="#' + pathId + '" xlink:href="#' + pathId + '"/>' +
				'</animateMotion>' +
			'</g>';
		}

		return out;
	}

	function buildLinks(L) {
		var out = '';

		for (var i = 0; i < L.points.length - 1; i++) {
			var a = L.points[i];
			var b = L.points[i + 1];
			var from = STATIONS[i];
			var to = STATIONS[i + 1];
			var hw = (L.hx + L.hy) * ISO_X;
			var d;
			var x1;
			var y1;
			var x2;
			var y2;

			if (L.linkMode === 'horizontal') {
				x1 = a.x + hw + 3;
				y1 = a.y;
				x2 = b.x - hw - 3;
				y2 = b.y;
				d = 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + 40) + ' ' + (y1 - 14) + ', ' + (x2 - 40) + ' ' + (y2 - 14) + ', ' + x2 + ' ' + y2;
			} else {
				x1 = a.x;
				y1 = a.y + L.hy + 3;
				x2 = b.x;
				y2 = b.y - L.hy - L.mh - 3;
				d = 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + 12) + ' ' + (y1 + 40) + ', ' + (x2 - 12) + ' ' + (y2 - 40) + ', ' + x2 + ' ' + y2;
			}

			var pathId = 'al-link-path-' + i;

			out += '<g class="al-link" data-from="' + from.id + '" data-to="' + to.id + '">' +
				'<path class="al-link-base" d="' + d + '"/>' +
				'<path class="al-link-glow" d="' + d + '" stroke="rgba(' + from.accentRgb + ',0.2)"/>' +
				'<path id="' + pathId + '" class="al-link-core" d="' + d + '" stroke="url(#al-link-grad-' + i + ')"/>' +
				'<path class="al-link-flow" d="' + d + '"/>' +
				buildPackets(pathId, from, L, i) +
			'</g>';
		}

		return out;
	}

	function buildTag(station, L, cx, cy, hw, moduleTopY) {
		var x;
		var y;
		var connector;

		if (L.tagSide === 'above') {
			x = cx;
			y = moduleTopY - 18 - L.tagH / 2;
			connector = 'M ' + cx + ' ' + (y + L.tagH / 2) + ' L ' + cx + ' ' + moduleTopY;
		} else {
			x = cx + hw + 22 + L.tagW / 2;
			y = cy - L.mh / 2;
			connector = 'M ' + (cx + hw) + ' ' + y + ' L ' + (x - L.tagW / 2) + ' ' + y;
		}

		return { x: x, y: y, w: L.tagW, h: L.tagH, connector: connector };
	}

	function buildTraces(L, cx, cy, station) {
		var C = iso(cx, cy, L.hx, L.hy, L.mh);
		var B = iso(cx, cy, L.hx, -L.hy, L.mh);
		var C0 = iso(cx, cy, L.hx, L.hy, 10);
		var B0 = iso(cx, cy, L.hx, -L.hy, 10);

		function lerp(a, b, t) {
			return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
		}

		var lines = '';
		var ts = [0.28, 0.5, 0.72];

		for (var i = 0; i < ts.length; i++) {
			var p1 = lerp(C, B, ts[i]);
			var p2 = lerp(C0, B0, ts[i]);
			lines += '<line x1="' + p1.x.toFixed(1) + '" y1="' + p1.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '"/>';
		}

		var led = lerp(C0, B0, 0.5);

		return '<g class="al-traces">' + lines +
			'<circle cx="' + led.x.toFixed(1) + '" cy="' + led.y.toFixed(1) + '" r="1.5"/>' +
		'</g>';
	}

	function buildStation(station, index, L) {
		var p = L.points[index];
		var cx = p.x;
		var cy = p.y;
		var base = box(cx, cy, L.hx + 6, L.hy + 6, 0, 10);
		var body = box(cx, cy, L.hx, L.hy, 10, L.mh);
		var hw = (L.hx + L.hy) * ISO_X;
		var topCenter = { x: cx, y: cy - L.mh };
		var moduleTopY = cy - L.hy - L.mh;
		var moduleBottomY = cy + L.hy;
		var tag = buildTag(station, L, cx, cy, hw, moduleTopY);
		var inset = box(cx, cy, L.hx - 9, L.hy - 9, L.mh, L.mh);
		var inset2 = box(cx, cy, L.hx - 16, L.hy - 16, L.mh, L.mh);
		var ledY = moduleBottomY - L.mh - 12;
		var icon = ICONS[station.icon] || ICONS.chip;
		var w = tag.w;
		var h = tag.h;
		var tagX = tag.x;
		var tagY = tag.y;
		var titleY = h / 2 - 25;
		var companyY = h / 2 - 8;

		var baseTop = polygon(base.top, 'class="al-base-top" fill="#140c16"');
		var baseLeft = polygon(base.left, 'class="al-base-left" fill="#07050a"');
		var baseRight = polygon(base.right, 'class="al-base-right" fill="#0d0810"');
		var bodyLeft = polygon(body.left, 'class="al-face-left" fill="url(#al-left-' + station.id + ')"');
		var bodyRight = polygon(body.right, 'class="al-face-right" fill="url(#al-right-' + station.id + ')"');
		var bodyTop = polygon(body.top, 'class="al-face-top" fill="url(#al-top-' + station.id + ')"');
		var baseEdge = '<path class="al-edge-accent" d="M ' + point(base.frontEdges[0]) + ' L ' + point(base.frontEdges[1]) + ' L ' + point(base.frontEdges[2]) + '"/>';
		var insets = polygon(inset.top, 'class="al-top-inset"') + polygon(inset2.top, 'class="al-top-inset al-top-inset--soft"');
		var iconSvg = '<g class="al-icon" transform="translate(' + topCenter.x + ' ' + (topCenter.y - 2) + ') scale(' + L.iconScale + ')" fill="none" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + icon + '</g>';
		var leds = '<g class="al-leds">' +
			'<circle class="al-led al-led--1" cx="' + (cx - 12) + '" cy="' + ledY + '" r="2" fill="var(--accent)"/>' +
			'<circle class="al-led al-led--2" cx="' + cx + '" cy="' + (ledY - 5) + '" r="1.7" fill="#35e6ff"/>' +
			'<circle class="al-led al-led--3" cx="' + (cx + 12) + '" cy="' + ledY + '" r="2" fill="#f8f5ff"/>' +
		'</g>';
		var tagSvg = '<g class="al-tag" transform="translate(' + tagX + ' ' + tagY + ')">' +
			'<rect class="al-tag-rect" x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="6"/>' +
			'<rect class="al-tag-bar" x="' + (-w / 2) + '" y="' + (-h / 2 + 10) + '" width="2.5" height="' + (h - 20) + '" rx="1.25" fill="var(--accent)"/>' +
			'<circle class="al-tag-dot" cx="' + (w / 2 - 14) + '" cy="' + (-h / 2 + 16) + '" r="2.6" fill="var(--accent)"/>' +
			'<text class="al-tag-num" x="' + (-w / 2 + 14) + '" y="' + (-h / 2 + 17) + '" font-size="' + L.fontNum + '">STATION ' + station.index + '</text>' +
			'<text class="al-tag-title" x="' + (-w / 2 + 14) + '" y="' + titleY + '" font-size="' + L.fontTitle + '">' + esc(station.tag) + '</text>' +
			'<text class="al-tag-company" x="' + (-w / 2 + 14) + '" y="' + companyY + '" font-size="' + L.fontCompany + '">' + esc(station.shortCompany) + '</text>' +
		'</g>';
		var portX = L.tagSide === 'above' ? cx : cx + hw;
		var portY = L.tagSide === 'above' ? moduleTopY : tag.y;

		return '<g class="al-station" data-id="' + station.id + '" style="' + accentStyle(station) + '">' +
			'<title>' + esc('Station ' + station.index + ': ' + station.company + ' - ' + station.role) + '</title>' +
			'<ellipse class="al-halo" cx="' + cx + '" cy="' + (cy + 8) + '" rx="' + (hw * 1.55).toFixed(1) + '" ry="' + (L.hy * 1.25).toFixed(1) + '" fill="url(#al-halo-' + station.id + ')" opacity="0.45"/>' +
			'<g class="al-lift">' +
				'<ellipse class="al-shadow" cx="' + cx + '" cy="' + (cy + 10) + '" rx="' + (hw * 1.05).toFixed(1) + '" ry="' + (L.hy * 0.7).toFixed(1) + '"/>' +
				baseTop + baseLeft + baseRight +
				baseEdge +
				bodyLeft + bodyRight + bodyTop +
				buildTraces(L, cx, cy, station) +
				insets +
				iconSvg +
				leds +
				'<path class="al-tag-link" d="' + tag.connector + '"/>' +
				'<circle class="al-port" cx="' + portX + '" cy="' + portY + '" r="2.2"/>' +
				tagSvg +
			'</g>' +
		'</g>';
	}

	function updateSceneState(id) {
		svg.dataset.active = id;

		var groups = svg.querySelectorAll('.al-station');
		for (var i = 0; i < groups.length; i++) {
			groups[i].classList.toggle('is-active', groups[i].getAttribute('data-id') === id);
		}

		var links = svg.querySelectorAll('.al-link');
		for (var j = 0; j < links.length; j++) {
			links[j].classList.toggle('is-live', links[j].getAttribute('data-from') === id);
			links[j].classList.toggle('is-incoming', links[j].getAttribute('data-to') === id);
		}
	}

	function buildScene() {
		var L = getLayout();
		svg.setAttribute('viewBox', '0 0 ' + L.w + ' ' + L.h);

		var stationsSvg = STATIONS.map(function (station, index) {
			return buildStation(station, index, L);
		}).join('');

		svg.innerHTML = buildDefs(L) +
			'<rect width="' + L.w + '" height="' + L.h + '" fill="url(#al-bg-grad)"/>' +
			'<ellipse cx="' + (L.w * 0.5) + '" cy="' + (L.mobile ? 470 : 350) + '" rx="' + (L.w * 0.58) + '" ry="' + (L.mobile ? 380 : 220) + '" fill="url(#al-glow-pink)" opacity="0.65"/>' +
			'<ellipse cx="' + (L.w * 0.1) + '" cy="' + (L.h * 0.74) + '" rx="250" ry="180" fill="url(#al-glow-cyan)" opacity="0.3"/>' +
			'<ellipse cx="' + (L.w * 0.92) + '" cy="' + (L.h * 0.3) + '" rx="220" ry="170" fill="url(#al-glow-pink)" opacity="0.25"/>' +
			buildFloor(L) +
			buildSparks(L) +
			buildLinks(L) +
			stationsSvg;

		updateSceneState(activeId);
	}

	function panelTemplate(station) {
		var metrics = station.metrics.map(function (metric) {
			return '<div class="al-metric"><strong>' + esc(metric.value) + '</strong><span>' + esc(metric.label) + '</span></div>';
		}).join('');

		var badges = station.stack.map(function (item) {
			return '<li class="al-badge">' + esc(item) + '</li>';
		}).join('');

		var achievements = station.achievements.map(function (item) {
			return '<li><span class="al-ach-marker" aria-hidden="true"></span><span>' + item + '</span></li>';
		}).join('');

		return '<div class="al-panel-inner">' +
			'<div class="al-panel-head">' +
				'<div class="al-panel-index" aria-hidden="true">' + station.index + '</div>' +
				'<div class="al-panel-id">' +
					'<p class="al-panel-kicker">Station ' + station.index + ' <span>//</span> ' + esc(station.phase) + '</p>' +
					'<h3 class="al-panel-company">' + esc(station.company) + '</h3>' +
					'<p class="al-panel-role">' + esc(station.role) + '</p>' +
				'</div>' +
				'<div class="al-panel-meta">' +
					'<span class="al-status"><i aria-hidden="true"></i>' + esc(station.status) + '</span>' +
					'<span class="al-panel-phase">Phase ' + station.index + ' / 04</span>' +
				'</div>' +
			'</div>' +
			'<div class="al-panel-body">' +
				'<div class="al-panel-col">' +
					'<h4 class="al-col-title">Impact Telemetry</h4>' +
					'<div class="al-metrics">' + metrics + '</div>' +
				'</div>' +
				'<div class="al-panel-col">' +
					'<h4 class="al-col-title">Tech Stack</h4>' +
					'<ul class="al-badges">' + badges + '</ul>' +
				'</div>' +
				'<div class="al-panel-col">' +
					'<h4 class="al-col-title">Assembly Highlights</h4>' +
					'<ul class="al-achievements">' + achievements + '</ul>' +
				'</div>' +
			'</div>' +
			'<div class="al-panel-foot">' +
				'<span class="al-foot-status"><i aria-hidden="true"></i> Node handshake complete</span>' +
				'<span class="al-foot-count">' + station.index + ' / 04</span>' +
				'<div class="al-foot-nav">' +
					'<button type="button" class="al-step" data-step="-1" aria-label="Previous station">&larr; Prev</button>' +
					'<button type="button" class="al-step" data-step="1" aria-label="Next station">Next &rarr;</button>' +
				'</div>' +
			'</div>' +
		'</div>';
	}

	function renderPanel(station, instant) {
		window.clearTimeout(panelTimer);

		var focusedStep = null;
		if (document.activeElement && panel.contains(document.activeElement) && document.activeElement.classList.contains('al-step')) {
			focusedStep = document.activeElement.getAttribute('data-step');
		}

		function apply() {
			panel.innerHTML = panelTemplate(station);
			panel.dataset.station = station.id;

			if (focusedStep) {
				var nextButton = panel.querySelector('.al-step[data-step="' + focusedStep + '"]');
				if (nextButton) nextButton.focus();
			}
		}

		if (instant || reduceMotion) {
			apply();
			panel.classList.remove('is-swapping');
			return;
		}

		panel.classList.add('is-swapping');
		panelTimer = window.setTimeout(function () {
			apply();
			window.requestAnimationFrame(function () {
				panel.classList.remove('is-swapping');
			});
		}, 110);
	}

	function buildTabs() {
		tabsHost.innerHTML = STATIONS.map(function (station) {
			return '<button type="button" class="al-tab" id="al-tab-' + station.id + '" role="tab" aria-selected="false" aria-controls="al-panel" tabindex="-1" data-station="' + station.id + '" style="' + accentStyle(station) + '">' +
				'<span class="al-tab-top"><span class="al-tab-num">' + station.index + '</span><span class="al-tab-dot" aria-hidden="true"></span></span>' +
				'<span class="al-tab-label">' + esc(station.tabLabel) + '</span>' +
				'<span class="al-tab-company">' + esc(station.shortCompany) + '</span>' +
			'</button>';
		}).join('');
	}

	function updateTabs(id) {
		var tabs = tabsHost.querySelectorAll('.al-tab');

		for (var i = 0; i < tabs.length; i++) {
			var isActive = tabs[i].getAttribute('data-station') === id;
			tabs[i].classList.toggle('is-active', isActive);
			tabs[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
			tabs[i].tabIndex = isActive ? 0 : -1;
		}

		panel.setAttribute('aria-labelledby', 'al-tab-' + id);
	}

	function setActive(id, options) {
		options = options || {};

		if (options.pin) pinnedId = id;

		var station = getStation(id);
		activeId = id;

		root.style.setProperty('--accent', station.accent);
		root.style.setProperty('--accent-rgb', station.accentRgb);

		updateSceneState(id);
		updateTabs(id);
		renderPanel(station, options.instant === true);
	}

	function pinStation(id, focusTab) {
		previewId = null;
		setActive(id, { pin: true });

		if (focusTab) {
			var tab = tabsHost.querySelector('.al-tab[data-station="' + id + '"]');
			if (tab) tab.focus();
		}
	}

	function stepStation(direction) {
		var index = stationIndex(pinnedId);
		var next = (index + direction + STATIONS.length) % STATIONS.length;
		pinStation(STATIONS[next].id, false);
	}

	/* ----------------------------------------------------------------------
	   Events
	   ---------------------------------------------------------------------- */

	tabsHost.addEventListener('click', function (event) {
		var tab = event.target.closest('.al-tab');
		if (tab) pinStation(tab.getAttribute('data-station'), false);
	});

	tabsHost.addEventListener('pointerover', function (event) {
		var tab = event.target.closest('.al-tab');
		if (!tab) return;

		var id = tab.getAttribute('data-station');
		if (id !== activeId) {
			previewId = id;
			setActive(id);
		}
	});

	tabsHost.addEventListener('pointerleave', function () {
		if (previewId) {
			previewId = null;
			setActive(pinnedId);
		}
	});

	tabsHost.addEventListener('focusin', function (event) {
		var tab = event.target.closest('.al-tab');
		if (!tab) return;

		var id = tab.getAttribute('data-station');
		if (id !== activeId) {
			previewId = id;
			setActive(id);
		}
	});

	tabsHost.addEventListener('focusout', function (event) {
		if (!tabsHost.contains(event.relatedTarget) && previewId) {
			previewId = null;
			setActive(pinnedId);
		}
	});

	tabsHost.addEventListener('keydown', function (event) {
		var tab = event.target.closest('.al-tab');
		if (!tab) return;

		var direction = 0;

		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') direction = 1;
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') direction = -1;
		else if (event.key === 'Home') {
			event.preventDefault();
			pinStation(STATIONS[0].id, true);
			return;
		} else if (event.key === 'End') {
			event.preventDefault();
			pinStation(STATIONS[STATIONS.length - 1].id, true);
			return;
		}

		if (!direction) return;

		event.preventDefault();
		var index = stationIndex(pinnedId);
		var next = (index + direction + STATIONS.length) % STATIONS.length;
		pinStation(STATIONS[next].id, true);
	});

	svg.addEventListener('pointerover', function (event) {
		var stationElement = event.target.closest ? event.target.closest('.al-station') : null;
		if (!stationElement) return;

		var id = stationElement.getAttribute('data-id');
		if (id && id !== activeId) {
			previewId = id;
			setActive(id);
		}
	});

	svg.addEventListener('pointerleave', function () {
		if (previewId) {
			previewId = null;
			setActive(pinnedId);
		}
	});

	svg.addEventListener('click', function (event) {
		var stationElement = event.target.closest ? event.target.closest('.al-station') : null;
		if (!stationElement) return;

		event.preventDefault();
		pinStation(stationElement.getAttribute('data-id'), false);
	});

	panel.addEventListener('click', function (event) {
		var step = event.target.closest('.al-step');
		if (!step) return;

		event.preventDefault();
		stepStation(Number(step.getAttribute('data-step')));
	});

	function handleLayoutChange() {
		if (mobileQuery.matches === lastMobile) return;

		lastMobile = mobileQuery.matches;
		buildScene();
		setActive(activeId, { instant: true });
	}

	if (mobileQuery.addEventListener) {
		mobileQuery.addEventListener('change', handleLayoutChange);
	} else if (mobileQuery.addListener) {
		mobileQuery.addListener(handleLayoutChange);
	}

	/* ----------------------------------------------------------------------
	   Initialize
	   ---------------------------------------------------------------------- */

	buildTabs();
	buildScene();
	setActive(pinnedId, { instant: true });

})();
