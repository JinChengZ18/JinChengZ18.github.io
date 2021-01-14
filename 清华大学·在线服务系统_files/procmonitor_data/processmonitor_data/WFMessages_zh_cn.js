var applicationMessage = {};
applicationMessage.title="选择应用";
applicationMessage.subproctitle="选择子流程";

var procmodifydetailMessage = {};
procmodifydetailMessage.title={};
procmodifydetailMessage.title.proccess = "流程属性";
procmodifydetailMessage.title.transition = "传输线属性";
procmodifydetailMessage.title.manualnode = "手动节点属性";
procmodifydetailMessage.title.startnode = "开始节点属性";
procmodifydetailMessage.title.choicenode = "选择节点属性";
procmodifydetailMessage.title.endnode = "结束节点属性";
procmodifydetailMessage.title.autonode = "自动节点属性";
procmodifydetailMessage.title.lane = "泳道属性";
procmodifydetailMessage.title.parallelnode = "并发节点属性";
procmodifydetailMessage.title.subflownode = "子流程节点属性";
procmodifydetailMessage.title.annotation = "注释属性";
procmodifydetailMessage.title.branch = "分支节点属性";
procmodifydetailMessage.title.branchbegin = "分支开始节点属性";
procmodifydetailMessage.title.branchend= "分支结束节点属性";

procmodifydetailMessage.title.NodeTemplate= "节点模板属性";
procmodifydetailMessage.title.Application= "应用程序属性";

var plugin = {};
plugin.confirm = "提交";
plugin.close = "关闭";

var relDataMap = ['整数','字符串','','浮点数','日期','','','','','','XML'];

var personMap = new Array(30);
personMap[2]="实例创建者";
personMap[3]="实例创建者上级";
personMap[4]="前一节点";
personMap[5]="前一节点上级";
personMap[20]="实例创建者所属组织领导";
personMap[21]="实例创建者所属机构领导";
personMap[22]="前一节点所属组织领导";
personMap[23]="前一节点所属机构领导";
personMap[29]="扩展类型参与人";

var processMessage={};
processMessage.confirmEdit={};
processMessage.confirmEdit.inputContentError="内容输入有误，请重新输入！";

processMessage.confirmRelDataEdit={};
processMessage.confirmRelDataEdit.variableSelectError="未能识别所选变量，请从左侧列表选择！";
processMessage.confirmRelDataEdit.inputContentError="内容输入有误，请重新输入！";
processMessage.confirmRelDataEdit.success="保存完成！";

processMessage.submit_onclick={};
processMessage.submit_onclick.nameRequiredError="名称不可以为空！";
processMessage.submit_onclick.alertTimeExceedError="催办时间应当早于超时时间！";
processMessage.submit_onclick.expireVariableNullError="请为超时时间设置变量！";
processMessage.submit_onclick.alertVariableNullError="请为催办开始时间设置变量！";
processMessage.submit_onclick.alertIntervalZeroError="催办间隔时间应当大于0！";

processMessage.displayCondition_my = {};
processMessage.displayCondition_my.calcTitle="公式编辑器";

processMessage.deleteRelData={};
processMessage.deleteRelData.confirmDeleteMessage="是否确定删除所选变量？";

var transitionMessage={};
transitionMessage.submit_onclick={};
transitionMessage.submit_onclick.nameRequiredError="名称不可以为空！";

transitionMessage.checkExp={};
transitionMessage.checkExp.expressionRequiredError="请输入表达式！";
transitionMessage.checkExp.success="语法正确！";

transitionMessage.checkSemicolon={};
transitionMessage.checkSemicolon.semicolonEndError="表达式应以分号为结束符！";
transitionMessage.checkSemicolon.multiSemicolonError="表达式中结束符“;”使用不当!";

transitionMessage.checkForm={};
transitionMessage.checkForm.semicolonEndError="表达式应以分号为结束符！";
transitionMessage.checkForm.expressSynaxError="语法错误!";
transitionMessage.checkForm.expressSynaxError_DateExp="语法错误，极有可能是日期格式不正确！";

transitionMessage.onload={};
transitionMessage.onload.noRelMessage="(无变量)";
transitionMessage.onload.DblClickMessage="(双击选择)";

var subNodeMessage = {};
subNodeMessage.parentVar = "添加父流程变量";
subNodeMessage.subVar = "添加子流程变量";
subNodeMessage.inVar = "入参";
subNodeMessage.outVar = "出参";
subNodeMessage.inOutVar = "入参/出参";
subNodeMessage.submit_onclick = {};
subNodeMessage.submit_onclick.varRequiredError="存在未指定变量的映射!";

subNodeMessage.submit_onclick.varOutError="异步操作模式下不能设置出参!";

applicationMessage.formtitle = "选择表单";
applicationMessage.webformtitle = "选择表单";
applicationMessage.dealmathodnotnull = "处理方式不能为空!";

var pageControlMessage = {};
pageControlMessage.getStrategyError="获取页面权限信息失败!";

var manualNodeMessage={};
manualNodeMessage.clickToChoose = "点击选择";
manualNodeMessage.Variables = "使用变量指定办理人";
manualNodeMessage.Node = "使用其它节点的办理人";
manualNodeMessage.Predefined = "使用内置的办理人";
manualNodeMessage.lengthExceedError = "已选择的内容超长！";
manualNodeMessage.selectOrgPersonTitle = "选择组织人员";

manualNodeMessage.selectVariable = "设置变量";
manualNodeMessage.operatorDeptFilterVarRequired = "办理人指定部门未设置变量";
manualNodeMessage.readerDeptFilterVarRequired = "抄送人指定部门未设置变量";

manualNodeMessage.notify={};
manualNodeMessage.notify.hour="小时";
manualNodeMessage.notify.min="分钟";
manualNodeMessage.notify.day="工作日";

manualNodeMessage.notify.variablelist="变量列表";
manualNodeMessage.notify.onpiecerequired="至少保留一条提醒信息!";
manualNodeMessage.notify.numlimitexceed="到达提醒数目上限!";

manualNodeMessage.notify.overtimevariablerequired="请设置超时变量";
manualNodeMessage.notify.variablerequired="请为提醒指定变量:";
manualNodeMessage.notify.intervalrequired="请为提醒设置时间间隔";

var resignView={};
resignView.SelectAlreadyExistError=" 已经存在！";
resignView.ClearSuccessMessage="删除成功！";

var branchNodeMessage={};
branchNodeMessage.dynamicvariablerequired="未设置动态分支的关联变量！";
branchNodeMessage.dynamicvariabledefaulttext="选择变量";