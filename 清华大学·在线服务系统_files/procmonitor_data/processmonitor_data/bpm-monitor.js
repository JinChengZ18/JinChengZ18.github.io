//一些monitor才用到的变量
PMDesigner.monitorSuspendFlag = true;
//monitorCurState



PMDesigner.nodePathPosition = -1;
PMDesigner.monitorPathArray = monitorLine.split('#');
//这里的PMDesigner.monitorPathArray中保存的节点信息如下：(当前节点的)前一节点#前二节点#前三节点....    即顺序 相对正常顺序是反着的。
PMDesigner.getCurMonitorPathID = function (){
	var idArray = monitorCurID.split('#');
	for(var i=0;i<idArray.length;i++){
		PMDesigner.renderBorderByActivityID(idArray[i]);
	}
	PMDesigner.nodeLinePosition = -1;
	PMDesigner.setMonitorButtonState();
}
PMDesigner.getPreMonitorPathID = function(){
	var preID = null;
	if(PMDesigner.monitorPathArray!=null&&PMDesigner.nodePathPosition<PMDesigner.monitorPathArray.length-1)
	{
		preID =  PMDesigner.monitorPathArray[PMDesigner.nodePathPosition+1];
		PMDesigner.nodePathPosition++;
	}
	PMDesigner.renderBorderByActivityID(preID);
	PMDesigner.setMonitorButtonState();
}
PMDesigner.getNextMonitorPathID = function(){
	var nextID = null;
	if(PMDesigner.nodePathPosition>0)
	{
		nextID =  PMDesigner.monitorPathArray[PMDesigner.nodePathPosition-1];
		PMDesigner.nodePathPosition--;
		PMDesigner.renderBorderByActivityID(nextID);
	}else{
		PMDesigner.getCurMonitorPathID();
		if(PMDesigner.nodePathPosition==0){
			PMDesigner.nodePathPosition--;
		}
	}
	PMDesigner.setMonitorButtonState();
}
PMDesigner.setMonitorButtonState = function(){
	var state = monitorCurState;//from processmonitor.html
    	if(state=="-1"||state=="5"||monitorCurID==null||monitorCurID==undefined)
    	{
    		jQuery('.mafe-toolbar-current-node').addClass('mafe-toolbar-current-node-disabled');
        }else{
        	jQuery('.mafe-toolbar-current-node').removeClass('mafe-toolbar-current-node-disabled');
        }
    	if(state=="-1"||state=="5"||PMDesigner.monitorPathArray==null||PMDesigner.nodePathPosition>=PMDesigner.monitorPathArray.length-2)
    	{
    		jQuery('.mafe-toolbar-pre-node').addClass('mafe-toolbar-pre-node-disabled');
    	}else{
    		jQuery('.mafe-toolbar-pre-node').removeClass('mafe-toolbar-pre-node-disabled');
    	}
    	if(state=="-1"||state=="5"||PMDesigner.nodePathPosition<0)
    	{
    		jQuery('.mafe-toolbar-next-node').addClass('mafe-toolbar-next-node-disabled');
    	}else{
    		jQuery('.mafe-toolbar-next-node').removeClass('mafe-toolbar-next-node-disabled');
    	}
}
PMDesigner.setMonitorProcessButtonState = function(){
	//挂起，暂停按钮   默认为挂起able，状态还有挂起disabled，和“继续”resume
	var state = monitorCurState;//from processmonitor.html
	if(state=="-1"||state=="4"||state=="5")
	{
		jQuery('.mafe-toolbar-suspend').removeClass('mafe-toolbar-resume');
		jQuery('.mafe-toolbar-suspend').addClass('mafe-toolbar-suspend-disabled');
	}else if(state=="3")
	{
		jQuery('.mafe-toolbar-suspend').removeClass('mafe-toolbar-suspend-disabled');
		jQuery('.mafe-toolbar-suspend').addClass('mafe-toolbar-resume');
	}
	
	if(state=="-1"||state=="4"||state=="5")
	{
		jQuery('.mafe-toolbar-restart').addClass('mafe-toolbar-restart-disabled');
	}
	if(state=="-1"||state=="2"||state=="4"||state=="5")
	{
		jQuery('.mafe-toolbar-abort').addClass('mafe-toolbar-abort-disabled');
	}
	if(state=="-1"||state=="2"||state=="4"||state=="5")
	{
		jQuery('.mafe-toolbar-complete').addClass('mafe-toolbar-complete-disabled');
	}
}

PMDesigner.renderBorderByActivityID = function (id){
	//遍历所有CustomShape元素
	var diagram = PMDesigner.project.diagrams.get(0);
	var elements = diagram.getCustomShapes().asArray();
	for(var i=0;i<elements.length;i++){
		var ele = elements[i];
		if(ele.type!="PMActivity"&&ele.type!="PMParallel"){
			continue;
		}
		if(ele.id == id){
			canvas = ele.canvas,
		    currentSelection = canvas.currentSelection,
		    currentLabel = canvas.currentLabel;
			ele.canvas.hideAllCoronas();
			ele.canvas.hideCurrentConnection();

		    canvas.emptyCurrentSelection();
		    canvas.addToSelection(ele);
		}
	}
}
