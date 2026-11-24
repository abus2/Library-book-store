/* Library Book Store — a first-person 3D library and book shop. Three.js r128 (global build). */
(() => {
const $ = s => document.querySelector(s);
if (!window.THREE) { $('#err').hidden = false; return; }
const T = THREE;

/* ---------- deterministic random ---------- */
let seed = 11; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = a => a[(R() * a.length) | 0];

/* ---------- tape database (first three are real, the rest are made up; s = short summary) ---------- */
const TAPES = [
  {t:'LONG SHOT',id:'SMD-EGP',year:'2019 · 2:05',genre:'COMEDY · ROMANCE',dir:'JONATHAN LEVINE',cast:'CHARLIZE THERON, SETH ROGEN, O\'SHEA JACKSON JR.',h:38,a:'#e9a23b',b:'#2b6fb3',s:'A gruff journalist reunites with his old babysitter, now a Secretary of State running for president, and joins her campaign.'},
  {t:'NIGHTHAWKS',id:'QNV-039',year:'1981 · 1:39',genre:'ACTION · THRILLER',dir:'BRUCE MALMUTH',cast:'SYLVESTER STALLONE, BILLY DEE WILLIAMS, RUTGER HAUER',h:222,a:'#c9d2e4',b:'#16203a',s:'Two New York cops hunt a ruthless international terrorist who has brought his bombing campaign to the city.'},
  {t:'TANGO & CASH',id:'XRJ-H2C',year:'1989 · 1:44',genre:'ACTION · THRILLER · COMEDY',dir:'ANDREI KONCHALOVSKY',cast:'SYLVESTER STALLONE, KURT RUSSELL, TERI HATCHER',h:12,a:'#ff5a3c',b:'#3b0d2a',s:'Two rival top cops are framed for murder, sent to prison and forced to team up to clear their names.'},
  {t:'STATIC BLOOM',id:'MVD-114',year:'1993 · 1:52',genre:'DRAMA · SCI-FI',dir:'ELENA VASQUEZ',cast:'MARTA IVES, DOMINIC HALE, JUN OKADA',h:285,a:'#7ef0c8',b:'#10223a',s:'A radio engineer finds a signal that makes strange flowers bloom, and a message from her own future.'},
  {t:'THE LAST RENTAL',id:'MVD-207',year:'1987 · 1:31',genre:'HORROR',dir:'PAUL DRESNER',cast:'LISA CORRIGAN, TOM BAXTER, A. PRYCE',h:0,a:'#ff2e4d',b:'#12060a',s:'On the final night before closing, a video store clerk finds one tape nobody can return.'},
  {t:'BLOOD ORANGE SKY',id:'MVD-318',year:'1991 · 2:02',genre:'THRILLER',dir:'ROSA KELLERMAN',cast:'IAN DOYLE, NADIA FERRO, W. STRAUSS',h:22,a:'#ff9a1f',b:'#3a0f2e',s:'A detective chases a killer across a city painted orange by wildfire smoke.'},
  {t:'HARBOR LIGHTS',id:'MVD-402',year:'1996 · 1:47',genre:'DRAMA · ROMANCE',dir:'SAM OYELARAN',cast:'CLAIRE MAHON, DEV PATEL-BROOKS',h:205,a:'#ffd5a0',b:'#20406b',s:'A lighthouse keeper’s daughter and a travelling sailor share one stormy week by the sea.'},
  {t:'DEAD AIR',id:'MVD-455',year:'1998 · 1:36',genre:'THRILLER · MYSTERY',dir:'HANNA LUND',cast:'RICK SALAZAR, MIRA TOLLEN, B. OKONKWO',h:265,a:'#9cc0ff',b:'#050914',s:'A late-night radio host realises a caller is describing crimes before they happen.'},
  {t:'CHROME HEARTS',id:'MVD-519',year:'1985 · 1:58',genre:'ACTION · SCI-FI',dir:'VIC MARANO',cast:'DUKE HOLLIS, TESS WARDELL, KANE ROBBINS',h:300,a:'#e8f2ff',b:'#4a1470',s:'In a city run by machines, a washed-up pilot builds one last chrome racer to win back freedom.'},
  {t:'NINE LIVES OF RAY',id:'MVD-604',year:'1994 · 1:41',genre:'COMEDY · FAMILY',dir:'GINA ABRAMS',cast:'RAY DELGADO, PEGGY LANG, THE CAT',h:48,a:'#ffe14a',b:'#e0562b',s:'A grumpy man comes back as a cat and gets nine tries to fix his family life.'},
  {t:'MOTEL SIGNAL',id:'MVD-688',year:'1990 · 1:33',genre:'HORROR · THRILLER',dir:'ORSON KEPLER',cast:'JUNE HARLOW, EDDIE NASH, M. CRUZ',h:340,a:'#59ffb0',b:'#06120e',s:'Guests at a remote motel keep tuning in to a TV channel that shows tomorrow’s news.'},
  {t:'REWIND',id:'MVD-701',year:'1999 · 1:29',genre:'COMEDY',dir:'DANI FOSTER',cast:'LEO MARCHETTI, AIKO TANABE, BIG STEVE',h:180,a:'#ff77c8',b:'#2c2a8a',s:'Two friends find a magic remote that rewinds their worst day, again and again.'},
  {t:'NEON COWBOY',id:'MVD-755',year:'1988 · 1:44',genre:'WESTERN · ACTION',dir:'CARLA REEVES',cast:'JACK TREMAINE, SOFIA BRANDT, OLLIE CRANE',h:95,a:'#ff7ad9',b:'#1b0f3a',s:'A drifter in a neon-lit desert town defends a failing diner from a ruthless land developer.'},
  {t:'THE QUIET ARCADE',id:'MVD-761',year:'1992 · 1:38',genre:'DRAMA',dir:'TOMAS WEBER',cast:'NINA PARK, GUS HOLLOWAY, DEE ROBLES',h:140,a:'#7df9ff',b:'#0d1a3f',s:'A shy teenager finds friendship and a way forward among the last regulars of a dying arcade.'},
  {t:'SPACE MOTEL',id:'MVD-768',year:'1986 · 1:35',genre:'SCI-FI · COMEDY',dir:'LUCY AMARI',cast:'BOBBY FINCH, KIRA OLSEN, ZED THE ALIEN',h:60,a:'#b6ff5a',b:'#2a1450',s:'The night clerk of a cosmic roadside motel must hide a runaway alien from the inspectors.'},
  {t:'SUMMER OF TAPES',id:'MVD-774',year:'1995 · 1:49',genre:'COMEDY · FAMILY',dir:'PETER GALLO',cast:'MAX LIU, ROSIE DUNN, TEO FARRELL',h:330,a:'#ffe066',b:'#d1432f',s:'Three friends spend one last summer making a home movie that goes hilariously wrong.'},
  {t:'FOG LINE',id:'MVD-779',year:'2000 · 1:56',genre:'MYSTERY · THRILLER',dir:'ASTRID NOLAN',cast:'HENRY VOSS, LENA MARCH, D. OKAFOR',h:250,a:'#c8d3dc',b:'#0b141c',s:'A ferry captain notices one more passenger than the ticket count on a foggy crossing.'},
  {t:'IRON LULLABY',id:'MVD-783',year:'1989 · 1:51',genre:'ACTION · DRAMA',dir:'RICO SALVATORE',cast:'BIG MARCUS PYLE, ANA TORRES, JOE BENNING',h:15,a:'#ffb347',b:'#2b2b33',s:'A retired boxer takes one last fight to save the gym that raised him.'},
  {t:'GHOST SHIFT',id:'MVD-790',year:'1997 · 1:34',genre:'HORROR · COMEDY',dir:'MIA FENWICK',cast:'PAT DOOLEY, SANDRA BLISS, THE GHOSTS',h:290,a:'#9dffcf',b:'#1e0f2e',s:'Night-shift cleaners at a haunted hotel organise the ghosts into a union.'},
  {t:'LAST DANCE DINER',id:'MVD-796',year:'1984 · 1:43',genre:'ROMANCE · DRAMA',dir:'EVA LINDQVIST',cast:'ROSE CALLOWAY, MILES ARDEN',h:335,a:'#ff9ec7',b:'#3b1030',s:'Two strangers share a booth and one long night, talking until sunrise.'},
  {t:'DRAGON TIDE',id:'MVD-802',year:'1993 · 2:05',genre:'FANTASY · ADVENTURE',dir:'KENJI MORITA',cast:'SUKI HARA, BEN OYELOWO, THE DRAGON',h:190,a:'#5ee1ff',b:'#0a2a4a',s:'A fisherman’s daughter befriends a sea dragon and sails out to stop a war.'},
  {t:'THE LONG REWIND',id:'MVD-808',year:'2001 · 1:58',genre:'DOCUMENTARY',dir:'HELEN BRODY',cast:'RENTAL CLERKS EVERYWHERE',h:120,a:'#f2e3c3',b:'#4a3a2a',s:'A warm look at the last video rental stores and the people who still run them.'},
  {t:'SATELLITE HEART',id:'MVD-815',year:'1999 · 1:46',genre:'SCI-FI · ROMANCE',dir:'NOAH WINTERS',cast:'ADA KOVAC, REMY LACROIX',h:270,a:'#ff8fa3',b:'#101a4d',s:'An astronaut and a ground-control radio operator fall in love across a crackling signal.'},
  {t:'BIG TOP BLUES',id:'MVD-821',year:'1991 · 1:40',genre:'FAMILY · COMEDY',dir:'GRETA HOLM',cast:'BUZZ PELLER, MAMIE CRUZ, LUCKY THE DOG',h:75,a:'#ffd23f',b:'#8a1f3d',s:'A clumsy clown inherits a tiny circus and must save it before the season ends.'},
  {t:'PAPER MOON MOTEL',id:'MVD-829',year:'1983 · 1:37',genre:'ROMANCE · COMEDY',dir:'LAURA KENDRICK',cast:'DANNY SOUZA, PIA MERCER, OLD MR. FINCH',h:110,a:'#ffe9b0',b:'#2f3a7a',s:'A runaway bride and a broke magician share one cheap motel room and one very long road trip.'},
  {t:'SILENT HIGHWAY',id:'MVD-833',year:'1990 · 1:54',genre:'THRILLER · DRAMA',dir:'OMAR HADDAD',cast:'CARLA BENSON, TREY WALKER, S. IWASAKI',h:230,a:'#ffb86b',b:'#1a1226',s:'A long-haul trucker picks up a hitchhiker who knows far too much about his past.'},
  {t:'TURBO TEEN',id:'MVD-840',year:'1987 · 1:32',genre:'COMEDY · ACTION',dir:'RANDY KOWALSKI',cast:'CHAD BRIGGS, LISA MONTOYA, COACH DUKE',h:35,a:'#ff6a5c',b:'#1d2f8f',s:'A high-school nobody wins a beat-up sports car and a street race that could save his town.'},
  {t:'THE HOLLOW CHOIR',id:'MVD-846',year:'1992 · 1:44',genre:'HORROR',dir:'IRIS CALDER',cast:'WENDY HALE, MARK TOBIN, THE CHOIR',h:5,a:'#b9a8ff',b:'#0a0714',s:'A new choir teacher hears voices in an empty chapel and learns who is still singing.'},
  {t:'COLD PIZZA SUMMER',id:'MVD-852',year:'1996 · 1:36',genre:'COMEDY',dir:'MARCO BELLINI',cast:'JOEY RAND, TINA OKAFOR, UNCLE SAL',h:150,a:'#ffcf5c',b:'#b23a2e',s:'Three delivery drivers try to save their failing pizzeria by winning a city-wide contest.'},
  {t:'AFTER THE RAIN',id:'MVD-859',year:'1994 · 2:07',genre:'DRAMA · ROMANCE',dir:'NADIA ROSSI',cast:'ELLA FARROW, JAMES ODUYA, MRS. LIN',h:210,a:'#a8d8ff',b:'#14304f',s:'Two old friends meet again in a flooded town and decide whether to rebuild together.'},
  {t:'STAR PATROL 9',id:'MVD-864',year:'1982 · 1:49',genre:'SCI-FI · ADVENTURE',dir:'DEREK VANCE',cast:'CAPTAIN LEE STARK, ZOE QUINN, ROBO-BOB',h:318,a:'#7fb2ff',b:'#080a2a',s:'A scrappy crew and a nervous robot must deliver a secret cargo across a hostile galaxy.'},
  {t:'THE VELVET HEIST',id:'MVD-870',year:'1989 · 1:57',genre:'CRIME · COMEDY',dir:'SOPHIE LAURENT',cast:'VIC ROMERO, MAYA CHEN, FINGERS MALONE',h:70,a:'#c96bff',b:'#2a0f3d',s:'A crew of retired thieves reunites to rob the casino that fired them, one velvet glove at a time.'},
  {t:'WOLF MOON ROAD',id:'MVD-877',year:'1995 · 1:42',genre:'HORROR · THRILLER',dir:'JASPER KING',cast:'HOLLY BRAND, NICK TAVARES, SHERIFF DREW',h:260,a:'#d6dcff',b:'#0d1230',s:'Stranded campers learn why the locals never drive the old mountain road at full moon.'},
  {t:'MY ROBOT BEST FRIEND',id:'MVD-882',year:'1993 · 1:35',genre:'FAMILY · SCI-FI',dir:'ANITA BHAT',cast:'OLIVER SHAW, PRIYA NAIR, BEEP',h:20,a:'#8ff0ff',b:'#26509a',s:'A lonely kid repairs a broken robot, and the two hide from the company that wants it back.'},
  {t:'SAMURAI SUNDAY',id:'MVD-889',year:'1991 · 1:53',genre:'ACTION · ADVENTURE',dir:'HIRO TANAKA',cast:'KEN SATO, MEI ARAKI, MASTER OGAWA',h:240,a:'#ff8a5c',b:'#3a0d0d',s:'A wandering swordsman guards a small village until a harvest festival that could be his last.'},
  {t:'THE GLASS DETECTIVE',id:'MVD-895',year:'1986 · 1:48',genre:'MYSTERY · CRIME',dir:'MORGAN BELL',cast:'ARTHUR LANE, VERA KNOX, INSPECTOR PAIGE',h:130,a:'#cfe9ee',b:'#1b2b33',s:'A near-sighted private eye follows a trail of broken glass to a very polite killer.'},
  {t:'SUNDAY DRIVERS',id:'MVD-901',year:'1997 · 1:39',genre:'COMEDY · FAMILY',dir:'BETH COLLINS',cast:'GRANDPA JOE, LUCY MARSH, THE MINIVAN',h:295,a:'#fff08a',b:'#3f8f5a',s:'A grandfather takes his grandkids on one chaotic road trip in a minivan that refuses to die.'},
  {t:'DEEP BLUE CALLING',id:'MVD-907',year:'2000 · 1:58',genre:'SCI-FI · THRILLER',dir:'KAREN ABEL',cast:'DR. NORA FIELD, SAM OKORO, THE VOICE',h:175,a:'#4da6ff',b:'#020b24',s:'A deep-sea crew answers a call from the ocean floor that should not exist.'},
  {t:'THE MIDNIGHT BAKER',id:'MVD-912',year:'1988 · 1:34',genre:'COMEDY · ROMANCE',dir:'LUIS ORTEGA',cast:'MARIA VEGA, TOM FINNEGAN, DOUGH THE DOG',h:85,a:'#ffd9a6',b:'#6a3b2a',s:'A night-shift baker and a sleepless poet fall in love through notes left in warm bread.'},
  {t:'ROLLERBALL HEROES',id:'MVD-918',year:'1992 · 1:46',genre:'ACTION · SPORT',dir:'TINA REYES',cast:'MAGGIE STONE, DUKE HARMON, COACH VOLKOV',h:320,a:'#ff5ad1',b:'#101a5a',s:'An underdog roller derby team fights for a championship and for the rink they call home.'},
];
const P = TAPES.length;

/* ---------- renderer / scene / camera ---------- */
const renderer = new T.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 'ontouchstart' in window ? 1.5 : 2));
renderer.outputEncoding = T.sRGBEncoding;
$('#stage').appendChild(renderer.domElement);
const scene = new T.Scene();
scene.background = new T.Color(0x070a1a);
scene.fog = new T.Fog(0x0a0c18, 14, 62);
const cam = new T.PerspectiveCamera(78, 1, 0.05, 95);
cam.rotation.order = 'YXZ';
cam.position.set(0, 1.62, 15.5); // start outside, on the sidewalk across the street from the shop
scene.add(cam);

