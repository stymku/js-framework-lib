// JavaScript created by Tymku Sergey
// v.0.0.1

(function(e,win){
	
	function _abswinbg(maxzInd,isremove){
	
		var me = this;
		
		this.oBody = $e(document.getElementsByTagName("body")[0]);				
		
		maxzInd = typeof maxzInd == "undefined" ? 200:maxzInd;
		isremove = typeof isremove == "undefined" ? true : isremove;
		
		
		var zInd = this.oBody.getmaxchildsvalue('zIndex');
		if (typeof zInd == 'undefined') zInd = maxzInd;
		
		this.oBG = $e('<DIV>').Class('winbg').style('zIndex',zInd);	
		if (isremove === true) this.oBG.click(function(){$e(this).remove();});
	
		
	}
	
	_abswinbg.prototype.addToBody = function (){
			this.oBody.addfirst(this.oBG);
	}
	
	function _abspopupWin(_ops){			
			var me = this;			
										
			_abspopupWin.superclass.constructor.call(this, 200);
			
			this.oPopUp = $e('<DIV>');
			if(typeof _ops.pc == "string") this.oPopUp.Class(_ops.pc);				
			if(typeof _ops.isclose == "boolean" && _ops.isclose === true ) {	
				this.oClose = $e('<DIV>').Class('popupclose');
				this.oClose.click(function(evt){me.oBG.remove();})
				this.oPopUp.append(this.oClose);
			}
						
			if(typeof _ops.pfc == "string" ) { this.oPopUpForm = $e('<DIV>'); this.oPopUpForm.Class(_ops.pfc);}
			
			if(typeof _ops.pfh == "string") { this.oPopUpHeader = $e('<DIV>'); this.oPopUpHeader.Class(_ops.pfh);this.oPopUpForm.append(this.oPopUpHeader)}
			if(typeof _ops.pfb == "string") { this.oPopUpBody = $e('<DIV>');   this.oPopUpBody.Class(_ops.pfb);this.oPopUpForm.append(this.oPopUpBody)}
			if(typeof _ops.pff == "string") { this.oPopUpFoot = $e('<DIV>');   this.oPopUpFoot.Class(_ops.pff);this.oPopUpForm.append(this.oPopUpFoot)}
									
			
			this.oPopUp.click(function(evt){
										if (me.propogation === false) return;
										if (typeof evt.stopPropagation != "undefined") {
											evt.stopPropagation();
										} else {
											evt.cancelBubble = true;
										}
										return false;
									   }
			)
			
			this.oPopUp.append(this.oPopUpForm);									
			this.propogation = function(flag){
				this.propogation = flag;
			}
	}
		
	$u.inherit(_abspopupWin, _abswinbg)
	
	_abspopupWin.prototype.attachFormToBG = function(){this.oBG.append(this.oPopUp);}			
		
	//*********FORM
	function _absform(_o){			
		var me = this;			
		
		this.formname = null;
		this.action = null;
		this.method = null;
		this.errors = [];
		this.elements = null;
					
		var _form;
		if (typeof _o == 'string'){					
			this.forminit(document.forms[_o]);
		} else
			if (_o instanceof e){					
				this.forminit(_o.object);					
			} else 
				{
					_absform.superclass.init.call(this,'<FORM>');							
				}							
		
	}	
	
	$u.inherit(_absform, e)
	
	_absform.prototype.submit = function(){this.object.submit();}
	
	_absform.prototype.forminit = function(_form){
		this.formname = _form.name;					
		this.action = _form.action;					
		this.method = _form.method;
		_absform.superclass.init.call(this,_form);									
	}
	
	
	_absform.prototype.getvalues = function(){
		var elements = this.object.elements;//document.forms[formname].elements; 		
	
		var data = new Object();
		var element_value = null;
		
		this.errors = [];
	  
		for(var i = 0; i < elements.length; i++) {
		  
		  if (!elements[i].type)  continue;
		  var field_type = elements[i].type.toLowerCase();
		  var element_name = elements[i].getAttribute("name");
		  
		  if (!(typeof element_name == 'string' && element_name != '' )) continue;
		  
		  switch(field_type) {
		  
			  case "text": {	
					var f = false;
					switch (elements[i].getAttribute("subtype")) {
						case "date": {
							if (elements[i].value.trim() != "") {
								_date = _isDate(elements[i].value,elements[i].getAttribute("fmtexp"));					
								if (typeof _date == "undefined") 
									this.errors[this.errors.length] = {
										errmsg:"Значение даты не верно",
										element:elements[i]};										
									else
										data[element_name] = _date._toDate();
								}		
							f = true;								
							break;							
						}//end date
						
						case "datetime": {
							if (elements[i].value.trim() != "") {
								_date = _isDate(elements[i].value,elements[i].getAttribute("fmtexp"));					
								if (typeof _date == "undefined") 
									this.errors[this.errors.length] = {
										errmsg:"Значение даты не верно",
										element:elements[i]};
									else
										data[element_name] = _date._toDateTime();
							}	
							f = true;								
							break;					
						}//end datetime
						
						case "phone":{
							elements[i].value = elements[i].value.trim()
							if (elements[i].value != "") {												
								if ( /^\+{0,1}\d+$/.test(elements[i].value) ) 
									data[element_name] = elements[i].value;																		
								else
									this.errors[this.errors.length] = {
										errmsg:"Формат телефона - (+)цифры",
										element:elements[i]};
							}
							f = true;																
							break;					
						}//end phone
						case "email":{
							elements[i].value = elements[i].value.trim()
							if (elements[i].value != "") {												
								if ( checkEmail(elements[i].value) ) 
									data[element_name] = elements[i].value;																		
								else
									this.errors[this.errors.length] = {
										errmsg:"Значение Email неверно",
										element:elements[i]};
							}	
							f= true;
							break;					
						}//end phone
						
						case "searchbox":{
							element_value = elements[i].getAttribute('pkey')
							if (typeof element_value != "undefined" ) {
									data[element_name] = element_value;	
							}	
							f= true;
							break;					
						}//end searchbox
						case "numeric": {
							element_value = elements[i].value.trim()
							if (isNumber(element_value) ) {
									data[element_name] = element_value;	
							}else{
								this.errors[this.errors.length] = {
										errmsg:"Значение неверно",
										element:elements[i]};
							}
							f= true;
							break;					
						}//end numeric
						case "integer": {
							element_value = elements[i].value.trim()
							if (isInteger(element_value) ) {
									data[element_name] = element_value;	
							}else{
								this.errors[this.errors.length] = {
										errmsg:"Значение неверно",
										element:elements[i]};
							}
							f= true;
							break;					
						}//end integer
					}
					if (f) break;
					}		
			   
			  case "textarea":
					if ($e(elements[i]).classExists('ckeditor')) {
						var editor = CKEDITOR.instances[elements[i].id];
						//alert(element_name + ':' + editor.getData())
						data[element_name] = editor.getData();
					}else{
							element_value = elements[i].value;					
							data[element_name] = element_value;
						}
						break;
	
			  case "password":
							data[element_name] = elements[i].value;
							break;
	
			  case "hidden":	
					if(elements[i].getAttribute("subtype") == "datetime") {
							if (elements[i].value.trim() != "") {
								_date = _isDate(elements[i].value,elements[i].getAttribute("fmtexp"));					
								if (typeof _date == "undefined") 
									this.errors[this.errors.length] = {
										errmsg:"Значение даты не верно",
										element:elements[i]};
									else
										data[element_name] = _date._toDateTime();
							}	
							 else{
								 data[element_name] = '';
							 }
							break;					
						}//end datetime
						
					data[element_name] = elements[i].value;
					break;
			  case "checkbox":
				  
				  element_value = CheckboxHandler.isChecked(elements[i]);
				  data[element_name] = element_value;
				  break;

			  case "radio":
				  if (RadioHandler.isChecked(elements[i])){
					  element_value = RadioHandler.getCheckedValue(elements[i]);			  
					  data[element_name] = element_value;
				  }
				  
				  break;
	  
			  case "select-one":
	  
				  var ind = elements[i].selectedIndex;
				  if(ind > 0) { 
					  element_value = elements[i].options[ind].value;
				  } else {
					  element_value = '';
				  }
				  
				  //if ( element_value.replace(/^\s+|\s+$/g, '').toLowerCase() != '')
				  
				  data[element_name] = element_value;
				  
				  break;
	  
			  case "select-multiple":
	  
				  var elems = ListHandler.getSelectedOptionsDisplayText(elements[i]);
				  element_value = elems.join('\n');
				  data[element_name] = element_value;
				  break;
			  
			  default: 
				  break;
		  }
		}
			  
		return data; 
		
	}
	
	
	_absform.prototype.getresponse = function(async,onsuccess,onerror){
			
			var _v = this.getvalues();
			
			async = typeof async == 'boolean' ? false:async;
			
			e.getjson(this.object.action,async,this.object.method, _v,onsuccess,onerror);
		}
	//*******END FROM
	
	function _stopPropagation(evt){
		if (typeof evt.stopPropagation != "undefined") {
			evt.stopPropagation();
		} else {
			evt.cancelBubble = true;
		}
		return false;
	}
		
	//*********FileUpload	
	function _chooseFiles(obj,name){
		
		var me = this;
		
		if (typeof name != 'string') name = "files";
		
		_chooseFiles.superclass.init.call(this,'<input>');
		
		this.attrs({type:'file',name:name+'[]',multiple:"multiple"}).hide();			
	}		
	
	
	$u.inherit(_chooseFiles, e)
	
	//*********EndUpload	
	
	//SlideShow	
	function _slider(w,i,fp,msec){
		
		var me = this;
		this.oWS  = $e(w);
		this.oFoot  = $e(fp,'s');
		this.oImages = $e(i,'all');	
		this.windowwidth = parseInt(this.oImages.items(0).comStyle('width'));
		
		this.delay = 5000;
		this.imnum = this.oImages.count();
		
		this.oAnchors = [];
		
		for(var i = 0;i<this.imnum;i++){
			this.oAnchors[i] = $e('<DIV>');
			this.oAnchors[i].click((function(i){ return function() {me.scrolltopos(i);}})(i));
			this.oAnchors[i].attachto(this.oFoot);
		}
		if (this.imnum>0) this.oAnchors[0].Class('active');
		
		if (typeof msec == 'undefined') msec = 300;
		
		this.dp = -this.windowwidth/25;
		this.deltatime = Math.abs(msec/25);
		
		this.setCA = function(ind){
			for(var i = 0;i<this.imnum;i++){
				this.oAnchors[i].Class('');				
			}
			this.oAnchors[ind].Class('active');				
		}
		
		this.sfb = function(){
			if (this.imnum<=0) return;
			
			me.oWS.style('left','0px');
			
			me.setCA(0);
			
			me.timeid = setTimeout(function(){ me._s(0);},me.delay);
		}
		
		this._s = function(imind){
			if ( imind + 1 >= me.imnum || imind < 0){ this.sfb();return; }
			
			var s = parseInt(me.oWS.comStyle('left'));
									
			var e = s - me.windowwidth;
			
			me.interval = setInterval(
							function(){
								s += me.dp;
								if (s < e){
									clearInterval(me.interval);
									
									me.oWS.style('left',e+'px');
									
									me.setCA(imind+1);									
									
									me.timeid = setTimeout(function(){me._s(++imind);},5000);
								} else me.oWS.style('left',s+'px');
							},me.deltatime);
			
		}
		
		this.setdelay = function(d){
			if (typeof d == 'undefined') return this.delay;
				else this.delay = d;
		}
		
		this.scrolltopos = function(i){			
			clearTimeout(me.timeid);
			clearInterval(me.interval);			
			
			if (i==0) this.sfb();
				else {me.oWS.style('left',-(i)*me.windowwidth+'px');me.setCA(i);
				me.timeid = setTimeout(function(){me._s(++i);},5000);}
			
		}
		
		this.scroll = function(){
			me.timeid = setTimeout(function(){ me._s(0);},me.delay);
		}
	}
	//
	
	e.ui = {
			abswinbg:_abswinbg,
			abspopupWin :_abspopupWin,
			absform :_absform,
			slider: function(w,i,fp,msec){return new _slider(w,i,fp,msec);},
			oForm:function(_o) {return new _absform(_o);},
			stopPropagation: _stopPropagation,
			oChooseFiles:function(name) { return new _chooseFiles(name);},
			isSupportUploadFiles: function(){
				if (win.File && win.FileList) 
					return true;
				 else return false;
				
			}//END 
		};	
	
	e.plugins.anchor = function(sides,parent){
		if (typeof parent  == 'undefined') parent = this.getparent();
		var pw = this.getOffsetRect(),
			pp = parseInt(parent.width()),
			delta = pp - pw.right + pw.left ;
			
		
		if ( sides.indexOf('right') != -1) {
			// right anchor
			$e(win).addEvent('resize',(function(el){
				return function() {
						var erect = el.getOffsetRect(),
						    prect = parent.getOffsetRect(),
							
							pp = parseInt(parent.width()),
							delta = pp - pw.right + pw.left ;
						
						var w = parseInt(parent.width());
						if (isNaN(w)) return;
						
						el.width(w - (erect.left - prect.left) - 20 +'px');
						el.value(w - (erect.left - prect.left) - 20 + ', ' + delta + ',' + (erect.left - prect.left));
					}
			})(this))
		}
	}
	
	e.plugins.test = function(){
		this.each(
			function(el){el.style('color','#f00')}
		);		
		return this;
	}
	
	
})(window.$e,window);


