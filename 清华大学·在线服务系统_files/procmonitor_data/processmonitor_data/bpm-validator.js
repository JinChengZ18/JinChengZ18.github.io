//校验方法主入口 cctest
PMDesigner.validateOneObject = function (element,objInAndOutConnections) {
	switch(element.type) {
    case "PMActivity"://节点类:自动，手动，子流程
    	PMDesigner.validatePMActivityNode(element,objInAndOutConnections);
    	break;
    case "PMGateway"://分支类,包含并发体里的开始，结束节点
    	PMDesigner.validatePMGateway(element,objInAndOutConnections);
    	break;
    case "PMEvent": //开始结束节点类
    	PMDesigner.validatePMEventNode(element,objInAndOutConnections);
    	break;
    case "PMFlow":
    case "Connection"://这两个是连接线类
    	break;
    case "PMPool"://泳池
    	break;
    case "PMLane"://泳道
    	break;
    case "PMParallel"://并发节点框
    	PMDesigner.validatePMParallel(element,objInAndOutConnections);
    	break;
    case "PMArtifact"://注释
    	break;
    
	}
}
/**
 * 取得 传输线 与 节点  之间的对应关系
 * @return mapForConnectionAndNodes Object
 * mapForConnectionAndNodes[node.id] : objInAndOut Object
 * objInAndOut['in'] 该节点入边线的数组
 * objInAndOut['out'] 该节点出边线的数组
 * 
 * 如果想取得mannualNode的入边线，用如下方法: mapForConnectionAndNodes[mannualNode.id]['in']
 * */
