import '../styles/contact.css'
import React from "react";
import { useParams } from "react-router-dom";
import { SITE, UseSeo } from "../app-core.jsx";
import { Trans, useTranslation } from "react-i18next";
import { useFitHeading } from "../hooks/useFitHeading.js";
const R = "info@studiomacaco.ch",
  q = {
    email: 254,
    name: 200,
    message: 5e3
  },
  w = "https://api-gorilla-studio.studiomacaco.ch".replace(/\/+$/, ""),
  O = "/contact-request";
class C extends Error {
  constructor(a, {
    status: t,
    detail: r
  } = {}) {
    super(a), this.name = "ContactError", this.status = t, this.detail = r;
  }
}
async function H({
  email: s,
  name: a,
  message: t,
  language: r
}) {
  const n = {
    email: s,
    name: a,
    message: t,
    language: r
  };
  if (!w) throw new C("contact: no API base URL configured");
  const u = await fetch(`${w}${O}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(n)
  });
  if (!u.ok) {
    const l = await u.json().catch(() => null),
      m = (l == null ? void 0 : l.message) ?? u.statusText;
    throw u.status === 400 && console.error("[contact] the API rejected a payload the form accepted:", m, n), new C(`contact: ${u.status} ${m}`, {
      status: u.status,
      detail: m
    });
  }
  return {
    ok: !0,
    delivered: !0
  };
}
const $ = {
    it: "https://www.iubenda.com/privacy-policy/72597078",
    en: "https://www.iubenda.com/privacy-policy/14380442"
  },
  F = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  v = {
    email: "",
    name: "",
    message: "",
    privacy: !1
  },
  M = ["email", "name", "message", "privacy"];
function k(s, a) {
  const t = {},
    r = s.email.trim();
  return r ? F.test(r) || (t.email = a("contact.errors.email")) : t.email = a("contact.errors.required"), s.name.trim() || (t.name = a("contact.errors.required")), s.message.trim() || (t.message = a("contact.errors.required")), s.privacy || (t.privacy = a("contact.errors.privacy")), t;
}
function CfPolicy({
  children: s
}) {
  const {
      lang: a
    } = useParams(),
    t = $[a] || $.it;
  return <a className="cf__policy cf__policy--link" href={t} target="_blank" rel="noreferrer" onClick={r => r.stopPropagation()}>{s}</a>;
}
function CfField() {
  const {
      t: s
    } = useTranslation(),
    {
      lang: a
    } = useParams(),
    [t, r] = React.useState(v),
    [n, u] = React.useState({}),
    [l, m] = React.useState("idle"),
    _ = React.useRef({}),
    N = React.useRef(null),
    b = c => i => {
      const f = i.target.type === "checkbox" ? i.target.checked : i.target.value;
      r(o => ({
        ...o,
        [c]: f
      })), u(o => {
        if (!o[c] || k({
          ...t,
          [c]: f
        }, s)[c]) return o;
        const d = {
          ...o
        };
        return delete d[c], d;
      });
    },
    I = async c => {
      var o, d;
      if (c.preventDefault(), l === "sending") return;
      if ((o = N.current) != null && o.value) {
        r(v), m("sent");
        return;
      }
      const i = k(t, s);
      u(i);
      const f = M.find(p => i[p]);
      if (f) {
        (d = _.current[f]) == null || d.focus();
        return;
      }
      m("sending");
      try {
        await H({
          email: t.email.trim(),
          name: t.name.trim(),
          message: t.message.trim(),
          language: a
        }), r(v), m("sent");
      } catch (p) {
        console.error(p), m("error");
      }
    },
    x = l === "sending",
    y = (c, {
      multiline: i = !1,
      type: f = "text",
      autoComplete: o
    } = {}) => {
      const d = `cf-${c}`,
        p = !!n[c],
        P = i ? "textarea" : "input";
      return <p className="cf__field"><label className="cf__label" htmlFor={d}>{s(`contact.fields.${c}`)}<span className="cf__req" title={s("contact.requiredHint")}>{"*"}</span></label><P id={d} ref={S => {
          _.current[c] = S;
        }} className={`cf__control${i ? " cf__control--area" : ""}`} type={i ? void 0 : f} rows={i ? 5 : void 0} value={t[c]} onChange={b(c)} required={!0} maxLength={q[c]} aria-invalid={p || void 0} aria-describedby={p ? `${d}-error` : void 0} autoComplete={o} disabled={x} />{p && <span className="cf__error" id={`${d}-error`}>{n[c]}</span>}</p>;
    };
  return <form className="cf" onSubmit={I} noValidate={!0}>{y("email", {
      type: "email",
      autoComplete: "email"
    })}{y("name", {
      autoComplete: "name"
    })}{y("message", {
      multiline: !0
    })}<div className="cf__trap" aria-hidden="true"><label htmlFor="cf-company">{"Company"}</label><input id="cf-company" ref={N} type="text" tabIndex={-1} autoComplete="off" /></div><div className="cf__consent"><label className="cf__check"><input type="checkbox" className="sr-only" ref={c => {
          _.current.privacy = c;
        }} checked={t.privacy} onChange={b("privacy")} required={!0} aria-invalid={n.privacy ? !0 : void 0} aria-describedby={n.privacy ? "cf-privacy-error" : void 0} disabled={x} /><span className="cf__box" aria-hidden="true" /><span className="cf__consent-text"><Trans i18nKey="contact.privacy" components={[<CfPolicy key="policy" />]} /></span></label>{n.privacy && <span className="cf__error" id="cf-privacy-error">{n.privacy}</span>}</div><div className="cf__foot"><p className={`cf__status cf__status--${l}`} role="status" aria-live="polite">{l === "sending" && s("contact.status.sending")}{l === "sent" && s("contact.status.sent")}{l === "error" && s("contact.status.error", {
          email: R
        })}</p><button type="submit" className="cf__submit" disabled={x}>{s("contact.submit")}<span className="cf__arrow" aria-hidden="true" /></button></div></form>;
}
const D = "+41 091 261 49 84";
function Ct() {
  const {
      lang: s
    } = useParams(),
    {
      t: a
    } = useTranslation(),
    t = a("contact.title1"),
    r = a("contact.title2"),
    n = useFitHeading(`${t} ${r}`);
  return <main className="ct"><UseSeo lang={s} kind="contact" /><div className="ct__inner"><div className="ct__lead"><p className="ct__eyebrow">{a("contact.eyebrow")}</p><h1 className="ct__title" ref={n}>{t}{" "}<br />{r}</h1></div><p className="ct__lines"><span><b>{"E."}</b>{" "}<a className="ct__link" href={`mailto:${SITE.email}`}>{SITE.email}</a></span><span><b>{"P."}</b>{" "}<a className="ct__link" href={`tel:${SITE.telephone}`}>{D}</a></span></p><div className="ct__form"><CfField /></div></div><CtMark /></main>;
}
function CtMark() {
  const [s, a] = React.useState("");
  return React.useEffect(() => {
    let t = !0;
    return fetch("/intro/svg/macaco-logo.svg").then(r => r.text()).then(r => {
      t && a(r);
    }).catch(() => {}), () => {
      t = !1;
    };
  }, []), <div className="ct__mark" aria-hidden="true" dangerouslySetInnerHTML={{
    __html: s
  }} />;
}
export { Ct as default };
