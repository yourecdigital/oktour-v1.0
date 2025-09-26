"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const L=require("react"),c=require("styled-components");var te={exports:{}},V={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ce;function dr(){if(Ce)return V;Ce=1;var u=L,g=Symbol.for("react.element"),C=Symbol.for("react.fragment"),_=Object.prototype.hasOwnProperty,D=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,F={key:!0,ref:!0,__self:!0,__source:!0};function S(E,f,x){var p,y={},w=null,A=null;x!==void 0&&(w=""+x),f.key!==void 0&&(w=""+f.key),f.ref!==void 0&&(A=f.ref);for(p in f)_.call(f,p)&&!F.hasOwnProperty(p)&&(y[p]=f[p]);if(E&&E.defaultProps)for(p in f=E.defaultProps,f)y[p]===void 0&&(y[p]=f[p]);return{$$typeof:g,type:E,key:w,ref:A,props:y,_owner:D.current}}return V.Fragment=C,V.jsx=S,V.jsxs=S,V}var M={};/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var je;function vr(){return je||(je=1,process.env.NODE_ENV!=="production"&&function(){var u=L,g=Symbol.for("react.element"),C=Symbol.for("react.portal"),_=Symbol.for("react.fragment"),D=Symbol.for("react.strict_mode"),F=Symbol.for("react.profiler"),S=Symbol.for("react.provider"),E=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),x=Symbol.for("react.suspense"),p=Symbol.for("react.suspense_list"),y=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),A=Symbol.for("react.offscreen"),R=Symbol.iterator,U="@@iterator";function B(e){if(e===null||typeof e!="object")return null;var r=R&&e[R]||e[U];return typeof r=="function"?r:null}var T=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;function v(e){{for(var r=arguments.length,t=new Array(r>1?r-1:0),n=1;n<r;n++)t[n-1]=arguments[n];ke("error",e,t)}}function ke(e,r,t){{var n=T.ReactDebugCurrentFrame,i=n.getStackAddendum();i!==""&&(r+="%s",t=t.concat([i]));var s=t.map(function(o){return String(o)});s.unshift("Warning: "+r),Function.prototype.apply.call(console[e],console,s)}}var De=!1,Fe=!1,Ae=!1,$e=!1,Ie=!1,ne;ne=Symbol.for("react.module.reference");function Le(e){return!!(typeof e=="string"||typeof e=="function"||e===_||e===F||Ie||e===D||e===x||e===p||$e||e===A||De||Fe||Ae||typeof e=="object"&&e!==null&&(e.$$typeof===w||e.$$typeof===y||e.$$typeof===S||e.$$typeof===E||e.$$typeof===f||e.$$typeof===ne||e.getModuleId!==void 0))}function Ye(e,r,t){var n=e.displayName;if(n)return n;var i=r.displayName||r.name||"";return i!==""?t+"("+i+")":t}function ae(e){return e.displayName||"Context"}function O(e){if(e==null)return null;if(typeof e.tag=="number"&&v("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."),typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case _:return"Fragment";case C:return"Portal";case F:return"Profiler";case D:return"StrictMode";case x:return"Suspense";case p:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case E:var r=e;return ae(r)+".Consumer";case S:var t=e;return ae(t._context)+".Provider";case f:return Ye(e,e.render,"ForwardRef");case y:var n=e.displayName||null;return n!==null?n:O(e.type)||"Memo";case w:{var i=e,s=i._payload,o=i._init;try{return O(o(s))}catch{return null}}}return null}var j=Object.assign,Y=0,oe,ie,se,ue,le,ce,fe;function de(){}de.__reactDisabledLog=!0;function We(){{if(Y===0){oe=console.log,ie=console.info,se=console.warn,ue=console.error,le=console.group,ce=console.groupCollapsed,fe=console.groupEnd;var e={configurable:!0,enumerable:!0,value:de,writable:!0};Object.defineProperties(console,{info:e,log:e,warn:e,error:e,group:e,groupCollapsed:e,groupEnd:e})}Y++}}function Ve(){{if(Y--,Y===0){var e={configurable:!0,enumerable:!0,writable:!0};Object.defineProperties(console,{log:j({},e,{value:oe}),info:j({},e,{value:ie}),warn:j({},e,{value:se}),error:j({},e,{value:ue}),group:j({},e,{value:le}),groupCollapsed:j({},e,{value:ce}),groupEnd:j({},e,{value:fe})})}Y<0&&v("disabledDepth fell below zero. This is a bug in React. Please file an issue.")}}var K=T.ReactCurrentDispatcher,G;function N(e,r,t){{if(G===void 0)try{throw Error()}catch(i){var n=i.stack.trim().match(/\n( *(at )?)/);G=n&&n[1]||""}return`
`+G+e}}var H=!1,q;{var Me=typeof WeakMap=="function"?WeakMap:Map;q=new Me}function ve(e,r){if(!e||H)return"";{var t=q.get(e);if(t!==void 0)return t}var n;H=!0;var i=Error.prepareStackTrace;Error.prepareStackTrace=void 0;var s;s=K.current,K.current=null,We();try{if(r){var o=function(){throw Error()};if(Object.defineProperty(o.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(o,[])}catch(h){n=h}Reflect.construct(e,[],o)}else{try{o.call()}catch(h){n=h}e.call(o.prototype)}}else{try{throw Error()}catch(h){n=h}e()}}catch(h){if(h&&n&&typeof h.stack=="string"){for(var a=h.stack.split(`
`),b=n.stack.split(`
`),l=a.length-1,d=b.length-1;l>=1&&d>=0&&a[l]!==b[d];)d--;for(;l>=1&&d>=0;l--,d--)if(a[l]!==b[d]){if(l!==1||d!==1)do if(l--,d--,d<0||a[l]!==b[d]){var m=`
`+a[l].replace(" at new "," at ");return e.displayName&&m.includes("<anonymous>")&&(m=m.replace("<anonymous>",e.displayName)),typeof e=="function"&&q.set(e,m),m}while(l>=1&&d>=0);break}}}finally{H=!1,K.current=s,Ve(),Error.prepareStackTrace=i}var I=e?e.displayName||e.name:"",P=I?N(I):"";return typeof e=="function"&&q.set(e,P),P}function Ue(e,r,t){return ve(e,!1)}function Be(e){var r=e.prototype;return!!(r&&r.isReactComponent)}function z(e,r,t){if(e==null)return"";if(typeof e=="function")return ve(e,Be(e));if(typeof e=="string")return N(e);switch(e){case x:return N("Suspense");case p:return N("SuspenseList")}if(typeof e=="object")switch(e.$$typeof){case f:return Ue(e.render);case y:return z(e.type,r,t);case w:{var n=e,i=n._payload,s=n._init;try{return z(s(i),r,t)}catch{}}}return""}var W=Object.prototype.hasOwnProperty,pe={},be=T.ReactDebugCurrentFrame;function J(e){if(e){var r=e._owner,t=z(e.type,e._source,r?r.type:null);be.setExtraStackFrame(t)}else be.setExtraStackFrame(null)}function Ne(e,r,t,n,i){{var s=Function.call.bind(W);for(var o in e)if(s(e,o)){var a=void 0;try{if(typeof e[o]!="function"){var b=Error((n||"React class")+": "+t+" type `"+o+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+typeof e[o]+"`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");throw b.name="Invariant Violation",b}a=e[o](r,o,n,t,null,"SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED")}catch(l){a=l}a&&!(a instanceof Error)&&(J(i),v("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",n||"React class",t,o,typeof a),J(null)),a instanceof Error&&!(a.message in pe)&&(pe[a.message]=!0,J(i),v("Failed %s type: %s",t,a.message),J(null))}}}var qe=Array.isArray;function X(e){return qe(e)}function ze(e){{var r=typeof Symbol=="function"&&Symbol.toStringTag,t=r&&e[Symbol.toStringTag]||e.constructor.name||"Object";return t}}function Je(e){try{return ge(e),!1}catch{return!0}}function ge(e){return""+e}function he(e){if(Je(e))return v("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.",ze(e)),ge(e)}var ye=T.ReactCurrentOwner,Ke={key:!0,ref:!0,__self:!0,__source:!0},Ee,me;function Ge(e){if(W.call(e,"ref")){var r=Object.getOwnPropertyDescriptor(e,"ref").get;if(r&&r.isReactWarning)return!1}return e.ref!==void 0}function He(e){if(W.call(e,"key")){var r=Object.getOwnPropertyDescriptor(e,"key").get;if(r&&r.isReactWarning)return!1}return e.key!==void 0}function Xe(e,r){typeof e.ref=="string"&&ye.current}function Ze(e,r){{var t=function(){Ee||(Ee=!0,v("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",r))};t.isReactWarning=!0,Object.defineProperty(e,"key",{get:t,configurable:!0})}}function Qe(e,r){{var t=function(){me||(me=!0,v("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",r))};t.isReactWarning=!0,Object.defineProperty(e,"ref",{get:t,configurable:!0})}}var er=function(e,r,t,n,i,s,o){var a={$$typeof:g,type:e,key:r,ref:t,props:o,_owner:s};return a._store={},Object.defineProperty(a._store,"validated",{configurable:!1,enumerable:!1,writable:!0,value:!1}),Object.defineProperty(a,"_self",{configurable:!1,enumerable:!1,writable:!1,value:n}),Object.defineProperty(a,"_source",{configurable:!1,enumerable:!1,writable:!1,value:i}),Object.freeze&&(Object.freeze(a.props),Object.freeze(a)),a};function rr(e,r,t,n,i){{var s,o={},a=null,b=null;t!==void 0&&(he(t),a=""+t),He(r)&&(he(r.key),a=""+r.key),Ge(r)&&(b=r.ref,Xe(r,i));for(s in r)W.call(r,s)&&!Ke.hasOwnProperty(s)&&(o[s]=r[s]);if(e&&e.defaultProps){var l=e.defaultProps;for(s in l)o[s]===void 0&&(o[s]=l[s])}if(a||b){var d=typeof e=="function"?e.displayName||e.name||"Unknown":e;a&&Ze(o,d),b&&Qe(o,d)}return er(e,a,b,i,n,ye.current,o)}}var Z=T.ReactCurrentOwner,_e=T.ReactDebugCurrentFrame;function $(e){if(e){var r=e._owner,t=z(e.type,e._source,r?r.type:null);_e.setExtraStackFrame(t)}else _e.setExtraStackFrame(null)}var Q;Q=!1;function ee(e){return typeof e=="object"&&e!==null&&e.$$typeof===g}function Re(){{if(Z.current){var e=O(Z.current.type);if(e)return`

