import K, { useRef as vr, useEffect as pr } from "react";
import M, { css as v } from "styled-components";
var ne = { exports: {} }, W = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var je;
function br() {
  if (je) return W;
  je = 1;
  var s = K, g = Symbol.for("react.element"), C = Symbol.for("react.fragment"), _ = Object.prototype.hasOwnProperty, D = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, F = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(E, c, x) {
    var p, y = {}, w = null, A = null;
    x !== void 0 && (w = "" + x), c.key !== void 0 && (w = "" + c.key), c.ref !== void 0 && (A = c.ref);
    for (p in c) _.call(c, p) && !F.hasOwnProperty(p) && (y[p] = c[p]);
    if (E && E.defaultProps) for (p in c = E.defaultProps, c) y[p] === void 0 && (y[p] = c[p]);
    return { $$typeof: g, type: E, key: w, ref: A, props: y, _owner: D.current };
  }
  return W.Fragment = C, W.jsx = S, W.jsxs = S, W;
}
var V = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pe;
function gr() {
  return Pe || (Pe = 1, process.env.NODE_ENV !== "production" && function() {
    var s = K, g = Symbol.for("react.element"), C = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), D = Symbol.for("react.strict_mode"), F = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), E = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), x = Symbol.for("react.suspense"), p = Symbol.for("react.suspense_list"), y = Symbol.for("react.memo"), w = Symbol.for("react.lazy"), A = Symbol.for("react.offscreen"), R = Symbol.iterator, U = "@@iterator";
    function N(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = R && e[R] || e[U];
      return typeof r == "function" ? r : null;
    }
    var T = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function d(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
          t[n - 1] = arguments[n];
        De("error", e, t);
      }
    }
    function De(e, r, t) {
      {
        var n = T.ReactDebugCurrentFrame, i = n.getStackAddendum();
        i !== "" && (r += "%s", t = t.concat([i]));
        var u = t.map(function(o) {
          return String(o);
        });
        u.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, u);
      }
    }
    var Fe = !1, Ae = !1, $e = !1, Ie = !1, Le = !1, ae;
    ae = Symbol.for("react.module.reference");
    function Ye(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === _ || e === F || Le || e === D || e === x || e === p || Ie || e === A || Fe || Ae || $e || typeof e == "object" && e !== null && (e.$$typeof === w || e.$$typeof === y || e.$$typeof === S || e.$$typeof === E || e.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ae || e.getModuleId !== void 0));
    }
    function We(e, r, t) {
      var n = e.displayName;
      if (n)
        return n;
      var i = r.displayName || r.name || "";
      return i !== "" ? t + "(" + i + ")" : t;
    }
    function oe(e) {
      return e.displayName || "Context";
    }
    function O(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && d("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case _:
          return "Fragment";
        case C:
          return "Portal";
        case F:
          return "Profiler";
        case D:
          return "StrictMode";
        case x:
          return "Suspense";
        case p:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case E:
            var r = e;
            return oe(r) + ".Consumer";
          case S:
            var t = e;
            return oe(t._context) + ".Provider";
          case c:
            return We(e, e.render, "ForwardRef");
          case y:
            var n = e.displayName || null;
            return n !== null ? n : O(e.type) || "Memo";
          case w: {
            var i = e, u = i._payload, o = i._init;
            try {
              return O(o(u));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var j = Object.assign, L = 0, ie, ue, se, le, ce, fe, de;
    function ve() {
    }
    ve.__reactDisabledLog = !0;
    function Ve() {
      {
        if (L === 0) {
          ie = console.log, ue = console.info, se = console.warn, le = console.error, ce = console.group, fe = console.groupCollapsed, de = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ve,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        L++;
      }
    }
    function Me() {
      {
        if (L--, L === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: j({}, e, {
              value: ie
            }),
            info: j({}, e, {
              value: ue
            }),
            warn: j({}, e, {
              value: se
            }),
            error: j({}, e, {
              value: le
            }),
            group: j({}, e, {
              value: ce
            }),
            groupCollapsed: j({}, e, {
              value: fe
            }),
            groupEnd: j({}, e, {
              value: de
            })
          });
        }
        L < 0 && d("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var G = T.ReactCurrentDispatcher, X;
    function B(e, r, t) {
      {
        if (X === void 0)
          try {
            throw Error();
          } catch (i) {
            var n = i.stack.trim().match(/\n( *(at )?)/);
            X = n && n[1] || "";
          }
        return `
` + X + e;
      }
    }
    var H = !1, z;
    {
      var Ue = typeof WeakMap == "function" ? WeakMap : Map;
      z = new Ue();
    }
    function pe(e, r) {
      if (!e || H)
        return "";
      {
        var t = z.get(e);
        if (t !== void 0)
          return t;
      }
      var n;
      H = !0;
      var i = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var u;
      u = G.current, G.current = null, Ve();
      try {
        if (r) {
          var o = function() {
            throw Error();
          };
          if (Object.defineProperty(o.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(o, []);
            } catch (h) {
              n = h;
            }
            Reflect.construct(e, [], o);
          } else {
            try {
              o.call();
            } catch (h) {
              n = h;
            }
            e.call(o.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (h) {
            n = h;
          }
          e();
        }
      } catch (h) {
        if (h && n && typeof h.stack == "string") {
          for (var a = h.stack.split(`
`), b = n.stack.split(`
`), l = a.length - 1, f = b.length - 1; l >= 1 && f >= 0 && a[l] !== b[f]; )
            f--;
          for (; l >= 1 && f >= 0; l--, f--)
            if (a[l] !== b[f]) {
              if (l !== 1 || f !== 1)
                do
                  if (l--, f--, f < 0 || a[l] !== b[f]) {
                    var m = `
` + a[l].replace(" at new ", " at ");
                    return e.displayName && m.includes("<anonymous>") && (m = m.replace("<anonymous>", e.displayName)), typeof e == "function" && z.set(e, m), m;
                  }
                while (l >= 1 && f >= 0);
              break;
            }
        }
      } finally {
        H = !1, G.current = u, Me(), Error.prepareStackTrace = i;
      }
      var I = e ? e.displayName || e.name : "", P = I ? B(I) : "";
      return typeof e == "function" && z.set(e, P), P;
    }
    function Ne(e, r, t) {
      return pe(e, !1);
    }
    function Be(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function J(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return pe(e, Be(e));
      if (typeof e == "string")
        return B(e);
      switch (e) {
        case x:
          return B("Suspense");
        case p:
          return B("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case c:
            return Ne(e.render);
          case y:
            return J(e.type, r, t);
          case w: {
            var n = e, i = n._payload, u = n._init;
            try {
              return J(u(i), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var Y = Object.prototype.hasOwnProperty, be = {}, ge = T.ReactDebugCurrentFrame;
    function q(e) {
      if (e) {
        var r = e._owner, t = J(e.type, e._source, r ? r.type : null);
        ge.setExtraStackFrame(t);
      } else
        ge.setExtraStackFrame(null);
    }
    function ze(e, r, t, n, i) {
      {
        var u = Function.call.bind(Y);
        for (var o in e)
          if (u(e, o)) {
            var a = void 0;
            try {
              if (typeof e[o] != "function") {
                var b = Error((n || "React class") + ": " + t + " type `" + o + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[o] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw b.name = "Invariant Violation", b;
              }
              a = e[o](r, o, n, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (l) {
              a = l;
            }
            a && !(a instanceof Error) && (q(i), d("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", n || "React class", t, o, typeof a), q(null)), a instanceof Error && !(a.message in be) && (be[a.message] = !0, q(i), d("Failed %s type: %s", t, a.message), q(null));
          }
      }
    }
    var Je = Array.isArray;
    function Z(e) {
      return Je(e);
    }
    function qe(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function Ke(e) {
      try {
        return he(e), !1;
      } catch {
        return !0;
      }
    }
    function he(e) {
      return "" + e;
    }
    function ye(e) {
      if (Ke(e))
        return d("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", qe(e)), he(e);
    }
    var Ee = T.ReactCurrentOwner, Ge = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, me, _e;
    function Xe(e) {
      if (Y.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function He(e) {
      if (Y.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function Ze(e, r) {
      typeof e.ref == "string" && Ee.current;
    }
    function Qe(e, r) {
      {
        var t = function() {
          me || (me = !0, d("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function er(e, r) {
      {
        var t = function() {
          _e || (_e = !0, d("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var rr = function(e, r, t, n, i, u, o) {
      var a = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: g,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: o,
        // Record the component responsible for creating this element.
        _owner: u
      };
      return a._store = {}, Object.defineProperty(a._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(a, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: n
      }), Object.defineProperty(a, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: i
      }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
    };
    function tr(e, r, t, n, i) {
      {
        var u, o = {}, a = null, b = null;
        t !== void 0 && (ye(t), a = "" + t), He(r) && (ye(r.key), a = "" + r.key), Xe(r) && (b = r.ref, Ze(r, i));
        for (u in r)
          Y.call(r, u) && !Ge.hasOwnProperty(u) && (o[u] = r[u]);
        if (e && e.defaultProps) {
          var l = e.defaultProps;
          for (u in l)
            o[u] === void 0 && (o[u] = l[u]);
        }
        if (a || b) {
          var f = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          a && Qe(o, f), b && er(o, f);
        }
        return rr(e, a, b, i, n, Ee.current, o);
      }
    }
    var Q = T.ReactCurrentOwner, Re = T.ReactDebugCurrentFrame;
    function $(e) {
      if (e) {
        var r = e._owner, t = J(e.type, e._source, r ? r.type : null);
        Re.setExtraStackFrame(t);
      } else
        Re.setExtraStackFrame(null);
    }
    var ee;
    ee = !1;
    function re(e) {
      return typeof e == "object" && e !== null && e.$$typeof === g;
    }
    function xe() {
      {
        if (Q.current) {
          var e = O(Q.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function nr(e) {
      return "";
    }
    var we = {};
    function ar(e) {
      {
        var r = xe();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function Te(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = ar(r);
        if (we[t])
          return;
        we[t] = !0;
        var n = "";
        e && e._owner && e._owner !== Q.current && (n = " It was passed a child from " + O(e._owner.type) + "."), $(e), d('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, n), $(null);
      }
    }
    function Se(e, r) {
      {
        if (typeof e != "object")
          return;
        if (Z(e))
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            re(n) && Te(n, r);
          }
        else if (re(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var i = N(e);
          if (typeof i == "function" && i !== e.entries)
            for (var u = i.call(e), o; !(o = u.next()).done; )
              re(o.value) && Te(o.value, r);
        }
      }
    }
    function or(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === c || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === y))
          t = r.propTypes;
        else
          return;
        if (t) {
          var n = O(r);
          ze(t, e.props, "prop", n, e);
        } else if (r.PropTypes !== void 0 && !ee) {
          ee = !0;
          var i = O(r);
          d("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", i || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && d("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ir(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var n = r[t];
          if (n !== "children" && n !== "key") {
            $(e), d("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", n), $(null);
            break;
          }
        }
        e.ref !== null && ($(e), d("Invalid attribute `ref` supplied to `React.Fragment`."), $(null));
      }
    }
    var Oe = {};
    function Ce(e, r, t, n, i, u) {
      {
        var o = Ye(e);
        if (!o) {
          var a = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var b = nr();
          b ? a += b : a += xe();
          var l;
          e === null ? l = "null" : Z(e) ? l = "array" : e !== void 0 && e.$$typeof === g ? (l = "<" + (O(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : l = typeof e, d("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", l, a);
        }
        var f = tr(e, r, t, i, u);
        if (f == null)
          return f;
        if (o) {
          var m = r.children;
          if (m !== void 0)
            if (n)
              if (Z(m)) {
                for (var I = 0; I < m.length; I++)
                  Se(m[I], e);
                Object.freeze && Object.freeze(m);
              } else
                d("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Se(m, e);
        }
        if (Y.call(r, "key")) {
          var P = O(e), h = Object.keys(r).filter(function(dr) {
            return dr !== "key";
          }), te = h.length > 0 ? "{key: someKey, " + h.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Oe[P + te]) {
            var fr = h.length > 0 ? "{" + h.join(": ..., ") + ": ...}" : "{}";
            d(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, te, P, fr, P), Oe[P + te] = !0;
          }
        }
        return e === _ ? ir(f) : or(f), f;
      }
    }
    function ur(e, r, t) {
      return Ce(e, r, t, !0);
    }
    function sr(e, r, t) {
      return Ce(e, r, t, !1);
    }
    var lr = sr, cr = ur;
    V.Fragment = _, V.jsx = lr, V.jsxs = cr;
  }()), V;
}
process.env.NODE_ENV === "production" ? ne.exports = br() : ne.exports = gr();
var k = ne.exports;
const hr = M.button`
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

  ${({ size: s = "medium" }) => {
  switch (s) {
    case "small":
      return v`
          padding: 8px 16px;
          font-size: 14px;
          height: 32px;
        `;
    case "large":
      return v`
          padding: 16px 32px;
          font-size: 18px;
          height: 48px;
        `;
    default:
      return v`
          padding: 12px 24px;
          font-size: 16px;
          height: 40px;
        `;
  }
}}

  ${({ variant: s = "primary" }) => {
  switch (s) {
    case "secondary":
      return v`
          background-color: #6b7280;
          color: white;
          &:hover:not(:disabled) {
            background-color: #4b5563;
          }
        `;
    case "outline":
      return v`
          background-color: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          &:hover:not(:disabled) {
            background-color: #3b82f6;
            color: white;
          }
        `;
    case "ghost":
      return v`
          background-color: transparent;
          color: #3b82f6;
          &:hover:not(:disabled) {
            background-color: #f3f4f6;
          }
        `;
    default:
      return v`
          background-color: #3b82f6;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2563eb;
          }
        `;
  }
}}

  ${({ disabled: s, loading: g }) => (s || g) && v`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`, xr = ({
  children: s,
  loading: g,
  disabled: C,
  ..._
}) => /* @__PURE__ */ k.jsx(hr, { disabled: C || g, ..._, children: g ? "Loading..." : s }), yr = M.div`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  ${({ padding: s = "medium" }) => {
  switch (s) {
    case "none":
      return v`
          padding: 0;
        `;
    case "small":
      return v`
          padding: 12px;
        `;
    case "large":
      return v`
          padding: 24px;
        `;
    default:
      return v`
          padding: 16px;
        `;
  }
}}

  ${({ variant: s = "default" }) => {
  switch (s) {
    case "elevated":
      return v`
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `;
    case "outlined":
      return v`
          background-color: white;
          border: 1px solid #e5e7eb;
          &:hover {
            border-color: #d1d5db;
          }
        `;
    default:
      return v`
          background-color: white;
          border: 1px solid #f3f4f6;
        `;
  }
}}

  ${({ onClick: s }) => s && v`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
      }
    `}
`, wr = ({ children: s, ...g }) => /* @__PURE__ */ k.jsx(yr, { ...g, children: s }), ke = M.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`, Er = M.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`, mr = M.div`
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
`, Tr = ({
  src: s,
  poster: g,
  autoplay: C = !0,
  muted: _ = !0,
  loop: D = !0,
  controls: F = !1,
  className: S,
  onLoad: E,
  onError: c
}) => {
  const x = vr(null), [p, y] = K.useState(!0), [w, A] = K.useState(null);
  return pr(() => {
    const R = x.current;
    if (!R) return;
    const U = () => y(!0), N = () => {
      y(!1), E == null || E();
    }, T = () => {
      const d = "Failed to load video";
      A(d), y(!1), c == null || c(d);
    };
    return R.addEventListener("loadstart", U), R.addEventListener("canplay", N), R.addEventListener("error", T), () => {
      R.removeEventListener("loadstart", U), R.removeEventListener("canplay", N), R.removeEventListener("error", T);
    };
  }, [E, c]), w ? /* @__PURE__ */ k.jsx(ke, { className: S, children: /* @__PURE__ */ k.jsx("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#f3f4f6",
    color: "#6b7280"
  }, children: "Video unavailable" }) }) : /* @__PURE__ */ k.jsxs(ke, { className: S, children: [
    /* @__PURE__ */ k.jsx(
      Er,
      {
        ref: x,
        src: s,
        poster: g,
        autoPlay: C,
        muted: _,
        loop: D,
        controls: F,
        playsInline: !0
      }
    ),
    p && /* @__PURE__ */ k.jsx(mr, { children: "Loading video..." })
  ] });
};
export {
  xr as Button,
  wr as Card,
  Tr as HeroVideo
};
