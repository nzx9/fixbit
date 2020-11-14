(this["webpackJsonpbug-tracker"]=this["webpackJsonpbug-tracker"]||[]).push([[0],{23:function(e){e.exports=JSON.parse('{"HOME":"/","LOGIN":"/login","REGISTER":"/register"}')},80:function(e,t,n){},87:function(e,t,n){"use strict";n.r(t);var a=n(5),c=n(0),i=n.n(c),r=n(7),o=n.n(r),s=(n(80),n(18)),l=n(44),u=n(11),j=n(36),d=Object(j.b)({name:"isLogged",initialState:{value:!1},reducers:{login:function(e){e.value=!0},logout:function(e){e.value=!1}}}),b=function(e){return e.isLogged.value},O=d.actions,h=O.login,m=(O.logout,d.reducer),p=n(23),f=Object(j.b)({name:"userData",initialState:{value:{uid:null,firstname:null,lastname:null,email:null}},reducers:{setUId:function(e,t){e.value.uid=t.payload},setFirstName:function(e,t){e.value.firstname=t.payload},setLastName:function(e,t){e.value.lastname=t.payload},setEmail:function(e,t){e.value.email=t.payload}}}),g=function(e){return e.userData.value.uid},x=function(e){return e.userData.value.firstname},v=function(e){return e.userData.value.lastname},y=function(e){return e.userData.value.email},w=f.actions,S=w.setUId,N=w.setFirstName,L=w.setLastName,C=w.setEmail,I=f.reducer,E=function(){var e=Object(s.e)(g),t=Object(s.e)(x),n=Object(s.e)(v),c=Object(s.e)(y);return Object(a.jsxs)("div",{children:[Object(a.jsxs)("h1",{children:["Welcome ",t,"!"]}),Object(a.jsxs)("code",{children:[Object(a.jsx)("span",{children:"--\x3e"}),"Info"]}),Object(a.jsxs)("ul",{children:[Object(a.jsxs)("li",{children:["User Id : ",e]}),Object(a.jsxs)("li",{children:["First Name: ",t]}),Object(a.jsxs)("li",{children:["Last Name : ",n]}),Object(a.jsxs)("li",{children:["Email : ",c]}),Object(a.jsxs)("li",{children:["Build type: ","production"]})]})]})},F=n(29),D=n(127),R=n(129),T=n(130),k=n(126),G=n(132),P=n(131),W=n(133),q=n(39),M=n(43),z=function(e,t){return new Promise((function(n,a){var c={method:"POST",headers:{"Content-Type":"application/json;charset=utf-8"},body:JSON.stringify(t)};fetch(e,c).then((function(e){return e.json()})).then((function(e){n(e)})).catch((function(e){a(e)}))}))},_=function(e){0},J=Object(D.a)((function(e){return{root:{flexGrow:1,"& .MuiTextField-root":{margin:e.spacing(1)}},paper:{padding:e.spacing(2),textAlign:"center",color:e.palette.text.secondary,marginTop:e.spacing(20),display:"flex",flexDirection:"column",alignItems:"center"}}})),B=function(){var e=J(),t=Object(s.d)(),n=i.a.useState(null),r=Object(F.a)(n,2),o=r[0],l=r[1],j=i.a.useState(null),d=Object(F.a)(j,2),b=d[0],O=d[1],m=Object(q.b)().enqueueSnackbar,f=Object(u.f)(),g=Object(c.useCallback)((function(){return f.push(p.HOME)}),[f]);return Object(a.jsx)("form",{className:e.root,validate:"true",autoComplete:"on",onSubmit:function(e){z("".concat(window.location.protocol,"//").concat(window.location.hostname,"/api/users/login.php"),{email:o,password:b}).then((function(e){_(),e.success?(m("Success",{variant:"success",anchorOrigin:{vertical:"bottom",horizontal:"right"}}),t(S(e.user_data.uid)),t(N(e.user_data.firstname)),t(L(e.user_data.lastname)),t(C(e.user_data.email)),g(),t(h())):m(e.msg,{variant:"error",anchorOrigin:{vertical:"bottom",horizontal:"right"}})})).catch((function(e){alert(e)})),e.preventDefault()},children:Object(a.jsxs)(R.a,{component:"main",maxWidth:"xs",children:[Object(a.jsx)(T.a,{}),Object(a.jsxs)(k.a,{className:e.paper,children:[Object(a.jsx)("h1",{children:"Login"}),Object(a.jsx)(G.a,{required:!0,fullWidth:!0,type:"email",variant:"outlined",label:"Email",onChange:function(e){l(e.target.value)}}),Object(a.jsx)(G.a,{required:!0,fullWidth:!0,type:"password",variant:"outlined",label:"Password",onChange:function(e){O(e.target.value)}}),Object(a.jsx)(P.a,{container:!0,justify:"flex-end",spacing:3,children:Object(a.jsx)(P.a,{item:!0,children:Object(a.jsx)(W.a,{type:"submit",variant:"contained",color:"primary",children:"Login"})})}),Object(a.jsx)(M.a,{to:p.REGISTER,children:"Register"})]})]})})},H=Object(D.a)((function(e){return{root:{flexGrow:1,"& .MuiTextField-root":{margin:e.spacing(1)}},paper:{padding:e.spacing(2),textAlign:"center",color:e.palette.text.secondary,marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"}}})),U=function(){var e=H(),t=i.a.useState(null),n=Object(F.a)(t,2),r=n[0],o=n[1],s=i.a.useState(null),l=Object(F.a)(s,2),j=l[0],d=l[1],b=i.a.useState(null),O=Object(F.a)(b,2),h=O[0],m=O[1],f=i.a.useState(null),g=Object(F.a)(f,2),x=g[0],v=g[1],y=i.a.useState(null),w=Object(F.a)(y,2),S=w[0],N=w[1],L=Object(q.b)().enqueueSnackbar,C=Object(u.f)(),I=Object(c.useCallback)((function(){return C.push(p.LOGIN)}),[C]);return Object(a.jsx)("form",{className:e.root,validate:!0,autoComplete:"on",onSubmit:function(e){x===S?z("".concat(window.location.protocol,"//").concat(window.location.hostname,"/api/users/register.php"),{firstname:r,lastname:j,email:h,password:x,c_password:S}).then((function(e){_(),e.success?(I(),L("Registration Success! Please Login.",{variant:"success",anchorOrigin:{vertical:"bottom",horizontal:"right"}})):L(e.msg,{variant:"error",anchorOrigin:{vertical:"bottom",horizontal:"right"}})})).catch((function(e){alert(e)})):L("Password and Confirm Password not match",{variant:"error",anchorOrigin:{vertical:"bottom",horizontal:"right"}}),e.preventDefault()},children:Object(a.jsxs)(R.a,{component:"main",maxWidth:"xs",children:[Object(a.jsx)(T.a,{}),Object(a.jsxs)(k.a,{className:e.paper,children:[Object(a.jsx)("h1",{children:"Register"}),Object(a.jsx)(G.a,{required:!0,fullWidth:!0,type:"text",variant:"outlined",label:"First Name",onChange:function(e){o(e.target.value)}}),Object(a.jsx)(G.a,{required:!0,fullWidth:!0,type:"text",variant:"outlined",label:"Last Name",onChange:function(e){d(e.target.value)}}),Object(a.jsx)(G.a,{required:!0,fullWidth:!0,type:"email",variant:"outlined",label:"Email",onChange:function(e){m(e.target.value)}}),Object(a.jsx)(G.a,{required:!0,fullWidth:!0,type:"password",variant:"outlined",label:"Password",onChange:function(e){v(e.target.value)}}),Object(a.jsx)(G.a,{required:!0,fullWidth:!0,type:"password",variant:"outlined",label:"Retype Password",onChange:function(e){N(e.target.value)}}),Object(a.jsx)(P.a,{container:!0,justify:"flex-end",spacing:3,children:Object(a.jsx)(P.a,{item:!0,children:Object(a.jsx)(W.a,{type:"submit",variant:"contained",color:"primary",children:"Register"})})}),Object(a.jsx)(M.a,{to:p.LOGIN,children:"Login"})]})]})})},A=function(){return Object(a.jsx)(a.Fragment,{children:Object(a.jsx)(u.c,{children:Object(a.jsx)(u.a,{path:p.HOME,component:E})})})},K=function(){return Object(a.jsx)(a.Fragment,{children:Object(a.jsxs)(u.c,{children:[Object(a.jsx)(u.a,{path:p.LOGIN,component:B}),Object(a.jsx)(u.a,{path:p.REGISTER,component:U})]})})};function Q(){var e=Object(u.f)(),t=Object(c.useCallback)((function(){return e.push(p.LOGIN)}),[e]);return Object(s.e)(b)?Object(a.jsx)(A,{}):(t(),Object(a.jsx)(K,{}))}var V=n(66),X=n(20),Y=n(61),Z=(n(86),n(21));var $,ee=Object(X.b)(),te=($=ee,Object(Z.c)({router:Object(l.b)($),isLogged:m,userData:I})),ne=Object(Y.a)(ee),ae=[].concat(Object(V.a)(Object(j.c)()),[ne]),ce=function(){var e,t=Object(j.a)({reducer:te,middleware:ae,preloadedState:e});return Object(a.jsx)(q.a,{maxSnack:3,children:Object(a.jsx)(s.a,{store:t,children:Object(a.jsx)(l.a,{history:ee,children:Object(a.jsx)(Q,{})})})})},ie=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,134)).then((function(t){var n=t.getCLS,a=t.getFID,c=t.getFCP,i=t.getLCP,r=t.getTTFB;n(e),a(e),c(e),i(e),r(e)}))};o.a.render(Object(a.jsx)(i.a.StrictMode,{children:Object(a.jsx)(ce,{})}),document.getElementById("root")),ie()}},[[87,1,2]]]);
//# sourceMappingURL=main.fdeb6c6e.chunk.js.map