const hemi = new T.HemisphereLight(0xfff6e8, 0x40382e, 1.3); scene.add(hemi);
const lamp = new T.PointLight(0xfff0d8, 1.6, 18, 2); scene.add(lamp);

/* ---------- procedural textures ---------- */
function tex(w, h, draw, enc = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c);
  if (enc) t.encoding = T.sRGBEncoding;
  t.anisotropy = 16; t.wrapS = t.wrapT = T.RepeatWrapping;
  return t;
}
const pegTex = tex(64, 64, (g, w, h) => {
  g.fillStyle = '#74716a'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#2a2927'; g.beginPath(); g.arc(32, 32, 7, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.arc(30, 30, 7, 3.6, 5.6); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.25)'; g.stroke();
});
const carpetTex = tex(128, 128, (g, w, h) => {
  g.fillStyle = '#2b2d33'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `hsla(${200 + R() * 60},12%,${15 + R() * 30}%,.55)`; g.fillRect(R() * w, R() * h, 2, 2); }
});
const checkTex = tex(128, 128, (g, w, h) => {
  g.fillStyle = '#c9c7bd'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#26272a'; g.fillRect(0, 0, w / 2, h / 2); g.fillRect(w / 2, h / 2, w / 2, h / 2);
  for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(0,0,0,${R() * .08})`; g.fillRect(R() * w, R() * h, 3, 3); }
});
const spineTex = tex(32, 128, (g, w, h) => {
  g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(0,0,0,.78)'; g.fillRect(0, 0, w, 12);
  g.fillStyle = 'rgba(0,0,0,.45)'; for (let y = 22; y < 96; y += 6) g.fillRect(w * .28, y, w * .44, 2.4);
  g.fillStyle = 'rgba(0,0,0,.8)'; g.fillRect(0, 104, w, 3); g.fillRect(0, 118, w, 10);
});
const bandTex = tex(256, 64, (g, w, h) => {
  g.fillStyle = '#e8b90f'; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(0,0,0,.28)'; for (let x = 6; x < w; x += 22) g.fillRect(x, 20, 10 + R() * 8, 24);
});

function signTex(text, bg = '#16171b', fg = '#f4f1e8') {
  return tex(512, 128, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.strokeStyle = fg; g.lineWidth = 5; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = fg; g.font = '800 64px Impact,"Arial Narrow Bold",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, w / 2, h / 2 + 3);
  });
}

/* ---------- movie posters (canvas art) ---------- */
function poster(d, i) {
  return tex(240, 400, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, d.a); gr.addColorStop(.55, d.b); gr.addColorStop(1, '#000');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.globalAlpha = .35; g.fillStyle = '#fff'; g.beginPath(); g.arc(w * (.3 + (i % 3) * .2), h * .38, 78, 0, 7); g.fill(); g.globalAlpha = 1;
    g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.moveTo(0, h * .6);
    for (let x = 0; x <= w; x += 20) g.lineTo(x, h * (.5 + .12 * Math.sin(x * .05 + i * 2) + R() * .05)); g.lineTo(w, h); g.lineTo(0, h); g.fill();
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '800 38px Impact,"Arial Narrow Bold",sans-serif';
    const words = d.t.split(' '); words.forEach((s, k) => g.fillText(s, w / 2, 70 + k * 40 - (words.length - 1) * 8));
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, 20); g.fillStyle = '#111'; g.font = '700 13px sans-serif'; g.fillText('VHS', 28, 15);
    g.fillStyle = '#1b2a6b'; g.fillRect(0, h - 44, w, 44); g.fillStyle = '#ffd23f'; g.font = '700 15px sans-serif'; g.fillText('☾ LIBRARY BOOK STORE', w / 2, h - 17);
  });
}
const posterTex = TAPES.map(poster);
const posterMat = posterTex.map(t => new T.MeshLambertMaterial({map: t}));
const posterMatDS = posterTex.map(t => new T.MeshLambertMaterial({map: t, side: T.DoubleSide}));

/* ---------- materials & helpers ---------- */
const M = c => new T.MeshLambertMaterial({color: c});
const matBoard = M(0x2c2e33), matUp = M(0x4a4d54), matWall = M(0x4a4c52), matCeil = M(0x2a2b30), matDark = M(0x0e0e11);
const matPeg = new T.MeshLambertMaterial({map: pegTex});
const matBand = new T.MeshLambertMaterial({map: bandTex});

function plane(w, h, mat, uv) {
  const g = new T.PlaneGeometry(w, h);
  if (uv) { const a = g.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, a.getX(i) * uv[0], a.getY(i) * uv[1]); }
  return new T.Mesh(g, mat);
}
function box(w, h, d, mat, x, y, z) { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); scene.add(m); return m; }
function rectFloor(x0, x1, z0, z1, map, tile, y = 0) {
  const w = x1 - x0, d = z0 - z1;
  const m = plane(w, d, new T.MeshLambertMaterial({map}), [w / tile, d / tile]);
  m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); scene.add(m);
}

/* ---------- room ---------- */
const ZF = 6, ZB = -60, HW = 4, CEIL = 3.0, RW = 6, RZ = -78; // RW/RZ: reading room half-width and back wall
rectFloor(-HW, HW, ZF, ZB, carpetTex, 1.2);
rectFloor(-0.88, 0.88, ZF, ZB, checkTex, 0.6, 0.004);
rectFloor(-3.6, -1.52, -26, ZB, checkTex, 0.6, 0.004);
rectFloor(1.52, 3.6, -14, -44, checkTex, 0.6, 0.004);
rectFloor(-HW, HW, 2.2, -2, checkTex, 0.6, 0.004);
{ const c = plane(HW * 2, ZF - ZB, matCeil); c.rotation.x = Math.PI / 2; c.position.set(0, CEIL, (ZF + ZB) / 2); scene.add(c); }
[-HW, HW].forEach(x => { const w = plane(ZF - ZB, CEIL, matWall); w.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; w.position.set(x, CEIL / 2, (ZF + ZB) / 2); scene.add(w); });
{ // shopfront: bulkheads, pillars, header band, a doorway (x -1.1..1.1) and two big glass windows
  const fd = new T.MeshLambertMaterial({color: 0x4a4c52, side: T.DoubleSide});
  const pc = (w, h, x, y) => { const m = plane(w, h, fd); m.position.set(x, y, ZF); scene.add(m); };
  pc(2.5, 0.9, -2.75, 0.45); pc(2.5, 0.9, 2.75, 0.45); pc(0.4, 2.4, -1.3, 1.2); pc(0.4, 2.4, 1.3, 1.2); pc(8, 0.6, 0, 2.7);
  const matFrame = M(0x12141a);
  const glass = new T.MeshPhongMaterial({color: 0x9fc4ff, transparent: true, opacity: 0.13, shininess: 90, specular: 0xffffff, side: T.DoubleSide, depthWrite: false});
  [-2.75, 2.75].forEach(x => { const g = plane(2.5, 1.5, glass); g.position.set(x, 1.65, ZF + 0.005); g.renderOrder = 2; scene.add(g);
    box(2.56, 0.07, 0.14, matFrame, x, 0.9, ZF); box(2.56, 0.07, 0.14, matFrame, x, 2.4, ZF); });
  [-4, -1.5, 1.5, 4].forEach(x => box(0.07, 1.5, 0.14, matFrame, x === -4 ? -3.96 : x === 4 ? 3.96 : x, 1.65, ZF));
  box(0.1, 2.4, 0.16, matFrame, -1.1, 1.2, ZF); box(0.1, 2.4, 0.16, matFrame, 1.1, 1.2, ZF); box(2.3, 0.1, 0.16, matFrame, 0, 2.4, ZF);
  // dividing wall with a doorway (x -1..1, 2.2 high) into the reading room; double-sided so it shows from both rooms
  const dm = new T.MeshLambertMaterial({color: 0x4a4c52, side: T.DoubleSide});
  [-3.5, 3.5].forEach(x => { const w = plane(5, CEIL, dm); w.position.set(x, CEIL / 2, ZB); scene.add(w); });
  const lin = plane(2, CEIL - 2.2, dm); lin.position.set(0, (2.2 + CEIL) / 2, ZB); scene.add(lin);
  box(0.12, 2.2, 0.22, matUp, -1.04, 1.1, ZB); box(0.12, 2.2, 0.22, matUp, 1.04, 1.1, ZB); box(2.2, 0.12, 0.22, matUp, 0, 2.24, ZB); }

/* ---------- shelving ---------- */
const spines = [], covers = Array.from({length: P}, () => []);
const LEVELS = [0.1, 0.6, 1.1, 1.6];
const heroes = [];
function shelfFace(x, z0, z1, dir, withBand) {
  const L = z0 - z1, cz = (z0 + z1) / 2, depth = withBand ? 0.48 : 0.3;
  const back = plane(L, 2.2, matPeg, [L / 0.08, 2.2 / 0.08]);
  back.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2; back.position.set(x, 1.1, cz); scene.add(back);
  LEVELS.concat(2.1).forEach(y => box(depth, 0.03, L, matBoard, x + dir * depth / 2, y, cz));
  for (let z = z1; z <= z0 + 0.01; z += 1.2) box(depth + .02, 2.2, 0.035, matUp, x + dir * depth / 2, 1.1, z);
  if (withBand) {
    const b = plane(L, 0.7, matBand, [L / 1.5, 1]); b.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2; b.position.set(x + dir * .01, 2.5, cz); scene.add(b);
    for (let z = z1 + 2; z < z0 - 1; z += 4.5) {
      const d = TAPES[(R() * P) | 0], m = new T.Mesh(new T.PlaneGeometry(0.4, 0.6), posterMat[TAPES.indexOf(d)]);
      m.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2; m.position.set(x + dir * .02, 2.52, z); m.userData.tape = d; scene.add(m); heroes.push(m);
    }
  }
  // fill with tapes
  LEVELS.forEach(y => {
    let z = z1 + 0.04;
    while (z < z0 - 0.06) {
      if (R() < 0.1) {
        const w = 0.105; if (z + w > z0) break;
        covers[(R() * P) | 0].push([x + dir * (depth - 0.03), y + 0.1, z + w / 2, dir]);
        z += w + 0.004;
      } else {
        const th = pick([0.016, 0.019, 0.026, 0.03, 0.034]), h = 0.17 + R() * 0.03;
        if (z + th > z0) break;
        spines.push([x + dir * depth * 0.5, y + h / 2 + 0.015, z + th / 2, depth * 0.94, h, th, dir]);
        z += th + 0.002;
      }
    }
  });
}
const ISL = []; // island z-ranges for collision
shelfFace(-HW + 0.02, 2, -58, 1, true);
shelfFace(HW - 0.02, 2, -58, -1, true);
shelfFace(-RW + 0.02, -61.5, -76.5, 1, false); // reading room wall shelves (tapes you can carry to a table)
shelfFace(RW - 0.02, -61.5, -76.5, -1, false);
for (let k = 0; k < 5; k++) {
  const z0 = -2 - 12 * k, z1 = z0 - 8; ISL.push([z1, z0]);
  [-1.2, 1.2].forEach(sx => {
    shelfFace(sx + .021, z0, z1, 1, false); shelfFace(sx - .021, z0, z1, -1, false);
    box(0.04, 2.3, 8, matUp, sx, 1.15, (z0 + z1) / 2);
    box(0.64, 0.06, 8, matDark, sx, 2.3, (z0 + z1) / 2);
  });
}
// islands: two spines at ±1.2 (each 0.64 thick, drawn as double-sided units)
const dummy = new T.Object3D();
{
  const g = new T.BoxGeometry(1, 1, 1);
  const m = new T.MeshLambertMaterial({map: spineTex});
  const im = new T.InstancedMesh(g, m, spines.length);
  const col = new T.Color();
  spines.forEach((s, i) => {
    dummy.position.set(s[0], s[1], s[2]); dummy.rotation.set(0, 0, 0); dummy.scale.set(s[3], s[4], s[5]); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
    col.setHSL(R(), 0.35 + R() * 0.5, 0.25 + R() * 0.4); if (R() < .14) col.setHSL(0, 0, 0.1 + R() * .12); im.setColorAt(i, col);
  });
  scene.add(im);
  const covG = new T.PlaneGeometry(0.105, 0.19);
  covers.forEach((arr, p) => {
    if (!arr.length) return;
    const c = new T.InstancedMesh(covG, posterMat[p], arr.length);
    arr.forEach((v, i) => { dummy.position.set(v[0], v[1], v[2]); dummy.rotation.set(0, v[3] > 0 ? Math.PI / 2 : -Math.PI / 2, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); c.setMatrixAt(i, dummy.matrix); });
    c.userData.tape = TAPES[p]; scene.add(c); heroes.push(c);
  });
}

/* ---------- ceiling lights ---------- */
{
  const pos = []; for (let z = 3; z > -58; z -= 3) [-2.4, 0, 2.4].forEach(x => pos.push([x, z]));
  const mk = (arr, mat) => {
    const im = new T.InstancedMesh(new T.PlaneGeometry(0.35, 1.2), mat, arr.length);
    arr.forEach((p, i) => { dummy.position.set(p[0], CEIL - 0.01, p[1]); dummy.rotation.set(Math.PI / 2, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); });
    scene.add(im);
  };
  window.__flick = new T.MeshBasicMaterial({color: 0xffffff, fog: false});
  mk(pos.filter(p => p[1] > -40), new T.MeshBasicMaterial({color: 0xf6f4ff, fog: false}));
  mk(pos.filter(p => p[1] <= -40), window.__flick);
}

/* ---------- hanging signs, standees, props ---------- */
[[-2.6, 'NEW RELEASES'], [-12, 'ACTION'], [-24, 'COMEDY'], [-36, 'THRILLER'], [-48, 'NO HOPE'], [-56, 'READING ROOM']].forEach(([z, name]) => {
  const s = new T.Mesh(new T.PlaneGeometry(1.5, 0.375), new T.MeshBasicMaterial({map: signTex(name), side: T.DoubleSide}));
  s.position.set(0, 2.52, z); scene.add(s);
  [-0.65, 0.65].forEach(dx => box(0.012, CEIL - 2.7, 0.012, matDark, dx, (CEIL + 2.7) / 2, z));
});
[[-1.2, -2.3, 0], [1.2, -14.4, 1], [-1.2, -26.4, 2], [1.2, -38.4, 5], [-1.2, -50.4, 7]].forEach(([x, z, p]) => {
  const m = new T.Mesh(new T.PlaneGeometry(0.62, 1.03), posterMatDS[p]); m.position.set(x, 0.62, z); m.rotation.x = -0.09; m.userData.tape = TAPES[p];
  scene.add(m); heroes.push(m); box(0.5, 0.1, 0.25, matBoard, x, 0.05, z + .02);
});
{ // wet-floor sign
  const t = tex(64, 128, (g, w, h) => { g.fillStyle = '#f2c500'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.font = '800 15px Impact,sans-serif'; g.textAlign = 'center'; g.fillText('CAUTION', w / 2, 24);
    g.beginPath(); g.moveTo(w / 2, 40); g.lineTo(w / 2 + 20, 90); g.lineTo(w / 2 - 20, 90); g.closePath(); g.lineWidth = 5; g.strokeStyle = '#111'; g.stroke(); });
  const grp = new T.Group();
  [-1, 1].forEach(s => { const p = new T.Mesh(new T.PlaneGeometry(0.26, 0.55), new T.MeshLambertMaterial({map: t, side: T.DoubleSide})); p.position.set(0, 0.27, s * 0.09); p.rotation.x = -s * 0.28; grp.add(p); });
  grp.position.set(-1.9, 0, -11.6); grp.rotation.y = 0.5; scene.add(grp);
}
box(0.7, 0.42, 0.5, M(0x1f4aa8), -3.1, 0.21, 2.8);
box(0.5, 0.45, 0.5, M(0xb08a57), 3.0, 0.23, -26.4).rotation.y = 0.4;
box(0.5, 0.45, 0.5, M(0xa9824e), -3.1, 0.23, -38.6).rotation.y = -0.3;

/* ---------- reading room: tables, chairs, lamps, shelves, a cosy nook ---------- */
const COL = []; // rectangle colliders [x0, x1, zMin, zMax]
const readLight = new T.PointLight(0xffc27a, 1.3, 24, 2); readLight.position.set(0, 2.5, -69); scene.add(readLight);
const matRW = M(0x5c4a3a), matRC = M(0x3a302a), matWood = M(0x7a5230), matLeg = M(0x3a2a1c), matSeat = M(0x8a3b2e), matPot = M(0x8a4b2a), matLeaf = M(0x2f7a46), matTape = M(0x1a1a1e);
const matShade = new T.MeshLambertMaterial({color: 0x2a4a38, side: T.DoubleSide}), matLamp = new T.MeshLambertMaterial({color: 0x0f6b3a, side: T.DoubleSide});
const glowMat = new T.MeshBasicMaterial({color: 0xffe2a0, fog: false}), pendMat = new T.MeshBasicMaterial({color: 0xffe2a0, fog: false});
const woodTex = tex(128, 128, (g, w, h) => {
  for (let i = 0; i < 8; i++) { g.fillStyle = `hsl(28,${35 + R() * 10}%,${22 + R() * 9}%)`; g.fillRect(0, i * 16, w, 16); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, i * 16, w, 1.5); }
  for (let i = 0; i < 400; i++) { g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(R() * w, R() * h, 8 + R() * 22, 1); }
});
const rugTex = tex(256, 128, (g, w, h) => {
  g.fillStyle = '#6b1f2a'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#d8b36a'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
  g.strokeStyle = '#2f0c14'; g.lineWidth = 8; g.strokeRect(22, 22, w - 44, h - 44);
  g.fillStyle = '#d8b36a'; for (let x = 52; x < w - 40; x += 36) { g.beginPath(); g.moveTo(x, h / 2 - 14); g.lineTo(x + 14, h / 2); g.lineTo(x, h / 2 + 14); g.lineTo(x - 14, h / 2); g.fill(); }
});
const winTex = tex(128, 128, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0b1636'); gr.addColorStop(1, '#2b4a86'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#fff'; for (let i = 0; i < 40; i++) g.fillRect(R() * w, R() * h * .8, 1.5, 1.5);
  g.fillStyle = '#f4f1d0'; g.beginPath(); g.arc(w * .68, h * .3, 14, 0, 7); g.fill();
});
rectFloor(-RW, RW, ZB, RZ, woodTex, 1.6);
{ const c = plane(RW * 2, ZB - RZ, matRC); c.rotation.x = Math.PI / 2; c.position.set(0, CEIL, (ZB + RZ) / 2); scene.add(c);
  [-RW, RW].forEach(x => { const w = plane(ZB - RZ, CEIL, matRW); w.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; w.position.set(x, CEIL / 2, (ZB + RZ) / 2); scene.add(w); });
  const bk = plane(RW * 2, CEIL, matRW); bk.position.set(0, CEIL / 2, RZ); scene.add(bk); }
function cyl(rt, rb, h, mat, x, y, z, open) { const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, 14, 1, !!open), mat); m.position.set(x, y, z); scene.add(m); return m; }
function ball(r, mat, x, y, z) { const m = new T.Mesh(new T.SphereGeometry(r, 10, 8), mat); m.position.set(x, y, z); scene.add(m); return m; }
function lyingTape(x, y, z, ry) {
  const i = (R() * P) | 0, m = new T.Mesh(new T.BoxGeometry(0.103, 0.025, 0.19), [matTape, matTape, posterMat[i], matTape, matTape, matTape]);
  m.position.set(x, y, z); m.rotation.y = ry; m.userData.tape = TAPES[i]; scene.add(m); heroes.push(m);
}
function chair(x, z, side) {
  box(0.42, 0.04, 0.42, matSeat, x, 0.45, z);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.04, 0.43, 0.04, matLeg, x + a * 0.18, 0.215, z + b * 0.18));
  box(0.42, 0.42, 0.04, matLeg, x, 0.68, z + side * 0.19);
}
function readTable(cx, cz) {
  box(2.0, 0.05, 0.9, matWood, cx, 0.75, cz);
  [[-0.92, -0.38], [0.92, -0.38], [-0.92, 0.38], [0.92, 0.38]].forEach(([dx, dz]) => box(0.06, 0.73, 0.06, matLeg, cx + dx, 0.365, cz + dz));
  [-1, 1].forEach(side => [-0.5, 0.5].forEach(dx => chair(cx + dx, cz + side * 0.8, side)));
  // green reading lamp
  cyl(0.08, 0.09, 0.03, matTape, cx + 0.8, 0.79, cz - 0.2); box(0.015, 0.28, 0.015, matTape, cx + 0.8, 0.93, cz - 0.2);
  cyl(0.05, 0.13, 0.12, matLamp, cx + 0.8, 1.1, cz - 0.2, true); ball(0.035, glowMat, cx + 0.8, 1.04, cz - 0.2);
  // tapes to read on the table (look at one, press E)
  lyingTape(cx - 0.55, 0.7875, cz + 0.05, (R() - 0.5) * 0.9); lyingTape(cx + 0.2, 0.7875, cz - 0.1, (R() - 0.5) * 0.9);
  // hanging lamp
  box(0.01, CEIL - 2.15, 0.01, matTape, cx, (CEIL + 2.15) / 2, cz); cyl(0.1, 0.32, 0.2, matShade, cx, 2.05, cz, true); ball(0.07, pendMat, cx, 1.95, cz);
  COL.push([cx - 1.1, cx + 1.1, cz - 1.05, cz + 1.05]);
}
[-2.6, 2.6].forEach(x => [-65, -71].forEach(z => readTable(x, z)));
// back nook: rug, two armchairs, a low table with tapes
{ const rug = plane(5, 2.6, new T.MeshLambertMaterial({map: rugTex})); rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.01, -75.6); scene.add(rug);
  const matArm = M(0x2f4a7a), matCush = M(0x3d5f99);
  [[-1.7, 1], [1.7, -1]].forEach(([x, f]) => {
    box(0.8, 0.4, 0.8, matArm, x, 0.2, -75.6); box(0.14, 0.55, 0.8, matArm, x - f * 0.33, 0.62, -75.6);
    box(0.62, 0.1, 0.62, matCush, x + f * 0.05, 0.45, -75.6); box(0.8, 0.25, 0.12, matArm, x, 0.52, -75.96); box(0.8, 0.25, 0.12, matArm, x, 0.52, -75.24);
  });
  cyl(0.5, 0.5, 0.04, matWood, 0, 0.48, -75.6); cyl(0.05, 0.05, 0.46, matLeg, 0, 0.23, -75.6);
  lyingTape(-0.15, 0.5125, -75.6, 0.3); lyingTape(0.2, 0.5125, -75.5, -0.4);
  COL.push([-2.3, 2.3, -76.5, -74.7]); }
// plants
[[-5.1, -77.1], [5.1, -77.1], [-2.3, -61.2], [2.3, -61.2]].forEach(([x, z]) => {
  cyl(0.2, 0.15, 0.3, matPot, x, 0.15, z); ball(0.22, matLeaf, x, 0.55, z); ball(0.18, matLeaf, x + 0.08, 0.8, z - 0.05); ball(0.15, matLeaf, x - 0.06, 0.98, z + 0.04);
  COL.push([x - 0.3, x + 0.3, z - 0.3, z + 0.3]);
});
// ceiling fans (I toggles them)
const fans = []; let fansOn = true, fanSpeed = 5;
const matFan = M(0x3a2a1c), matBlade = M(0x8a6a45);
[[0, -65], [0, -71], [-4.5, -65], [4.5, -65], [-4.5, -71], [4.5, -71], [0, -75.6]].forEach(([fx, fz]) => {
  cyl(0.015, 0.015, 0.3, matTape, fx, CEIL - 0.15, fz); cyl(0.12, 0.12, 0.1, matFan, fx, CEIL - 0.34, fz);
  const g = new T.Group(); g.position.set(fx, CEIL - 0.4, fz);
  for (let k = 0; k < 4; k++) {
    const arm = new T.Group(); arm.rotation.y = k * Math.PI / 2;
    const bl = new T.Mesh(new T.BoxGeometry(0.62, 0.015, 0.15), matBlade); bl.position.x = 0.44; bl.rotation.x = 0.12; arm.add(bl); g.add(arm);
  }
  scene.add(g); fans.push(g);
  cyl(0.09, 0.09, 0.07, matFan, fx, CEIL - 0.45, fz); ball(0.06, pendMat, fx, CEIL - 0.52, fz);
});
function toggleFans() { fansOn = !fansOn; toast('Ceiling fans ' + (fansOn ? 'on' : 'off')); }
// notice boards: silence please, no food, phones on silent, table cards, hanging signs
function boardTex(lines, bg, fg, w, h) {
  return tex(w, h, (g, W, H) => {
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = fg; g.lineWidth = 8; g.strokeRect(14, 14, W - 28, H - 28);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    const n = lines.length, fs = Math.min(H / (n + 0.9), W / (Math.max(...lines.map(l => l.length)) * 0.62));
    g.font = '800 ' + fs + 'px Impact,sans-serif';
    lines.forEach((l, i) => g.fillText(l, W / 2, H * (i + 1) / (n + 1)));
  });
}
function board(lines, bg, fg, w, h, x, y, z, ry) {
  box(w + 0.08, h + 0.08, 0.03, matLeg, x, y, z);
  const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshLambertMaterial({map: boardTex(lines, bg, fg, 512, Math.round(512 * h / w))}));
  m.position.set(x, y, z + Math.cos(ry) * 0.02); m.rotation.y = ry; scene.add(m);
}
function hangBoard(lines, bg, fg, w, h, x, y, z) {
  [-0.4, 0.4].forEach(dx => box(0.01, CEIL - y - h / 2, 0.01, matTape, x + dx * w, (CEIL + y + h / 2) / 2, z));
  const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshLambertMaterial({map: boardTex(lines, bg, fg, 512, Math.round(512 * h / w)), side: T.DoubleSide}));
  m.position.set(x, y, z); scene.add(m);
  box(w + 0.06, 0.03, 0.03, matLeg, x, y + h / 2 + 0.015, z); box(w + 0.06, 0.03, 0.03, matLeg, x, y - h / 2 - 0.015, z);
}
// on the dividing wall, facing into the reading room
board(['SILENCE', 'PLEASE'], '#10243f', '#ffe27a', 1.3, 0.8, -3.3, 1.7, ZB - 0.015, Math.PI);
board(['NO FOOD', 'OR DRINKS'], '#3a0f14', '#ff8f7a', 1.3, 0.8, 3.3, 1.7, ZB - 0.015, Math.PI);
board(['PHONES ON', 'SILENT'], '#0f2e1f', '#9dffb8', 1.1, 0.7, -5.0, 1.6, ZB - 0.015, Math.PI);
board(['RETURN TAPES', 'TO THE SHELF'], '#2b2b33', '#ffffff', 1.1, 0.7, 5.0, 1.6, ZB - 0.015, Math.PI);
// on the back wall
board(['QUIET ZONE'], '#2a1a3d', '#d9b8ff', 1.0, 0.45, -1.9, 1.3, RZ + 0.015, 0);
board(['SHHH...'], '#3d2a10', '#ffd9a0', 1.0, 0.45, 1.9, 1.3, RZ + 0.015, 0);
board(['OPEN ALL', 'NIGHT'], '#1a1a1a', '#ffb347', 1.0, 0.6, -5.2, 1.6, RZ + 0.015, 0);
board(['READ AT', 'YOUR PACE'], '#1a1a1a', '#ffb347', 1.0, 0.6, 5.2, 1.6, RZ + 0.015, 0);
// hanging signs over the aisle (readable from both sides)
hangBoard(['SILENCE PLEASE'], '#10243f', '#ffe27a', 1.7, 0.4, 0, 2.3, -62.4);
hangBoard(['READERS AT WORK'], '#3a0f14', '#ffd0c0', 1.7, 0.4, 0, 2.3, -68);
hangBoard(['SHHH! BOOK NOOK'], '#0f2e1f', '#9dffb8', 1.7, 0.4, 0, 2.3, -73.4);
// little table tent cards
[[-2.6, -65, 'SILENCE'], [2.6, -65, 'QUIET'], [-2.6, -71, 'SHHH...'], [2.6, -71, 'READING']].forEach(([cx, cz, txt]) => {
  const c = new T.Mesh(new T.PlaneGeometry(0.2, 0.11), new T.MeshLambertMaterial({map: boardTex([txt], '#f4efe1', '#222', 256, 140), side: T.DoubleSide}));
  c.position.set(cx - 0.1, 0.84, cz + 0.3); scene.add(c); box(0.2, 0.01, 0.05, matLeg, cx - 0.1, 0.78, cz + 0.3);
});
// moonlit windows on the back wall
[-3.8, 3.8].forEach(x => {
  const wn = plane(1.5, 1.3, new T.MeshBasicMaterial({map: winTex, fog: false})); wn.position.set(x, 1.75, RZ + 0.02); scene.add(wn);
  box(1.62, 0.06, 0.08, matLeg, x, 2.43, RZ + 0.04); box(1.62, 0.06, 0.08, matLeg, x, 1.07, RZ + 0.04);
  box(0.06, 1.4, 0.08, matLeg, x - 0.78, 1.75, RZ + 0.04); box(0.06, 1.4, 0.08, matLeg, x + 0.78, 1.75, RZ + 0.04);
  box(0.04, 1.3, 0.06, matLeg, x, 1.75, RZ + 0.04); box(1.5, 0.04, 0.06, matLeg, x, 1.75, RZ + 0.04);
});
// framed posters above the wall shelves (tapes you can inspect)
[-1, 1].forEach(sd => [-63.5, -67, -70.5, -74].forEach(z => {
  const i = (R() * P) | 0, m = new T.Mesh(new T.PlaneGeometry(0.42, 0.7), posterMat[i]);
  m.rotation.y = sd < 0 ? Math.PI / 2 : -Math.PI / 2; m.position.set(sd * (RW - 0.02), 2.6, z); m.userData.tape = TAPES[i]; scene.add(m); heroes.push(m);
}));

/* ---------- neon lights ---------- */
const NEON = {
  rainbow: [0xff2d95, 0x00e5ff, 0xffd23f, 0x39ff88, 0xa855ff, 0xff6a00],
  synthwave: [0xff2d95, 0x4d7cff, 0xff2d95, 0x4d7cff, 0xa855ff, 0x00e5ff],
  sunset: [0xffb347, 0xff7a00, 0xff3d6e, 0xff5a36, 0xffa23a, 0xff2d95],
  ocean: [0x00e5ff, 0x4d7cff, 0x39ff88, 0x00e5ff, 0x7a5cff, 0x4dd0e1]
};
const NEON_NAMES = Object.keys(NEON).concat('off');
const NZ = [-2, -14, -26, -38, -50, -999], NSEG = [[ZF, -2], [-2, -14], [-14, -26], [-26, -38], [-38, -50], [-50, ZB]];
let neonName = 'rainbow', neonOn = true, party = false;
const neonGroup = new T.Group(); scene.add(neonGroup);
const nMats = [], hMats = [], nc = new T.Color();
{
  const nd = new T.Object3D(), geo = new T.BoxGeometry(1, 1, 1);
  NSEG.forEach(([z0, z1], i) => {
    const L = z0 - z1 - 0.3, zc = (z0 + z1) / 2, tubes = [];
    [-(HW - 0.05), HW - 0.05].forEach(x => [2.78, 2.6].forEach(y => tubes.push([x, y, 0.05, 0.05])));
    [-1.8, -0.6, 0.6, 1.8].forEach(x => tubes.push([x, CEIL - 0.03, 0.06, 0.03]));
    [-0.82, 0.82].forEach(x => tubes.push([x, 0.016, 0.05, 0.012]));
    const core = new T.MeshBasicMaterial({color: 0xffffff, fog: false});
    const halo = new T.MeshBasicMaterial({color: 0xffffff, fog: false, transparent: true, opacity: 0.2, blending: T.AdditiveBlending, depthWrite: false});
    const a = new T.InstancedMesh(geo, core, tubes.length), b = new T.InstancedMesh(geo, halo, tubes.length);
    tubes.forEach(([x, y, w, h], k) => {
      nd.position.set(x, y, zc); nd.rotation.set(0, 0, 0); nd.scale.set(w, h, L); nd.updateMatrix(); a.setMatrixAt(k, nd.matrix);
      nd.scale.set(w * 3.4, h * 3.4, L); nd.updateMatrix(); b.setMatrixAt(k, nd.matrix);
    });
    neonGroup.add(a); neonGroup.add(b); nMats.push(core); hMats.push(halo);
  });
}
// coloured neon for the reading room: tubes above the wall shelves, on the ceiling, along the aisle floor and across the back wall, plus coloured lights
const rMats = [], rH = [], rLights = [];
{
  const nd = new T.Object3D(), geo = new T.BoxGeometry(1, 1, 1), L = ZB - RZ - 0.6, zc = (ZB + RZ) / 2;
  [
    [[-(RW - 0.06), 2.18, zc, 0.05, 0.05, L], [RW - 0.06, 2.18, zc, 0.05, 0.05, L]],
    [[-4.5, CEIL - 0.03, zc, 0.06, 0.03, L], [0, CEIL - 0.03, zc, 0.06, 0.03, L], [4.5, CEIL - 0.03, zc, 0.06, 0.03, L]],
    [[-1.35, 0.016, zc, 0.05, 0.012, L], [1.35, 0.016, zc, 0.05, 0.012, L]],
    [[0, 2.9, RZ + 0.05, 11, 0.05, 0.05], [0, 0.12, RZ + 0.05, 11, 0.05, 0.05]]
  ].forEach(tubes => {
    const core = new T.MeshBasicMaterial({color: 0xffffff, fog: false});
    const halo = new T.MeshBasicMaterial({color: 0xffffff, fog: false, transparent: true, opacity: 0.2, blending: T.AdditiveBlending, depthWrite: false});
    const a = new T.InstancedMesh(geo, core, tubes.length), b = new T.InstancedMesh(geo, halo, tubes.length);
    tubes.forEach(([x, y, z, sx, sy, sz], k) => {
      nd.position.set(x, y, z); nd.rotation.set(0, 0, 0); nd.scale.set(sx, sy, sz); nd.updateMatrix(); a.setMatrixAt(k, nd.matrix);
      nd.scale.set(sx < 0.5 ? sx * 3.4 : sx, sy * 3.4, sz < 0.5 ? sz * 3.4 : sz); nd.updateMatrix(); b.setMatrixAt(k, nd.matrix);
    });
    a.frustumCulled = b.frustumCulled = false; neonGroup.add(a); neonGroup.add(b); rMats.push(core); rH.push(halo);
  });
  [[-4.6, 2.2, -65.5], [4.6, 2.2, -72], [0, 1.6, -76.8]].forEach(p => { const l = new T.PointLight(0xffffff, 1.6, 10, 2); l.position.set(p[0], p[1], p[2]); scene.add(l); rLights.push(l); });
}
function neonTex(text, hex, w = 512, h = 128) {
  return tex(w, h, g => {
    const c = '#' + hex.toString(16).padStart(6, '0');
    g.clearRect(0, 0, w, h); let fs = 70; g.font = '800 70px Impact,sans-serif'; const mw = g.measureText(text).width; if (mw > w - 50) { fs = Math.floor(70 * (w - 50) / mw); g.font = '800 ' + fs + 'px Impact,sans-serif'; } g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = c; g.shadowBlur = 30; g.strokeStyle = c; g.lineWidth = 7; g.strokeText(text, w / 2, h / 2);
    g.shadowBlur = 8; g.fillStyle = '#fff'; g.fillText(text, w / 2, h / 2);
  });
}
function neonSign(text, hex, w, h, x, y, z, ry) {
  const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({map: neonTex(text, hex), transparent: true, fog: false, depthWrite: false}));
  m.position.set(x, y, z); m.rotation.y = ry; neonGroup.add(m);
}
neonSign('LIBRARY BOOK STORE', 0xff2d95, 3.2, 0.8, 0, 2.6, ZB + 0.04, 0);
neonSign('READING ROOM', 0x39ff88, 3.2, 0.8, 0, 2.6, ZB - 0.04, Math.PI);
neonSign('QUIET PLEASE', 0xffb347, 3.2, 0.8, 0, 2.2, RZ + 0.04, 0);
neonSign('OPEN 24 HRS', 0x00e5ff, 3.2, 0.8, 0, 2.1, ZF - 0.04, Math.PI);
/* ---------- the street outside: shopfront, sidewalk, road, neighbours, lamps, parked cars, rain ---------- */
const ZE = 24, COL_OUT = [], R2 = () => Math.random();
let rainOn = true, greeted = false;
const streetLight = new T.PointLight(0xffd49a, 1.6, 18, 2); streetLight.position.set(0, 3.4, ZF + 3); scene.add(streetLight);
function brickBg(g, w, h) { g.fillStyle = '#241714'; g.fillRect(0, 0, w, h); for (let r = 0; r < h / 12; r++) for (let c = -1; c < w / 24; c++) { g.fillStyle = `hsl(${8 + R() * 8},${28 + R() * 10}%,${14 + R() * 8}%)`; g.fillRect(c * 24 + (r % 2 ? 12 : 0) + 1, r * 12 + 1, 22, 10); } }
function bldgTex(cols, rows) {
  return tex(512, 256, (g, w, h) => {
    brickBg(g, w, h); const cw = w / cols, rh = h / rows;
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols; c++) {
      const lit = R() < 0.4; g.fillStyle = lit ? `hsl(${38 + R() * 14},90%,${52 + R() * 18}%)` : '#0c1222'; g.fillRect(c * cw + cw * 0.2, r * rh + rh * 0.18, cw * 0.6, rh * 0.52);
      g.fillStyle = '#05060a'; g.fillRect(c * cw + cw * 0.2, r * rh + rh * 0.7, cw * 0.6, 3);
    }
    g.fillStyle = '#0b0c12'; g.fillRect(0, h - rh, w, rh); // dark ground floor
    for (let c = 0; c < cols; c += 2) { g.fillStyle = `hsl(${(R() * 360) | 0},85%,60%)`; g.globalAlpha = 0.55; g.fillRect(c * cw + cw * 0.1, h - rh * 0.75, cw * 1.6, rh * 0.4); g.globalAlpha = 1; }
  });
}
const sideTex = tex(128, 128, (g, w, h) => { g.fillStyle = '#3d3f47'; g.fillRect(0, 0, w, h); g.strokeStyle = '#25262c'; g.lineWidth = 3; g.strokeRect(0, 0, w, h); g.strokeRect(0, 0, w / 2, h / 2); g.strokeRect(w / 2, h / 2, w / 2, h / 2); for (let i = 0; i < 200; i++) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(R() * w, R() * h, 2, 2); } });
const roadTex = tex(128, 128, (g, w, h) => { g.fillStyle = '#18191e'; g.fillRect(0, 0, w, h); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${R() < .5 ? 255 : 0},${R() < .5 ? 255 : 0},255,.05)`; g.fillRect(R() * w, R() * h, 2, 2); } });
const poolTex = tex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const awnTex = tex(128, 32, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f4f1e8' : '#1b2a6b'; g.fillRect(i * 16, 0, 16, h); } });
function glow(color, w, d, x, z, op) { const m = plane(w, d, new T.MeshBasicMaterial({map: poolTex, color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, fog: false})); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.025, z); scene.add(m); }

