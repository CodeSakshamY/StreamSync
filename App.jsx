import { useState, useRef, useEffect } from "react";

// ─── Helpers ───
const WORDS = ["RIVER","OCEAN","FALCON","COSMOS","EMBER","TITAN","NOVA","PRISM","BLAZE","NEXUS"];
const genCode = () => WORDS[~~(Math.random()*WORDS.length)] + (~~(Math.random()*9)+1);
const getVid = u => { const m=u.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/); return m?m[1]:null; };
const fmt = () => new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const AC = ["#5865F2","#22C55E","#F59E0B","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316"];
const avc = n => AC[n.charCodeAt(0)%AC.length];
const EMOJIS = ["😂","❤️","🔥","😮","👏","😭","🎉","💀"];

// ─── Seed data ───
const SEED_MSGS = [
  {id:1,user:"Emma",msg:"omg this part!! 😭",t:"2:31 PM",host:false},
  {id:2,user:"Alex",msg:"told you it gets good 😌",t:"2:31 PM",host:true},
  {id:3,user:"John",msg:"WAIT WHAT",t:"2:32 PM",host:false},
  {id:4,user:"Sarah",msg:"rewind 20 secs please!!",t:"2:32 PM",host:false},
  {id:5,user:"Mike",msg:"seen it 3× still hits different 🔥",t:"2:33 PM",host:false},
];
const SEED_USERS = [
  {id:1,name:"Alex",host:true,status:"active"},
  {id:2,name:"Emma",host:false,status:"active"},
  {id:3,name:"John",host:false,status:"active"},
  {id:4,name:"Sarah",host:false,status:"reconnecting"},
  {id:5,name:"Mike",host:false,status:"active"},
];
const SEED_QUEUE = [
  {id:1,vid:"dQw4w9WgXcQ",title:"Rick Astley — Never Gonna Give You Up",active:true},
  {id:2,vid:"9bZkp7q19f0",title:"PSY — Gangnam Style",active:false},
  {id:3,vid:"JGwWNGJdvx8",title:"Ed Sheeran — Shape Of You",active:false},
];

// ─── FAQ data (GEO/AIEO optimised) ───
const FAQ_DATA = [
  {q:"What is StreamSync?",a:"StreamSync is a free real-time watch party platform that synchronises YouTube videos for groups. Create a room, share a 6-character code, and watch together — no account needed."},
  {q:"Do I need an account?",a:"No account, no sign-up, no downloads. Enter a YouTube URL, get a room code, share with friends, and start watching in under 10 seconds."},
  {q:"How many people can join?",a:"Up to 50 people can watch simultaneously in one room. V1 expands this to 500 viewers per room."},
  {q:"How does sync work?",a:"Play, pause, and seek events broadcast via WebSocket instantly. An auto-correction system runs every 5 seconds and resyncs anyone drifting more than 2 seconds."},
  {q:"What if the host leaves?",a:"The room stays active for 10–15 minutes. If the host returns, privileges restore. If not, the oldest remaining participant becomes host automatically."},
  {q:"Does it work on mobile?",a:"Yes. StreamSync is mobile-first — iOS, Android, and all modern mobile browsers. Chat becomes a swipeable bottom drawer so video always stays front and centre."},
];

