import { Gauge, Headphones, ShieldCheck, Wifi } from "lucide-react";

import { COMPROMISSOS } from "../landing/contratacao/contrato";
import { COMO, GARANTIAS, HOOK, OFERTA, PLANOS_CASA } from "./onboarding.config";
import type { OnboardingState } from "./steps";

const ICONS = [Gauge, Wifi, Headphones];

export function StepHook() {
  return (
    <>
      <span className="onb__kicker">{HOOK.kicker}</span>
      <h1>{HOOK.title}</h1>
      <p className="onb__lead">{HOOK.body}</p>
    </>
  );
}

export function StepComo() {
  return (
    <>
      <h1>{COMO.title}</h1>
      <p className="onb__lead">{COMO.body}</p>
      <div className="onb__pilares">
        {COMO.pilares.map((p, i) => {
          const Icon = ICONS[i] ?? Gauge;
          return (
            <div className="onb__pilar" key={p.t}>
              <span className="onb__ico"><Icon size={20} /></span>
              <span>
                <b>{p.t}</b>
                <span>{p.d}</span>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function StepGarantias() {
  return (
    <>
      <h1>{GARANTIAS.title}</h1>
      <p className="onb__lead">{GARANTIAS.body}</p>
      <div className="onb__pilares">
        {COMPROMISSOS.map((c) => (
          <div className="onb__pilar" key={c.titulo}>
            <span className="onb__ico"><ShieldCheck size={20} /></span>
            <span>
              <b>{c.titulo}</b>
              <span>{c.desc}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function StepOferta({ state, patch }: { state: OnboardingState; patch: (p: Partial<OnboardingState>) => void }) {
  return (
    <>
      <h1>{OFERTA.title}</h1>
      <p className="onb__lead">{OFERTA.body}</p>
      <div className="onb__opts">
        {PLANOS_CASA.map((plan) => (
          <button
            key={plan.name}
            type="button"
            className="onb__opt"
            aria-pressed={state.plano === plan.name}
            onClick={() => patch({ plano: plan.name })}
          >
            <span>
              <b>{plan.name} · {plan.mega} Mega</b>
              <span>{plan.wifi}{plan.watchTv ? " · Watch TV" : ""}</span>
            </span>
            <em>R$ {plan.priceInt},{plan.priceCents}</em>
          </button>
        ))}
      </div>
      <p className="onb__micro">{OFERTA.micro}</p>
    </>
  );
}
