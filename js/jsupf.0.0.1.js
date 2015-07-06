(function(e,win){
	
	function _filebase(file,MAXSIZE){
		var me = this;
		
		this.iscompleted = false;
		
		this.oLayerFile  = $e('<DIV>').Class('fl-layer');		
		
		this.oRight = $e('<DIV>').Class('cl-right').width('140px').attachto(this.oLayerFile);
		this.oLeft = $e('<DIV>').attachto(this.oLayerFile);
		
		
		this.oClose  = $e('<DIV>').Class('fl-close').attachto(this.oRight).hide();
		this.oProgress  = $e('<DIV>').Class('fl-progress').attachto(this.oRight).hide();
		this.oProgressBar = $e('<DIV>').Class('fl-progress-bar').width('0px').attachto(this.oProgress).hide();
		this.oWarn = $e('<DIV>').Class('fl-warn').attachto(this.oLayerFile).hide();
		this.oFileName  = $e('<DIV>').Class('fl-name').attachto(this.oLeft);
		
		this.addtoparent = function(parent){
			this.oFileName.html(file.name+ ' ('+this.toUnits(file.size)+')');
			this.oLayerFile.attachto(parent);							
			
		}
		
		this.chfilesize = function(){
			if (file.size >= MAXSIZE) 
				{
					this.oWarn.html('Превышен максимальный размер файла. Допустимый размер '+ this.toUnits(MAXSIZE)).show();			
					return true;
				}
					else return false;
		}//end chfilesize
	}
	
	_filebase.prototype.toUnits = function(value){

		var units = ["B","KB","MB","GB","TB","PB"];
		var index = 0;
		while (value >= 1024){
			value /= 1024;
			index++;
		}
		return value.toFixed() + " " + units[index];			
	} //end _uploads
	
	function _uploadedfiles(file,MAXSIZE,parent,params,ops){
		
		var me = this;
		
		this.Init = function(){
			_uploadedfiles.superclass.constructor.call(this,file,MAXSIZE);	
			this.iscompleted = true;
			this.addtoparent(parent);
			this.chfilesize();
			
			if (typeof ops.candelete != 'undefined') {
			
				this.oClose.click(			
					function(){					
						//delete from database
						if (me.iscompleted == true) {
							var p = {id:file.id,link:'delfile'};
							if(typeof params == "object")
								for (var propName in params){
									if (params.hasOwnProperty(propName)) {
										p[propName] = params[propName];
									  }
								}
							e.getjson('/',true,'POST',p,
									function(){me.oLayerFile.hide();me.oWarn.hide();},
									function(){me.oWarn.html('Ошибка удаления.'); me.oWarn.show();}
									)
						}	
					}
				)
				
				this.oClose.show();
			}//end can delete	
			
			if (typeof ops.download != 'undefined') {
				//this.oFileName.Class('fl-down');
				var a = $e('<a>').Class('fl-name');
				
				var url = "/?link=downf";
				if (typeof file.caseid != 'undefined') url += "&caseid=" + encodeURIComponent(file.caseid);
				if (typeof file.id != 'undefined') url += "&id=" + encodeURIComponent(file.id);
				
				if(typeof params == "object")
					for (var propName in params){
						if (params.hasOwnProperty(propName)) {
							url += '&' + propName + '=' + encodeURIComponent(params[propName]);
						  }
					}
				a.attr('href',url);	
					
				a.html(me.oFileName.html());
				me.oFileName.html('');				
				
				a.attachto(me.oFileName);
						
				this.oFileName.click(
					function(evt){
						
					}//end 
				);
			}	
		}
		
		
		
		this.Init();
	}
	
	$u.inherit(_uploadedfiles, _filebase)
	
	
	function _uf(file,MAXSIZE,parent,params,ops){
		var me = this;
								
		this.Init = function(){
			_uf.superclass.constructor.call(this,file,MAXSIZE);	
			
			this.iscompleted = false;
			this.addtoparent(parent);			
			
			if (!this.chfilesize()) 
			{
				//addToProgress;
				if (typeof ops.candelete != 'undefined') this.oClose.show();
				this.oProgress.show();
				this.aj = e.ajxUploadFiles('/',true);
				this.StartUpload();
			}
			
		}
		
		this.StartUpload = function(){					
			var fd = new FormData();
            fd.append("filetoupload", file);			
			for (var propName in params){
				if (params.hasOwnProperty(propName)) {
					fd.append(propName,params[propName]);
				  }
			}
			
			this.oClose.click(			
				function(){					
					//delete from database
					if (me.iscompleted == true) {
						if (typeof me.jsr.id !== undefined)
						e.getjson('/',true,'POST',{id:me.jsr.id,link:'delfile'},
								function(){me.oLayerFile.hide();me.oWarn.hide();},
								function(){me.oWarn.html('Ошибка удаления.'); me.oWarn.show();}
								)	
					} else {
								me.aj.abort();	
								me.oLayerFile.hide();								
							}
				}//end function
			)
			
						
			this.aj.onProgressStart = function(){		
				me.oProgressBar.width('0%').show();
			}
			
			this.aj.onProgressAbort = function(){				
				me.oProgress.hide();
			}//end progress abort
			
			this.aj.onProgressError = function(){
				me.oWarn.html('Ошибка загрузки.').show();
				me.oProgress.hide();				
				me.iscompleted = false;				
			}
			
			this.aj.onProgress = function(evt){
								if (evt.lengthComputable) {
									var percentComplete = Math.round(evt.loaded * 100 / evt.total);
									//me.oProgress.html(percentComplete.toString() + '%');
									me.oProgressBar.width(percentComplete.toString() + '%');
								}
								else {							
									me.oProgress.html('Unknown');
								}
							}					
			
			this.aj.onCompletion = function(){
									try{
										
										me.jsr = JSON.parse(this.response)
										if (me.jsr.errno !== "0") { 
											me.oProgress.hide();
											me.oWarn.html(me.jsr.errmsg).show();																								
											me.iscompleted = false;
											return;
										}	
										
										me.oWarn.hide();
										me.oProgress.hide();
										me.oLayerFile.style('backgroundColor','#fff');
										me.oFileName.style('color','#357AE8')
										//me.oProgressBar.width('100%');
										//me.oProgress.html('100%')										
										
										//checkAllUploaded();
										me.iscompleted = true;
										
										
									}catch(e) {
										me.oProgress.hide();
										me.oWarn.html(this.response).show();																								
										me.iscompleted = false;
									}									
								}
			
			this.aj.runAJAX(fd)			
		}
		
		this.Init();
	}
	
	$u.inherit(_uf, _filebase)
	
	function _uploadfiles(parent,MAXFILESIZE){
		
		var me = this;
		this.efiles = [];
		this.inputfile = e.ui.oChooseFiles();
		this.params = {};
		this.ops = {};
		
		this.inputfile.addEvent('change',
				function(evt){
					var files = evt.target.files; // FileList object
					//me.AddFiles(files)
					for(var i= 0; i < files.length; i++){
						me.efiles[me.efiles.length] =  new _uf(files[i],MAXFILESIZE,parent,me.params,me.ops);
					}
				}
			)//end addEvent
				
		this.addparams = function(p){
			for (var propName in p){
				if (p.hasOwnProperty(propName)) {
					this.params[propName] = p[propName];
				  }
			}			
		}
		this.setoptions = function(ops){
			if (!$u.isObj(ops)) return;
			this.ops = ops;
			for(var i= 0; i < me.efiles.length; i++){
				me.efiles[i].setoptions(ops);
			}
		}
		
		this.addupdfile = function(file,delparams){
			me.efiles[me.efiles.length] =  new _uploadedfiles(file,MAXFILESIZE,parent,delparams,me.ops); 
		}
		
		this.choosefiles = function(){
			if (typeof me.ops.upload != 'undefined') this.inputfile.click();
		}
		
		this.count = function(){
			return me.efiles.length;
		}
		
	}
			
	
	
	e.ui.oUploadFiles = function(parent,MAXFILESIZE){
			return new _uploadfiles(parent,MAXFILESIZE);
	}
	
	
})(window.$e,window);