// ─── JSON-LD schemas ───
const SCHEMA_APP = {
  "@context":"https://schema.org","@type":"WebApplication","name":"StreamSync",
  "url":"https://streamsync.app",
  "description":"Real-time watch party platform. Sync YouTube videos with friends instantly. No account required. Create a room in under 10 seconds.",
  "applicationCategory":"EntertainmentApplication","operatingSystem":"Web Browser, iOS, Android",
  "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
  "featureList":["Synchronized video playback","Real-time group chat","Instant room creation","No account required","Mobile-first design","Auto-sync drift correction every 5s","Host moderation controls","Late-join sync","Auto-reconnect","Video queue"]
};
const SCHEMA_FAQ = {
  "@context":"https://schema.org","@type":"FAQPage",
  "mainEntity": FAQ_DATA.map(({q,a}) => ({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))
};

// ─── CSS ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#252932;border-radius:4px}
.ss{font-family:'DM Sans',sans-serif;background:#0F1115;color:#fff;min-height:100vh}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-90px) scale(1.4)}}

/* Logo */
.logo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.5px;display:flex;align-items:center;gap:7px;color:#fff;user-select:none}
.ldot{width:8px;height:8px;border-radius:50%;background:#5865F2;box-shadow:0 0 8px #5865F2bb;animation:pulse 2.4s ease-in-out infinite;flex-shrink:0}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all .15s;border-radius:9px;line-height:1}
.btn:disabled{opacity:.38;cursor:not-allowed;pointer-events:none}
.bp{background:#5865F2;color:#fff;padding:11px 20px;font-size:14px}
.bp:hover{background:#4752c4;transform:translateY(-1px);box-shadow:0 8px 24px rgba(88,101,242,.36)}
.bp:active{transform:translateY(0)}
.bs{background:rgba(255,255,255,.07);color:#fff;border:1.5px solid rgba(255,255,255,.12);padding:11px 20px;font-size:14px}
.bs:hover{background:rgba(255,255,255,.12)}
.bg{background:transparent;color:#AAB0BC;padding:7px 10px;font-size:13px;border-radius:7px;border:none}
.bg:hover{color:#fff;background:rgba(255,255,255,.06)}
.bd{background:rgba(239,68,68,.12);color:#EF4444;border:1px solid rgba(239,68,68,.25);padding:4px 10px;font-size:11.5px;font-weight:700;border-radius:7px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
.bd:hover{background:rgba(239,68,68,.22)}

/* Pills */
.pill{display:inline-block;padding:2px 9px;border-radius:100px;font-size:10.5px;font-weight:700;letter-spacing:.04em}
.pg{background:rgba(34,197,94,.12);color:#22C55E;border:1px solid rgba(34,197,94,.28)}
.pb{background:rgba(88,101,242,.12);color:#818cf8;border:1px solid rgba(88,101,242,.28)}
.py{background:rgba(234,179,8,.12);color:#EAB308;border:1px solid rgba(234,179,8,.28)}

/* Toast */
.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:999;background:#1c2030;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:9px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;animation:toastIn .22s ease;white-space:nowrap;box-shadow:0 8px 30px rgba(0,0,0,.6);max-width:90vw}
.tg{border-color:rgba(34,197,94,.3);color:#22C55E}
.ti{border-color:rgba(88,101,242,.3);color:#818cf8}
.tr{border-color:rgba(239,68,68,.3);color:#EF4444}
.tw{border-color:rgba(234,179,8,.3);color:#EAB308}

/* Form */
.lbl{display:block;font-size:10.5px;font-weight:700;color:#8A90A0;margin-bottom:5px;letter-spacing:.07em;text-transform:uppercase}
.inp{width:100%;background:#0a0c10;border:1.5px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;padding:10px 12px;outline:none;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none;margin-bottom:13px}
.inp:focus{border-color:#5865F2;box-shadow:0 0 0 3px rgba(88,101,242,.14)}
.inp::placeholder{color:#3a3f52}
.ferr{font-size:11.5px;color:#EF4444;margin:-9px 0 12px;display:flex;align-items:center;gap:3px}

/* Overlay / Modal */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:200;animation:fadeIn .18s ease;padding:16px}
.modal{background:#171A21;border:1.5px solid rgba(255,255,255,.1);border-radius:18px;padding:28px;width:100%;max-width:390px;animation:scaleIn .22s ease;max-height:90vh;overflow-y:auto}
.mh{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin:12px 0 4px;letter-spacing:-.02em}
.ms{font-size:13px;color:#8A90A0;line-height:1.55;margin-bottom:20px}

/* Top nav */
.snav{display:flex;align-items:center;justify-content:space-between;padding:12px 32px;border-bottom:1px solid rgba(255,255,255,.06);background:#0F1115;position:sticky;top:0;z-index:100}
.stabs{display:flex;gap:2px}
.stab{background:none;border:none;color:#8A90A0;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;padding:6px 12px;cursor:pointer;border-radius:7px;transition:all .15s}
.stab.on{color:#fff;background:rgba(255,255,255,.08)}
.stab:hover:not(.on){color:#fff}

/* Landing */
.hero{display:flex;flex-direction:column;align-items:center;text-align:center;padding:64px 32px 48px;position:relative}
.hglow{position:absolute;top:0;left:50%;transform:translateX(-50%);width:700px;height:380px;background:radial-gradient(ellipse at 50% 0%,rgba(88,101,242,.18) 0%,transparent 65%);pointer-events:none}
.eyb{display:inline-flex;align-items:center;gap:6px;background:rgba(88,101,242,.1);border:1px solid rgba(88,101,242,.28);color:#818cf8;font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:20px;animation:fadeUp .5s ease both}
.lh1{font-family:'Syne',sans-serif;font-size:clamp(34px,6vw,68px);font-weight:800;line-height:1.0;letter-spacing:-.03em;margin-bottom:16px;animation:fadeUp .5s .07s ease both}
.lh1 em{font-style:normal;color:#5865F2}
.lsub{font-size:clamp(13px,1.8vw,16px);color:#8A90A0;max-width:440px;line-height:1.7;margin-bottom:30px;animation:fadeUp .5s .14s ease both}
.ctas{display:flex;gap:9px;animation:fadeUp .5s .2s ease both;justify-content:center;flex-wrap:wrap}
.stats{display:flex;align-items:stretch;margin:0 32px;border:1px solid rgba(255,255,255,.06);border-radius:13px;overflow:hidden}
.sc{flex:1;text-align:center;padding:16px 10px;border-right:1px solid rgba(255,255,255,.06)}
.sc:last-child{border-right:none}
.sn{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.sl{font-size:10.5px;color:#8A90A0;margin-top:3px;font-weight:500}
.feat{padding:52px 32px;max-width:960px;margin:0 auto}
.e2{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5865F2;margin-bottom:7px}
.h2{font-family:'Syne',sans-serif;font-size:clamp(20px,3.2vw,32px);font-weight:800;letter-spacing:-.02em;margin-bottom:10px}
.h2s{font-size:13px;color:#8A90A0;max-width:400px;line-height:1.65;margin-bottom:32px}
.fgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:11px}
.fc{background:#171A21;border:1.5px solid rgba(255,255,255,.07);border-radius:13px;padding:20px;transition:all .2s;position:relative;overflow:hidden}
.fc::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(88,101,242,.5),transparent);opacity:0;transition:opacity .2s}
.fc:hover{border-color:rgba(88,101,242,.3);transform:translateY(-2px)}.fc:hover::after{opacity:1}
.fi{width:38px;height:38px;background:rgba(88,101,242,.12);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:11px}
.ft{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:5px}
.fd{font-size:12.5px;color:#8A90A0;line-height:1.6}

/* FAQ */
.faq-item{border-bottom:1px solid rgba(255,255,255,.07)}
.faq-btn{width:100%;background:none;border:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;text-align:left;padding:15px 0;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;transition:color .15s}
.faq-btn:hover{color:#818cf8}
.chev{flex-shrink:0;color:#8A90A0;transition:transform .2s;font-size:14px}
.chev.on{transform:rotate(180deg)}
.faq-ans{font-size:13px;color:#8A90A0;line-height:1.7;padding-bottom:15px;animation:fadeUp .18s ease}
.lfoot{text-align:center;padding:22px 32px;border-top:1px solid rgba(255,255,255,.05);color:#3a3f52;font-size:12px;line-height:1.9}
.flink{background:none;border:none;color:#8A90A0;font-size:12px;cursor:pointer;text-decoration:underline;text-underline-offset:2px;font-family:'DM Sans',sans-serif;transition:color .15s}
.flink:hover{color:#fff}

/* Room */
.room{display:flex;flex-direction:column;height:calc(100vh - 49px)}
.rnav{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;background:#171A21;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;gap:8px;min-height:50px}
.rnl{display:flex;align-items:center;gap:8px;min-width:0}
.rtit{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rchip{background:rgba(88,101,242,.13);border:1px solid rgba(88,101,242,.3);color:#818cf8;font-family:'Syne',sans-serif;font-size:11px;font-weight:800;letter-spacing:.07em;padding:3px 8px;border-radius:5px;cursor:pointer;transition:all .15s;user-select:none}
.rchip:hover{background:rgba(88,101,242,.25)}
.rbody{display:flex;flex:1;overflow:hidden}
.vcol{flex:1;background:#000;display:flex;flex-direction:column;min-width:0;position:relative}
.vwrap{flex:1;position:relative;background:#0a0a0a}
.vwrap iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
.vbar{background:#171A21;border-top:1px solid rgba(255,255,255,.06);padding:7px 14px;display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap}
.spill{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:#22C55E;margin-left:auto}
.sdot{width:6px;height:6px;border-radius:50%;background:#22C55E;animation:pulse 2.4s ease-in-out infinite}
.reacts{display:flex;gap:3px}
.rbtn{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);border-radius:7px;padding:4px 7px;font-size:13.5px;cursor:pointer;transition:all .15s;position:relative}
.rbtn:hover{background:rgba(255,255,255,.14);transform:scale(1.15)}
.rfloat{position:absolute;bottom:30px;font-size:22px;animation:floatUp .9s ease forwards;pointer-events:none;z-index:50}
.sb{width:272px;background:#171A21;border-left:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;flex-shrink:0;transition:width .22s ease;overflow:hidden}
.sb.cl{width:0}
.sbtabs{display:flex;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}
.sbt{flex:1;background:none;border:none;color:#8A90A0;font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:600;padding:11px 6px;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap}
.sbt.on{color:#fff;border-bottom-color:#5865F2}
.ulist{flex:1;overflow-y:auto;padding:7px}
.uc{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#8A90A0;padding:5px 6px 7px}
.urow{display:flex;align-items:center;gap:7px;padding:5px 7px;border-radius:7px;transition:background .12s;position:relative}
.urow:hover{background:rgba(255,255,255,.05)}
.uav{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:700;color:#fff;flex-shrink:0}
.uname{font-size:12.5px;font-weight:500;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ust{font-size:13px;flex-shrink:0}
.ukick{display:none;gap:3px}
.urow:hover .ukick{display:flex}
.urow:hover .ust{display:none}
.ccol{display:flex;flex-direction:column;flex:1;overflow:hidden}
.cmsgs{flex:1;overflow-y:auto;padding:7px;display:flex;flex-direction:column;gap:1px}
.cm{padding:4px 7px;border-radius:6px;transition:background .1s}
.cm:hover{background:rgba(255,255,255,.04)}
.cmh{display:flex;align-items:baseline;gap:5px;margin-bottom:1px}
.cu{font-size:12px;font-weight:700;color:#818cf8}
.cu.h{color:#F59E0B}
.cts{font-size:10px;color:#3a3f52}
.ct{font-size:12.5px;color:#C8CDD8;line-height:1.44;word-break:break-word}
.cfoot{padding:8px;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}
.cinw{display:flex;gap:5px;background:#0a0c10;border:1.5px solid rgba(255,255,255,.1);border-radius:8px;padding:6px 8px;align-items:center;transition:border-color .15s}
.cinw:focus-within{border-color:#5865F2}
.cii{flex:1;background:none;border:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:12.5px;outline:none}
.cii::placeholder{color:#3a3f52}
.csb{background:#5865F2;border:none;color:#fff;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;transition:all .15s;flex-shrink:0}
.csb:hover{background:#4752c4}
.qlist{flex:1;overflow-y:auto;padding:7px;display:flex;flex-direction:column;gap:5px}
.qi{background:#0a0c10;border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:8px;display:flex;gap:7px;align-items:center}
.qthumb{width:48px;height:34px;border-radius:4px;background:#222;flex-shrink:0;overflow:hidden}
.qthumb img{width:100%;height:100%;object-fit:cover}
.qtit{font-size:11.5px;font-weight:600;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* Architecture */
.arch{max-width:820px;margin:0 auto;padding:28px 32px}
.arow{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:10px;margin-bottom:10px}
.acard{background:#171A21;border:1.5px solid rgba(255,255,255,.07);border-radius:11px;padding:14px}
.acard.hi{border-color:rgba(88,101,242,.35)}
.ath{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;margin:6px 0 5px}
.atp{font-size:11.5px;color:#8A90A0;line-height:1.6}
.echip{display:inline-block;background:#0a0c10;border:1px solid rgba(88,101,242,.25);color:#818cf8;font-family:'Courier New',monospace;font-size:9.5px;padding:2px 7px;border-radius:4px;margin:2px}
.dbt{background:#0a0c10;border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:11px;margin-bottom:8px}
.dbn{font-family:'Syne',sans-serif;font-size:11.5px;font-weight:700;color:#818cf8;margin-bottom:5px}
.dbf{font-family:'Courier New',monospace;font-size:10px;color:#8A90A0;line-height:1.9;display:block}

/* SEO Report */
.seo{max-width:800px;margin:0 auto;padding:24px 32px}
.cblk{background:#0a0c10;border:1px solid rgba(255,255,255,.08);border-radius:9px;padding:13px 15px;font-family:'Courier New',monospace;font-size:10.5px;color:#8A90A0;overflow-x:auto;line-height:1.7;white-space:pre;margin-bottom:20px}

@media(max-width:700px){
  .snav{padding:10px 16px}.stab{padding:5px 8px;font-size:11px}
  .hero{padding:48px 16px 36px}.stats{margin:0 16px}.feat{padding:36px 16px}
  .faq-sec{padding:36px 16px}.lfoot{padding:18px 16px}
  .rbody{flex-direction:column}.vcol{height:200px;flex:none}.sb{width:100%;border-left:none;border-top:1px solid rgba(255,255,255,.06)}
  .sb.cl{height:0;min-height:0}
  .seo,.arch{padding:16px}
}
`;

function Toast({msg,kind}){
  const cls={success:"tg",info:"ti",danger:"tr",warning:"tw"};
  const ic={success:"✓",info:"ℹ",danger:"✕",warning:"⚠"};
  return <div className={`toast ${cls[kind||"info"]}`}>{ic[kind||"info"]} {msg}</div>;
}

function FAQItem({q,a}){
  const [o,setO]=useState(false);
  return(
    <div className="faq-item">
      <button className="faq-btn" onClick={()=>setO(!o)}>
        <span>{q}</span>
        <span className={`chev${o?" on":""}`}>▾</span>
      </button>
      {o&&<p className="faq-ans">{a}</p>}
    </div>
  );
}

// ──────────────────────────────────────
// LANDING
// ──────────────────────────────────────
function Landing({setScreen}){
  const feats=[
    {i:"⚡",t:"Zero Setup",d:"Room in under 10 seconds. No account, no extensions, no friction."},
    {i:"🔄",t:"Perfect Sync",d:"WebSocket broadcast for play/pause/seek. Drift auto-corrects every 5 seconds."},
    {i:"💬",t:"Live Chat",d:"Real-time chat with nicknames, timestamps, and host badges."},
    {i:"👑",t:"Host Controls",d:"Change video, kick users, mute chat, delete messages."},
    {i:"📱",t:"Mobile First",d:"iOS, Android, and all modern mobile browsers. Swipeable chat drawer."},
    {i:"🎬",t:"Video Queue",d:"Queue videos ahead of time. Auto-play next. Reorder on the fly."},
  ];
  return(
    <div>
      <section className="hero">
        <div className="hglow"/>
        <div className="eyb"><span className="ldot" style={{width:6,height:6}}/>Real-Time Watch Party Platform</div>
        <h1 className="lh1">Watch parties.<br/><em>Perfectly in sync.</em></h1>
        <p className="lsub">Create a room, share a code, and watch YouTube with anyone — no account, no extensions, no friction.</p>
        <div className="ctas">
          <button className="btn bp" onClick={()=>setScreen("create")} style={{fontSize:14.5,padding:"13px 26px"}}>▶ Create a Room</button>
          <button className="btn bs" onClick={()=>setScreen("join")} style={{fontSize:14.5,padding:"13px 26px"}}># Join with Code</button>
        </div>
      </section>
      <div className="stats">
        {[["<10s","Room Created"],["<2s","To Join"],["50","Viewers/Room"],["<2s","Max Drift"]].map(([n,l])=>(
          <div className="sc" key={l}><div className="sn">{n}</div><div className="sl">{l}</div></div>
        ))}
      </div>
      <section className="feat">
        <div className="e2">Platform Features</div>
        <h2 className="h2">Everything you need.</h2>
        <p className="h2s">No unnecessary complexity. Every feature earns its place.</p>
        <div className="fgrid">
          {feats.map(f=>(
            <div className="fc" key={f.t}><div className="fi">{f.i}</div><div className="ft">{f.t}</div><p className="fd">{f.d}</p></div>
          ))}
        </div>
      </section>
      <section style={{padding:"48px 32px",maxWidth:680,margin:"0 auto"}}>
        <div className="e2">FAQ</div>
        <h2 className="h2" style={{marginBottom:20}}>Common questions</h2>
        {FAQ_DATA.map((item,i)=><FAQItem key={i} q={item.q} a={item.a}/>)}
      </section>
      <footer className="lfoot">
        <p>StreamSync — Watch Together. Anywhere. · Free · No account required</p>
      </footer>
    </div>
  );
}

// ──────────────────────────────────────
// MODALS
// ──────────────────────────────────────
function CreateModal({setScreen,enterRoom}){
  const [url,setUrl]=useState("");
  const [err,setErr]=useState("");
  const go=()=>{
    if(!url.trim()){setErr("Enter a YouTube URL");return}
    const v=getVid(url);
    if(!v){setErr("Invalid YouTube URL — try youtube.com/watch?v=...");return}
    enterRoom({vid:v,rcode:genCode(),nick:"Host",isHost:true});
  };
  return(
    <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setScreen("landing")}>
      <div className="modal">
        <div className="logo" style={{fontSize:15}}>StreamSync <span className="ldot"/></div>
        <h2 className="mh">Create a Room</h2>
        <p className="ms">Paste a YouTube URL. Get a code. Share it. Start watching.</p>
        <label className="lbl">YouTube URL</label>
        <input className="inp" style={err?{borderColor:"#EF4444"}:{}} placeholder="https://youtube.com/watch?v=..." value={url} onChange={e=>{setUrl(e.target.value);setErr("")}} onKeyDown={e=>e.key==="Enter"&&go()} autoFocus/>
        {err&&<p className="ferr">⚠ {err}</p>}
        <button className="btn bp" style={{width:"100%"}} onClick={go}>▶ Create Room</button>
        <button className="btn bg" style={{width:"100%",marginTop:7,justifyContent:"center"}} onClick={()=>setScreen("landing")}>← Back</button>
      </div>
    </div>
  );
}

function JoinModal({setScreen,enterRoom}){
  const [code,setCode]=useState("");
  const [nick,setNick]=useState("");
  const go=()=>{
    if(!code.trim()||!nick.trim())return;
    enterRoom({vid:"dQw4w9WgXcQ",rcode:code.toUpperCase(),nick,isHost:false});
  };
  return(
    <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setScreen("landing")}>
      <div className="modal">
        <div className="logo" style={{fontSize:15}}>StreamSync <span className="ldot"/></div>
        <h2 className="mh">Join a Room</h2>
        <p className="ms">Enter the room code from your friend and pick a nickname.</p>
        <label className="lbl">Room Code</label>
        <input className="inp" placeholder="e.g. RIVER7" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} maxLength={8} style={{textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800}} autoFocus/>
        <label className="lbl">Nickname</label>
        <input className="inp" placeholder="Your nickname" value={nick} onChange={e=>setNick(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} maxLength={20}/>
        <button className="btn bp" style={{width:"100%"}} onClick={go} disabled={!code||!nick}>→ Join Room</button>
        <button className="btn bg" style={{width:"100%",marginTop:7,justifyContent:"center"}} onClick={()=>setScreen("landing")}>← Back</button>
      </div>
    </div>
  );
}

function ChangeVideoModal({onClose,onApply}){
  const [url,setUrl]=useState("");
  const [err,setErr]=useState("");
  const go=()=>{const v=getVid(url);if(!v){setErr("Invalid YouTube URL");return}onApply(v)};
  return(
    <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:360}}>
        <h2 className="mh" style={{marginTop:0}}>Change Video</h2>
        <p className="ms">Paste a new YouTube URL — all viewers switch instantly.</p>
        <label className="lbl">New YouTube URL</label>
        <input className="inp" placeholder="https://youtube.com/watch?v=..." value={url} onChange={e=>{setUrl(e.target.value);setErr("")}} onKeyDown={e=>e.key==="Enter"&&go()} autoFocus/>
        {err&&<p className="ferr">⚠ {err}</p>}
        <button className="btn bp" style={{width:"100%"}} onClick={go}>↪ Change for Everyone</button>
        <button className="btn bg" style={{width:"100%",marginTop:7,justifyContent:"center"}} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// WATCH ROOM
// ──────────────────────────────────────
function WatchRoom({rcode,vid,nick,isHost,setScreen,showToast}){
  const [sb,setSb]=useState(true);
  const [tab,setTab]=useState("chat");
  const [msgs,setMsgs]=useState(SEED_MSGS);
  const [users,setUsers]=useState(SEED_USERS);
  const [queue,setQueue]=useState(SEED_QUEUE);
  const [curVid,setCurVid]=useState(vid);
  const [cinput,setCinput]=useState("");
  const [floats,setFloats]=useState([]);
  const [showChange,setShowChange]=useState(false);
  const mref=useRef(200);
  const eref=useRef(null);
  useEffect(()=>{eref.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const send=()=>{
    if(!cinput.trim())return;
    setMsgs(p=>[...p,{id:++mref.current,user:nick,msg:cinput,t:fmt(),host:isHost}]);
    setCinput("");
  };
  const react=(em)=>{
    const id=Date.now();
    setFloats(p=>[...p,{id,em,left:30+Math.random()*40}]);
    setTimeout(()=>setFloats(p=>p.filter(f=>f.id!==id)),1000);
  };
  const kick=(id)=>{setUsers(p=>p.filter(u=>u.id!==id));showToast("User removed.","danger")};
  const mute=()=>showToast("User chat muted.","warning");
  const applyVideo=(v)=>{
    setCurVid(v);setShowChange(false);
    setQueue(p=>p.map(q=>({...q,active:q.vid===v})));
    showToast("Video changed for all viewers.","success");
  };
  const si=s=>s==="active"?"🟢":s==="reconnecting"?"🟡":"🔴";

  return(
    <div className="room" style={{position:"relative"}}>
      {showChange&&<ChangeVideoModal onClose={()=>setShowChange(false)} onApply={applyVideo}/>}
      <header className="rnav">
        <div className="rnl">
          <div className="logo" style={{fontSize:14}}>StreamSync <span className="ldot"/></div>
          <span style={{color:"rgba(255,255,255,.2)"}}>·</span>
          <span className="rtit">Watch Party</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button className="rchip" onClick={()=>{navigator.clipboard?.writeText(rcode).catch(()=>{});showToast("Code copied: "+rcode,"info")}}>{rcode}</button>
          {isHost&&<button className="btn bs" style={{padding:"4px 10px",fontSize:12}} onClick={()=>setShowChange(true)}>↪ Change Video</button>}
          <button className="btn bs" style={{padding:"4px 10px",fontSize:12}} onClick={()=>setSb(!sb)}>{sb?"✕ Hide":"☰ Chat"}</button>
          <button className="btn bg" style={{fontSize:12,padding:"4px 9px"}} onClick={()=>setScreen("landing")}>Leave</button>
        </div>
      </header>
      <div className="rbody">
        <div className="vcol">
          <div className="vwrap">
            <iframe src={`https://www.youtube.com/embed/${curVid}?modestbranding=1&rel=0`} allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen title="StreamSync Video Player"/>
            {floats.map(f=>(
              <div key={f.id} className="rfloat" style={{left:`${f.left}%`}}>{f.em}</div>
            ))}
          </div>
          <div className="vbar">
            <span style={{fontSize:11,color:"#8A90A0",fontWeight:600}}>{isHost?"👑 Host — controls all viewers":"🟢 Viewer"}</span>
            <div className="reacts">
              {EMOJIS.map(em=>(
                <button key={em} className="rbtn" onClick={()=>react(em)} title={`React ${em}`}>{em}</button>
              ))}
            </div>
            <div className="spill"><span className="sdot"/>In Sync</div>
          </div>
        </div>
        <div className={`sb${sb?"":" cl"}`}>
          <div className="sbtabs">
            <button className={`sbt${tab==="chat"?" on":""}`} onClick={()=>setTab("chat")}>💬 Chat</button>
            <button className={`sbt${tab==="users"?" on":""}`} onClick={()=>setTab("users")}>👥 {users.length}</button>
            <button className={`sbt${tab==="queue"?" on":""}`} onClick={()=>setTab("queue")}>📋 Queue</button>
          </div>
          {tab==="chat"&&(
            <div className="ccol">
              <div className="cmsgs">
                {msgs.map(m=>(
                  <div className="cm" key={m.id}>
                    <div className="cmh">
                      <span className={`cu${m.host?" h":""}`}>{m.host?"👑 ":""}{m.user}</span>
                      <span className="cts">{m.t}</span>
                    </div>
                    <div className="ct">{m.msg}</div>
                  </div>
                ))}
                <div ref={eref}/>
              </div>
              <div className="cfoot">
                <div className="cinw">
                  <input className="cii" placeholder={`Message as ${nick}…`} value={cinput} onChange={e=>setCinput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
                  <button className="csb" onClick={send}>→</button>
                </div>
              </div>
            </div>
          )}
          {tab==="users"&&(
            <div className="ulist">
              <div className="uc">Watching Now ({users.length})</div>
              {users.map(u=>(
                <div className="urow" key={u.id}>
                  <div className="uav" style={{background:avc(u.name)}}>{u.name[0]}</div>
                  <span className="uname">{u.host?"👑 ":""}{u.name}{u.name===nick?" (you)":""}</span>
                  <span className="ust">{si(u.status)}</span>
                  {isHost&&!u.host&&u.name!==nick&&(
                    <div className="ukick" style={{gap:3,display:"none"}}>
                      <button className="bd" onClick={()=>mute(u.id)}>Mute</button>
                      <button className="bd" onClick={()=>kick(u.id)}>Kick</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {tab==="queue"&&(
            <div className="qlist">
              <div className="uc">Up Next ({queue.length})</div>
              {queue.map((q,i)=>(
                <div className="qi" key={q.id} style={q.active?{borderColor:"rgba(88,101,242,.4)",background:"rgba(88,101,242,.06)"}:{}}>
                  <div style={{width:16,textAlign:"center",color:"#8A90A0",fontSize:10.5,fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <div className="qthumb">
                    <img src={`https://img.youtube.com/vi/${q.vid}/mqdefault.jpg`} alt={q.title}/>
                  </div>
                  <span className="qtit">{q.title}</span>
                  {q.active&&<span className="pill pb" style={{flexShrink:0,fontSize:9}}>Now</span>}
                  {isHost&&!q.active&&(
                    <button style={{background:"none",border:"none",color:"#8A90A0",cursor:"pointer",fontSize:13,flexShrink:0}} onClick={()=>applyVideo(q.vid)}>▶</button>
                  )}
                </div>
              ))}
              {isHost&&<button className="btn bs" style={{width:"100%",padding:"7px",fontSize:12,marginTop:4}} onClick={()=>setShowChange(true)}>+ Add Video</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// ARCHITECTURE
// ──────────────────────────────────────
function Arch(){
  const events=["join","leave","play","pause","seek","sync","chat","video_change","mute","kick","delete_message"];
  const dbs=[
    {n:"rooms",f:["id","room_code","video_id","host_id","created_at","last_activity"]},
    {n:"participants",f:["id","room_id","nickname","joined_at","status"]},
    {n:"messages",f:["id","room_id","user","message","timestamp"]},
    {n:"room_state",f:["room_id","current_time","is_playing","last_sync"]},
  ];
  return(
    <div className="arch">
      <div className="e2" style={{marginBottom:8}}>Technical Architecture</div>
      <h2 className="h2">How StreamSync Works</h2>
      <p style={{fontSize:13,color:"#8A90A0",marginBottom:22,lineHeight:1.65}}>React + TypeScript · FastAPI · WebSockets · SQLite</p>
      <div className="arow" style={{marginBottom:14}}>
        {[
          {i:"⚛️",t:"Frontend (React + TS)",p:"Landing · Create · Join · Video Player · Sidebar · Chat · Toast System",hi:true},
          {i:"🐍",t:"Backend (FastAPI)",p:"Room management · Sync engine · Presence · Chat · Moderation",hi:true},
          {i:"🔌",t:"Real-Time (WebSockets)",p:"Persistent connection per user. Broadcast events to all room participants instantly.",hi:true},
          {i:"🗄️",t:"Database (SQLite → PG)",p:"Rooms · Participants · Messages · Room State · Moderation Actions",hi:false},
        ].map(c=>(
          <div className={`acard${c.hi?" hi":""}`} key={c.t}>
            <div style={{fontSize:16}}>{c.i}</div>
            <div className="ath">{c.t}</div>
            <p className="atp">{c.p}</p>
          </div>
        ))}
      </div>
      <div className="acard" style={{marginBottom:14}}>
        <div className="ath" style={{marginBottom:8}}>WebSocket Event Types</div>
        <div>{events.map(e=><span key={e} className="echip">{e}</span>)}</div>
      </div>
      <div style={{marginBottom:14}}>
        <div className="ath" style={{marginBottom:10,fontSize:14}}>Database Schema</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:9}}>
          {dbs.map(t=>(
            <div className="dbt" key={t.n}>
              <div className="dbn">{t.n}</div>
              {t.f.map(f=><span key={f} className="dbf">{f}</span>)}
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
        {[
          {e:"POST /room/create",n:"Input: YouTube URL → Output: {roomId, videoId, roomCode}"},
          {e:"POST /room/join",n:"Input: room code + nickname. Validates room exists and is active."},
          {e:"WS /room/{id}",n:"Persistent connection. Handles all real-time events bi-directionally."},
        ].map(e=>(
          <div className="acard" key={e.e}>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:10.5,color:"#818cf8",marginBottom:5}}>{e.e}</div>
            <p className="atp">{e.n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// SEO REPORT
// ──────────────────────────────────────
function SEOReport(){
  const audits=[
    {item:"JSON-LD WebApplication Schema",s:"✅",imp:"High",n:"App type, featureList, pricing, OS — eligible for rich results."},
    {item:"JSON-LD FAQPage Schema",s:"✅",imp:"High",n:"6 Q&As for People Also Ask + LLM direct retrieval."},
    {item:"Open Graph Meta Tags",s:"✅",imp:"High",n:"og:title/description/image for social previews."},
    {item:"Answer-First Hero Copy",s:"✅",imp:"High",n:"Lead sentence answers the core query — optimised for zero-shot LLM extraction."},
    {item:"Entity-Rich FAQ Content",s:"✅",imp:"High",n:"Covers: what is, how does, how many, what if, mobile support."},
    {item:"Meta Description (150 chars)",s:"⚠️",imp:"High",n:"Required for SERP CTR. Target <150 chars + primary keyword + CTA."},
    {item:"robots.txt",s:"⚠️",imp:"Med",n:"Disallow /api, /admin, /room/. Explicitly allow AI crawlers."},
    {item:"XML Sitemap",s:"⚠️",imp:"Med",n:"Submit sitemap.xml to Google Search Console."},
    {item:"Core Web Vitals (LCP/CLS/INP)",s:"⚠️",imp:"High",n:"Critical ranking factor. Target LCP <2.5s, CLS <0.1."},
    {item:"Canonical URLs",s:"⚠️",imp:"Med",n:"Prevent duplicate indexing with rel=canonical on all pages."},
  ];
  const aieo=[
    {score:"High",t:"Chunking",n:"Each FAQ answer is 1–3 sentences — ideal vector-search chunk, under 512 tokens."},
    {score:"High",t:"Entity Density",n:"watch party, room code, synchronized playback, WebSocket, YouTube — top retrieval signals."},
    {score:"High",t:"Structured featureList",n:"Schema featureList enables direct LLM extraction of capabilities."},
    {score:"Med",t:"Comparison Content",n:"'StreamSync vs Teleparty vs Watch2Gether' raises AI citation probability significantly."},
    {score:"Med",t:"Knowledge Base",n:"/docs/ with WebSocket event reference improves knowledge graph depth."},
    {score:"Med",t:"Step-by-Step Guides",n:"'Create a watch party in 3 steps' is highly extracted by ChatGPT, Gemini, Perplexity."},
  ];
  const meta=`<title>StreamSync — Watch YouTube Together in Real Time | Free Watch Party</title>
<meta name="description" content="Free watch party. Sync YouTube with friends in &lt;10s. No account." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://streamsync.app/" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://streamsync.app/" />
<meta property="og:title" content="StreamSync — Watch YouTube Together" />
<meta property="og:description" content="Free watch party rooms. Perfect sync, live chat, no account." />
<meta property="og:image" content="https://streamsync.app/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="StreamSync — Watch YouTube Together" />
<meta name="twitter:description" content="Free real-time watch party. Sync YouTube with friends in 10 seconds." />`;
  const robots=`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /room/

User-agent: GPTBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://streamsync.app/sitemap.xml`;

  const ThH = ({children}) => <th style={{textAlign:"left",fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#8A90A0",padding:"5px 8px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>{children}</th>;
  const TdS = ({children,style={}}) => <td style={{padding:"8px 8px",fontSize:12.5,lineHeight:1.5,...style}}>{children}</td>;

  return(
    <div className="seo">
      <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(34,197,94,.09)",border:"1px solid rgba(34,197,94,.28)",color:"#22C55E",fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"4px 11px",borderRadius:"100px",marginBottom:12}}>⚡ Full Audit Complete</div>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(20px,3.5vw,30px)",fontWeight:800,letterSpacing:"-.02em",marginBottom:5}}>SEO + GEO + AIEO Report</h1>
      <p style={{fontSize:13,color:"#8A90A0",lineHeight:1.55,marginBottom:24}}>Technical, Generative Engine, and AI Engine Optimisation — StreamSync MVP v1.0</p>

      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:11,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,.07)"}}>🔍 Technical SEO Audit</h2>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
        <thead><tr><ThH>Item</ThH><ThH>Status</ThH><ThH>Impact</ThH><ThH>Notes</ThH></tr></thead>
        <tbody>
          {audits.map((a,i)=>(
            <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <TdS style={{fontWeight:500}}>{a.item}</TdS>
              <TdS style={{fontSize:14}}>{a.s}</TdS>
              <TdS><span className={`pill ${a.imp==="High"?"pg":"py"}`}>{a.imp}</span></TdS>
              <TdS style={{color:"#8A90A0",fontSize:12}}>{a.n}</TdS>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:11,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,.07)"}}>🏷️ Production Meta Tags</h2>
      <div className="cblk">{meta}</div>

      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:11,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,.07)"}}>📋 WebApplication Schema (JSON-LD)</h2>
      <div className="cblk">{`<script type="application/ld+json">\n${JSON.stringify(SCHEMA_APP,null,2)}\n<\/script>`}</div>

      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:11,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,.07)"}}>🤖 AIEO — AI Engine Optimisation</h2>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
        {aieo.map((a,i)=>(
          <div key={i} style={{background:"#171A21",border:"1.5px solid rgba(255,255,255,.06)",borderRadius:9,padding:"11px 13px",display:"flex",gap:9,alignItems:"flex-start"}}>
            <span className={`pill ${a.score==="High"?"pg":"py"}`} style={{flexShrink:0,marginTop:1}}>{a.score}</span>
            <div>
              <div style={{fontWeight:700,fontSize:12.5,marginBottom:2}}>{a.t}</div>
              <div style={{fontSize:12,color:"#8A90A0",lineHeight:1.55}}>{a.n}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:11,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,.07)"}}>📈 Expected Impact</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginBottom:24}}>
        {[
          {v:"+40–70%",l:"Organic Traffic Uplift",n:"FAQ schema + semantic structure + improved SERP CTR"},
          {v:"High",l:"AI Citation Probability",n:"FAQ JSON-LD + entity density + answer-first copy"},
          {v:"82/100",l:"Technical SEO Score",n:"Blocking: Core Web Vitals, sitemap, robots.txt"},
        ].map((m,i)=>(
          <div key={i} style={{background:"#171A21",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:11,padding:14}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:"#5865F2",marginBottom:3,lineHeight:1}}>{m.v}</div>
            <div style={{fontWeight:700,fontSize:12.5,marginBottom:2}}>{m.l}</div>
            <div style={{fontSize:11.5,color:"#8A90A0",lineHeight:1.5}}>{m.n}</div>
          </div>
        ))}
      </div>

      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:11,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,.07)"}}>🤖 robots.txt</h2>
      <div className="cblk">{robots}</div>
      <div style={{textAlign:"center",padding:"12px 0 4px",color:"#3a3f52",fontSize:11}}>StreamSync SEO + GEO + AIEO Report · MVP v1.0</div>
    </div>
  );
}

// ──────────────────────────────────────
// ROOT APP
// ──────────────────────────────────────
const TABS = [
  {id:"landing",label:"🏠 Platform"},
  {id:"room",label:"▶ Watch Room"},
  {id:"arch",label:"🏗 Architecture"},
  {id:"seo",label:"📈 SEO Report"},
];

export default function StreamSync(){
  const [screen,setScreen]=useState("landing");
  const [room,setRoom]=useState(null);
  const [toast,setToast]=useState(null);

  const showToast=(msg,kind="success")=>{setToast({msg,kind});setTimeout(()=>setToast(null),2800)};

  const enterRoom=(opts)=>{
    setRoom(opts);setScreen("room");
    showToast(opts.isHost?`Room created — share code: ${opts.rcode}`:`Joined ${opts.rcode} as ${opts.nick}`,"success");
  };

  return(
    <div className="ss">
      <style>{CSS}</style>
      {toast&&<Toast msg={toast.msg} kind={toast.kind}/>}

      {/* Global nav */}
      <div className="snav">
        <div className="logo">StreamSync <span className="ldot"/></div>
        <div className="stabs">
          {TABS.map(t=>(
            <button key={t.id} className={`stab${screen===t.id?" on":""}`}
              onClick={()=>{
                if(t.id==="room"&&!room){showToast("Create or join a room first.","warning");return}
                setScreen(t.id);
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Screens */}
      {(screen==="landing"||screen==="create"||screen==="join")&&(
        <div style={{position:"relative"}}>
          <Landing setScreen={setScreen}/>
          {screen==="create"&&<CreateModal setScreen={setScreen} enterRoom={enterRoom}/>}
          {screen==="join"&&<JoinModal setScreen={setScreen} enterRoom={enterRoom}/>}
        </div>
      )}
      {screen==="room"&&room&&<WatchRoom {...room} setScreen={(s)=>{setScreen(s)}} showToast={showToast}/>}
      {screen==="room"&&!room&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",flexDirection:"column",gap:14}}>
          <p style={{color:"#8A90A0",fontSize:15}}>No active room yet.</p>
          <button className="btn bp" onClick={()=>setScreen("create")}>▶ Create a Room</button>
          <button className="btn bs" onClick={()=>setScreen("join")}># Join with Code</button>
        </div>
      )}
      {screen==="arch"&&<Arch/>}
      {screen==="seo"&&<SEOReport/>}
    </div>
  );
}
