//>>built
require({cache:{"url:dijit/templates/Tree.html":"<div role=\"tree\">\n\t<div class=\"dijitInline dijitTreeIndent\" style=\"position: absolute; top: -9999px\" data-dojo-attach-point=\"indentDetector\"></div>\n\t<div class=\"dijitTreeExpando dijitTreeExpandoLoading\" data-dojo-attach-point=\"rootLoadingIndicator\"></div>\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitTreeContainer\" role=\"presentation\">\n\t</div>\n</div>\n","url:dijit/templates/TreeNode.html":"<div class=\"dijitTreeNode\" role=\"presentation\"\n\t><div data-dojo-attach-point=\"rowNode\" class=\"dijitTreeRow\" role=\"presentation\"\n\t\t><span data-dojo-attach-point=\"expandoNode\" class=\"dijitInline dijitTreeExpando\" role=\"presentation\"></span\n\t\t><span data-dojo-attach-point=\"expandoNodeText\" class=\"dijitExpandoText\" role=\"presentation\"></span\n\t\t><span data-dojo-attach-point=\"contentNode\"\n\t\t\tclass=\"dijitTreeContent\" role=\"presentation\">\n\t\t\t<span role=\"presentation\" class=\"dijitInline dijitIcon dijitTreeIcon\" data-dojo-attach-point=\"iconNode\"></span\n\t\t\t><span data-dojo-attach-point=\"labelNode,focusNode\" class=\"dijitTreeLabel\" role=\"treeitem\" tabindex=\"-1\" aria-selected=\"false\"></span>\n\t\t</span\n\t></div>\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitTreeNodeContainer\" role=\"presentation\" style=\"display: none;\"></div>\n</div>\n"}});
define("dijit/Tree",["dojo/_base/array","dojo/aspect","dojo/_base/connect","dojo/cookie","dojo/_base/declare","dojo/Deferred","dojo/promise/all","dojo/dom","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/errors/create","dojo/fx","dojo/has","dojo/_base/kernel","dojo/keys","dojo/_base/lang","dojo/on","dojo/topic","dojo/touch","dojo/when","./a11yclick","./focus","./registry","./_base/manager","./_Widget","./_TemplatedMixin","./_Container","./_Contained","./_CssStateMixin","./_KeyNavMixin","dojo/text!./templates/TreeNode.html","dojo/text!./templates/Tree.html","./tree/TreeStoreModel","./tree/ForestStoreModel","./tree/_dndSelector","dojo/query!css2"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,on,_12,_13,_14,_15,_16,_17,_18,_19,_1a,_1b,_1c,_1d,_1e,_1f,_20,_21,_22,_23){
function _24(d){
return _11.delegate(d.promise||d,{addCallback:function(_25){
this.then(_25);
},addErrback:function(_26){
this.otherwise(_26);
}});
};
var _27=_5("dijit._TreeNode",[_19,_1a,_1b,_1c,_1d],{item:null,isTreeNode:true,label:"",_setLabelAttr:function(val){
this.labelNode[this.labelType=="html"?"innerHTML":"innerText" in this.labelNode?"innerText":"textContent"]=val;
this._set("label",val);
},labelType:"text",isExpandable:null,isExpanded:false,state:"NotLoaded",templateString:_1f,baseClass:"dijitTreeNode",cssStateNodes:{rowNode:"dijitTreeRow"},_setTooltipAttr:{node:"rowNode",type:"attribute",attribute:"title"},buildRendering:function(){
this.inherited(arguments);
this._setExpando();
this._updateItemClasses(this.item);
if(this.isExpandable){
this.labelNode.setAttribute("aria-expanded",this.isExpanded);
}
this.setSelected(false);
},_setIndentAttr:function(_28){
var _29=(Math.max(_28,0)*this.tree._nodePixelIndent)+"px";
_b.set(this.domNode,"backgroundPosition",_29+" 0px");
_b.set(this.rowNode,this.isLeftToRight()?"paddingLeft":"paddingRight",_29);
_1.forEach(this.getChildren(),function(_2a){
_2a.set("indent",_28+1);
});
this._set("indent",_28);
},markProcessing:function(){
this.state="Loading";
this._setExpando(true);
},unmarkProcessing:function(){
this._setExpando(false);
},_updateItemClasses:function(_2b){
var _2c=this.tree,_2d=_2c.model;
if(_2c._v10Compat&&_2b===_2d.root){
_2b=null;
}
this._applyClassAndStyle(_2b,"icon","Icon");
this._applyClassAndStyle(_2b,"label","Label");
this._applyClassAndStyle(_2b,"row","Row");
this.tree._startPaint(true);
},_applyClassAndStyle:function(_2e,_2f,_30){
var _31="_"+_2f+"Class";
var _32=_2f+"Node";
var _33=this[_31];
this[_31]=this.tree["get"+_30+"Class"](_2e,this.isExpanded);
_9.replace(this[_32],this[_31]||"",_33||"");
_b.set(this[_32],this.tree["get"+_30+"Style"](_2e,this.isExpanded)||{});
},_updateLayout:function(){
var _34=this.getParent();
if(!_34||!_34.rowNode||_34.rowNode.style.display=="none"){
_9.add(this.domNode,"dijitTreeIsRoot");
}else{
_9.toggle(this.domNode,"dijitTreeIsLast",!this.getNextSibling());
}
},_setExpando:function(_35){
var _36=["dijitTreeExpandoLoading","dijitTreeExpandoOpened","dijitTreeExpandoClosed","dijitTreeExpandoLeaf"],_37=["*","-","+","*"],idx=_35?0:(this.isExpandable?(this.isExpanded?1:2):3);
_9.replace(this.expandoNode,_36[idx],_36);
this.expandoNodeText.innerHTML=_37[idx];
},expand:function(){
if(this._expandDeferred){
return _24(this._expandDeferred);
}
if(this._collapseDeferred){
this._collapseDeferred.cancel();
delete this._collapseDeferred;
}
this.isExpanded=true;
this.labelNode.setAttribute("aria-expanded","true");
if(this.tree.showRoot||this!==this.tree.rootNode){
this.containerNode.setAttribute("role","group");
}
_9.add(this.contentNode,"dijitTreeContentExpanded");
this._setExpando();
this._updateItemClasses(this.item);
if(this==this.tree.rootNode&&this.tree.showRoot){
this.tree.domNode.setAttribute("aria-expanded","true");
}
var _38=_d.wipeIn({node:this.containerNode,duration:_18.defaultDuration});
var def=(this._expandDeferred=new _6(function(){
_38.stop();
}));
_2.after(_38,"onEnd",function(){
def.resolve(true);
},true);
_38.play();
return _24(def);
},collapse:function(){
if(this._collapseDeferred){
return _24(this._collapseDeferred);
}
if(this._expandDeferred){
this._expandDeferred.cancel();
delete this._expandDeferred;
}
this.isExpanded=false;
this.labelNode.setAttribute("aria-expanded","false");
if(this==this.tree.rootNode&&this.tree.showRoot){
this.tree.domNode.setAttribute("aria-expanded","false");
}
_9.remove(this.contentNode,"dijitTreeContentExpanded");
this._setExpando();
this._updateItemClasses(this.item);
var _39=_d.wipeOut({node:this.containerNode,duration:_18.defaultDuration});
var def=(this._collapseDeferred=new _6(function(){
_39.stop();
}));
_2.after(_39,"onEnd",function(){
def.resolve(true);
},true);
_39.play();
return _24(def);
},indent:0,setChildItems:function(_3a){
var _3b=this.tree,_3c=_3b.model,_3d=[];
var _3e=this.getChildren();
_1.forEach(_3e,function(_3f){
_1b.prototype.removeChild.call(this,_3f);
},this);
this.defer(function(){
_1.forEach(_3e,function(_40){
if(!_40._destroyed&&!_40.getParent()){
_3b.dndController.removeTreeNode(_40);
function _41(_42){
var id=_3c.getIdentity(_42.item),ary=_3b._itemNodesMap[id];
if(ary.length==1){
delete _3b._itemNodesMap[id];
}else{
var _43=_1.indexOf(ary,_42);
if(_43!=-1){
ary.splice(_43,1);
}
}
_1.forEach(_42.getChildren(),_41);
};
_41(_40);
if(_3b.persist){
var _44=_1.map(_40.getTreePath(),function(_45){
return _3b.model.getIdentity(_45);
}).join("/");
for(var _46 in _3b._openedNodes){
if(_46.substr(0,_44.length)==_44){
delete _3b._openedNodes[_46];
}
}
_3b._saveExpandedNodes();
}
_40.destroyRecursive();
}
});
});
this.state="Loaded";
if(_3a&&_3a.length>0){
this.isExpandable=true;
_1.forEach(_3a,function(_47){
var id=_3c.getIdentity(_47),_48=_3b._itemNodesMap[id],_49;
if(_48){
for(var i=0;i<_48.length;i++){
if(_48[i]&&!_48[i].getParent()){
_49=_48[i];
_49.set("indent",this.indent+1);
break;
}
}
}
if(!_49){
_49=this.tree._createTreeNode({item:_47,tree:_3b,isExpandable:_3c.mayHaveChildren(_47),label:_3b.getLabel(_47),labelType:(_3b.model&&_3b.model.labelType)||"text",tooltip:_3b.getTooltip(_47),ownerDocument:_3b.ownerDocument,dir:_3b.dir,lang:_3b.lang,textDir:_3b.textDir,indent:this.indent+1});
if(_48){
_48.push(_49);
}else{
_3b._itemNodesMap[id]=[_49];
}
}
this.addChild(_49);
if(this.tree.autoExpand||this.tree._state(_49)){
_3d.push(_3b._expandNode(_49));
}
},this);
_1.forEach(this.getChildren(),function(_4a){
_4a._updateLayout();
});
}else{
this.isExpandable=false;
}
if(this._setExpando){
this._setExpando(false);
}
this._updateItemClasses(this.item);
var def=_7(_3d);
this.tree._startPaint(def);
return _24(def);
},getTreePath:function(){
var _4b=this;
var _4c=[];
while(_4b&&_4b!==this.tree.rootNode){
_4c.unshift(_4b.item);
_4b=_4b.getParent();
}
_4c.unshift(this.tree.rootNode.item);
return _4c;
},getIdentity:function(){
return this.tree.model.getIdentity(this.item);
},removeChild:function(_4d){
this.inherited(arguments);
var _4e=this.getChildren();
if(_4e.length==0){
this.isExpandable=false;
this.collapse();
}
_1.forEach(_4e,function(_4f){
_4f._updateLayout();
});
},makeExpandable:function(){
this.isExpandable=true;
this._setExpando(false);
},setSelected:function(_50){
this.labelNode.setAttribute("aria-selected",_50?"true":"false");
_9.toggle(this.rowNode,"dijitTreeRowSelected",_50);
},focus:function(){
_16.focus(this.focusNode);
}});
if(_e("dojo-bidi")){
_27.extend({_setTextDirAttr:function(_51){
if(_51&&((this.textDir!=_51)||!this._created)){
this._set("textDir",_51);
this.applyTextDir(this.labelNode);
_1.forEach(this.getChildren(),function(_52){
_52.set("textDir",_51);
},this);
}
}});
}
var _53=_5("dijit.Tree",[_19,_1e,_1a,_1d],{baseClass:"dijitTree",store:null,model:null,query:null,label:"",showRoot:true,childrenAttr:["children"],paths:[],path:[],selectedItems:null,selectedItem:null,openOnClick:false,openOnDblClick:false,templateString:_20,persist:false,autoExpand:false,dndController:_23,dndParams:["onDndDrop","itemCreator","onDndCancel","checkAcceptance","checkItemAcceptance","dragThreshold","betweenThreshold"],onDndDrop:null,itemCreator:null,onDndCancel:null,checkAcceptance:null,checkItemAcceptance:null,dragThreshold:5,betweenThreshold:0,_nodePixelIndent:19,_publish:function(_54,_55){
_12.publish(this.id,_11.mixin({tree:this,event:_54},_55||{}));
},postMixInProperties:function(){
this.tree=this;
if(this.autoExpand){
this.persist=false;
}
this._itemNodesMap={};
if(!this.cookieName&&this.id){
this.cookieName=this.id+"SaveStateCookie";
}
this.expandChildrenDeferred=new _6();
this.pendingCommandsPromise=this.expandChildrenDeferred.promise;
this.inherited(arguments);
},postCreate:function(){
this._initState();
var _56=this;
this.own(on(this.containerNode,on.selector(".dijitTreeNode",_13.enter),function(evt){
_56._onNodeMouseEnter(_17.byNode(this),evt);
}),on(this.containerNode,on.selector(".dijitTreeNode",_13.leave),function(evt){
_56._onNodeMouseLeave(_17.byNode(this),evt);
}),on(this.containerNode,on.selector(".dijitTreeRow",_15.press),function(evt){
_56._onNodePress(_17.getEnclosingWidget(this),evt);
}),on(this.containerNode,on.selector(".dijitTreeRow",_15),function(evt){
_56._onClick(_17.getEnclosingWidget(this),evt);
}),on(this.containerNode,on.selector(".dijitTreeRow","dblclick"),function(evt){
_56._onDblClick(_17.getEnclosingWidget(this),evt);
}));
if(!this.model){
this._store2model();
}
this.own(_2.after(this.model,"onChange",_11.hitch(this,"_onItemChange"),true),_2.after(this.model,"onChildrenChange",_11.hitch(this,"_onItemChildrenChange"),true),_2.after(this.model,"onDelete",_11.hitch(this,"_onItemDelete"),true));
this.inherited(arguments);
if(this.dndController){
if(_11.isString(this.dndController)){
this.dndController=_11.getObject(this.dndController);
}
var _57={};
for(var i=0;i<this.dndParams.length;i++){
if(this[this.dndParams[i]]){
_57[this.dndParams[i]]=this[this.dndParams[i]];
}
}
this.dndController=new this.dndController(this,_57);
}
this._load();
this.onLoadDeferred=_24(this.pendingCommandsPromise);
this.onLoadDeferred.then(_11.hitch(this,"onLoad"));
},_store2model:function(){
this._v10Compat=true;
_f.deprecated("Tree: from version 2.0, should specify a model object rather than a store/query");
var _58={id:this.id+"_ForestStoreModel",store:this.store,query:this.query,childrenAttrs:this.childrenAttr};
if(this.params.mayHaveChildren){
_58.mayHaveChildren=_11.hitch(this,"mayHaveChildren");
}
if(this.params.getItemChildren){
_58.getChildren=_11.hitch(this,function(_59,_5a,_5b){
this.getItemChildren((this._v10Compat&&_59===this.model.root)?null:_59,_5a,_5b);
});
}
this.model=new _22(_58);
this.showRoot=Boolean(this.label);
},onLoad:function(){
},_load:function(){
this.model.getRoot(_11.hitch(this,function(_5c){
var rn=(this.rootNode=this.tree._createTreeNode({item:_5c,tree:this,isExpandable:true,label:this.label||this.getLabel(_5c),labelType:this.model.labelType||"text",textDir:this.textDir,indent:this.showRoot?0:-1}));
if(!this.showRoot){
rn.rowNode.style.display="none";
this.domNode.setAttribute("role","presentation");
this.domNode.removeAttribute("aria-expanded");
this.domNode.removeAttribute("aria-multiselectable");
if(this["aria-label"]){
rn.containerNode.setAttribute("aria-label",this["aria-label"]);
this.domNode.removeAttribute("aria-label");
}else{
if(this["aria-labelledby"]){
rn.containerNode.setAttribute("aria-labelledby",this["aria-labelledby"]);
this.domNode.removeAttribute("aria-labelledby");
}
}
rn.labelNode.setAttribute("role","presentation");
rn.containerNode.setAttribute("role","tree");
rn.containerNode.setAttribute("aria-expanded","true");
rn.containerNode.setAttribute("aria-multiselectable",!this.dndController.singular);
}else{
this.domNode.setAttribute("aria-multiselectable",!this.dndController.singular);
this.rootLoadingIndicator.style.display="none";
}
this.containerNode.appendChild(rn.domNode);
var _5d=this.model.getIdentity(_5c);
if(this._itemNodesMap[_5d]){
this._itemNodesMap[_5d].push(rn);
}else{
this._itemNodesMap[_5d]=[rn];
}
rn._updateLayout();
this._expandNode(rn).then(_11.hitch(this,function(){
this.rootLoadingIndicator.style.display="none";
this.expandChildrenDeferred.resolve(true);
}));
}),_11.hitch(this,function(err){
console.error(this,": error loading root: ",err);
}));
},getNodesByItem:function(_5e){
if(!_5e){
return [];
}
var _5f=_11.isString(_5e)?_5e:this.model.getIdentity(_5e);
return [].concat(this._itemNodesMap[_5f]);
},_setSelectedItemAttr:function(_60){
this.set("selectedItems",[_60]);
},_setSelectedItemsAttr:function(_61){
var _62=this;
return this.pendingCommandsPromise=this.pendingCommandsPromise.always(_11.hitch(this,function(){
var _63=_1.map(_61,function(_64){
return (!_64||_11.isString(_64))?_64:_62.model.getIdentity(_64);
});
var _65=[];
_1.forEach(_63,function(id){
_65=_65.concat(_62._itemNodesMap[id]||[]);
});
this.set("selectedNodes",_65);
}));
},_setPathAttr:function(_66){
if(_66.length){
return _24(this.set("paths",[_66]).then(function(_67){
return _67[0];
}));
}else{
return _24(this.set("paths",[]).then(function(_68){
return _68[0];
}));
}
},_setPathsAttr:function(_69){
var _6a=this;
function _6b(_6c,_6d){
var _6e=_6c.shift();
var _6f=_1.filter(_6d,function(_70){
return _70.getIdentity()==_6e;
})[0];
if(!!_6f){
if(_6c.length){
return _6a._expandNode(_6f).then(function(){
return _6b(_6c,_6f.getChildren());
});
}else{
return _6f;
}
}else{
throw new _53.PathError("Could not expand path at "+_6e);
}
};
return _24(this.pendingCommandsPromise=this.pendingCommandsPromise.always(function(){
return _7(_1.map(_69,function(_71){
_71=_1.map(_71,function(_72){
return _11.isString(_72)?_72:_6a.model.getIdentity(_72);
});
if(_71.length){
return _6b(_71,[_6a.rootNode]);
}else{
throw new _53.PathError("Empty path");
}
}));
}).then(function setNodes(_73){
_6a.set("selectedNodes",_73);
return _6a.paths;
}));
},_setSelectedNodeAttr:function(_74){
this.set("selectedNodes",[_74]);
},_setSelectedNodesAttr:function(_75){
this.dndController.setSelection(_75);
},expandAll:function(){
var _76=this;
function _77(_78){
return _76._expandNode(_78).then(function(){
var _79=_1.filter(_78.getChildren()||[],function(_7a){
return _7a.isExpandable;
});
return _7(_1.map(_79,_77));
});
};
return _24(_77(this.rootNode));
},collapseAll:function(){
var _7b=this;
function _7c(_7d){
var _7e=_1.filter(_7d.getChildren()||[],function(_7f){
return _7f.isExpandable;
}),_80=_7(_1.map(_7e,_7c));
if(!_7d.isExpanded||(_7d==_7b.rootNode&&!_7b.showRoot)){
return _80;
}else{
return _80.then(function(){
return _7b._collapseNode(_7d);
});
}
};
return _24(_7c(this.rootNode));
},mayHaveChildren:function(){
},getItemChildren:function(){
},getLabel:function(_81){
return this.model.getLabel(_81);
},getIconClass:function(_82,_83){
return (!_82||this.model.mayHaveChildren(_82))?(_83?"dijitFolderOpened":"dijitFolderClosed"):"dijitLeaf";
},getLabelClass:function(){
},getRowClass:function(){
},getIconStyle:function(){
},getLabelStyle:function(){
},getRowStyle:function(){
},getTooltip:function(){
return "";
},_onDownArrow:function(evt,_84){
var _85=this._getNext(_84);
if(_85&&_85.isTreeNode){
this.focusNode(_85);
}
},_onUpArrow:function(evt,_86){
var _87=_86.getPreviousSibling();
if(_87){
_86=_87;
while(_86.isExpandable&&_86.isExpanded&&_86.hasChildren()){
var _88=_86.getChildren();
_86=_88[_88.length-1];
}
}else{
var _89=_86.getParent();
if(!(!this.showRoot&&_89===this.rootNode)){
_86=_89;
}
}
if(_86&&_86.isTreeNode){
this.focusNode(_86);
}
},_onRightArrow:function(evt,_8a){
if(_8a.isExpandable&&!_8a.isExpanded){
this._expandNode(_8a);
}else{
if(_8a.hasChildren()){
_8a=_8a.getChildren()[0];
if(_8a&&_8a.isTreeNode){
this.focusNode(_8a);
}
}
}
},_onLeftArrow:function(evt,_8b){
if(_8b.isExpandable&&_8b.isExpanded){
this._collapseNode(_8b);
}else{
var _8c=_8b.getParent();
if(_8c&&_8c.isTreeNode&&!(!this.showRoot&&_8c===this.rootNode)){
this.focusNode(_8c);
}
}
},focusLastChild:function(){
var _8d=this._getLast();
if(_8d&&_8d.isTreeNode){
this.focusNode(_8d);
}
},_getFirst:function(){
return this.showRoot?this.rootNode:this.rootNode.getChildren()[0];
},_getLast:function(){
var _8e=this.rootNode;
while(_8e.isExpanded){
var c=_8e.getChildren();
if(!c.length){
break;
}
_8e=c[c.length-1];
}
return _8e;
},_getNext:function(_8f){
if(_8f.isExpandable&&_8f.isExpanded&&_8f.hasChildren()){
return _8f.getChildren()[0];
}else{
while(_8f&&_8f.isTreeNode){
var _90=_8f.getNextSibling();
if(_90){
return _90;
}
_8f=_8f.getParent();
}
return null;
}
},childSelector:".dijitTreeRow",isExpandoNode:function(_91,_92){
return _8.isDescendant(_91,_92.expandoNode)||_8.isDescendant(_91,_92.expandoNodeText);
},_onNodePress:function(_93,e){
_93.focus();
},__click:function(_94,e,_95,_96){
var _97=e.target,_98=this.isExpandoNode(_97,_94);
if(_94.isExpandable&&(_95||_98)){
this._onExpandoClick({node:_94});
}else{
this._publish("execute",{item:_94.item,node:_94,evt:e});
this[_96](_94.item,_94,e);
this.focusNode(_94);
}
e.stopPropagation();
e.preventDefault();
},_onClick:function(_99,e){
this.__click(_99,e,this.openOnClick,"onClick");
},_onDblClick:function(_9a,e){
this.__click(_9a,e,this.openOnDblClick,"onDblClick");
},_onExpandoClick:function(_9b){
var _9c=_9b.node;
this.focusNode(_9c);
if(_9c.isExpanded){
this._collapseNode(_9c);
}else{
this._expandNode(_9c);
}
},onClick:function(){
},onDblClick:function(){
},onOpen:function(){
},onClose:function(){
},_getNextNode:function(_9d){
_f.deprecated(this.declaredClass+"::_getNextNode(node) is deprecated. Use _getNext(node) instead.","","2.0");
return this._getNext(_9d);
},_getRootOrFirstNode:function(){
_f.deprecated(this.declaredClass+"::_getRootOrFirstNode() is deprecated. Use _getFirst() instead.","","2.0");
return this._getFirst();
},_collapseNode:function(_9e){
if(_9e._expandNodeDeferred){
delete _9e._expandNodeDeferred;
}
if(_9e.state=="Loading"){
return;
}
if(_9e.isExpanded){
var ret=_9e.collapse();
this.onClose(_9e.item,_9e);
this._state(_9e,false);
this._startPaint(ret);
return ret;
}
},_expandNode:function(_9f){
if(_9f._expandNodeDeferred){
return _9f._expandNodeDeferred;
}
var _a0=this.model,_a1=_9f.item,_a2=this;
if(!_9f._loadDeferred){
_9f.markProcessing();
_9f._loadDeferred=new _6();
_a0.getChildren(_a1,function(_a3){
_9f.unmarkProcessing();
_9f.setChildItems(_a3).then(function(){
_9f._loadDeferred.resolve(_a3);
});
},function(err){
console.error(_a2,": error loading "+_9f.label+" children: ",err);
_9f._loadDeferred.reject(err);
});
}
var def=_9f._loadDeferred.then(_11.hitch(this,function(){
var _a4=_9f.expand();
this.onOpen(_9f.item,_9f);
this._state(_9f,true);
return _a4;
}));
this._startPaint(def);
return def;
},focusNode:function(_a5){
this.focusChild(_a5);
},_onNodeMouseEnter:function(){
},_onNodeMouseLeave:function(){
},_onItemChange:function(_a6){
var _a7=this.model,_a8=_a7.getIdentity(_a6),_a9=this._itemNodesMap[_a8];
if(_a9){
var _aa=this.getLabel(_a6),_ab=this.getTooltip(_a6);
_1.forEach(_a9,function(_ac){
_ac.set({item:_a6,label:_aa,tooltip:_ab});
_ac._updateItemClasses(_a6);
});
}
},_onItemChildrenChange:function(_ad,_ae){
var _af=this.model,_b0=_af.getIdentity(_ad),_b1=this._itemNodesMap[_b0];
if(_b1){
_1.forEach(_b1,function(_b2){
_b2.setChildItems(_ae);
});
}
},_onItemDelete:function(_b3){
var _b4=this.model,_b5=_b4.getIdentity(_b3),_b6=this._itemNodesMap[_b5];
if(_b6){
_1.forEach(_b6,function(_b7){
this.dndController.removeTreeNode(_b7);
var _b8=_b7.getParent();
if(_b8){
_b8.removeChild(_b7);
}
_b7.destroyRecursive();
},this);
delete this._itemNodesMap[_b5];
}
},_initState:function(){
this._openedNodes={};
if(this.persist&&this.cookieName){
var _b9=_4(this.cookieName);
if(_b9){
_1.forEach(_b9.split(","),function(_ba){
this._openedNodes[_ba]=true;
},this);
}
}
},_state:function(_bb,_bc){
if(!this.persist){
return false;
}
var _bd=_1.map(_bb.getTreePath(),function(_be){
return this.model.getIdentity(_be);
},this).join("/");
if(arguments.length===1){
return this._openedNodes[_bd];
}else{
if(_bc){
this._openedNodes[_bd]=true;
}else{
delete this._openedNodes[_bd];
}
this._saveExpandedNodes();
}
},_saveExpandedNodes:function(){
if(this.persist&&this.cookieName){
var ary=[];
for(var id in this._openedNodes){
ary.push(id);
}
_4(this.cookieName,ary.join(","),{expires:365,path:"/"});
}
},destroy:function(){
if(this._curSearch){
this._curSearch.timer.remove();
delete this._curSearch;
}
if(this.rootNode){
this.rootNode.destroyRecursive();
}
if(this.dndController&&!_11.isString(this.dndController)){
this.dndController.destroy();
}
this.rootNode=null;
this.inherited(arguments);
},destroyRecursive:function(){
this.destroy();
},resize:function(_bf){
if(_bf){
_a.setMarginBox(this.domNode,_bf);
}
this._nodePixelIndent=_a.position(this.tree.indentDetector).w||this._nodePixelIndent;
this.expandChildrenDeferred.then(_11.hitch(this,function(){
this.rootNode.set("indent",this.showRoot?0:-1);
this._adjustWidths();
}));
},_outstandingPaintOperations:0,_startPaint:function(p){
this._outstandingPaintOperations++;
if(this._adjustWidthsTimer){
this._adjustWidthsTimer.remove();
delete this._adjustWidthsTimer;
}
var oc=_11.hitch(this,function(){
this._outstandingPaintOperations--;
if(this._outstandingPaintOperations<=0&&!this._adjustWidthsTimer&&this._started){
this._adjustWidthsTimer=this.defer("_adjustWidths");
}
});
_14(p,oc,oc);
},_adjustWidths:function(){
if(this._adjustWidthsTimer){
this._adjustWidthsTimer.remove();
delete this._adjustWidthsTimer;
}
this.containerNode.style.width="auto";
this.containerNode.style.width=this.domNode.scrollWidth>this.domNode.offsetWidth?"auto":"100%";
},_createTreeNode:function(_c0){
return new _27(_c0);
},focus:function(){
if(this.lastFocusedChild){
this.focusNode(this.lastFocusedChild);
}else{
this.focusFirstChild();
}
}});
if(_e("dojo-bidi")){
_53.extend({_setTextDirAttr:function(_c1){
if(_c1&&this.textDir!=_c1){
this._set("textDir",_c1);
this.rootNode.set("textDir",_c1);
}
}});
}
_53.PathError=_c("TreePathError");
_53._TreeNode=_27;
return _53;
});