// sidewalk, curb, road with markings
rectFloor(-40, 40, ZF + 3.55, ZF, sideTex, 1.6);
box(80, 0.14, 0.25, M(0x6a6c74), 0, 0.0, ZF + 3.5);
rectFloor(-40, 40, ZF + 60, ZF + 3.6, roadTex, 4, -0.12);
for (let x = -36; x < 36; x += 5) { const m = plane(2.4, 0.14, new T.MeshBasicMaterial({color: 0xe8c33a})); m.rotation.x = -Math.PI / 2; m.position.set(x, -0.115, ZF + 13); scene.add(m); }
for (let k = -3; k <= 3; k++) { const m = plane(0.55, 3.2, new T.MeshBasicMaterial({color: 0xdcdcdc})); m.rotation.x = -Math.PI / 2; m.position.set(8 + k * 0.95, -0.114, ZF + 5.4); scene.add(m); }

// shopfront skin (outside face): tile bulkheads, pillars, parapet with the big neon sign, striped awning
const matTile = M(0x14204f), matSkin = M(0x1b2a6b);
[[2.5, 0.9, -2.75, 0.45], [2.5, 0.9, 2.75, 0.45], [0.4, 2.4, -1.3, 1.2], [0.4, 2.4, 1.3, 1.2], [8, 0.6, 0, 2.7]].forEach(([w, h, x, y]) => { const m = plane(w, h, matTile); m.position.set(x, y, ZF + 0.02); scene.add(m); });
{ const par = plane(8, 2.4, matSkin); par.position.set(0, 4.2, ZF + 0.02); scene.add(par);
  box(8.4, 0.2, 0.6, matLeg, 0, 5.5, ZF + 0.25); box(8.1, 0.1, 0.35, matLeg, 0, 3.02, ZF + 0.15); box(0.3, 5.4, 0.3, matLeg, -4.1, 2.7, ZF + 0.1); box(0.3, 5.4, 0.3, matLeg, 4.1, 2.7, ZF + 0.1);
  const awn = plane(3.4, 1.5, new T.MeshLambertMaterial({map: awnTex, side: T.DoubleSide})); awn.rotation.x = -(Math.PI / 2 - 0.3); awn.position.set(0, 2.73, ZF + 0.76); scene.add(awn);
  box(3.4, 0.16, 0.03, M(0x1b2a6b), 0, 2.48, ZF + 1.45); }
