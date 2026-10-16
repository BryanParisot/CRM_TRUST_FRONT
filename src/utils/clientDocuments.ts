export interface ClientDocumentsInfo {
  step:number;
  cgv:unknown|null;
  invoice:unknown|null;
  payment_confirmed_at:string|null;
  final_documents:{kind:string}[];
}

const documentLabels = [
  {kind:'cgv',label:'Mes CGV signées'},
  {kind:'invoice',label:'Ma facture d’acompte'},
  {kind:'sales_contract',label:'Contrat de vente'},
  {kind:'registration',label:'Certificat d’immatriculation'},
  {kind:'cebia_report',label:'Rapport CEBIA'},
];

export function availableClientDocuments(info:ClientDocumentsInfo|null){
  if(!info)return [];
  return documentLabels.filter(({kind})=>{
    if(kind==='cgv')return Boolean(info.cgv);
    if(kind==='invoice')return Boolean(info.invoice&&info.payment_confirmed_at);
    return info.step>=5&&info.final_documents.some(document=>document.kind===kind);
  });
}
