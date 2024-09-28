(()=>{var t={n:a=>{var e=a&&a.__esModule?()=>a.default:()=>a;return t.d(e,{a:e}),e},d:(a,e)=>{for(var s in e)t.o(e,s)&&!t.o(a,s)&&Object.defineProperty(a,s,{enumerable:!0,get:e[s]})},o:(t,a)=>Object.prototype.hasOwnProperty.call(t,a),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},a={};(()=>{"use strict";t.r(a),t.d(a,{extend:()=>st});const e=flarum.reg.get("core","forum/app");var s=t.n(e);function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}const o=flarum.reg.get("core","common/states/PaginatedListState");var n=t.n(o);class l extends(n()){constructor(t){var a,e,s;super({},1,null),a=this,s=void 0,(e=function(t){var a=function(t,a){if("object"!==r(t)||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var s=e.call(t,a);if("object"!==r(s))return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t,"string");return"symbol"===r(a)?a:String(a)}(e="app"))in a?Object.defineProperty(a,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):a[e]=s,this.app=t}get type(){return"flags"}load(){var t;return null!=(t=this.app.session.user)&&t.attribute("newFlagCount")&&(this.pages=[],this.location={page:1}),this.pages.length>0?Promise.resolve():super.loadNext()}}flarum.reg.add("flarum-flags","forum/states/FlagListState",l);const i=flarum.reg.get("core","common/extend"),u=flarum.reg.get("core","forum/utils/PostControls");var c=t.n(u);const f=flarum.reg.get("core","common/components/Button");var g=t.n(f);const d=flarum.reg.get("core","common/components/FormModal");var p=t.n(d);const h=flarum.reg.get("core","common/components/Form");var v=t.n(h);const b=flarum.reg.get("core","common/utils/Stream");var _=t.n(b);const y=flarum.reg.get("core","common/utils/withAttr");var N=t.n(y);const x=flarum.reg.get("core","common/utils/ItemList");var F=t.n(x);class P extends(p()){oninit(t){super.oninit(t),this.success=!1,this.reason=_()(""),this.reasonDetail=_()("")}className(){return"FlagPostModal Modal--medium"}title(){return s().translator.trans("flarum-flags.forum.flag_post.title")}content(){return this.success?m("div",{className:"Modal-body"},m(v(),{className:"Form--centered"},m("p",{className:"helpText"},s().translator.trans("flarum-flags.forum.flag_post.confirmation_message")),m("div",{className:"Form-group Form-controls"},m(g(),{className:"Button Button--primary Button--block",onclick:this.hide.bind(this)},s().translator.trans("flarum-flags.forum.flag_post.dismiss_button"))))):m("div",{className:"Modal-body"},m(v(),{className:"Form--centered"},m("div",{className:"Form-group"},m("div",null,this.flagReasons().toArray())),m("div",{className:"Form-group Form-controls"},m(g(),{className:"Button Button--primary Button--block",type:"submit",loading:this.loading,disabled:!this.reason()},s().translator.trans("flarum-flags.forum.flag_post.submit_button")))))}flagReasons(){const t=new(F()),a=s().forum.attribute("guidelinesUrl");return t.add("off-topic",m("label",{className:"checkbox"},m("input",{type:"radio",name:"reason",checked:"off_topic"===this.reason(),value:"off_topic",onclick:N()("value",this.reason)}),m("strong",null,s().translator.trans("flarum-flags.forum.flag_post.reason_off_topic_label")),s().translator.trans("flarum-flags.forum.flag_post.reason_off_topic_text"),"off_topic"===this.reason()&&m("textarea",{className:"FormControl",placeholder:s().translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),value:this.reasonDetail(),oninput:N()("value",this.reasonDetail)})),70),t.add("inappropriate",m("label",{className:"checkbox"},m("input",{type:"radio",name:"reason",checked:"inappropriate"===this.reason(),value:"inappropriate",onclick:N()("value",this.reason)}),m("strong",null,s().translator.trans("flarum-flags.forum.flag_post.reason_inappropriate_label")),s().translator.trans("flarum-flags.forum.flag_post.reason_inappropriate_text",{a:a?m("a",{href:a,target:"_blank"}):void 0}),"inappropriate"===this.reason()&&m("textarea",{className:"FormControl",placeholder:s().translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),value:this.reasonDetail(),oninput:N()("value",this.reasonDetail)})),60),t.add("spam",m("label",{className:"checkbox"},m("input",{type:"radio",name:"reason",checked:"spam"===this.reason(),value:"spam",onclick:N()("value",this.reason)}),m("strong",null,s().translator.trans("flarum-flags.forum.flag_post.reason_spam_label")),s().translator.trans("flarum-flags.forum.flag_post.reason_spam_text"),"spam"===this.reason()&&m("textarea",{className:"FormControl",placeholder:s().translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),value:this.reasonDetail(),oninput:N()("value",this.reasonDetail)})),50),t.add("other",m("label",{className:"checkbox"},m("input",{type:"radio",name:"reason",checked:"other"===this.reason(),value:"other",onclick:N()("value",this.reason)}),m("strong",null,s().translator.trans("flarum-flags.forum.flag_post.reason_other_label")),"other"===this.reason()&&m("textarea",{className:"FormControl",value:this.reasonDetail(),oninput:N()("value",this.reasonDetail)})),10),t}onsubmit(t){t.preventDefault(),this.loading=!0,s().store.createRecord("flags").save({reason:"other"===this.reason()?null:this.reason(),reasonDetail:this.reasonDetail(),relationships:{post:this.attrs.post}},{errorHandler:this.onerror.bind(this)}).then((()=>this.success=!0)).catch((()=>{})).then(this.loaded.bind(this))}}flarum.reg.add("flarum-flags","forum/components/FlagPostModal",P);const w=flarum.reg.get("core","forum/components/HeaderSecondary");var k=t.n(w);const D=flarum.reg.get("core","forum/components/HeaderDropdown");var S=t.n(D);const C=flarum.reg.get("core","common/utils/classList");var A=t.n(C);const L=flarum.reg.get("core","common/Component");var M=t.n(L);const B=flarum.reg.get("core","common/components/Avatar");var O=t.n(B);const j=flarum.reg.get("core","common/helpers/username");var I=t.n(j);const T=flarum.reg.get("core","forum/components/HeaderList");var H=t.n(T);const R=flarum.reg.get("core","forum/components/HeaderListItem");var E=t.n(R);class U extends(M()){oninit(t){super.oninit(t)}view(){const t=this.attrs.state;return m(H(),{className:"FlagList",title:s().translator.trans("flarum-flags.forum.flagged_posts.title"),controls:this.controlItems(),hasItems:t.hasItems(),loading:t.isLoading(),emptyText:s().translator.trans("flarum-flags.forum.flagged_posts.empty_text"),loadMore:()=>t.hasNext()&&!t.isLoadingNext()&&t.loadNext()},m("ul",{className:"HeaderListGroup-content"},this.content(t)))}controlItems(){return new(F())}content(t){return!t.isLoading()&&t.hasItems()?t.getPages().map((t=>t.items.map((t=>{const a=t.post();return m("li",null,m(E(),{className:"Flag",avatar:m(O(),{user:a.user()||null}),icon:"fas fa-flag",content:s().translator.trans("flarum-flags.forum.flagged_posts.item_text",{username:I()(a.user()),em:m("em",null),discussion:a.discussion().title()}),excerpt:a.contentPlain(),datetime:t.createdAt(),href:s().route.post(a),onclick:t=>{t.redraw=!1}}))})))):null}}flarum.reg.add("flarum-flags","forum/components/FlagList",U);class G extends(S()){static initAttrs(t){t.className=A()("FlagsDropdown",t.className),t.label=t.label||s().translator.trans("flarum-flags.forum.flagged_posts.tooltip"),t.icon=t.icon||"fas fa-flag",super.initAttrs(t)}getContent(){return m(U,{state:this.attrs.state})}goToRoute(){m.route.set(s().route("flags"))}getUnreadCount(){return s().forum.attribute("flagCount")}getNewCount(){return s().session.user.attribute("newFlagCount")}}flarum.reg.add("flarum-flags","forum/components/FlagsDropdown",G);const q=flarum.reg.get("core","forum/components/Post");var z=t.n(q);const V=flarum.reg.get("core","common/utils/humanTime");var J=t.n(V);const K=flarum.reg.get("core","common/extenders");var Q=t.n(K);const W=flarum.reg.get("core","common/models/Post");var X=t.n(W);const Y=flarum.reg.get("core","common/components/Page");var Z=t.n(Y);class $ extends(Z()){oninit(t){super.oninit(t),s().history.push("flags"),s().flags.load(),this.bodyClass="App--flags"}view(){return m("div",{className:"FlagsPage"},m(U,{state:s().flags}))}}flarum.reg.add("flarum-flags","forum/components/FlagsPage",$);const tt=flarum.reg.get("core","common/Model");var at=t.n(tt);class et extends(at()){type(){return at().attribute("type").call(this)}reason(){return at().attribute("reason").call(this)}reasonDetail(){return at().attribute("reasonDetail").call(this)}createdAt(){return at().attribute("createdAt",at().transformDate).call(this)}post(){return at().hasOne("post").call(this)}user(){return at().hasOne("user").call(this)}}flarum.reg.add("flarum-flags","forum/models/Flag",et);const st=[(new(Q().Routes)).add("flags","/flags",$),(new(Q().Store)).add("flags",et),new(Q().Model)(X()).hasMany("flags").attribute("canFlag")];s().initializers.add("flarum-flags",(()=>{s().flags=new l(s()),(0,i.extend)(c(),"userControls",(function(t,a){!a.isHidden()&&"comment"===a.contentType()&&a.canFlag()&&t.add("flag",m(g(),{icon:"fas fa-flag",onclick:()=>s().modal.show(P,{post:a})},s().translator.trans("flarum-flags.forum.post_controls.flag_button")))})),(0,i.extend)(k().prototype,"items",(function(t){s().forum.attribute("canViewFlags")&&t.add("flags",m(G,{state:s().flags}),15)})),(0,i.extend)(z().prototype,"elementAttrs",(function(t){this.attrs.post.flags().length&&(t.className+=" Post--flagged")})),z().prototype.dismissFlag=function(t){const a=this.attrs.post;return delete a.data.relationships.flags,this.subtree.invalidate(),s().flags.cache&&s().flags.cache.some(((t,e)=>{if(t.post()===a){if(s().flags.cache.splice(e,1),s().flags.index===a){let t=s().flags.cache[e];if(t||(t=s().flags.cache[0]),t){const a=t.post();s().flags.index=a,m.route.set(s().route.post(a))}}return!0}})),s().request({url:s().forum.attribute("apiUrl")+a.apiEndpoint()+"/flags",method:"DELETE",body:t})},z().prototype.flagActionItems=function(){const t=new(F()),a=c().destructiveControls(this.attrs.post);return Object.keys(a.toObject()).forEach((t=>{const e=a.get(t).attrs;e.className="Button",(0,i.extend)(e,"onclick",(()=>this.dismissFlag()))})),t.add("controls",m("div",{className:"ButtonGroup"},a.toArray())),t.add("dismiss",m(g(),{className:"Button",icon:"far fa-eye-slash",onclick:this.dismissFlag.bind(this)},s().translator.trans("flarum-flags.forum.post.dismiss_flag_button")),-100),t},(0,i.override)(z().prototype,"header",(function(t){const a=this.attrs.post,e=a.flags();if(e.length)return a.isHidden()&&(this.revealContent=!0),m("div",{className:"Post-flagged"},m("div",{className:"Post-flagged-flags"},e.map((t=>m("div",{className:"Post-flagged-flag"},this.flagReason(t))))),m("div",{className:"Post-flagged-actions"},this.flagActionItems().toArray()))})),z().prototype.flagReason=function(t){if("user"===t.type()){const a=t.user(),e=t.reason()?s().translator.trans("flarum-flags.forum.flag_post.reason_".concat(t.reason(),"_label")):null,r=t.reasonDetail(),o=J()(t.createdAt());return[s().translator.trans(e?"flarum-flags.forum.post.flagged_by_with_reason_text":"flarum-flags.forum.post.flagged_by_text",{time:o,user:a,reason:e}),!!r&&m("span",{className:"Post-flagged-detail"},r)]}}}))})(),module.exports=a})();
//# sourceMappingURL=forum.js.map