neonSign('LIBRARY BOOK STORE', 0xff2d95, 5.6, 1.4, 0, 4.3, ZF + 0.06, 0);
neonSign('OPEN', 0xff3355, 1.2, 0.46, -3.35, 4.3, ZF + 0.06, 0);
neonSign('24 HRS', 0x00e5ff, 1.2, 0.46, 3.35, 4.3, ZF + 0.06, 0);
neonSign('OPEN', 0xff3355, 1.3, 0.5, 0, 2.7, ZF + 0.04, 0);
// window decals and tapes on display behind the glass
function decal(lines, color, w, h, x, y) {
  const t = tex(512, Math.round(512 * h / w), (g, W, H) => { g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; const fs = Math.min(H / (lines.length + 0.5), W / (Math.max(...lines.map(l => l.length)) * 0.62)); g.font = '800 ' + fs + 'px Impact,sans-serif'; lines.forEach((l, i) => g.fillText(l, W / 2, H * (i + 1) / (lines.length + 1))); });
  const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({map: t, transparent: true, depthWrite: false})); m.position.set(x, y, ZF + 0.03); m.renderOrder = 3; scene.add(m);
}
decal(['NEW RELEASES'], '#ffd23f', 2.2, 0.35, -2.75, 2.15); decal(['RENT 2 NIGHTS', '$3.99'], '#7dff9a', 2.0, 0.6, 2.75, 2.05);
[-3.45, -2.75, -2.05, 2.05, 2.75, 3.45].forEach((x, k) => { const i = (R() * P) | 0, m = new T.Mesh(new T.PlaneGeometry(0.5, 0.75), posterMatDS[i]); m.position.set(x, 1.3, ZF - 0.2); m.rotation.y = (k % 3 - 1) * 0.18; scene.add(m); });
// doormat
{ const t = tex(256, 128, (g, w, h) => { g.fillStyle = '#5a1620'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e8c27a'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#e8c27a'; g.font = '800 44px Impact,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('WELCOME', w / 2, h / 2 + 2); });
  const m = plane(1.6, 0.8, new T.MeshLambertMaterial({map: t})); m.rotation.x = -Math.PI / 2; m.position.set(0, 0.015, ZF + 0.55); scene.add(m); }
glow(0xff2d95, 9, 5, 0, ZF + 2.6, 0.32); glow(0xffd49a, 3, 3, 0, ZF + 0.9, 0.35);

// neighbouring buildings and the skyline across the street
{
  const dk = M(0x0b0c12), front = (cols, rows) => new T.MeshLambertMaterial({map: bldgTex(cols, rows)});
  [[-16.05, 24, 9], [16.05, 24, 8], [-40.05, 24, 12], [40.05, 24, 13]].forEach(([x, w, hgt], i) => {
    const b = new T.Mesh(new T.BoxGeometry(w, hgt, 14), [dk, dk, dk, dk, front(10, 4), dk]); b.position.set(x, hgt / 2, ZF - 7); scene.add(b);
  });
  [[0, 11, 36, 0], [0, 17, 50, 1]].forEach(([x, hgt, z, k]) => { const m = plane(120, hgt, new T.MeshLambertMaterial({map: bldgTex(8, 4)}), [6, 1]); m.rotation.y = Math.PI; m.position.set(x, hgt / 2, ZF + z); scene.add(m); });
  const moon = new T.Mesh(new T.CircleGeometry(4.5, 32), new T.MeshBasicMaterial({color: 0xf4f1d0, fog: false})); moon.position.set(-16, 34, 75); moon.rotation.y = Math.PI; scene.add(moon);
  const sp = new Float32Array(900); for (let i = 0; i < 300; i++) { const a = R() * 6.283, e = 0.25 + R() * 1.1; sp[i * 3] = Math.cos(a) * 85 * Math.cos(e * 0.8); sp[i * 3 + 1] = 12 + Math.sin(e) * 60; sp[i * 3 + 2] = Math.sin(a) * 85 * Math.cos(e * 0.8); }
  const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
  const stars = new T.Points(sg, new T.PointsMaterial({color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false})); stars.frustumCulled = false; scene.add(stars);
}

// street lamps, bench, bin, return box, parked cars
const lampBulb = new T.MeshBasicMaterial({color: 0xffe2a0, fog: false});
[-8.5, 8.5].forEach(x => {
  cyl(0.05, 0.07, 4.6, matLeg, x, 2.3, ZF + 3.2); box(0.06, 0.06, 0.95, matLeg, x, 4.58, ZF + 3.65); box(0.5, 0.1, 0.34, matLeg, x, 4.52, ZF + 4.05); ball(0.12, lampBulb, x, 4.42, ZF + 4.05);
  const cone = new T.Mesh(new T.CylinderGeometry(0.15, 1.9, 4.3, 18, 1, true), new T.MeshBasicMaterial({color: 0xffd49a, transparent: true, opacity: 0.07, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false})); cone.position.set(x, 2.3, ZF + 4.05); scene.add(cone);
  glow(0xffd49a, 7, 7, x, ZF + 4.05, 0.4); COL_OUT.push([x - 0.2, x + 0.2, ZF + 3.0, ZF + 3.4]);
});
{ const bx = -6.8, bz = ZF + 2.1; box(1.6, 0.06, 0.5, matWood, bx, 0.46, bz); box(1.6, 0.4, 0.05, matWood, bx, 0.72, bz - 0.25); [-0.7, 0.7].forEach(dx => box(0.05, 0.45, 0.45, matLeg, bx + dx, 0.22, bz)); COL_OUT.push([bx - 0.9, bx + 0.9, bz - 0.35, bz + 0.35]); }
{ cyl(0.28, 0.25, 0.9, M(0x2f6b4a), 6.6, 0.45, ZF + 1.4); cyl(0.3, 0.3, 0.06, matLeg, 6.6, 0.92, ZF + 1.4); COL_OUT.push([6.25, 6.95, ZF + 1.05, ZF + 1.75]); }
{ box(0.62, 1.1, 0.46, M(0x1b2a6b), 2.6, 0.55, ZF + 0.55); const m = new T.Mesh(new T.PlaneGeometry(0.5, 0.3), new T.MeshLambertMaterial({map: boardTex(['RETURN', 'TAPES'], '#f4f1e8', '#1b2a6b', 256, 154)})); m.position.set(2.6, 0.8, ZF + 0.79); scene.add(m); COL_OUT.push([2.25, 2.95, ZF + 0.3, ZF + 0.85]); }
function extCar(x, z, color) {
  const body = M(color), glassM = M(0x10151f);
  box(3.9, 0.55, 1.7, body, x, 0.55, z); box(2.1, 0.5, 1.5, glassM, x - 0.1, 1.07, z); box(2.0, 0.06, 1.46, body, x - 0.1, 1.34, z);
  [[-1.2, -0.8], [1.2, -0.8], [-1.2, 0.8], [1.2, 0.8]].forEach(([dx, dz]) => { const w = cyl(0.32, 0.32, 0.22, matTape, x + dx, 0.32, z + dz); w.rotation.x = Math.PI / 2; });
  [-0.6, 0.6].forEach(dz => { box(0.06, 0.14, 0.3, lampBulb, x + 1.96, 0.62, z + dz); box(0.06, 0.12, 0.3, new T.MeshBasicMaterial({color: 0xff2a2a, fog: false}), x - 1.96, 0.62, z + dz); });
  COL_OUT.push([x - 2.0, x + 2.0, z - 0.9, z + 0.9]);
}
extCar(-11, ZF + 6.2, 0x7a1f2a); extCar(11.5, ZF + 6.4, 0x1f4a7a);

// rain (R2 = unseeded random so it never changes the shop's seeded layout)
const RN = 420, rainPos = new Float32Array(RN * 6), rainOff = new Float32Array(RN * 3);
for (let i = 0; i < RN; i++) { rainOff[i * 3] = (R2() - .5) * 26; rainOff[i * 3 + 1] = R2() * 14; rainOff[i * 3 + 2] = (R2() - .5) * 26; }
const rainGeo = new T.BufferGeometry(); rainGeo.setAttribute('position', new T.BufferAttribute(rainPos, 3));
const rain = new T.LineSegments(rainGeo, new T.LineBasicMaterial({color: 0x9db8ff, transparent: true, opacity: 0.35})); rain.frustumCulled = false; scene.add(rain);
function updateRain(dt) {
  rain.visible = rainOn && pos.z > ZF - 1; if (!rain.visible) return;
  for (let i = 0; i < RN; i++) {
    let oy = rainOff[i * 3 + 1] - 16 * dt; if (oy < 0) { oy += 14; rainOff[i * 3] = (R2() - .5) * 26; rainOff[i * 3 + 2] = (R2() - .5) * 26; } rainOff[i * 3 + 1] = oy;
    const x = pos.x + rainOff[i * 3], z = pos.z + rainOff[i * 3 + 2], k = i * 6;
    rainPos[k] = x; rainPos[k + 1] = oy; rainPos[k + 2] = z; rainPos[k + 3] = x; rainPos[k + 4] = oy + 0.35; rainPos[k + 5] = z + 0.02;
  }
  rainGeo.attributes.position.needsUpdate = true;
}
const NL = 'ontouchstart' in window ? 2 : 3, nLights = [];
for (let i = 0; i < NL; i++) { const l = new T.PointLight(0xffffff, 1.5, 12, 2); scene.add(l); nLights.push(l); }
function zoneIdx(z) { for (let i = 0; i < NZ.length; i++) if (z > NZ[i]) return i; return NZ.length - 1; }
function updateNeon(t) {
  neonGroup.visible = neonOn; nLights.forEach(l => l.visible = neonOn); rLights.forEach(l => l.visible = neonOn);
  if (!neonOn) { pendMat.color.setHex(0xffe2a0); return; }
  const pal = NEON[neonName];
  for (let i = 0; i < 6; i++) {
    if (party) nc.setHSL((t * 0.12 + i / 6) % 1, 1, 0.55); else { nc.setHex(pal[i]); nc.multiplyScalar(0.88 + 0.12 * Math.sin(t * 2 + i)); }
    nMats[i].color.copy(nc); hMats[i].color.copy(nc);
  }
  [3, 4, 5, 1].forEach((idx, j) => { rMats[j].color.copy(nMats[idx].color); rH[j].color.copy(nMats[idx].color); });
  rLights.forEach((l, k) => { l.color.copy(nMats[[1, 3, 4][k]].color); l.intensity = party ? 2.2 + 0.8 * Math.sin(t * 6 + k * 2) : 1.7; });
  pendMat.color.copy(nMats[2].color);
  const z = pos.z, zs = [zoneIdx(z), zoneIdx(z + 7), zoneIdx(z - 7)];
  nLights.forEach((l, k) => {
    l.color.copy(nMats[zs[k]].color); l.intensity = (party ? 1.8 + 0.7 * Math.sin(t * 6 + k * 2) : 1.5) * (pos.z < ZB - 0.5 ? 0.8 : 1);
    l.position.set(k === 2 ? pos.x : pos.x * 0.4, k === 2 ? 0.5 : 2.5, z + (k === 0 ? 0 : k === 1 ? 6 : -6));
  });
}
function applyNeon() { applyLight(); }
function cycleNeon() {
  const i = (NEON_NAMES.indexOf(neonOn ? neonName : 'off') + 1) % NEON_NAMES.length, n = NEON_NAMES[i];
  if (n === 'off') neonOn = false; else { neonOn = true; neonName = n; }
  toast('Neon: ' + n);
}
function toggleParty() { party = !party; if (party) neonOn = true; applyLight(); toast('Party lights ' + (party ? 'on' : 'off')); }

/* ---------- controls ---------- */
const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; });
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
let yaw = 0, pitch = 0, tyaw = 0, tpitch = 0, running = false, locked = false, tClock = 0, dragLook = false;
const look = (dx, dy, k = 0.0022) => { if (ui) return; if (held) { hRY += dx * 0.01; hRX = Math.max(-1.2, Math.min(1.2, hRX + dy * 0.01)); return; } k *= sens; tyaw -= dx * k; tpitch = Math.max(-1.3, Math.min(1.3, tpitch - dy * k)); };
document.addEventListener('mousemove', e => { if (locked) look(e.movementX, e.movementY); else if (dragLook && e.buttons) look(e.movementX, e.movementY, 0.004); });
document.addEventListener('pointerlockchange', () => { locked = document.pointerLockElement === renderer.domElement; if (!locked && running && !ui) openUI('set'); });
document.addEventListener('pointerlockerror', () => { dragLook = true; });

