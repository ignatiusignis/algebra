/* Exact integer polynomial arithmetic. No eval. */
(function(root){
const key=(x,y)=>x+','+y;
function add(a,b,sign=1){const c=new Map(a);for(const [k,v] of b){const n=(c.get(k)||0n)+BigInt(sign)*v;if(n)c.set(k,n);else c.delete(k)}return c}
function mul(a,b){let c=new Map();for(const [k,v] of a)for(const [l,w] of b){const [x,y]=k.split(',').map(Number),[u,t]=l.split(',').map(Number);if(x+y+u+t>12)throw Error('Za wysoka potęga');c=add(c,new Map([[key(x+u,y+t),v*w]]))}return c}
const constant=n=>n?new Map([['0,0',n]]):new Map();
function parse(source){let s=source.replace(/\s/g,'').replace(/−/g,'-').replace(/[·×]/g,'*').replace(/²/g,'^2').replace(/³/g,'^3');if(!s||s.length>160)throw Error('Nieprawidłowa długość');const ts=s.match(/\d+|[xy()+*^-]/g)||[];if(ts.join('')!==s)throw Error('Niedozwolony znak');let i=0;
function atom(){let t=ts[i++],p;if(t==='('){p=sum();if(ts[i++]!==')')throw Error('Brak nawiasu')}else if(t==='x'||t==='y')p=new Map([[t==='x'?'1,0':'0,1',1n]]);else if(/^\d+$/.test(t||''))p=constant(BigInt(t));else throw Error('Oczekiwano składnika');if(ts[i]==='^'){i++;const e=ts[i++];if(!/^\d+$/.test(e||'')||Number(e)>6)throw Error('Potęga 0–6');let q=constant(1n);for(let j=0;j<Number(e);j++)q=mul(q,p);p=q}return p}
function unary(){if(ts[i]==='+'){i++;return unary()}if(ts[i]==='-'){i++;return add(new Map(),unary(),-1)}return atom()}
function product(){let p=unary();while(ts[i]==='*'||/^(?:x|y|\(|\d+)$/.test(ts[i]||'')){if(ts[i]==='*')i++;p=mul(p,unary())}return p}
function sum(){let p=product();while(ts[i]==='+'||ts[i]==='-'){const sign=ts[i++]==='+'?1:-1;p=add(p,product(),sign)}return p}
const p=sum();if(i!==ts.length)throw Error('Nieprawidłowy zapis');return p}
function equal(a,b){return add(parse(a),parse(b),-1).size===0}
root.Algebra={parse,equal};if(typeof module!=='undefined')module.exports=root.Algebra;
})(globalThis);