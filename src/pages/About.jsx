import { Link } from "react-router-dom";
export default function About() {
  return (<div className="wrap max-w-3xl"><h1 className="h1">About Cygnaconsult</h1>
    <p className="mb-3">Cygnaconsult is a technology and commerce company. Through the CYGNA platform we operate marketplaces for merchandise, vehicles and real estate, and we deliver professional website, cloud, design and applied AI services to clients across Africa and internationally.</p>
    <p className="mb-3">Our AI Lab trains and deploys custom machine learning models, from predictive analytics and computer vision to fine-tuned language models, with transparent accuracy metrics, secure data handling and clear delivery timelines.</p>
    <div className="my-6 grid gap-3 sm:grid-cols-3">{[["Trust", "Verified sellers, secure payments, transparent pricing."], ["Quality", "Vetted experts and documented inspection reports."], ["Innovation", "Practical AI built around real business problems."]].map(([t, d]) => <div key={t} className="card"><b>{t}</b><p className="text-sm text-slate-600">{d}</p></div>)}</div>
    <Link className="btn" to="/contact">Get in touch</Link></div>);
}