let joy = null, lk = null; const jv = {x: 0, y: 0};
addEventListener('touchstart', e => { for (const t of e.changedTouches) {
  if (t.clientX < innerWidth * .45 && !joy) joy = {id: t.identifier, x: t.clientX, y: t.clientY};
  else if (!lk) lk = {id: t.identifier, x: t.clientX, y: t.clientY}; } }, {passive: true});
addEventListener('touchmove', e => { for (const t of e.changedTouches) {
  if (joy && t.identifier === joy.id) { jv.x = Math.max(-1, Math.min(1, (t.clientX - joy.x) / 50)); jv.y = Math.max(-1, Math.min(1, (t.clientY - joy.y) / 50)); }
  if (lk && t.identifier === lk.id) { look(t.clientX - lk.x, t.clientY - lk.y, 0.005); lk.x = t.clientX; lk.y = t.clientY; } } }, {passive: true});
addEventListener('touchend', e => { for (const t of e.changedTouches) {
  if (joy && t.identifier === joy.id) { joy = null; jv.x = jv.y = 0; } if (lk && t.identifier === lk.id) lk = null; } }, {passive: true});

function enter() {
  $('#start').classList.add('gone'); $('#hud').hidden = false; running = true;
  cam.position.set(0, 1.62, 15.5); yaw = tyaw = pitch = tpitch = 0; cam.rotation.set(0, 0, 0);
  setTimeout(() => $('#hint').classList.add('off'), 11000);
  const c = renderer.domElement;
  if (c.requestPointerLock && !('ontouchstart' in window)) { try { const r = c.requestPointerLock(); if (r && r.catch) r.catch(() => { dragLook = true; }); } catch (_) { dragLook = true; } }
  hum();
}
$('#enter').addEventListener('click', enter);

