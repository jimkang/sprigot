function createCamera(t){var e={locked:!1,rootSelection:null,boardSelection:null,zoomBehavior:null,parsedPreLockTransform:null,scaleExtent:t,setUpZoomOnBoard:function(t,i){var n=this.getActualWidth(t.node()),o=this.getActualHeight(t.node()),r=d3.scale.linear().domain([0,n]).range([0,n]),a=d3.scale.linear().domain([0,o]).range([o,0]);e.zoomBehavior=d3.behavior.zoom().x(r).y(a).scaleExtent(this.scaleExtent).on("zoom",e.syncZoomEventToTransform),e.boardSelection=t,e.boardSelection.call(e.zoomBehavior),e.rootSelection=i},syncZoomEventToTransform:function(){e.locked||e.rootSelection.attr("transform","translate("+d3.event.translate+")"+" scale("+d3.event.scale+")")},resetZoom:function(){e.locked||rootSelection.attr("transform","translate(0, 0) scale(1)")},lockZoomToDefault:function(){e.resetZoom(),e.locked=!0},lockZoom:function(){e.locked=!0},unlockZoom:function(){e.locked=!1,e.parsedPreLockTransform&&(e.tweenToNewZoom(e.parsedPreLockTransform.scale,e.parsedPreLockTransform.translate,300),e.parsedPreLockTransform=null)},lockZoomToDefaultCenterPanAtDataCoords:function(t){e.parsedPreLockTransform=e.parseScaleAndTranslateFromTransformString(e.rootSelection.attr("transform")),e.panToCenterOnRect(t),e.lockZoom()},panToCenterOnRect:function(t,i,n){i||(i=300);var o=this.getActualWidth(this.boardSelection.node()),r=this.getActualHeight(this.boardSelection.node()),a=1,s=e.rootSelection.attr("transform");if(s){var d=e.parseScaleAndTranslateFromTransformString(s);a=d.scale}e.tweenToNewZoom(a,[-t.x-t.width/2+o/2,-t.y-t.height/2+r/2],i,n)},tweenToNewZoom:function(t,i,n,o){var r=e.rootSelection.attr("transform"),a=d3.transition().duration(n).tween("zoom",function(){var n=1,o=[0,0];if(r){var a=e.parseScaleAndTranslateFromTransformString(r);n=a.scale,o=a.translate}var s=d3.interpolate(n,t);return interpolateTranslation=d3.interpolate(o,i),function(t){var i=s(t);e.zoomBehavior.scale(i);var n=interpolateTranslation(t);e.zoomBehavior.translate(n),e.rootSelection.attr("transform","translate("+n[0]+", "+n[1]+")"+" scale("+i+")")}});o&&a.each("end",o)},parseScaleAndTranslateFromTransformString:function(t){var e={scale:1,translate:[0,0]};if(t&&t.length>0){var i=t.split("scale(")[1];i&&(e.scale=parseFloat(i.substr(0,i.length-1)));var n=t.split(") ")[0].split(",");e.translate=[parseFloat(n[0].substr(10)),parseFloat(n[1])],e.translate[1]||console.log("Got NaN out of",n)}return e},getActualHeight:function(t){var e=t.clientHeight;return 1>e&&(e=t.parentNode.clientHeight),e},getActualWidth:function(t){var e=t.clientWidth;return 1>e&&(e=t.parentNode.clientWidth),e},translateYFromSel:function(t){return t.attr("transform").split(",")[1].split(".")[0]},translateXFromSel:function(t){return t.attr("transform").split(",")[0].split(".")[0].split("(")[1]},panToElement:function(t,i){var n=e.zoomBehavior.scale(),o=parseInt(e.translateYFromSel(t))*n,r=parseInt(e.translateXFromSel(t))*n;e.panToCenterOnRect({x:r,y:o,width:1,height:1},750,i)}};return e}function uid(t){for(var e=[],i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=i.length,o=0;t>o;++o)e.push(i[getRandomInt(0,n-1)]);return e.join("")}function getRandomInt(t,e){return Math.floor(Math.random()*(e-t+1))+t}function createAPIEnvoy(t){var e={serverURL:t,queuesForIntervals:{}};return e.request=function(t,e){var i=new XMLHttpRequest;i.open("POST",this.serverURL),i.setRequestHeader("Content-Type","application/json"),i.setRequestHeader("accept","application/json"),i.onload=function(){if(200===this.status){var t=JSON.parse(this.responseText);e(null,t)}else e(this.status,null)},i.send(JSON.stringify(t))},e.addRequestToQueue=function(t,e,i){var n=queuesForIntervals.toString(),o=null;n in this.queuesForIntervals?o=this.queuesForIntervals[n]:(o=[],this.queuesForIntervals[n]=o),o.push({jsonBody:e,done:i})},e}function OKCancelDialog(t,e,i,n,o){this.parentSelector=t,this.text=e,this.okText=i,this.respondToOK=n,this.cleanUpFunction=o}function createStore(){var t={apienvoy:createAPIEnvoy("http://192.241.250.38")};return t.saveSprigFromTreeNode=function(t,e){var i=null;if(t&&(i=D3SprigBridge.serializeTreedNode(t)),i){var n=TextStuff.makeId(4),o={};i.doc=e,o[n]={op:"saveSprig",params:i},this.apienvoy.request(o,function(t,e){return t?(console.log("Error while saving sprig:",t),void 0):(n in e&&"saved"===e[n].status?console.log("Sprig saved:",e):console.log("Sprig not saved."),void 0)})}},t.saveChildAndParentSprig=function(t,e){var i={};i.saveChildSprigOp={op:"saveSprig",params:t},i.saveParentSprigOp={op:"saveSprig",params:e},this.apienvoy.request(i,function(t,e){return t?(console.log("Error while saving sprigs:",t),void 0):(console.log("Child sprig save status:",e.saveChildSprigOp.status),console.log("Parent sprig save status:",e.saveParentSprigOp.status),void 0)})},t.deleteChildAndSaveParentSprig=function(t,e){var i={};i.deleteChildSprigOp={op:"deleteSprig",params:t},i.saveParentSprigOp={op:"saveSprig",params:e},this.apienvoy.request(i,function(t,e){return t?(console.log("Error while saving sprigs:",t),void 0):(console.log("Sprig deletion status:",e.deleteChildSprigOp.status),console.log("Parent sprig save status:",e.saveParentSprigOp.status),void 0)})},t.getSprigTree=function(t,e){var i={op:"getDoc",params:{id:t,childDepth:40}};this.apienvoy.request({getDocReq:i},function(t,i){return t?(e&&e(t,null),void 0):("getDocReq"in i&&"got"===i.getDocReq.status?e&&e(null,i.getDocReq.result.sprigTree):e&&e(null,null),void 0)})},t.createNewDoc=function(t,e){var i={},n="docCreateReq"+uid(4),o="rootSprigSaveReq"+uid(4);i[n]={op:"saveDoc",params:t},i[o]={op:"saveSprig",params:e},this.apienvoy.request(i,function(t,e){t?console.log("Error while saving doc:",t):console.log("Saved doc:",e)})},t}function createTreeNav(){var t={sprigTree:null,graphCamera:null,treeRenderer:null,graph:null,textStuff:null};return t.init=function(t,e,i,n,o){this.sprigTree=t,this.graphCamera=e,this.treeRenderer=i,this.graph=n,this.textStuff=o},t.chooseTreeNode=function(t,e,i){this.expandChildren(t),this.graph.focusOnTreeNode(t,e,i),this.textStuff.showTextpaneForTreeNode(t)},t.toggleChildren=function(t){t.children?(t._children=t.children,t.children=null):this.expandChildren(t)},t.expandChildren=function(t){t._children&&(t.children=t._children,t._children=null)},t.collapseRecursively=function(e){e.children&&(e._children=e.children,e._children.forEach(t.collapseRecursively),e.children=null)},t.nodeIsExpanded=function(t){return t.children&&!t._children},t.followBranchOfNode=function(t){var e=null;if("object"==typeof t.children)for(var i=t.children.length-1;i>=0&&(e=t.children[i],"boolean"!=typeof e.emphasized||!e.emphasized);--i);if(e){var n=d3.select("#"+e.id).node();this.chooseTreeNode(e,n)}},t.followParentOfNode=function(t,e){if("object"==typeof t.parent){var i=d3.select("#"+t.parent.id);this.chooseTreeNode(t.parent,i.node()),this.graphCamera.panToElement(i,e)}},t.moveToSiblingNode=function(t,e,i){if("object"==typeof t.parent&&"object"==typeof t.parent.children){var n=t.parent.children.indexOf(t),o=n+e;if(o>-1&&o<t.parent.children.length){var r=t.parent.children[o],a=d3.select("#"+r.id).node();r._children&&this.expandChildren(r),this.graph.focusOnTreeNode(r,a,i),this.textStuff.showTextpaneForTreeNode(r)}}},t.goToSprigId=function(t,e){var i=D3SprigBridge.mapPathToSprigId(t,this.sprigTree,100);if(i.length>0){var n=i[i.length-1];n.id!==this.graph.focusNode.id&&this.followPathToSprig(i,e,function(){this.textStuff.showTextpaneForTreeNode(n)}.bind(this))}},t.followPathToSprig=function(t,e,i){if(!e)var e=this.treeRenderer.treeNodeAnimationDuration-200;t.forEach(function(t){this.expandChildren(t)}.bind(this)),this.treeRenderer.update(this.sprigTree,0),this.graph.focusOnSprig(t[t.length-1].id,e,i)},t.respondToDownArrow=function(){d3.event.stopPropagation(),this.nodeIsExpanded(this.graph.focusNode)?this.followBranchOfNode(this.graph.focusNode):this.chooseTreeNode(this.graph.focusNode,d3.select("#"+this.graph.focusNode.id).node())},t.respondToUpArrow=function(){d3.event.stopPropagation(),this.followParentOfNode(this.graph.focusNode)},t.respondToLeftArrow=function(){d3.event.stopPropagation(),this.moveToSiblingNode(this.graph.focusNode,-1)},t.respondToRightArrow=function(){d3.event.stopPropagation(),this.moveToSiblingNode(this.graph.focusNode,1)},t}function createGraph(){var t={camera:null,treeRenderer:null,treeNav:null,textStuff:null,historian:null,sprigot:null,pane:null,board:null,svgRoot:null,focusEl:null,focusNode:null,nodeRoot:null};return t.init=function(t,e,i,n,o,r){this.camera=e,this.treeRenderer=i,this.treeNav=createTreeNav(),this.textStuff=n,this.historian=o,this.sprigot=r,this.pane=t.append("div").attr("id","graphPane").classed("pane",!0),this.board=this.pane.append("svg").attr({id:"svgBoard",width:"100%",height:"85%"}),this.board.append("g").attr("id","background").append("rect").attr({width:"100%",height:"100%",fill:"rgba(0, 0, 16, 0.2)"}),this.svgRoot=this.board.append("g").attr({id:"graphRoot",transform:"translate("+margin.left+","+margin.top+")"}),this.camera.setUpZoomOnBoard(this.board,this.svgRoot),this.setGraphScale();var a=this.pane.append("div").attr("id","zoom-note").classed("info-note",!0);return this.sprigot.isMobile()?a.text("You can pinch to zoom in and out of the graph. Drag to pan."):a.text("You can use the mouse wheel to zoom in and out of the graph. Drag to pan."),this},t.loadNodeTreeToGraph=function(t,e,i){this.nodeRoot=t,this.treeRenderer.init(this.nodeRoot,this),this.treeNav.init(this.nodeRoot,this.camera,TreeRenderer,this,this.textStuff);var n=this.board.node().clientHeight-margin.top-margin.bottom;this.nodeRoot.x0=n/2,this.nodeRoot.y0=0,this.treeNav.collapseRecursively(this.nodeRoot);var o=this.nodeRoot;this.treeRenderer.update(this.nodeRoot);var r=!0;if(e){var a=D3SprigBridge.mapPathInD3Tree(e,this.nodeRoot,100);a.length>0&&(this.treeNav.followPathToSprig(a),o=a[a.length-1],r=!1)}r&&setTimeout(function(){this.panToRoot(),this.focusNode&&Historian.syncURLToSprigId(this.focusNode.id)}.bind(this),900),setTimeout(function(){this.noteNodeWasVisited(o),this.textStuff.initialShow(o),i()}.bind(this),800)},t.panToRoot=function(){var t=d3.select("#"+this.nodeRoot.id);this.setFocusEl(t.node()),this.camera.panToElement(t)},t.setGraphScale=function(){var t=this.camera.getActualHeight(this.board.node());230>=t&&(this.camera.rootSelection.attr("transform","translate(0, 0) scale(0.75)"),this.camera.zoomBehavior.scale(.5))},t.setFocusEl=function(t){this.focusEl=t,this.focusNode=d3.select(this.focusEl).datum()},t.focusOnTreeNode=function(t,e,i){this.setFocusEl(e);var n=this.noteNodeWasVisited(t);n||this.noteNodeWasVisited(t),this.historian.syncURLToSprigId(t.id),this.treeRenderer.update(this.nodeRoot),this.camera.panToElement(d3.select(this.focusEl),i)},t.focusOnSprig=function(t,e,i){e||(e=500);var n=d3.select("#"+t);setTimeout(function(){this.focusOnTreeNode(n.datum(),n.node(),i)}.bind(this),e)},t.nodeHasFocus=function(t){return t===this.focusNode},t.noteNodeWasVisited=function(t){var e="visited_"+t.id;localStorage[e]=!0},t.nodeWasVisited=function(t){var e="visited_"+t.id;return e in localStorage},t.nodeIsUnvisited=function(t){return!this.nodeWasVisited(t)},t}function createDivider(){var t={expanderArrow:null,graph:null,textStuff:null,camera:null,sprigot:null};return t.init=function(t,e,i,n,o){this.graph=e,this.textStuff=i,this.camera=n,this.sprigot=o,this.expanderArrow=t.append("div").classed("divider",!0).append("svg").classed("arrowboard",!0).append("polygon").attr({id:"expanderArrow",fill:"rgba(0, 0, 64, 0.4)",stroke:"#E0EBFF","stroke-width":1,points:"0,0 32,24 0,48",transform:"translate(0, 0)"}),this.expanderArrow.on("click",this.toggleGraphExpansion.bind(this))},t.syncExpanderArrow=function(){var t=this.textStuff.pane.classed("collapsedPane"),e=t?36:6,i="translate("+e+", 0) ",n=t,o=!1;i+="scale("+(n?"-1":"1")+", "+(o?"-1":"1")+") ",this.expanderArrow.transition().duration(500).ease("linear").attr("transform",i).attr("stroke-opacity",.5).attr("stroke-width",2).transition().delay(501).duration(500).attr("stroke-opacity",.15).attr("stroke-width",1)},t.toggleGraphExpansion=function(){var t=this.textStuff.pane.classed("collapsedPane"),e=!t;this.textStuff.pane.classed("collapsedPane",e).classed("pane",!e),this.graph.pane.classed("expandedPane",e).classed("pane",!e),this.textStuff.findUnreadLink.style("display",e?"none":"block"),this.syncExpanderArrow(),this.graph.focusEl&&this.camera.panToElement(d3.select(this.graph.focusEl))},t.hideGraph=function(){this.graph.pane.classed("expandedPane",!1),this.graph.pane.classed("collapsedPane",!0)},t}if("object"==typeof module)var _=require("underscore");D3SprigBridge={},D3SprigBridge.serializeTreedNode=function(t){var e=_.pick(t,"id","doc","title","body","emphasize"),i=t.children;return t.children||(i=t._children),i&&(e.children=_.pluck(i,"id")),e},D3SprigBridge.sanitizeTreeForD3=function t(e){if("object"==typeof e.children){for(var i=[],n=[],o=0;o<e.children.length;++o){var r=e.children[o];"object"==typeof r?n.push(r):i.push(r)}i.length>0&&(e.childRefs=i),n.length>0&&(e.children=n,e.children.forEach(t))}return e},D3SprigBridge.mapPathToSprigId=function(t,e,i){function n(e){return e.id===t}return this.mapPathInD3Tree(n,e,i)},D3SprigBridge.mapPathInD3Tree=function(t,e,i){if(t(e))return[e];for(var n=[],o={},r=null,a=0,s=null,d=[e];i>=a;){s=[];for(var l=0;l<d.length;++l){var h=d[l];if(t(h)){r=h;break}if(i>=a+1&&h){var c=[];"object"==typeof h.children&&h.children?c=h.children:"object"==typeof h._children&&h._children&&(c=h._children),c.forEach(function(t){o[t.id]=h}),s=s.concat(c)}}if(r)break;a++,d=s}if(r)for(var h=r;h;)n.unshift(h),h=h.id in o?o[h.id]:null;return n},"object"==typeof module&&(module.exports=D3SprigBridge),"object"==typeof module&&(module.exports.uid=uid),OKCancelDialog.prototype.show=function(){var t=d3.select(this.parentSelector).append("div").attr("id","OKCancelDialog").classed("notification",!0);t.append("p").attr("id","dialogText").text(this.text),t.append("button").attr("id","OKButton").text(this.okText?this.okText:"OK").on("click",this.respondToOKClick.bind(this)),t.append("button").attr("id","CancelButton").text("Cancel").on("click",this.respondToCancelClick.bind(this))},OKCancelDialog.prototype.respondToOKClick=function(){this.respondToOK(),this.cleanUpFunction&&this.cleanUpFunction(),d3.select(this.parentSelector).select("#OKCancelDialog").remove()},OKCancelDialog.prototype.respondToCancelClick=function(){this.cleanUpFunction&&this.cleanUpFunction(),d3.select(this.parentSelector).select("#OKCancelDialog").remove()};var TreeRenderer={treeLayout:null,diagonalProjection:null,sprigTree:null,graphSVGGroup:null,graph:null,treeNodeAnimationDuration:750};TreeRenderer.init=function(t,e){this.treeLayout=d3.layout.tree(),this.treeLayout.nodeSize([160,160]),this.sprigTree=t,this.diagonalProjection=d3.svg.diagonal().projection(function(t){return[t.y,t.x]}),this.graph=e,this.graphSVGGroup=e.svgRoot},TreeRenderer.update=function(t,e){e||(e=this.treeNodeAnimationDuration);var n=this.treeLayout.nodes(this.sprigTree).reverse();n.forEach(function(t){var e=t.x,i=t.x0;t.x=t.y,t.x0=t.y0,t.y=e,t.y0=i});var o=this.treeLayout.links(n);n.forEach(function(t){t.x=180*t.depth});var r=this.graphSVGGroup.selectAll("g.node").data(n,function(t){return t.id||(t.id=++i)}),a=r.enter().append("g").attr("class","node").attr("transform",function(){return"translate("+t.y0+","+t.x0+")"}).attr("id",function(t){return t.id}).on("click",TreeRenderer.respondToNodeClick).on("dblclick",this.onNodeDoubleClick.bind(this));a.append("circle").attr("r",1e-6).style("fill",function(t){return t._children?"lightsteelblue":"#fff"}).style("fill-opacity",.7).style("stroke","rgba(0, 64, 192, 0.7)"),a.append("text").attr("x",function(t){return t.children||t._children?"0.3em":"-0.3em"}).attr("y","-1em").attr("dy",".35em").attr("text-anchor",function(t){return t.y>0?"start":"end"}).text(function(t){return t.title}).style("fill-opacity",1e-6);var s=r.transition().duration(e).attr("transform",function(t){return"translate("+t.y+","+t.x+")"});s.select("circle").attr("r",8).style("fill",function(t){var e="lightsteelblue";return this.graph.nodeHasFocus(t)?e="#e0362f":"boolean"==typeof t.emphasize&&t.emphasize&&(e="#08a"),e}.bind(this)).style("fill-opacity",function(t){var e=.7;return this.graph.nodeHasFocus(t)&&(e=1),e}.bind(this)).style("stroke-width",function(t){return t._children&&t._children.length>0?"1.4em":0}),s.select("text").style("fill-opacity",function(t){return this.graph.nodeHasFocus(t)?1:.78}.bind(this));var d=r.exit().transition().duration(e).attr("transform",function(){return"translate("+t.y+","+t.x+")"}).remove();d.select("circle").attr("r",1e-6),d.select("text").style("fill-opacity",1e-6);var l=this.graphSVGGroup.selectAll("path.link").data(o,function(t){return t.target.id});l.enter().insert("path","g").attr("class","link").attr("d",function(){var e={x:t.x0,y:t.y0};return this.diagonalProjection({source:e,target:e})}.bind(this)),l.attr("d",this.diagonalProjection).attr("stroke-width",function(t){return this.graph.nodeWasVisited(t.target)?3:1.5}.bind(this)),l.exit().transition().duration(e).attr("d",function(){var e={x:t.x,y:t.y};return this.diagonalProjection({source:e,target:e})}.bind(this)).remove(),n.forEach(function(t){t.x0=t.x,t.y0=t.y})},TreeRenderer.respondToNodeClick=function(t){TreeRenderer.graph.treeNav.chooseTreeNode(t,this)},TreeRenderer.onNodeDoubleClick=function(t){this.graph.treeNav.toggleChildren(t),this.update(t)};var TextStuff={graph:null,treeRenderer:null,store:null,sprigot:null,divider:null,sprigot:null,pane:null,textpane:null,textcontent:null,titleField:null,contentZone:null,addButton:null,deleteButton:null,newSprigotButton:null,emphasizeCheckbox:null,findUnreadLink:null,showGraphLink:null,downLink:null,OKCancelDialog:null,editAvailable:!1};TextStuff.init=function(t,e,i,n,o,r){this.graph=e,this.treeRenderer=i,this.store=n,this.sprigot=o,this.divider=r,this.pane=t.append("div").classed("pane",!0).attr("id","nongraphPane"),this.pane.append("div").attr("id","questionDialog"),this.textpane=this.pane.append("div").attr("id","textpane"),this.contentZone=this.textpane.append("div").classed("contentZone",!0).style("display","none"),this.titleField=this.contentZone.append("span").classed("sprigTitleField",!0).style("display","none"),this.textcontent=this.contentZone.append("div").classed("textcontent",!0).attr("tabindex",0),this.editAvailable&&(this.addButton=this.textpane.append("button").text("+").classed("newsprigbutton",!0).classed("editcontrol",!0),this.deleteButton=this.textpane.append("button").text("-").classed("deletesprigbutton",!0).classed("editcontrol",!0),this.textpane.append("label").text("Emphasize").classed("editcontrol",!0),this.emphasizeCheckbox=this.textpane.append("input").attr({type:"checkbox",id:"emphasize"}).classed("editcontrol",!0),this.newSprigotButton=this.textpane.append("button").text("New Sprigot!").classed("editcontrol",!0)),this.initFindUnreadLink(),d3.selectAll("#textpane .contentZone,.editcontrol").style("display","none"),this.editAvailable&&(this.textcontent.on("click",this.startEditing.bind(this)),this.titleField.on("click",this.startEditing.bind(this)),this.addButton.on("click",this.sprigot.respondToAddChildSprigCmd.bind(this.sprigot)),this.deleteButton.on("click",this.showDeleteSprigDialog.bind(this)),this.emphasizeCheckbox.on("change",this.respondToEmphasisCheckChange.bind(this)),this.contentZone.on("keydown",this.respondTocontentZoneKeyDown.bind(this)),this.newSprigotButton.on("click",this.sprigot.respondToNewSprigotCmd.bind(this.sprigot)))},TextStuff.initFindUnreadLink=function(){var t=location.hash.split("/");if(t.length>1){var e=t[0]+"/"+t[1]+"/";this.findUnreadLink=this.pane.append("a").attr("id","findunreadlink").attr("href",e+"findunread").classed("control-link",!0).classed("findunread-link",!0).text("Find Unread").style("display","none")}},TextStuff.syncTextpaneWithTreeNode=function(t){this.textcontent.datum(t),this.titleField.datum(t),this.textcontent.html(t.body),this.titleField.html(t.title),this.editAvailable&&(this.emphasizeCheckbox.node().checked=this.graph.focusNode.emphasize),this.sprigot.isMobile()&&window.scrollTo(0,0)},TextStuff.showTextpaneForTreeNode=function(t){this.syncTextpaneWithTreeNode(t),d3.selectAll("#textpane .contentZone,.editcontrol").style("display","block"),this.contentZone.style("display","block"),this.uncollapseTextpane()},TextStuff.fadeInTextPane=function(t){if("none"===this.contentZone.style("display")){var e=d3.selectAll("#textpane .contentZone,.editcontrol");this.textpane.style("opacity",0),e.style("opacity",0),this.contentZone.style("opacity",0),e.style("display","block").transition().duration(t).style("opacity",1),this.contentZone.style("display","block").transition().duration(t).style("opacity",1),this.textpane.transition().duration(t).style("opacity",1)}},TextStuff.fadeInControlLinks=function(t){var e=d3.selectAll("#nongraphPane .control-link");e.style("opacity",0),e.style("display","block").transition().duration(t).style("opacity",1)},TextStuff.initialShow=function(t){setTimeout(function(){this.syncTextpaneWithTreeNode(t),this.fadeInTextPane(750),this.fadeInControlLinks(800)}.bind(this),725)},TextStuff.uncollapseTextpane=function(){var t=this.pane.classed("collapsedPane");t&&this.divider.toggleGraphExpansion()},TextStuff.showTitle=function(){this.titleField.text(this.titleField.datum().title),this.titleField.style("display","block")},TextStuff.disableFindUnreadLink=function(){this.findUnreadLink.text("You've read all the sprigs!"),this.findUnreadLink.transition().duration(700).style("opacity",.3).style("cursor","default").attr("href",null),this.findUnreadLink.transition().delay(3e3).duration(2e3).style("opacity",0)},TextStuff.makeId=function(t){return"s"+uid(t)},TextStuff.changeEditMode=function(t,e){if(this.editAvailable)if(this.textcontent.attr("contenteditable",t),this.titleField.attr("contenteditable",t),this.contentZone.classed("editing",t),t)this.showTitle(),this.textcontent.node().focus();else{this.titleField.style("display","none");var i=this.textcontent.datum();i.body=this.textcontent.html();var n=this.titleField.text(),o=n!==i.title;i.title=n,o&&d3.select("#"+i.id+" text").text(i.title),this.textcontent.datum(i),this.titleField.datum(i),e||this.store.saveSprigFromTreeNode(this.textcontent.datum(),this.sprigot.docId)}},TextStuff.endEditing=function(){this.contentZone.classed("editing")&&this.changeEditMode(!1)},TextStuff.showDeleteSprigDialog=function(){this.OKCancelDialog=new OKCancelDialog("#questionDialog","Do you want to delete this?","Delete",this.sprigot.respondToDeleteSprigCmd.bind(this.sprigot),function(){delete this.OKCancelDialog}.bind(this)),this.OKCancelDialog.show()},TextStuff.respondToEmphasisCheckChange=function(){this.graph.focusNode&&(this.graph.focusNode.emphasize=this.emphasizeCheckbox.node().checked,this.treeRenderer.update(this.graph.nodeRoot),this.store.saveSprigFromTreeNode(this.graph.focusNode,this.sprigot.docId))},TextStuff.respondTocontentZoneKeyDown=function(){(d3.event.metaKey||d3.event.ctrlKey)&&13===d3.event.which&&(d3.event.stopPropagation(),this.contentZone.classed("editing")&&this.changeEditMode(!1))},TextStuff.startEditing=function(){d3.event.stopPropagation(),this.contentZone.classed("editing")||this.changeEditMode(!0)};var Historian={treeNav:null,docId:null};Historian.init=function(t,e){this.treeNav=t,this.docId=e,window.onpopstate=this.statePopped.bind(this)},Historian.statePopped=function(t){t.state&&(this.docId=t.state.docId,this.treeNav.goToSprigId(t.state.sprigId,100))},Historian.syncURLToSprigId=function(t){if("object"!=typeof window.history.state||!window.history.state||"string"!=typeof window.history.state.docId||"string"!=typeof window.history.state.sprigId||window.history.state.docId!==this.docId||window.history.state.sprigId!==t){var e=location.protocol+"//"+location.host+location.pathname+"#/"+this.docId+"/"+t;window.history.pushState({docId:this.docId,sprigId:t},null,e)}};var margin={top:20,right:10,bottom:20,left:10},Sprigot={docId:null,graph:null,store:null,divider:null,camera:null};Sprigot.init=function(t){var e=d3.select("body"),i=e.select(".sprigot");if(t&&!i.empty()&&i.remove(),i.empty()){i=e.append("section").classed("sprigot",!0);var n=[.5,1];this.isMobile()&&(n=[.25,1]),this.camera=createCamera(n),this.graph=createGraph(),this.graph.init(i,this.camera,TreeRenderer,TextStuff,Historian,this),this.store=createStore(),this.divider=createDivider(),this.divider.init(i,this.graph,TextStuff,this.camera,this),TextStuff.init(i,this.graph,TreeRenderer,this.store,this,this.divider),this.divider.syncExpanderArrow(),this.initDocEventResponders()}},Sprigot.load=function(t,e,i){this.docId=t,Historian.init(this.graph.treeNav,this.docId),this.store.getSprigTree(t,function(t,n){if(t&&i(t,null),n){var o=D3SprigBridge.sanitizeTreeForD3(n);this.graph.loadNodeTreeToGraph(o,e,i)}else i("Sprig tree not found.")}.bind(this))},Sprigot.initDocEventResponders=function(){var t=d3.select(document);TextStuff.editAvailable&&t.on("click",TextStuff.endEditing.bind(TextStuff)),t.on("keyup",this.respondToDocKeyUp.bind(this)),t.on("keydown",this.respondToDocKeyDown.bind(this))},Sprigot.respondToDocKeyUp=function(){if(27===d3.event.keyCode)d3.event.stopPropagation(),TextStuff.contentZone.classed("editing")&&TextStuff.changeEditMode(!1);else if(!TextStuff.contentZone.classed("editing"))switch(d3.event.which){case 69:d3.event.stopPropagation(),"block"===TextStuff.contentZone.style("display")&&TextStuff.changeEditMode(!0);break;case 40:this.graph.treeNav.respondToDownArrow();break;case 38:this.graph.treeNav.respondToUpArrow();break;case 37:this.graph.treeNav.respondToLeftArrow();break;case 39:this.graph.treeNav.respondToRightArrow();break;case 187:d3.event.shiftKey&&this.respondToAddChildSprigCmd();break;case 85:this.respondToFindUnreadCmd()}},Sprigot.respondToDocKeyDown=function(){TextStuff.editAvailable&&(d3.event.metaKey||d3.event.ctrlKey)&&8===d3.event.which&&TextStuff.showDeleteSprigDialog()},Sprigot.respondToAddChildSprigCmd=function(){d3.event.stopPropagation(),TextStuff.contentZone.classed("editing")&&TextStuff.changeEditMode(!1);var t={id:TextStuff.makeId(8),doc:this.docId,title:"New Sprig",body:""},e=this.graph.focusNode.children;e||(e=this.graph.focusNode._children),e||(e=[]),e.push(t),this.graph.focusNode.children=e,TextStuff.changeEditMode(!0),this.store.saveChildAndParentSprig(t,D3SprigBridge.serializeTreedNode(this.graph.focusNode)),TreeRenderer.update(this.graph.nodeRoot,this.graph.treeRenderer.treeNodeAnimationDuration),setTimeout(function(){this.graph.focusOnSprig(t.id),TextStuff.showTextpaneForTreeNode(t)}.bind(this),this.graph.treeRenderer.treeNodeAnimationDuration+100)},Sprigot.respondToDeleteSprigCmd=function(){d3.event.stopPropagation(),TextStuff.contentZone.classed("editing")&&TextStuff.changeEditMode(!1,!0);var t=this.graph.focusNode.parent,e=t.children.indexOf(this.graph.focusNode);t.children.splice(e,1);var i={id:this.graph.focusNode.id,doc:this.docId};this.store.deleteChildAndSaveParentSprig(i,D3SprigBridge.serializeTreedNode(t));var n=this.graph.treeNav;TreeRenderer.update(this.graph.nodeRoot,this.graph.treeRenderer.treeNodeAnimationDuration),setTimeout(function(){n.chooseTreeNode(t,d3.select("#"+t.id).node())},this.graph.treeRenderer.treeNodeAnimationDuration+500)},Sprigot.respondToNewSprigotCmd=function(){var t={id:uid(8),rootSprig:uid(8),authors:["deathmtn"],admins:["deathmtn"]},e={id:t.rootSprig,doc:t.id,title:"Root",body:"Hello. Type some stuff here.",children:[]};this.store.createNewDoc(t,e)},Sprigot.respondToFindUnreadCmd=function(){var t=D3SprigBridge.mapPathInD3Tree(this.graph.nodeIsUnvisited.bind(this.graph),this.graph.treeNav.sprigTree,100);if(t.length>0){(t.length>1||t[0].id!==this.graph.focusNode.id)&&this.graph.treeNav.followPathToSprig(t);var e=t[t.length-1];Historian.syncURLToSprigId(e.id),TextStuff.syncTextpaneWithTreeNode(e)}else TextStuff.disableFindUnreadLink()},Sprigot.respondToSwitchToGraphCmd=function(){this.graph.pane.classed("expandedPane")||this.divider.toggleGraphExpansion()},Sprigot.isMobile=function(){var t="only screen and (max-device-height: 568px)";return window.matchMedia(t).matches};var Director={};Director.direct=function(t){var e=t.split("/");if(e.length<2)return Sprigot.init(),Sprigot.load("About",this.matchAny,function(t){t&&console.log("Error while getting sprig:",t)}),void 0;switch(e[1]){case"index":break;default:var i=e[1];if(e.length>1)var n=e[2];Sprigot.init();var o=function(t){return n===t.id};"findunread"===n&&(o=this.matchAny),Sprigot.graph.nodeRoot&&Sprigot.docId===i?"findunread"===n?Sprigot.respondToFindUnreadCmd():n&&Sprigot.graph.treeNav.goToSprigId(n,100):Sprigot.load(i,o,function(t){t?console.log("Error while getting sprig:",t):"findunread"===n&&Sprigot.respondToFindUnreadCmd()})}},Director.matchAny=function(){return!0},Director.respondToHashChange=function(){this.direct(location.hash)},Director.init=function(){this.direct(location.hash),window.onhashchange=this.respondToHashChange.bind(this)},Director.init();