function _uploadfiles(ptid){
	
	var me = this
	
	this.params = {};
	this.oUploadFiles = null;	
	
	function oUFiles(files,elBody,_parent){
		
		var me = this		
		
		var uploads = [];
		this.oUploadFiles = null;
		this.cancelall = false;
		
		Init = function (){
			
		}
		
		this.Process = function(){
			for(var i= 0;i <files.length;i++){
				StartUploads(i)
			}
		}//end Process
		
		this.Close = function(){
			//end close all active connections
			this.cancelall = true;
			for(var i = 0; i<uploads.length;i++)
				uploads[i].abort()
		}
		
		checkAllUploaded = function(){
			var _alluploaded = true;
			for(var i = 0; i<uploads.length;i++)
				if (!uploads[i].iscompleted) { _alluploaded = false; break;}
			if (_alluploaded)	_parent.elActionSaveExit.show() 
		}
		
		this.SaveDescription = function(){
			for(var i = 0; i<uploads.length;i++)
				if (uploads[i].iscompleted) { 
					try {
						var jsr = JSON.parse(uploads[i].response)
						if (typeof jsr.fileid !== "string" ) throw uploads[i].response;
						var elFileDesc = elBody.qSel('input[name=filedesc'+i+']')
						if (elFileDesc.isUndef()) throw "Отсутствует описание файла "+ index;
						getJSON('/libraries/patientactions.php',false,'GET',{_ptid:ptid,_fileid:jsr.fileid,_action:'addfiledesc',_filedesc:elFileDesc.object.value},
							function(){
								
							},
							function(errmsg){
								//alert(errmsg)
								$warning(errmsg)
							}
						)
					}
					catch(e) {
						
					}
				}
		}
		
		this.rollbackUploadedFiles = function(){
			for(var i = 0; i<uploads.length;i++)
				if (uploads[i].iscompleted) { 
					try {
						var jsr = JSON.parse(uploads[i].response)
						if (typeof jsr.fileid !== "string" ) throw uploads[i].response;
						getJSON('/libraries/patientactions.php',false,'GET',{_ptid:ptid,_fileid:jsr.fileid,_action:'removefile'},
							function(){
								
							},
							function(errmsg){
								//alert(errmsg)
								$warning(errmsg)
							}
						)
					}
					catch(e) {
						
					}
				}
		}
		
		
		
		StartUploads = function(index){
			
			if (me.cancelall) return;
			
			var file = files[index]
			var aj = new ajUploadFiles('/libraries/upload.file.php',true)
			var fd = new FormData();
            fd.append("filetoupload", file);
			fd.append("_ptid", ptid);
			
			//var oCell = ConstructRow(index);
			var oRow = document.createElement('TR'),oCell;						
			oRow.className = 'cl-pad5'																													
			
			oCell = document.createElement('TD')
			oCell.className = 'cl-pad3-lr cl-textalign-left'
			oCell.innerHTML = file.name
			oRow.appendChild(oCell)			
			
			oCell = document.createElement('TD')
			oCell.className = 'cl-pad3-lr cl-textalign-left'
			oCell.innerHTML = toUnits(file.size)
			oRow.appendChild(oCell)
			
			var elProgress = $e().cEl('TD').attr('className','cl-pad3-lr cl-textalign-left').addTo(oRow)

			oCell = document.createElement('TD')
			oCell.className = 'cl-pad3-lr cl-textalign-left'
			$compSearchBox(oCell,"filedesc"+index,"","pricelist","id").setSize(50);
			oRow.appendChild(oCell)
			
			var elAction = $e().createActionButton('Отменить',
				function(){
					aj.abort()
				}
			).hide()
			var elActionLayer =  $e().cEl('TD').attr('className','cl-pad3-lr cl-textalign-left').addTo(oRow)
			elAction.addTo(elActionLayer)
			
			var elActionTry = $e().createActionButton('Отправить снова',
				function(){
					aj.runAJAX(fd)
					elActionTry.hide()
					elAction.show()
				}
			).hide()			
			elActionTry.addTo(elActionLayer)
			
			elBody.addChild(oRow)
			
			aj.onProgressStart = function(){
				elAction.show()
			}
			
			aj.onProgressAbort = function(){
				elAction.hide()
				elActionLayer.html('Загрузка отменена')
			}//end progress abort
			
			aj.onProgressError = function(){
				elAction.hide()
				elActionLayer.html('Ошибка загрузки')				
			}
			
			aj.onProgress = function(evt){
								if (evt.lengthComputable) {
									var percentComplete = Math.round(evt.loaded * 100 / evt.total);
									elProgress.html(percentComplete.toString() + '%');
									//document.getElementById('prog').value = percentComplete;
									//aj.abort()
								}
								else {							
									elProgress.html('Unknown');
								}
							}					
			
			aj.onCompletion = function(){
									try{																				
										
										var jsr = JSON.parse(this.response)
										if (jsr.errno !== "0") throw new String(jsr.errmsg);
										
										elProgress.html('100%')
										elAction.hide()
										elActionLayer.html('Успешно загружен.') //+this.response
										
										checkAllUploaded();
										this.iscompleted = true;
										
										//jsr.err
									}catch(e) {
										elAction.hide()	
												
										if (e instanceof String || typeof e == 'string') {
											elActionTry.setText(e+'.Загрузить снова.')												
										}
										 else		
											{
												//elActionTry.setText(Object.prototype.toString.call(e).slice(8, -1));
												elActionTry.setText('Загрузить снова. Сервер вернул:'+this.response)												
											}
										elActionTry.show()									
									}
									
								}													
			
			aj.runAJAX(fd)
			uploads[uploads.length] = aj
		}		
		
		Init()
	}
	
	this.Init = function (){		
		
		this.patient = $patient(ptid)
		this.patient._loadpatient()
				
		this.parentWindow  = $modalwindow()
		this.parentWindow.setCloseOnOut(false)
		this.windowBody = this.parentWindow.getBody() 
		
		this.patient.addPatTip(this.windowBody,true)
		
		this.elNavDiv = $e().cEl('div').prop('className','cl-control-layer').addTo(this.windowBody)
			
		this.elActionSaveExit = $e().createActionButton('Сохранить и закрыть окно.',
			function(){
				
				if (me.oUploadFiles != null) {
						me.oUploadFiles.SaveDescription();
						me.oUploadFiles.Close()
					}
				me.parentWindow.Close()
			}
		).hide().addTo($e().cEl('TD').attr('className','cl-pad3-lr cl-textalign-left').addTo(this.elNavDiv))	
		
		var elAction = $e().createActionButton('Отменить загрузку',
				function(){
					if (me.oUploadFiles != null) 
						me.oUploadFiles.rollbackUploadedFiles()
					me.parentWindow.Close()
				}
			).addTo($e().cEl('TD').attr('className','cl-pad3-lr cl-textalign-left').addTo(this.elNavDiv))
		
	
		this._table =  $e().cEl('table').addTo($e().cEl('div').prop('className','').addTo(this.windowBody))		
		
		this.addHead() 
		
		this.elFileBody = $e().cEl('tbody').addTo(this._table)
		
		this.elNavTR = null
		
		this.addInput()
		//this.createNav()
		
		//this.addControls();			
		
	}
	
	this.addHead = function(){
		var names = ['Имя файла','Размер','% загрузки','Описание','Действия']
		var elHead  = $e().cEl('thead').prop('className','').addTo(this._table)
		var oRow = document.createElement('tr')
		elHead.addChild(oRow) 
		
		for(var i = 0; i <names.length; i++ ){
			var oCell = document.createElement('th')
			oCell.className = 'cl-bg4'
			oCell.innerHTML = names[i]
			oRow.appendChild(oCell)
		}
	}
	
	this.addInput = function(){
		
		this.elInput =  $e().cEl('input').attrs({type:'file',name:'file'+ptid+'[]',multiple:null}).style('display','none').addTo(this.elNavDiv)
		this.elInput.addEvent('change',
			function(e){
				var files = me.elInput.object.files
				me.oUploadFiles = new oUFiles(files,me.elFileBody,me)
				me.oUploadFiles.Process()
			}
		)
		this.elInput.object.click()
	}
	
	this.createNav = function(){
		//this.elNavDiv
		var _elTable = $e().cEl('table').props({celldapping:0,cellspacing:0,width:'100%'}).addTo(this.elNavDiv)
		this.elNavTR = $e().cEl('th').prop('className','cl-bg-white').addTo($e().cEl('thead').addTo(_elTable))
		
	}	
	
	this.Init()
}

