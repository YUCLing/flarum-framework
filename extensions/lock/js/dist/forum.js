(()=>{var o={n:t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},d:(t,e)=>{for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},o:(o,t)=>Object.prototype.hasOwnProperty.call(o,t),r:o=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})}},t={};(()=>{"use strict";o.r(t),o.d(t,{extend:()=>S});const e=flarum.reg.get("core","common/extend"),n=flarum.reg.get("core","forum/app");var r=o.n(n);const s=flarum.reg.get("core","forum/components/Notification");var c=o.n(s);class a extends(c()){icon(){return"fas fa-lock"}href(){const o=this.attrs.notification;return r().route.discussion(o.subject(),o.content().postNumber)}content(){return r().translator.trans("flarum-lock.forum.notifications.discussion_locked_text",{user:this.attrs.notification.fromUser()})}excerpt(){return null}}flarum.reg.add("flarum-lock","forum/components/DiscussionLockedNotification",a);const i=flarum.reg.get("core","common/models/Discussion");var l=o.n(i);const u=flarum.reg.get("core","common/components/Badge");var d=o.n(u);const f=flarum.reg.get("core","forum/utils/DiscussionControls");var k=o.n(f);const g=flarum.reg.get("core","forum/components/DiscussionPage");var p=o.n(g);const b=flarum.reg.get("core","common/components/Button");var _=o.n(b);const y=flarum.reg.get("core","common/extenders");var v=o.n(y);const L=flarum.reg.get("core","forum/components/EventPost");var h=o.n(L);class x extends(h()){icon(){return this.attrs.post.content().locked?"fas fa-lock":"fas fa-unlock"}descriptionKey(){return this.attrs.post.content().locked?"flarum-lock.forum.post_stream.discussion_locked_text":"flarum-lock.forum.post_stream.discussion_unlocked_text"}}flarum.reg.add("flarum-lock","forum/components/DiscussionLockedPost",x);class P{pattern(){return"is:locked"}toFilter(o,t){return{[(t?"-":"")+"locked"]:!0}}filterKey(){return"locked"}fromFilter(o,t){return"".concat(t?"-":"","is:locked")}}flarum.reg.add("flarum-lock","common/query/discussions/LockedGambit",P);const S=[(new(v().Search)).gambit("discussions",P),(new(v().PostTypes)).add("discussionLocked",x),new(v().Model)(l()).attribute("isLocked").attribute("canLock")];r().initializers.add("flarum-lock",(()=>{r().notificationComponents.discussionLocked=a,(0,e.extend)(l().prototype,"badges",(function(o){this.isLocked()&&o.add("locked",m(d(),{type:"locked",label:r().translator.trans("flarum-lock.forum.badge.locked_tooltip"),icon:"fas fa-lock"}))})),(0,e.extend)(k(),"moderationControls",(function(o,t){t.canLock()&&o.add("lock",m(_(),{icon:"fas fa-lock",onclick:this.lockAction.bind(t)},r().translator.trans("flarum-lock.forum.discussion_controls.".concat(t.isLocked()?"unlock":"lock","_button"))))})),k().lockAction=function(){this.save({isLocked:!this.isLocked()}).then((()=>{r().current.matches(p())&&r().current.get("stream").update(),m.redraw()}))},(0,e.extend)("flarum/forum/components/NotificationGrid","notificationTypes",(function(o){o.add("discussionLocked",{name:"discussionLocked",icon:"fas fa-lock",label:r().translator.trans("flarum-lock.forum.settings.notify_discussion_locked_label")})}))}))})(),module.exports=t})();
//# sourceMappingURL=forum.js.map