PMDesigner.getMapForConnectionAndNodes = function(){
	var mapForConnectionAndNodes = new Object();
	var diagram = PMDesigner.project.diagrams.get(0);
	var connections = diagram.getConnections();
	var elements = diagram.getCustomShapes().asArray();//所有节点
	for(var j=0;j<elements.length;j++){
		var ele = elements[j];
		var inArray = new Array();
		var outArray = new Array();
		var objInAndOut = new Object();
		
		for(var i=0;i<connections.getSize();i++){
			var connection = connections.asArray()[i].getDataObject();
			if(connection.flo_element_origin_type=='bpmnArtifact'||connection.flo_element_dest_type=='bpmnArtifact'){//注释的入边线不算
				continue;
			}
			if(connection.flo_element_origin == ele.id){//出边线
				outArray.push(connection);
			}else if(connection.flo_element_dest == ele.id){//入边线
				inArray.push(connection);
			}
		}
		objInAndOut['in'] = inArray;
		objInAndOut['out'] = outArray;
		mapForConnectionAndNodes[ele.id]= objInAndOut;
	}
	return mapForConnectionAndNodes;
}
PMDesigner.getLocaleStr = function(){
	/*根据浏览器的不同语言加载不同js*/
	var rtnStr = "zh_CN";
	var type=navigator.appName;
	var lang;
	if (type=="Netscape"){
		lang = navigator.language
	}else{
		lang = navigator.userLanguage
	}
	lang = lang.substr(0,2)
	if (lang == "en"){
		rtnStr = "en_US";
	}else if (lang == "zh"){
		rtnStr = "zh_CN";
	}
	return rtnStr = "zh_CN";
}
var callbackXmlValidate = function(data){
	
	//根据返回的节点ID，搜集节点名称等信息，在后台做更好？
	if(data.length<1){
		if($('.custom_validator>.custom_validator_row').size() == 0){
			$('.custom_validator').append('<div class="custom_validator_init">'+RIA_I18N.designer.validateMessage.correctProcess+'</div>');
		}
		return;
	}
	
	if(!data.length){
		alert(data.header.message.title);
		return;
	}
	
	$.each(data, function(i, item) {
		var itemArray = item['errorMessage'].split('^');
		var objID = itemArray[0];
		var errorMessage = itemArray[1];
		displayErrorMessage(objID,errorMessage);
	})
}
var displayErrorMessage = function(objID,errorMessage){
	var diagram = PMDesigner.project.diagrams.get(0);
	var elements = diagram.getCustomShapes().asArray();
	for (var j = 0; j < elements.length; j++) {
		if(elements[j].id == objID){
			displayErrorMessageByType(elements[j],errorMessage);
//			return elements[j];
		}
	}
//	return PMDesigner.project;
}
var displayErrorMessageByType = function(ele,errorMessage){
	var rtnArray = new Array();
	switch(ele.type) {
    case "PMActivity"://节点类:自动，手动，子流程
    	PMDesigner.addOneErrorMessage(ele.act_task_type,ele.act_uid,ele.act_name,PMDesigner.getTypeName(ele.act_type),errorMessage);
    	break;
    case "PMGateway"://分支类
    	PMDesigner.addOneErrorMessage(ele.gat_type,ele.gat_uid,ele.gat_name,PMDesigner.getTypeName(ele.gat_type),errorMessage);
    	break;
    case "PMEvent": //开始结束节点类
    	PMDesigner.addOneErrorMessage(ele.evn_type,ele.evn_uid,ele.evn_name,PMDesigner.getTypeName(ele.evn_type),errorMessage);
    	break;
    case "PMFlow":
    case "Connection"://这两个是连接线类
    	break;
    case "PMPool"://泳池
    	break;
    case "PMLane"://泳道
    	break;
    case "PMParallel"://并发节点框
    	break;
    case "PMArtifact"://注释
    	break;
    
	}
}
PMDesigner.xmlValidateServer = function(xmlStr){
	//后台校验
	var localeStr = PMDesigner.getLocaleStr();
	//因为校验需要的xml格式不匹配，所以用了较多替换，xml的tagNem不能直接更改。 PMDesigner.project.getDirtyObjectXml()
	var newStr = xmlStr.replace('<uwws:ProcessContent xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/">','');
	newStr = newStr.replace('</uwws:ProcessContent>','');
	newStr = newStr.replace('<Process ','<xml-fragment ');
	newStr = newStr.replace('</Process>','</xml-fragment>');
	$.ajax({
		url : contextPath + "/workflow/validateProcessH5.action",
		type:"post",
		dataType:"json",
		async:false, //界面其他代码假死，等待结果返回，执行完之后，才继续运行。
        data: {
        	"xmlStr":newStr,
        	"local":localeStr
        },
		success : function(data) {
			callbackXmlValidate(data);
		},
		error : function() {
		}
	})
}
PMDesigner.validateCountAbleElements = function () {
	//全局校验
	
	//流程名不能为空
	if(PMDesigner.project.projectName == null || PMDesigner.project.projectName == '' ||PMDesigner.project.projectName == undefined){
		var errorMessage = RIA_I18N.designer.validateMessage.processNameNotNull;
		PMDesigner.addOneErrorMessage('Process',PMDesigner.project.projectId,PMDesigner.project.projectName,'流程',errorMessage);
	}
	//变量名称不能相同
	var variablesArray = $(PMDesigner.project.processXml).find('datas data');
	if(variablesArray.length>1){
		var variableSameNameError = '';
		for(var i=0;i<variablesArray.length;i++){
			var iVariableName = variablesArray.get(i).getAttribute('name');
			for(var j=i+1;j<variablesArray.length;j++){
				var jVariableName = variablesArray.get(j).getAttribute('name');
				if(iVariableName == jVariableName){
					variableSameNameError += 'variableSameNameError;';
				}
			}
		}
		if(variableSameNameError.indexOf('variableSameNameError')>-1){
			var errorMessage = RIA_I18N.designer.validateMessage.variableSameNameError;
			PMDesigner.addOneErrorMessage('Process',PMDesigner.project.projectId,PMDesigner.project.projectName,'流程',errorMessage);
		}
	}
	//开始结束节点
	if(PMDesigner.startNodeCount !=1){
		var errorMessage = RIA_I18N.designer.validateMessage.oneStartNodeForOneProcess;
		PMDesigner.addOneErrorMessage('Process',PMDesigner.project.projectId,PMDesigner.project.projectName,'流程',errorMessage);
	}
	if(PMDesigner.endNodeCount < 1){
		var errorMessage = RIA_I18N.designer.validateMessage.atLeastOneEndNode;
		PMDesigner.addOneErrorMessage('Process',PMDesigner.project.projectId,PMDesigner.project.projectName,'流程',errorMessage);
	}
} 
PMDesigner.validatePMEventNode = function(element,objInAndOutConnections){
	//开始和结束节点
	//需要判断是不是并发里面的开始节点吗？
	var dataObject =  element.getDataObject();
	if('START'==dataObject.evn_type){
		//开始节点计数，+1
		PMDesigner.startNodeCount++;
		if(objInAndOutConnections['out'].length < 1){//开始节点要有出边线
			var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveOutConnection;
			PMDesigner.addOneErrorMessage(dataObject.evn_type,dataObject.evn_uid,dataObject.evn_name,PMDesigner.getTypeName(dataObject.evn_type),errorMessage);
		}
	}else if('END'==dataObject.evn_type){
		//结束节点计数，+1
		PMDesigner.endNodeCount++;
		if(objInAndOutConnections['in'].length < 1){//结束节点要有入边线
			var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveInConnection;
			PMDesigner.addOneErrorMessage(dataObject.evn_type,dataObject.evn_uid,dataObject.evn_name,PMDesigner.getTypeName(dataObject.evn_type),errorMessage);
		}
	}
}