function $uploadfiles(ptid){
	return new _uploadfiles(ptid)
}


function _oManageFiles(ptid,navcontrols){
	
	var me = this
		
	this.showdeleted = false;
		
	this.Init = function (){		
		
		this.patient = $patient(ptid)
		this.patient._loadpatient()
		
		this.ofiles = $oFiles()	
				
		this.parentWindow  = $modalwindow()
		this.parentWindow.setCloseOnOut(true)
		this.windowBody = this.parentWindow.getBody() 
		
		this.patient.addPatTip(this.windowBody,true)
				
		this.createNav();
		this.addControls();		
		
		this._table =  $e().cEl('table').addTo($e().cEl('div').prop('className','').addTo(this.windowBody))		
		
		this.addHead() 
		
		this.elFileBody = $e().cEl('tbody').addTo(this._table)							
		
	}
	
	this.addHead = function(){
		var names = ['Имя файла','Описание','Размер','Создал','Дата создания','Действия']
		var elHead  = $e().cEl('thead').prop('className','').addTo(this._table)
		var oRow = document.createElement('tr')
		elHead.addChild(oRow) 
		
		for(var i = 0; i <names.length; i++ ){
			var oCell = document.createElement('th')
			oCell.className = 'cl-bg4'
			oCell.innerHTML = names[i]
			oRow.appendChild(oCell)
		}
	}
	
	
	this.createNav = function(){
		//this.elNavDiv
		this.elNavDiv = $e().cEl('div').prop('className','cl-control-layer').addTo(this.windowBody)
		var _elTable = $e().cEl('table').props({celldapping:0,cellspacing:0,width:'100%'}).addTo(this.elNavDiv)
		this.elNavTR = $e().cEl('th').prop('className','cl-bg-white').addTo($e().cEl('thead').addTo(_elTable))
		
	}
	
	this.addControls = function(){
		
		if (navcontrols.indexOf('addfiles') !== -1) 			
			$e().createActionButton('Добавить файлы',
				function(){
					$uploadfiles(ptid)
				}
			).addTo($e().cEl('td').addTo(this.elNavTR))			
		
		if (navcontrols.indexOf('showdeleted') !== -1) {
			me.elDeleted =  $e(createToggle('Удаленные',me.showdeleted,
				function(checked){
					me.showdeleted= checked
					me.UpdateFileList()
				}
			))
			$e().cEl('td').addTo(this.elNavTR).addChild(me.elDeleted)
		}//end				
		
		$e().cEl('a').prop('className','cl-arrow cl-pad2').html('&#10226;').addTo($e().cEl('td').addTo(this.elNavTR)).addEvent('click',function(){
			me.UpdateFileList()												 
		}) 		 
	}
	
	
	this.UpdateFileList = function(){
		me.elFileBody.clear()
	
		me.ofiles._loadbyPTID(ptid)	
							
		me.ofiles.each(
				function(row,index) {
					var isshow = true;
					
					if (me.showdeleted === false &&  (row.active.trim().toLowerCase() == 'n'))  isshow = false		
					
					if (!isshow) return;
					
					var oRow = document.createElement('TR'),oCell;
						
					oRow.className = 'cl-pad5'	
											
					var bgclass = 'cl-bg-white' 
					if (row.active.trim().toLowerCase() == 'n')	bgclass = 'cl-bg7' 						
							
					oRow.className += ' ' + bgclass			
						
					oCell = document.createElement('TD')
					oCell.className = 'cl-pad3-lr cl-textalign-left' 
					//oCell.innerHTML = row.orgfilename;
					var aLink = document.createElement('a')
					aLink.setAttribute('href','javascript:void(0);')
					aLink.innerHTML = row.orgfilename;
					aLink.onclick = function(){
						var win=window.open("/libraries/getfile.php?fileid="+encodeURIComponent(row.id), "_blank");
						win.focus();						
					}
					oCell.appendChild(aLink)
					oRow.appendChild(oCell)
					
					oCell = document.createElement('TD')
					oCell.className = 'cl-pad3-lr cl-textalign-left' 
					oCell.innerHTML = row.filedesc;
					oRow.appendChild(oCell)
					
					oCell = document.createElement('TD')
					oCell.className = 'cl-pad3-lr cl-textalign-left' 
					oCell.innerHTML = toUnits(parseInt(row.filesize));
					oRow.appendChild(oCell)
					
					oCell = document.createElement('TD')
					var elDoctor = $e().cEl('DIV').prop('className','cl-doctor-image-small').addTo(oCell)
		
					$user(row.createdby).addTip(elDoctor)
					//$tooltipwindow(elDoctor).beforeShow(u.showInfo).adjustTo('bottom')
					
					$e().cEl('span').html(row.lastname + " " + row.firstname + " " + row.middlename).addTo(oCell)

					oRow.appendChild(oCell)
					
					oCell = document.createElement('TD')
					oCell.className = 'cl-pad3-lr' 
					oCell.innerHTML = row.created 
					oRow.appendChild(oCell)	

					if (row.active.trim().toLowerCase() == 'y'){		
						oCell = document.createElement('TD')
						oCell.className = 'cl-pad3-lr' 					
						oRow.appendChild(oCell)	
						
						$e().createActionButton('Удалить файл',
									function(){
										$promptwindow('Вы действительно хотите удалить файл ' + row.orgfilename + '?',
											function(status){
												if (status !== true) return;
												getJSON('/libraries/patientactions.php',false,'GET',{_action:'removefile',_ptid:ptid,_fileid:row.id},me.UpdateFileList, 
													function(errmsg) {
															$warning(errmsg)
															me.UpdateFileList()
														})
											}										
										).setHeader(me.patient.getLabel())									
									}
								).addTo(oCell)					
					}
					me.elFileBody.addChild(oRow)
				}//end function	
		)		
	}
	
	
	this.Init()
}

function $oManageFiles(ptid,navcontrols){
	return new _oManageFiles(ptid,navcontrols)
}