/* ---------- basket, checkout, toggles, minimap ---------- */
const basket = []; let humOn = true;
const toastEl = $('#toast'), basketEl = $('#basket'), mg = $('#map').getContext('2d'), rentBtn = $('#rentbtn');
function toast(s) { blip(/^(Added|Holding|Found)/.test(s) ? 880 : 520); toastEl.textContent = s; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 2000); }
function renderBasket() {
  $('#b-count').textContent = basket.length;
  $('#b-list').innerHTML = basket.length ? basket.map(d => '<li>' + d.t + ' <i>' + d.id + '</i></li>').join('') : '<li class="empty">Empty. Look at a tape, press E</li>';
}
function addTape() {
  if (!running || !tapeEl.classList.contains('show') || !current) return toast('Look at a tape first');
  if (basket.includes(current)) return toast('Already in your basket');
  if (basket.length >= 5) return toast('Basket is full (5 max)');
  basket.push(current); renderBasket(); toast('Added: ' + current.t);
}
renderBasket();
rentBtn.addEventListener('touchstart', e => e.stopPropagation(), {passive: true});
rentBtn.addEventListener('click', () => pickUp());
const addBtn = $('#addbtn'); addBtn.addEventListener('touchstart', e => e.stopPropagation(), {passive: true}); addBtn.addEventListener('click', addTape);
let md = null;
addEventListener('mousedown', e => { md = e.button === 0 ? [e.clientX, e.clientY] : null; });
addEventListener('mouseup', e => {
  const d = md; md = null;
  if (!d || !running || ui || e.button !== 0 || !(locked || dragLook)) return;
  if (Math.hypot(e.clientX - d[0], e.clientY - d[1]) < 5 && !(e.target && e.target.closest && e.target.closest('button'))) pickUp(true);
});
if ('ontouchstart' in window) rentBtn.style.display = 'block';
addEventListener('keydown', e => {
  if (!running || ui) { if (e.code === 'Escape' && ui && ui !== 'shop') closeUI(); return; }
  if (e.code === 'KeyF') { e.preventDefault(); openUI('find'); }
  else if (e.code === 'KeyP') openUI('set');
  else if (e.code === 'KeyK') toggleDark();
  else if (e.code === 'KeyH') openUI('hist');
  else if (e.code === 'KeyN') cycleNeon();
  else if (e.code === 'KeyY') toggleParty();
  else if (e.code === 'KeyI') toggleFans();
  else if (e.code === 'KeyJ') openShop();
  else if (e.code === 'KeyO') toggleRadio();
  else if (e.code === 'KeyG') toggleFav();
  else if (e.code === 'KeyX') openNext();
  else if (e.code === 'KeyZ') openPrev();
  else if (e.code === 'KeyT') cycleTag();
  else if (e.code === 'KeyU') surprise();
  else if (e.code === 'KeyE') pickUp();
  else if (e.code === 'KeyQ') putBack();
  else if (e.code === 'KeyR') addTape();
  else if (e.code === 'KeyL') toggleTorch();
  else if (/^Digit[1-7]$/.test(e.code)) { const n = +e.code.slice(5); if (held && hPage === NPAGES) { if (n <= 5) rate(n); } else jump(n); }
  else if (e.code === 'KeyB') basketEl.classList.toggle('open');
  else if (e.code === 'KeyC') checkout();
  else if (e.code === 'KeyV') { document.body.classList.toggle('vhs'); toast('VHS look ' + (document.body.classList.contains('vhs') ? 'on' : 'off')); }
  else if (e.code === 'KeyM' && window.__hum) { humOn = !humOn; window.__hum.gain.value = humOn ? 0.012 : 0; toast('Store hum ' + (humOn ? 'on' : 'off')); }
});
/* ---------- pick up & inspect a tape ---------- */
let held = null, hObj = null, hRY = 0.3, hRX = 0.05, torchOn = false;
const torch = new T.SpotLight(0xffffff, 0, 20, 0.5, 0.5, 1); cam.add(torch); cam.add(torch.target); torch.target.position.set(0, 0, -1);
const addkEl = document.querySelector('.addk'), isTouch = 'ontouchstart' in window;
function wrap(g, s, x, y, max, lh) { let l = ''; s.split(' ').forEach(wd => { if (l && g.measureText(l + wd).width > max) { g.fillText(l, x, y); y += lh; l = ''; } l += wd + ' '; }); g.fillText(l, x, y); return y + lh; }
function backTex(d) { return tex(240, 400, (g, w, h) => {
  g.fillStyle = '#efe9d8'; g.fillRect(0, 0, w, h); g.fillStyle = d.b; g.fillRect(0, 0, w, 56);
  g.fillStyle = '#fff'; g.font = '800 22px Impact,sans-serif'; g.textAlign = 'left'; g.fillText(d.t, 14, 38);
  g.font = '700 13px sans-serif'; let y = 84;
  [['YEAR', d.year], ['GENRE', d.genre], ['DIRECTOR', d.dir], ['STARRING', d.cast]].forEach(([k, v]) => { g.fillStyle = '#777'; g.fillText(k, 14, y); y += 17; g.fillStyle = '#111'; y = wrap(g, v, 14, y, w - 28, 17) + 8; });
  g.fillStyle = '#111'; for (let i = 0; i < 30; i++) g.fillRect(16 + i * 3.4, h - 80, 1 + (i % 3), 36);
  g.font = '700 11px sans-serif'; g.fillText(d.id, 16, h - 60 + 12); g.fillStyle = '#1b2a6b'; g.fillRect(0, h - 22, w, 22); g.fillStyle = '#ffd23f'; g.textAlign = 'center'; g.fillText('LIBRARY BOOK STORE · READ ON', w / 2, h - 7);
}); }
function spineT(d) { return tex(64, 320, (g, w, h) => {
  g.fillStyle = d.b; g.fillRect(0, 0, w, h); g.fillStyle = d.a; g.fillRect(0, 0, w, 26);
  g.save(); g.translate(w / 2 + 8, h / 2 + 14); g.rotate(-Math.PI / 2); g.fillStyle = '#fff'; g.font = '700 26px Impact,sans-serif'; g.textAlign = 'center'; g.fillText(d.t, 0, 0); g.restore();
}); }
function updateK() {
  addkEl.innerHTML = held ? '<kbd>G</kbd> ♥ FAV &middot; <kbd>R</kbd> ADD TO BASKET · <kbd>E</kbd> PUT BACK &middot; <kbd>X</kbd> OPEN BOOK' : 'PRESS <kbd>E</kbd> TO PICK UP';
  rentBtn.textContent = held ? 'PUT BACK' : 'PICK UP'; addBtn.style.display = favBtn.style.display = openBtn.style.display = held && isTouch ? 'block' : 'none';
  openBtn.textContent = hPage === 0 ? 'OPEN BOOK' : hPage === NPAGES ? 'CLOSE' : 'NEXT PAGE \u25b8'; prevBtn.style.display = held && isTouch && hPage > 0 ? 'block' : 'none'; rateBtn.style.display = held && isTouch && hPage === NPAGES ? 'block' : 'none';
}
let hHinge = null, hPage = 0, hOpen = 0, hWob = 0;
function pickUp(quiet) {
  if (held) return putBack();
  if (!running || !tapeEl.classList.contains('show') || !current) return quiet ? undefined : toast('Look at a tape first');
  held = current;
  const W = 0.103, H = 0.187, edge = new T.MeshBasicMaterial({color: 0xe8e2d0}), dk = new T.MeshBasicMaterial({color: 0x222226}), sp = new T.MeshBasicMaterial({map: spineT(held)});
  const paper = () => tex(240, 400, (g, w, h) => { g.fillStyle = '#efe9d8'; g.fillRect(0, 0, w, h); });
  hPage = 0; hOpen = 0; hObj = new T.Group();
  const body = new T.Mesh(new T.BoxGeometry(W, H, 0.015), [edge, sp, dk, dk, new T.MeshBasicMaterial({map: paper()}), new T.MeshBasicMaterial({map: backTex(held)})]);
  body.position.z = -0.005; hObj.add(body);
  hHinge = new T.Group(); hHinge.position.set(-W / 2, 0, 0.0075);
  const cover = new T.Mesh(new T.BoxGeometry(W, H, 0.01), [dk, dk, dk, dk, new T.MeshBasicMaterial({map: posterTex[TAPES.indexOf(held)]}), new T.MeshBasicMaterial({map: paper()})]);
  cover.position.x = W / 2; hHinge.add(cover); hObj.add(hHinge);
  hObj.scale.setScalar(2.1); hObj.position.set(0, -0.04, -0.55); hRY = 0.3; hRX = 0.05; cam.add(hObj);
  tapeEl.classList.add('show'); updateK();
  const w = tapeEl.offsetWidth || 300, h = tapeEl.offsetHeight || 170;
  if (innerWidth < 700) { tapeEl.style.left = '16px'; tapeEl.style.top = (innerHeight * 0.62) + 'px'; }
  else { tapeEl.style.left = Math.min(innerWidth / 2 + 210, innerWidth - w - 16) + 'px'; tapeEl.style.top = Math.max(60, innerHeight / 2 - h / 2) + 'px'; }
  toast('Holding ' + held.t + ' \u00b7 X opens it like a book');
}
function putBack() {
  if (!held) return;
  const keep = posterTex[TAPES.indexOf(held)]; cam.remove(hObj);
  hObj.traverse(o => { if (o.isMesh) { o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map && m.map !== keep) m.map.dispose(); m.dispose(); }); } });
  hObj = hHinge = null; held = null; hPage = 0; hOpen = 0;
  tapeEl.classList.remove('show'); updateK(); toast('Put back on the shelf');
}
function toggleTorch() { torchOn = !torchOn; torch.intensity = torchOn ? 2.5 : 0; toast('Torch ' + (torchOn ? 'on' : 'off')); }
function jump(n) {
  const zs = [3, -8, -20, -32, -44, -55, -63]; pos.x = 0; pos.z = zs[n - 1]; yaw = tyaw = 0; pitch = tpitch = 0; vel.set(0, 0); toast(ZONES[n - 1][1]);
}
/* ---------- interface panels, finder, settings, receipt, sound ---------- */
const S = id => document.getElementById(id);
let flicker = false, ui = null, sens = 1, fovAdd = 0, bri = 1, dark = false, ac = null;
const hdgEl = S('hdg');
function blip(f = 660, d = 0.08) {
  if (!humOn) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.value = 0.03;
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
  } catch (_) {}
}
function openUI(name) {
  if (!running) return;
  putBack(); ui = name; S('ui').hidden = false;
  ['find', 'set', 'rec', 'hist'].forEach(n => S('p-' + n).hidden = n !== name);
  if (document.exitPointerLock) document.exitPointerLock();
  if (name === 'hist') renderRentals();
  if (name === 'find') { S('q').value = ''; renderFind(''); setTimeout(() => S('q').focus(), 30); }
}
function closeUI() {
  ui = null; S('ui').hidden = true; if (document.activeElement) document.activeElement.blur();
  try { if (!isTouch && !dragLook) renderer.domElement.requestPointerLock(); } catch (_) {}
}
document.querySelectorAll('#ui .x').forEach(b => b.onclick = closeUI);
function applyLight() { streetLight.intensity = dark ? 0.2 : 1.6 * bri; hemi.intensity = dark ? 0.1 : 1.3 * bri * (party ? 0.55 : 1); lamp.intensity = dark ? 0.15 : 1.6 * bri * (party ? 0.6 : 1); readLight.intensity = dark ? 0.1 : 1.3 * bri * (party ? 0.6 : 1); }
function toggleDark() { dark = !dark; applyLight(); if (dark && !torchOn) toggleTorch(); toast('Lights ' + (dark ? 'out. Use your torch' : 'on')); }
function toggleFlicker() { flicker = !flicker; toast('Light flicker ' + (flicker ? 'on' : 'off')); }
function toggleVhs() { document.body.classList.toggle('vhs'); toast('VHS look ' + (document.body.classList.contains('vhs') ? 'on' : 'off')); }
function toggleHum() { if (!window.__hum) return; humOn = !humOn; window.__hum.gain.value = humOn ? 0.012 : 0; toast('Store hum ' + (humOn ? 'on' : 'off')); }
S('s-bri').oninput = e => { bri = +e.target.value; applyLight(); };
S('s-sens').oninput = e => { sens = +e.target.value; };
S('s-fov').oninput = e => { fovAdd = +e.target.value; resize(); };
S('p-set').querySelectorAll('[data-a]').forEach(b => b.onclick = () => { const a = b.dataset.a; if (a === 'vhs') toggleVhs(); else if (a === 'torch') toggleTorch(); else if (a === 'dark') toggleDark(); else if (a === 'flick') toggleFlicker(); else if (a === 'find') openUI('find'); else if (a === 'basket') { closeUI(); basketEl.classList.toggle('open'); } else if (a === 'out') checkout(); else if (a === 'hist') openUI('hist'); else if (a === 'rand') surprise(); else if (a === 'neon') cycleNeon(); else if (a === 'party') toggleParty(); else if (a === 'radio') toggleRadio(); else if (a === 'shop') { closeUI(); openShop(); } else if (a === 'rain') { rainOn = !rainOn; toast('Rain ' + (rainOn ? 'on' : 'off')); } else if (a === 'reset') resetData(); else toggleHum(); });

S('menubtn').addEventListener('touchstart', e => e.stopPropagation(), {passive: true});
S('menubtn').addEventListener('click', () => openUI('set'));
/* ---------- rentals history, discovery, touch controls ---------- */
let rentals = [];
try { rentals = JSON.parse(localStorage.getItem('mv_rentals') || '[]'); } catch (_) {}
function saveRentals() { try { localStorage.setItem('mv_rentals', JSON.stringify(rentals.slice(-30))); } catch (_) {} }
function renderRentals() {
  S('h-stats').textContent = 'Seen ' + seen.size + '/' + TAPES.length + ' \u00b7 Booklets read ' + readSet.size + '/' + TAPES.length + ' \u00b7 Favourites ' + favs.size + ' \u00b7 Rented ' + rentals.length + ' \u00b7 Rated ' + Object.values(ratings).filter(o => o.r).length;
  S('h-fav').textContent = favs.size ? '\u2665 Favourites: ' + TAPES.filter(d => favs.has(d.id)).map(d => d.t).join(', ') : 'No favourites yet. Pick up a tape and press G.';
  S('h-list').innerHTML = rentals.length ? rentals.map((r, i) => '<li><span><b>' + r.t + '</b><br><small>due ' + r.due + '</small></span><button data-i="' + i + '">Return</button></li>').join('') : '<li>No tapes rented yet</li>';
}
S('h-list').onclick = e => {
  const b = e.target.closest('button[data-i]'); if (!b) return;
  const r = rentals.splice(+b.dataset.i, 1)[0]; saveRentals(); renderRentals(); toast('Returned: ' + r.t + '. Thanks!');
};
const seen = new Set();
try { JSON.parse(localStorage.getItem('mv_seen') || '[]').forEach(i => seen.add(i)); } catch (_) {}
function markSeen(d) {
  if (seen.has(d.id)) return; seen.add(d.id);
  try { localStorage.setItem('mv_seen', JSON.stringify([...seen])); } catch (_) {}
  toast(seen.size >= TAPES.length ? 'Collector! You found every tape' : 'New tape discovered: ' + d.t + ' (' + seen.size + '/' + TAPES.length + ')');
}
function surprise() { findTape((Math.random() * TAPES.length) | 0); }
S('p-set').querySelectorAll('[data-j]').forEach(b => b.onclick = () => { closeUI(); jump(+b.dataset.j); });

if (isTouch) document.body.classList.add('touch');
const tmap = {
  find: () => openUI('find'), basket: () => basketEl.classList.toggle('open'), torch: () => toggleTorch(), menu: () => openUI('set'),
  sprint: b => { keys.ShiftLeft = !keys.ShiftLeft; b.classList.toggle('on', !!keys.ShiftLeft); }
};
document.querySelectorAll('#tbar button').forEach(b => {
  b.addEventListener('touchstart', e => e.stopPropagation(), {passive: true});
  b.addEventListener('click', () => tmap[b.dataset.t](b));
});
const stickEl = S('stick'), knobEl = S('knob'); let sj = null, tp = null;
addEventListener('touchstart', e => { for (const t of e.changedTouches) {
  if (t.clientX < innerWidth * .45) { if (!sj && !ui) { sj = {id: t.identifier, x: t.clientX, y: t.clientY}; stickEl.style.left = t.clientX + 'px'; stickEl.style.top = t.clientY + 'px'; knobEl.style.transform = 'none'; stickEl.hidden = false; } }
  else if (!tp) tp = {id: t.identifier, x: t.clientX, y: t.clientY, t: Date.now()};
} }, {passive: true});
addEventListener('touchmove', e => { for (const t of e.changedTouches) if (sj && t.identifier === sj.id) {
  const dx = Math.max(-50, Math.min(50, t.clientX - sj.x)), dy = Math.max(-50, Math.min(50, t.clientY - sj.y));
  knobEl.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
} }, {passive: true});
addEventListener('touchend', e => { for (const t of e.changedTouches) {
  if (sj && t.identifier === sj.id) { sj = null; stickEl.hidden = true; }
  if (tp && t.identifier === tp.id) {
    const ok = running && !ui && !held && Date.now() - tp.t < 350 && Math.hypot(t.clientX - tp.x, t.clientY - tp.y) < 12; tp = null;
    if (ok) pickUp(true);
  }
} }, {passive: true});