PMDesigner.validatePMActivityNode = function(element,objInAndOutConnections){
	//PMActivity类型的三种节点：自动，手动，子流程
	var dataObject =  element.getDataObject();
	//附加出边线优先级，默认优先级个数校验
	if(objInAndOutConnections['out'].length>1){
		var rtnValue = PMDesigner.validateOutConnectionsRules(objInAndOutConnections['out'],element);
		if(rtnValue.indexOf('defaultError')>-1){//优先级为默认出边线多于一条
			var errorMessage = RIA_I18N.designer.validateMessage.moreThanOneDefaultPriority;
			PMDesigner.addOneErrorMessage(dataObject.act_task_type,dataObject.act_uid,dataObject.act_name,PMDesigner.getTypeName(dataObject.act_type),errorMessage);
		}
		if(rtnValue.indexOf('samePriorityError')>-1){//出边线有相同的优先级
			var errorMessage = RIA_I18N.designer.validateMessage.samePriorityError;
			PMDesigner.addOneErrorMessage(dataObject.act_task_type,dataObject.act_uid,dataObject.act_name,PMDesigner.getTypeName(dataObject.act_type),errorMessage);
		}
	}
	//PMActivity节点需要有出边线和入边线;
	if(objInAndOutConnections['out'] == 0){
		var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveOutConnection;
		PMDesigner.addOneErrorMessage(dataObject.act_task_type,dataObject.act_uid,dataObject.act_name,PMDesigner.getTypeName(dataObject.act_type),errorMessage);
	}
	if(objInAndOutConnections['in'] == 0){
		var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveInConnection;
		PMDesigner.addOneErrorMessage(dataObject.act_task_type,dataObject.act_uid,dataObject.act_name,PMDesigner.getTypeName(dataObject.act_type),errorMessage);
	}
	//1.手动节点需要有参与人
	if(dataObject.act_type == 'TASK'){
		if(0 == $(dataObject.xml).find('Participant').length){
			var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveParticipant;
			PMDesigner.addOneErrorMessage(dataObject.act_task_type,dataObject.act_uid,dataObject.act_name,PMDesigner.getTypeName(dataObject.act_type),errorMessage,'warning');
		}
	}
	//2.子流程节点子流程（ID）不能为空
	if(dataObject.act_type == 'SUB_PROCESS'){
		if('' == $(dataObject.xml).find('subProc').attr('processID')||undefined==$(dataObject.xml).find('subProc').attr('processID')){
			var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveSubprocess;
			PMDesigner.addOneErrorMessage(dataObject.act_task_type,dataObject.act_uid,dataObject.act_name,PMDesigner.getTypeName(dataObject.act_type),errorMessage);
		}
	}
	//3.自动节点应用程序不能为空
	if(dataObject.act_type == 'AUTO_TASK'){
		if('' == $(dataObject.xml).attr('application')||undefined==$(dataObject.xml).attr('application')){
			var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveApplication;
			PMDesigner.addOneErrorMessage(dataObject.act_task_type,dataObject.act_uid,dataObject.act_name,PMDesigner.getTypeName(dataObject.act_type),errorMessage);
		}
	}
}
PMDesigner.validatePMGateway = function(element,objInAndOutConnections){
	//PMGateway类型的三种节点：EXCLUSIVE选择节点(分支节点)，PARALLEL并发开始，INCLUSIVE并发结束'',
	var dataObject =  element.getDataObject();
	if(dataObject.gat_type!='INCLUSIVE'){//不是 并发结束
		var displayName,
			displayType;
		if(dataObject.gat_type == 'PARALLEL'){
			displayName = '并发体开始节点';
			displayType = '并发体开始节点';
		}else{
			displayName = dataObject.gat_name;
			displayType = PMDesigner.getTypeName(dataObject.gat_type);
		}
		//附加出边线优先级，默认优先级个数校验
		if(objInAndOutConnections['out'].length>1){
			var rtnValue = PMDesigner.validateOutConnectionsRules(objInAndOutConnections['out'],element);
			if(rtnValue.indexOf('defaultError')>-1){//优先级为默认出边线多于一条
				var errorMessage = RIA_I18N.designer.validateMessage.moreThanOneDefaultPriority;
				PMDesigner.addOneErrorMessage(dataObject.gat_type,dataObject.gat_uid,displayName,displayType,errorMessage);
			}
			if(rtnValue.indexOf('samePriorityError')>-1){//出边线有相同的优先级
				var errorMessage = RIA_I18N.designer.validateMessage.samePriorityError;
				PMDesigner.addOneErrorMessage(dataObject.gat_type,dataObject.gat_uid,displayName,displayType,errorMessage);
			}
		}
		//应该有出边线
		if(objInAndOutConnections['out'] == 0){
			var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveOutConnection;
			PMDesigner.addOneErrorMessage(dataObject.gat_type,dataObject.gat_uid,displayName,displayType,errorMessage);
		}
	}
	if(dataObject.gat_type!='PARALLEL'){//不是 并发开始
		if(objInAndOutConnections['in'] == 0){
			var displayName,
				displayType;
			if(dataObject.gat_type == 'INCLUSIVE'){
				displayName = '并发体结束节点';
				displayType = '并发体结束节点';
			}else{
				displayName = dataObject.gat_name;
				displayType = PMDesigner.getTypeName(dataObject.gat_type);
			}
			var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveInConnection;
			PMDesigner.addOneErrorMessage(dataObject.gat_type,dataObject.gat_uid,displayName,displayType,errorMessage);
		}
	}
}
//出边线优先级，默认个数校验
PMDesigner.validateOutConnectionsRules = function(outConnectionsArray,element){
	var rtnValue = '';
	var dataObject =  element.getDataObject();
	//同一节点的出边连接线最多只能有一条是缺省连接线
	var defaultPriorityCount=0;
	//同一节点的出边线不该有相同的优先级
	for (var j = 0; j < outConnectionsArray.length; j++) {
	 	var connection=outConnectionsArray[j];
	 	var connentionId=connection.id;
    	 if(-1 == $(connection.flo_xml).attr('priority')){//优先级是默认时，为-1
    		 defaultPriorityCount++;
    	 }
    	 for(var k=j+1;k<outConnectionsArray.length;k++){
    		 var comConnection = outConnectionsArray[k];
    		 if($(comConnection.flo_xml).attr('priority') == $(connection.flo_xml).attr('priority')){//两条线优先级相同
    			 rtnValue = rtnValue+'samePriorityError;';
    		 }
    	 }
	 }
	if(defaultPriorityCount > 1){
		rtnValue = rtnValue+'defaultError;'
	}
	return rtnValue;
}
//校验并发体框
PMDesigner.validatePMParallel = function(element,objInAndOutConnections){
	var dataObject =  element.getDataObject();
	if(objInAndOutConnections['out'].length>1){
		var rtnValue = PMDesigner.validateOutConnectionsRules(objInAndOutConnections['out'],element);
		if(rtnValue.indexOf('defaultError')>-1){//优先级为默认出边线多于一条
			var errorMessage = RIA_I18N.designer.validateMessage.moreThanOneDefaultPriority;
			PMDesigner.addOneErrorMessage(dataObject.type,dataObject.par_uid,dataObject.par_name,PMDesigner.getTypeName(dataObject.type),errorMessage);
		}
		if(rtnValue.indexOf('samePriorityError')>-1){//出边线有相同的优先级
			var errorMessage = RIA_I18N.designer.validateMessage.samePriorityError;
			PMDesigner.addOneErrorMessage(dataObject.type,dataObject.par_uid,dataObject.par_name,PMDesigner.getTypeName(dataObject.type),errorMessage);
		}
	}
	if(objInAndOutConnections['out'] == 0){//应该有出
		var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveOutConnection;
		PMDesigner.addOneErrorMessage(dataObject.type,dataObject.par_uid,dataObject.par_name,PMDesigner.getTypeName(dataObject.type),errorMessage);
	}
	if(objInAndOutConnections['in'] == 0){//应该有入
		var errorMessage = RIA_I18N.designer.validateMessage.shouldHaveInConnection;
		PMDesigner.addOneErrorMessage(dataObject.type,dataObject.par_uid,dataObject.par_name,PMDesigner.getTypeName(dataObject.type),errorMessage);
	}
}
//向校验结果表格，添加一条错误信息
PMDesigner.addOneErrorMessage = function(objectType,objectID,objectName,objectTypeStr,errorMessage,errorOrWarning){
	var displayMessage = "<span class='message-info'>"+objectName+"("+objectTypeStr+") : "+errorMessage +"</span>",
		icon;
	if(errorOrWarning=='warning'){
		icon = '<span class="np-warning-sign validator-warning"></span>';
	}else{
		icon = '<span class="np-remove-sign validator-error"></span>';
	}
	$('.custom_validator').append('<div class="custom_validator_row">'+icon+displayMessage+'<div style="display:none">'+objectID+'</div></div>');
}
//根据节点ACT_TYPE,获取节点类型中文名称
PMDesigner.getTypeName = function(actType){
	var rtnStr = "";
	switch(actType) {
    case "TASK":
    	rtnStr = RIA_I18N.designer.pannel.mannel;
    	break;
    case "AUTO_TASK":
    	rtnStr = RIA_I18N.designer.pannel.auto;
    	break;
    case "SUB_PROCESS":
    	rtnStr = RIA_I18N.designer.pannel.subProcess;
    	break;
    case "START":
    	rtnStr = RIA_I18N.designer.pannel.start;
    	break;
    case "END":
    	rtnStr = RIA_I18N.designer.pannel.end;
    	break;
    case "EXCLUSIVE":
    	rtnStr = RIA_I18N.designer.pannel.exclusive;
    	break;
    case "PMParallel":
    	rtnStr = RIA_I18N.designer.pannel.parallel;
    	break;
	}
	return rtnStr;
}