Check the render method of \``+e+"`."}return""}}function tr(e){return""}var xe={};function nr(e){{var r=Re();if(!r){var t=typeof e=="string"?e:e.displayName||e.name;t&&(r=`

Check the top-level render call using <`+t+">.")}return r}}function we(e,r){{if(!e._store||e._store.validated||e.key!=null)return;e._store.validated=!0;var t=nr(r);if(xe[t])return;xe[t]=!0;var n="";e&&e._owner&&e._owner!==Z.current&&(n=" It was passed a child from "+O(e._owner.type)+"."),$(e),v('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',t,n),$(null)}}function Te(e,r){{if(typeof e!="object")return;if(X(e))for(var t=0;t<e.length;t++){var n=e[t];ee(n)&&we(n,r)}else if(ee(e))e._store&&(e._store.validated=!0);else if(e){var i=B(e);if(typeof i=="function"&&i!==e.entries)for(var s=i.call(e),o;!(o=s.next()).done;)ee(o.value)&&we(o.value,r)}}}function ar(e){{var r=e.type;if(r==null||typeof r=="string")return;var t;if(typeof r=="function")t=r.propTypes;else if(typeof r=="object"&&(r.$$typeof===f||r.$$typeof===y))t=r.propTypes;else return;if(t){var n=O(r);Ne(t,e.props,"prop",n,e)}else if(r.PropTypes!==void 0&&!Q){Q=!0;var i=O(r);v("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",i||"Unknown")}typeof r.getDefaultProps=="function"&&!r.getDefaultProps.isReactClassApproved&&v("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.")}}function or(e){{for(var r=Object.keys(e.props),t=0;t<r.length;t++){var n=r[t];if(n!=="children"&&n!=="key"){$(e),v("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",n),$(null);break}}e.ref!==null&&($(e),v("Invalid attribute `ref` supplied to `React.Fragment`."),$(null))}}var Se={};function Oe(e,r,t,n,i,s){{var o=Le(e);if(!o){var a="";(e===void 0||typeof e=="object"&&e!==null&&Object.keys(e).length===0)&&(a+=" You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");var b=tr();b?a+=b:a+=Re();var l;e===null?l="null":X(e)?l="array":e!==void 0&&e.$$typeof===g?(l="<"+(O(e.type)||"Unknown")+" />",a=" Did you accidentally export a JSX literal instead of a component?"):l=typeof e,v("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",l,a)}var d=rr(e,r,t,i,s);if(d==null)return d;if(o){var m=r.children;if(m!==void 0)if(n)if(X(m)){for(var I=0;I<m.length;I++)Te(m[I],e);Object.freeze&&Object.freeze(m)}else v("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");else Te(m,e)}if(W.call(r,"key")){var P=O(e),h=Object.keys(r).filter(function(fr){return fr!=="key"}),re=h.length>0?"{key: someKey, "+h.join(": ..., ")+": ...}":"{key: someKey}";if(!Se[P+re]){var cr=h.length>0?"{"+h.join(": ..., ")+": ...}":"{}";v(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,re,P,cr,P),Se[P+re]=!0}}return e===_?or(d):ar(d),d}}function ir(e,r,t){return Oe(e,r,t,!0)}function sr(e,r,t){return Oe(e,r,t,!1)}var ur=sr,lr=ir;M.Fragment=_,M.jsx=ur,M.jsxs=lr}()),M}process.env.NODE_ENV==="production"?te.exports=dr():te.exports=vr();var k=te.exports;const pr=c.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  outline: none;

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  ${({size:u="medium"})=>{switch(u){case"small":return c.css`
          padding: 8px 16px;
          font-size: 14px;
          height: 32px;
        `;case"large":return c.css`
          padding: 16px 32px;
          font-size: 18px;
          height: 48px;
        `;default:return c.css`
          padding: 12px 24px;
          font-size: 16px;
          height: 40px;
        `}}}

  ${({variant:u="primary"})=>{switch(u){case"secondary":return c.css`
          background-color: #6b7280;
          color: white;
          &:hover:not(:disabled) {
            background-color: #4b5563;
          }
        `;case"outline":return c.css`
          background-color: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          &:hover:not(:disabled) {
            background-color: #3b82f6;
            color: white;
          }
        `;case"ghost":return c.css`
          background-color: transparent;
          color: #3b82f6;
          &:hover:not(:disabled) {
            background-color: #f3f4f6;
          }
        `;default:return c.css`
          background-color: #3b82f6;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2563eb;
          }
        `}}}

  ${({disabled:u,loading:g})=>(u||g)&&c.css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`,br=({children:u,loading:g,disabled:C,..._})=>k.jsx(pr,{disabled:C||g,..._,children:g?"Loading...":u}),gr=c.div`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  ${({padding:u="medium"})=>{switch(u){case"none":return c.css`
          padding: 0;
        `;case"small":return c.css`
          padding: 12px;
        `;case"large":return c.css`
          padding: 24px;
        `;default:return c.css`
          padding: 16px;
        `}}}

  ${({variant:u="default"})=>{switch(u){case"elevated":return c.css`
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `;case"outlined":return c.css`
          background-color: white;
          border: 1px solid #e5e7eb;
          &:hover {
            border-color: #d1d5db;
          }
        `;default:return c.css`
          background-color: white;
          border: 1px solid #f3f4f6;
        `}}}

  ${({onClick:u})=>u&&c.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
      }
    `}
`,hr=({children:u,...g})=>k.jsx(gr,{...g,children:u}),Pe=c.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`,yr=c.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`,Er=c.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  z-index: 1;
`,mr=({src:u,poster:g,autoplay:C=!0,muted:_=!0,loop:D=!0,controls:F=!1,className:S,onLoad:E,onError:f})=>{const x=L.useRef(null),[p,y]=L.useState(!0),[w,A]=L.useState(null);return L.useEffect(()=>{const R=x.current;if(!R)return;const U=()=>y(!0),B=()=>{y(!1),E==null||E()},T=()=>{const v="Failed to load video";A(v),y(!1),f==null||f(v)};return R.addEventListener("loadstart",U),R.addEventListener("canplay",B),R.addEventListener("error",T),()=>{R.removeEventListener("loadstart",U),R.removeEventListener("canplay",B),R.removeEventListener("error",T)}},[E,f]),w?k.jsx(Pe,{className:S,children:k.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",backgroundColor:"#f3f4f6",color:"#6b7280"},children:"Video unavailable"})}):k.jsxs(Pe,{className:S,children:[k.jsx(yr,{ref:x,src:u,poster:g,autoPlay:C,muted:_,loop:D,controls:F,playsInline:!0}),p&&k.jsx(Er,{children:"Loading video..."})]})};exports.Button=br;exports.Card=hr;exports.HeroVideo=mr;