/* ---------- radio and favourites ---------- */
let radioT = null, radioStep = 0;
const CHORDS = [[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7], [164.8, 207.7, 246.9]];
function note(f, d = 0.7, type = 'triangle', v = 0.035) {
  if (!humOn) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; g.gain.value = v;
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
  } catch (_) {}
}
function toggleRadio() {
  if (radioT) { clearInterval(radioT); radioT = null; return toast('Radio off'); }
  radioT = setInterval(() => {
    const ch = CHORDS[(radioStep >> 3) % 4]; note(ch[radioStep % 3] * (radioStep % 8 > 3 ? 2 : 1));
    if (radioStep % 8 === 0) note(ch[0] / 2, 1.2, 'sine', 0.05);
    radioStep++;
  }, 340);
  toast('Radio on');
}
const favs = new Set();
try { JSON.parse(localStorage.getItem('mv_favs') || '[]').forEach(i => favs.add(i)); } catch (_) {}
const favBtn = S('favbtn');
favBtn.addEventListener('touchstart', e => e.stopPropagation(), {passive: true});
favBtn.addEventListener('click', () => toggleFav());
function toggleFav() {
  if (!held) return toast('Pick up a tape first (E), then press G');
  if (favs.has(held.id)) { favs.delete(held.id); toast('Removed from favourites: ' + held.t); } else { favs.add(held.id); toast('\u2665 Added: ' + held.t); }
  try { localStorage.setItem('mv_favs', JSON.stringify([...favs])); } catch (_) {}
}

/* ---------- open the case like a book ---------- */
const readSet = new Set();
try { JSON.parse(localStorage.getItem('mv_read') || '[]').forEach(i => readSet.add(i)); } catch (_) {}
function hashOf(s) { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function pickOf(h, arr, k) { return arr[(h >> k) % arr.length]; }
function plotOf(d) {
  const h = hashOf(d.id + d.t);
  return pickOf(h, ['On a rainy night in a sleepy town', 'Just before closing time', 'With one week left on the clock', 'When the power fails across the city', 'After a mysterious package arrives'], 1) + ', ' +
    pickOf(h, ['an unlikely duo uncovers a secret', 'a lonely clerk finds a tape that should never be played', 'two rivals are forced to work together', 'a stranger with no past knocks on the door', 'an old promise finally comes due'], 4) + '. ' +
    pickOf(h, ['Nothing stays hidden for long.', 'Every rewind changes the ending.', 'Trust is the first thing to go.', 'The night is only getting started.', 'The truth is stranger than the tape.'], 7);
}
function drawPageTex(t, title, rows, d, num) {
  const c = t.image, g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = '#efe9d8'; g.fillRect(0, 0, w, h); g.fillStyle = d.b; g.fillRect(0, 0, w, 46);
  g.fillStyle = '#fff'; g.font = '800 20px Impact,sans-serif'; g.textAlign = 'left'; g.fillText(title, 14, 31);
  let y = 74;
  rows.forEach(r => {
    if (Array.isArray(r)) { g.fillStyle = '#777'; g.font = '700 12px sans-serif'; g.fillText(r[0], 14, y); y += 17; g.fillStyle = '#111'; g.font = '600 15px sans-serif'; y = wrap(g, r[1], 14, y, w - 28, 19) + 8; }
    else { g.fillStyle = '#111'; g.font = '600 15px sans-serif'; y = wrap(g, r, 14, y, w - 28, 19) + 8; }
  });
  g.fillStyle = '#999'; g.font = '11px sans-serif'; g.textAlign = 'center'; g.fillText(num, w / 2, h - 10); t.needsUpdate = true;
}
const NPAGES = 6, TAGS = ['', 'Watch later', 'Loved it', 'Skip it', 'Share with friends'], ratings = {};
try { Object.assign(ratings, JSON.parse(localStorage.getItem('mv_rate') || '{}')); } catch (_) {}
function saveRatings() { try { localStorage.setItem('mv_rate', JSON.stringify(ratings)); } catch (_) {} }
function rate(n) { if (!held) return; (ratings[held.id] = ratings[held.id] || {r: 0, tag: ''}).r = n; saveRatings(); toast('Rated ' + held.t + ' ' + n + '/5'); if (hPage === NPAGES) setPage(hPage); }
function cycleTag() {
  if (!held) return toast('Pick up a tape first (E)');
  const o = ratings[held.id] = ratings[held.id] || {r: 0, tag: ''}; o.tag = TAGS[(TAGS.indexOf(o.tag) + 1) % TAGS.length]; saveRatings(); toast('Tag: ' + (o.tag || 'none'));
  if (hPage === NPAGES) setPage(hPage);
}
function setPage(p) {
  hPage = p; hWob = 1; tapeEl.classList.toggle('show', p === 0);
  if (p > 0) {
    const d = held, h = hashOf(d.id + d.t), L = hHinge.children[0].material[5].map, R = hObj.children[0].material[4].map, stars = n => '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);
    const rated = ['G', 'PG', 'PG-13', 'R'][h % 4], mins = 84 + (h % 50), mine = rentals.filter(r => r.t === d.t).length, my = ratings[d.id] || {r: 0, tag: ''};
    const W1 = ['Neon', 'Static', 'Rewind', 'Tracking', 'Velvet', 'Chrome', 'Echo', 'Highway'], W2 = ['Nights', 'Dreams', 'Signal', 'Lights', 'Drive', 'Fade', 'Hours', 'Motel'];
    const similar = TAPES.filter(x => x !== d).sort((x, y) => (y.genre === d.genre) - (x.genre === d.genre) || hashOf(x.id + d.id) - hashOf(y.id + d.id)).slice(0, 3).map(x => x.t).join(', ');
    const spreads = [
      [['SYNOPSIS', [d.s || plotOf(d)]], ['CAST & CREW', [['DIRECTOR', d.dir], ['STARRING', d.cast]]]],
      [['DETAILS', [['YEAR', d.year], ['GENRE', d.genre], ['RUNTIME', mins + ' min'], ['RATED', rated], ['TAPE NO.', d.id]]],
       ['STAFF REVIEWS', [[stars(3 + (h % 3)), pickOf(h, ['A rewind-worthy ride.', 'Better with the lights off.', 'Pure Friday night energy.'], 2)], [stars(3 + ((h >> 3) % 3)), pickOf(h, ['Classic shelf material.', 'Worth the late fee.', 'Our clerks keep renting it.'], 5)]]]],
      [['YOUR NOTES', [['FAVOURITE', favs.has(d.id) ? '\u2665 Yes' : 'Not yet (press G)'], ['IN BASKET', basket.includes(d) ? 'Yes' : 'No'], ['RENTED BY YOU', mine + ' time' + (mine === 1 ? '' : 's')]]],
       ['TRIVIA', [pickOf(h, ['Rewound ' + (900 + h % 400) + ' times in this very store.', 'The cover was designed in one night.', 'Staff vote this a late-night favourite.'], 3), pickOf(h, ['Best watched at midnight.', 'Always rewind before returning.', 'Rated by ' + (40 + h % 60) + ' regulars.'], 6)]]],
      [['BEHIND THE SCENES', [['SHOT IN', pickOf(h, ['18 nights', '12 days', 'a single week', 'a converted warehouse'], 2)], ['BUDGET', '$' + (1 + h % 9) + '00,000'], ['FUN FACT', pickOf(h, ['The lead did their own stunts.', 'Half of it was shot after midnight.', 'The score was recorded in one take.'], 4)]]],
       ['SOUNDTRACK', [['TRACK 1', W1[h % 8] + ' ' + W2[(h >> 3) % 8]], ['TRACK 2', W1[(h >> 5) % 8] + ' ' + W2[(h >> 7) % 8]], ['TRACK 3', W1[(h >> 9) % 8] + ' ' + W2[(h >> 2) % 8]], ['COMPOSER', String(d.dir).split(' ')[0] + ' & the Rewinders']]]],
      [['SIMILAR TAPES', [['YOU MAY ALSO LIKE', similar], 'Press F to find them on the shelves.']],
       ['RENTAL GUIDE', [['PRICE', '$3.99 for 2 days'], ['LATE FEE', '$1.00 per day'], ['TIP', pickOf(h, ['Rewind before you return it.', 'Keep it away from magnets.', 'Best on a rainy night.'], 6)]]]],
      [['MY RATING', [['YOUR RATING', my.r ? stars(my.r) : 'Not rated yet'], 'Press 1 to 5, or tap RATE.']],
       ['MY TAG', [['TAG', my.tag || 'None yet'], 'Press T to change the tag.']]]
    ][p - 1], num = 'PAGE ' + p + ' / ' + NPAGES;
    drawPageTex(L, spreads[0][0], spreads[0][1], d, num); drawPageTex(R, spreads[1][0], spreads[1][1], d, num);
    if (p === NPAGES && !readSet.has(d.id)) { readSet.add(d.id); try { localStorage.setItem('mv_read', JSON.stringify([...readSet])); } catch (_) {} toast('Booklet read: ' + d.t + ' (' + readSet.size + '/' + TAPES.length + ')'); }
  }
  updateK();
}
function openNext() { if (!held) return toast('Pick up a tape first (E), then press X to open it'); setPage((hPage + 1) % (NPAGES + 1)); blip(700, 0.05); }
function openPrev() { if (!held) return toast('Pick up a tape first (E)'); if (!hPage) return toast('Already closed'); setPage(hPage - 1); blip(600, 0.05); }
const openBtn = S('openbtn'), prevBtn = S('prevbtn'), rateBtn = S('ratebtn');
rateBtn.addEventListener('touchstart', e => e.stopPropagation(), {passive: true});
rateBtn.addEventListener('click', () => { if (held) rate((((ratings[held.id] || {}).r || 0) % 5) + 1); });
[[openBtn, openNext], [prevBtn, openPrev]].forEach(([b, f]) => { b.addEventListener('touchstart', e => e.stopPropagation(), {passive: true}); b.addEventListener('click', () => f()); });

let fMode = 'all';
const todayIdx = hashOf(new Date().toDateString()) % TAPES.length;
function renderFind(q) {
  q = (q || '').toLowerCase();
  const list = TAPES.filter(d => (d.t + ' ' + d.genre + ' ' + d.cast + ' ' + d.dir + ' ' + d.year + (favs.has(d.id) ? ' fav favourite' : '') + ' ' + (d.s || '')).toLowerCase().includes(q) &&
    (fMode === 'all' || (fMode === 'fav' && favs.has(d.id)) || (fMode === 'unseen' && !seen.has(d.id)) || (fMode === 'unread' && !readSet.has(d.id))));
  S('r').innerHTML = list.map(d => { const rt = (ratings[d.id] || {}).r; return '<li data-i="' + TAPES.indexOf(d) + '"><b>' + (favs.has(d.id) ? '\u2665 ' : '') + d.t + '</b><span>' + d.genre + ' \u00b7 ' + d.year.split(' ')[0] + (rt ? ' \u00b7 \u2605' + rt : '') + '</span><em>' + (d.s || '') + '</em></li>'; }).join('') || '<li>No match</li>';
  document.querySelectorAll('#chips button').forEach(b => b.classList.toggle('on', b.dataset.f === fMode));
}
document.querySelectorAll('#chips button').forEach(b => b.onclick = () => { if (b.dataset.f === 'totd') return findTape(todayIdx); fMode = b.dataset.f; renderFind(S('q').value); });
let resetAt = 0;
function resetData() {
  if (Date.now() - resetAt > 4000) { resetAt = Date.now(); return toast('Press Reset again to clear saved progress'); }
  resetAt = 0; ['mv_rentals', 'mv_seen', 'mv_favs', 'mv_read', 'mv_rate'].forEach(k => { try { localStorage.removeItem(k); } catch (_) {} });
  rentals.length = 0; seen.clear(); favs.clear(); readSet.clear(); Object.keys(ratings).forEach(k => delete ratings[k]); toast('Saved progress cleared');
}
S('q').oninput = e => renderFind(e.target.value);
S('q').onkeydown = e => { if (e.key === 'Enter') { const li = S('r').querySelector('li[data-i]'); if (li) findTape(+li.dataset.i); } };
S('r').onclick = e => { const li = e.target.closest('li[data-i]'); if (li) findTape(+li.dataset.i); };
function findTape(i) {
  const arr = covers[i]; closeUI();
  if (!arr.length) return toast('No copy of that tape on the shelves');
  let best = arr[0]; arr.forEach(v => { if (Math.abs(v[2] - pos.z) < Math.abs(best[2] - pos.z)) best = v; });
  const room = best[2] < ZB - 0.5;
  if (room) pos.z = best[2]; else if (pos.z < ZB + 1) pos.z = ZB + 1.5;
  const x = room ? Math.sign(best[0]) * 4.4 : Math.abs(best[0]) < 1 ? 0 : Math.sign(best[0]) * 2.5, dx = best[0] - x, dz = best[2] - pos.z;
  pos.x = x; vel.set(0, 0); yaw = tyaw = Math.atan2(-dx, -dz);
  pitch = tpitch = Math.max(-1.3, Math.min(1.3, Math.atan2(best[1] - 1.62, Math.hypot(dx, dz))));
  toast('Found: ' + TAPES[i].t + '. Look at the cover');
}
function checkout() {
  if (!basket.length) return toast('Your basket is empty');
  const n = basket.length, due = new Date(Date.now() + 2 * 864e5).toDateString();
  basket.forEach(d => rentals.push({t: d.t, due})); saveRentals();
  S('rc-list').innerHTML = basket.map(d => '<li>' + d.t + '<span>$3.99</span></li>').join('');
  S('rc-tot').textContent = '$' + (n * 3.99).toFixed(2); S('rc-due').textContent = due;
  S('rc-no').textContent = 'No. ' + (1000 + ((Math.random() * 9000) | 0));
  basket.length = 0; renderBasket(); openUI('rec');
}

function drawMap() {
  const k = 3, w = 44, h = 262, cx = w / 2; mg.clearRect(0, 0, w, h);
  mg.fillStyle = 'rgba(255,255,255,.3)'; mg.fillRect(cx - HW * k - 1, 0, 1.5, (ZF - ZB) * k); mg.fillRect(cx + HW * k - 0.5, 0, 1.5, (ZF - ZB) * k);
  mg.strokeStyle = 'rgba(255,200,120,.45)'; mg.lineWidth = 1.5; mg.strokeRect(cx - RW * k, (ZF - ZB) * k, RW * 2 * k, (ZB - RZ) * k);
  mg.fillStyle = 'rgba(255,255,255,.22)';
  ISL.forEach(([a, b]) => [[-1.52, -.88], [.88, 1.52]].forEach(([x0, x1]) => mg.fillRect(cx + x0 * k, (ZF - b) * k, (x1 - x0) * k, (b - a) * k)));
  mg.fillStyle = 'rgba(255,200,120,.3)'; COL.forEach(([x0, x1, a, b]) => mg.fillRect(cx + x0 * k, (ZF - b) * k, (x1 - x0) * k, (b - a) * k));
  const px = cx + pos.x * k, py = (ZF - pos.z) * k;
  mg.fillStyle = mg.strokeStyle = '#ffd23f'; mg.beginPath(); mg.arc(px, py, 3, 0, 7); mg.fill();
  mg.beginPath(); mg.moveTo(px, py); mg.lineTo(px - Math.sin(yaw) * 9, py + Math.cos(yaw) * 9); mg.stroke();
  const a = (((-yaw * 180 / Math.PI) % 360) + 360) % 360; hdgEl.textContent = 'FACING ' + ['BACK', 'RIGHT', 'FRONT', 'LEFT'][Math.round(a / 90) % 4] + ' · SEEN ' + seen.size + '/' + TAPES.length;
}
addEventListener('keydown', e => { if (!running && (e.code === 'Enter' || e.code === 'Space')) enter(); });
renderer.domElement.addEventListener('click', () => { if (running && !locked && !dragLook && renderer.domElement.requestPointerLock) renderer.domElement.requestPointerLock(); });

/* fluorescent hum */
function hum() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)(), g = a.createGain(); g.gain.value = 0.012; window.__hum = g; g.connect(a.destination);
    [60, 120, 180].forEach((f, i) => { const o = a.createOscillator(); o.type = i ? 'sine' : 'sawtooth'; o.frequency.value = f; const og = a.createGain(); og.gain.value = i ? .4 : .25; o.connect(og); og.connect(g); o.start(); });
  } catch (_) {}
}

/* ---------- movement & collision ---------- */
const pos = cam.position, vel = new T.Vector2(); const RAD = 0.3;
function blocked(x, z) {
  if (z > ZF + 0.6) { // the street outside
    if (Math.abs(x) > 18 || z > 24) return true;
    for (const [x0, x1, a, b] of COL_OUT) if (x > x0 - RAD && x < x1 + RAD && z > a - RAD && z < b + RAD) return true;
    return false;
  }
  if (z > ZF - 0.5) return Math.abs(x) > 0.8; // front doorway
  if (z < ZB - 0.6) { // reading room
    if (Math.abs(x) > RW - 0.75 || z < RZ + 0.6) return true;
    for (const [x0, x1, a, b] of COL) if (x > x0 - RAD && x < x1 + RAD && z > a - RAD && z < b + RAD) return true;
    return false;
  }
  if (z < ZB + 0.6) return Math.abs(x) > 0.7; // doorway
  if (Math.abs(x) > HW - 0.75) return true;
  const ax = Math.abs(x);
  if (ax > 0.88 - RAD && ax < 1.52 + RAD) for (const [a, b] of ISL) if (z > a - RAD && z < b + RAD) return true;
  return false;
}
const ZONES = [[-2, 'NEW RELEASES · 0-9'], [-14, 'ACTION · A-C'], [-26, 'COMEDY · D-H'], [-38, 'DRAMA · I-M'], [-50, 'THRILLER · N-R'], [-60, 'HORROR · S-Z'], [-999, 'READING ROOM · QUIET PLEASE']];
const zoneEl = $('#zone'), clockEl = $('#clock'); let lastZone = '';

/* ---------- targeting ---------- */
const ray = new T.Raycaster(); ray.far = 6.5; const ctr = new T.Vector2(0, 0);
const tapeEl = $('#tape'), dotEl = $('#dot'), dofEl = $('#dof'); let frame = 0, current = null; const f = {};
['id', 'title', 'rent', 'year', 'genre', 'dir', 'cast', 'plot'].forEach(k => f[k] = $('#t-' + k));
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
function show(d) {
  markSeen(d);
  if (current !== d) {
    current = d; f.id.textContent = d.id; f.title.textContent = d.t; f.year.textContent = d.year; f.genre.textContent = d.genre; f.dir.textContent = d.dir; f.cast.textContent = d.cast; f.plot.textContent = d.s || '';
    const dt = new Date(2026, 0, 1 + d.h); f.rent.textContent = String(dt.getDate()).padStart(2, '0') + ' ' + MON[dt.getMonth()] + ' ' + dt.getFullYear();
  }
}
const v3 = new T.Vector3();
function target() {
  ray.setFromCamera(ctr, cam);
  const hit = ray.intersectObjects(heroes, false)[0];
  if (hit && hit.object.userData.tape) {
    show(hit.object.userData.tape);
    v3.copy(hit.point).project(cam);
    let sx = (v3.x * .5 + .5) * innerWidth + 46, sy = (-v3.y * .5 + .5) * innerHeight - 40;
    const w = tapeEl.offsetWidth || 300, h = tapeEl.offsetHeight || 160;
    sx = Math.min(sx, innerWidth - w - 16); sy = Math.max(60, Math.min(sy, innerHeight - h - 16));
    tapeEl.style.left = sx + 'px'; tapeEl.style.top = sy + 'px';
    tapeEl.classList.add('show'); dotEl.classList.add('on'); dofEl.classList.add('focus');
  } else { tapeEl.classList.remove('show'); dotEl.classList.remove('on'); dofEl.classList.remove('focus'); }
}

/* ---------- loop ---------- */
function resize() { renderer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.fov = (innerWidth < innerHeight ? 90 : 78) + fovAdd; cam.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
const clock = new T.Clock(); let bob = 0;
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  if (running && !ui) {
    let fx = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0) + jv.x;
    let fz = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - jv.y;
    const n = Math.hypot(fx, fz); if (n > 1) { fx /= n; fz /= n; }
    const sp = (keys.ShiftLeft || keys.ShiftRight ? 4.2 : 2.1);
    vel.x += (fx * sp - vel.x) * Math.min(1, dt * 9); vel.y += (fz * sp - vel.y) * Math.min(1, dt * 9);
    const s = Math.sin(yaw), c = Math.cos(yaw);
    const dx = (vel.x * c - vel.y * s) * dt, dz = (-vel.x * s - vel.y * c) * dt;
    if (!blocked(pos.x + dx, pos.z)) pos.x += dx; else vel.x *= .3;
    if (!blocked(pos.x, pos.z + dz)) pos.z += dz; else vel.y *= .3;
    const mv = Math.min(1, vel.length() / 2.1); bob += vel.length() * dt * 2.2;
    yaw += (tyaw - yaw) * Math.min(1, dt * 14); pitch += (tpitch - pitch) * Math.min(1, dt * 14);
    cam.position.y = 1.62 + Math.sin(bob * 2) * 0.022 * mv;
    cam.rotation.set(pitch, yaw, 0);
    tClock += dt; const s2 = tClock | 0;
    clockEl.textContent = 'SP ' + ((s2 / 3600) | 0) + ':' + String(((s2 / 60) | 0) % 60).padStart(2, '0') + ':' + String(s2 % 60).padStart(2, '0');
    const z = pos.z > ZF - 0.2 ? 'OUTSIDE \u00b7 THE STREET' : ZONES.find(zz => pos.z > zz[0])[1];
    if (!greeted && pos.z < ZF - 0.8) { greeted = true; const hn = $('#hint'); hn.innerHTML = 'Welcome in. Press <kbd>F</kbd> to find a tape &middot; <kbd>P</kbd> for settings'; hn.classList.remove('off'); setTimeout(() => hn.classList.add('off'), 8000); } if (z !== lastZone) { zoneEl.textContent = z; lastZone = z; }
    if ((frame++ & 1) === 0) { if (!held) target(); drawMap(); }
  } else if (!running) { cam.position.x = Math.sin(t * .15) * 3; cam.position.y = 1.62; cam.rotation.set(0.02, -cam.position.x / 13, 0); }
  updateRain(dt);
  lamp.position.set(pos.x, 2.4, pos.z + .5);
  updateNeon(t);
  fanSpeed += ((fansOn ? 7 : 0) - fanSpeed) * Math.min(1, dt * 1.2); fans.forEach((f, i) => f.rotation.y += dt * fanSpeed * (i % 2 ? -1 : 1));
  if (hObj) {
    hOpen += ((hPage > 0 ? 1 : 0) - hOpen) * Math.min(1, dt * 7);
    const vh = 2 * Math.tan(cam.fov * Math.PI / 360) * 0.5, sOpen = Math.min(3.4, vh * cam.aspect * 0.92 / 0.206), sc = 2.1 + (sOpen - 2.1) * hOpen, k = 1 - hOpen;
    hWob = Math.max(0, hWob - dt * 3); hObj.scale.setScalar(sc); hObj.rotation.set(hRX * k, (hRY + Math.sin(t * 1.2) * 0.12) * k, Math.sin(t * 40) * 0.04 * hWob);
    hObj.position.set(0.0515 * sc * hOpen, -0.04 + Math.sin(bob * 2) * 0.01 * k, -0.55 + 0.05 * hOpen);
    hHinge.rotation.y = -hOpen * 2.85;
  }
  window.__flick.color.setScalar(flicker && Math.random() < 0.004 ? 0.35 : 1);
  renderer.render(scene, cam);
  requestAnimationFrame(tick);
}
/* ---------- first screen: the library shop interface ---------- */
const shopEl = S('shop'), shGrid = S('sh-grid'), shChips = S('sh-chips'), shQ = S('sh-q'), shCart = S('sh-cart');
let shFilter = 'all', shHome = true; // shHome: still on the first screen (not walked in yet)
const genreCount = {}; TAPES.forEach(d => d.genre.split(' \u00b7 ').forEach(g => genreCount[g] = (genreCount[g] || 0) + 1));
const shGenres = Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a] || a.localeCompare(b)).slice(0, 10);
function mk(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
function shopChips() {
  shChips.innerHTML = '';
  [['all', 'All'], ['fav', '\u2665 Favourites'], ['inb', 'In basket']].concat(shGenres.map(g => [g, g[0] + g.slice(1).toLowerCase()])).forEach(([k, label]) => {
    const b = mk('button', k === shFilter ? 'on' : '', label); b.onclick = () => { shFilter = k; shopChips(); shopGrid(); }; shChips.appendChild(b);
  });
}
function shopMatch(d, q) { return !q || (d.t + ' ' + d.genre + ' ' + d.cast + ' ' + d.dir + ' ' + d.year + ' ' + d.s).toLowerCase().includes(q); }
function shopGrid() {
  const q = shQ.value.trim().toLowerCase(); shGrid.innerHTML = '';
  const list = TAPES.filter(d => shopMatch(d, q) && (shFilter === 'all' || (shFilter === 'fav' ? favs.has(d.id) : shFilter === 'inb' ? basket.includes(d) : d.genre.split(' \u00b7 ').includes(shFilter))));
  S('sh-count').textContent = list.length + ' of ' + TAPES.length + ' tapes';
  if (!list.length) { shGrid.appendChild(mk('div', 'sh-empty', 'No tapes match. Try another word or category.')); return; }
  list.forEach(d => {
    const card = mk('div', 'sh-card'), cover = mk('div', 'sh-cover');
    cover.style.setProperty('--grad', 'linear-gradient(160deg,' + d.a + ',' + d.b + ')');
    cover.appendChild(mk('strong', '', d.t)); cover.appendChild(mk('em', '', d.year));
    if (rentals.some(r => r.t === d.t)) cover.appendChild(mk('i', '', 'RENTED'));
    const info = mk('div', 'sh-info'); info.appendChild(mk('div', 'g', d.genre)); info.appendChild(mk('p', '', d.s));
    const row = mk('div', 'sh-row'); row.appendChild(mk('b', '', '$3.99'));
    const fav = mk('button', 'fav' + (favs.has(d.id) ? ' on' : ''), '\u2665'); fav.title = 'Favourite';
    fav.onclick = () => { if (favs.has(d.id)) favs.delete(d.id); else favs.add(d.id); try { localStorage.setItem('mv_favs', JSON.stringify([...favs])); } catch (_) {} shopGrid(); };
    const inB = basket.includes(d), add = mk('button', inB ? 'in' : 'add', inB ? '\u2713 In basket' : '+ Basket');
    add.onclick = () => {
      if (basket.includes(d)) basket.splice(basket.indexOf(d), 1);
      else if (basket.length >= 5) return toast('Basket is full (5 max)');
      else basket.push(d);
      S('sh-rec').hidden = true; renderBasket(); shopCart(); shopGrid();
    };
    row.appendChild(fav); row.appendChild(add); info.appendChild(row); card.appendChild(cover); card.appendChild(info); shGrid.appendChild(card);
  });
}
function shopCart() {
  S('sh-n').textContent = S('sh-cn').textContent = basket.length;
  const ul = S('sh-list'); ul.innerHTML = '';
  if (!basket.length) ul.appendChild(mk('li', 'empty', 'Empty. Add tapes with + Basket.'));
  basket.forEach(d => { const li = mk('li', '', d.t), x = mk('button', '', '\u00d7'); x.title = 'Remove'; x.onclick = () => { basket.splice(basket.indexOf(d), 1); renderBasket(); shopCart(); shopGrid(); }; li.appendChild(x); ul.appendChild(li); });
  S('sh-tot').textContent = '$' + (basket.length * 3.99).toFixed(2); S('sh-out').disabled = !basket.length;
}
function openShop() {
  if (running) { for (const k in keys) keys[k] = false; putBack(); ui = 'shop'; if (document.exitPointerLock) document.exitPointerLock(); S('sh-go').textContent = '\u25c2 BACK TO THE STORE'; }
  shopEl.hidden = false; S('sh-rec').hidden = true; shopChips(); shopGrid(); shopCart();
}
function closeShop() {
  shopEl.hidden = true; shCart.classList.remove('open'); if (document.activeElement) document.activeElement.blur();
  if (running) { ui = null; try { if (!isTouch && !dragLook) renderer.domElement.requestPointerLock(); } catch (_) {} } else enter();
}
S('sh-go').onclick = closeShop;
S('sh-cartbtn').onclick = () => shCart.classList.toggle('open');
S('sh-clear').onclick = () => { basket.length = 0; renderBasket(); shopCart(); shopGrid(); };
S('sh-rok').onclick = () => { S('sh-rec').hidden = true; };
S('sh-out').onclick = () => {
  if (!basket.length) return;
  const n = basket.length, due = new Date(Date.now() + 2 * 864e5).toDateString();
  const rl = S('sh-rlist'); rl.innerHTML = ''; basket.forEach(d => { const li = mk('li', '', d.t); li.appendChild(mk('span', '', '$3.99')); rentals.push({t: d.t, due}); rl.appendChild(li); }); saveRentals();
  S('sh-rtot').textContent = '$' + (n * 3.99).toFixed(2); S('sh-rdue').textContent = due; S('sh-rno').textContent = 'No. ' + (1000 + ((Math.random() * 9000) | 0));
  basket.length = 0; renderBasket(); shopCart(); shopGrid(); S('sh-rec').hidden = false; shCart.classList.add('open');
};
shQ.addEventListener('input', shopGrid);
shopEl.addEventListener('keydown', e => { if (e.code === 'Escape' && running) closeShop(); e.stopPropagation(); });
scene.traverse(o => { if (o.isInstancedMesh) o.frustumCulled = false; });
tick();
})();
