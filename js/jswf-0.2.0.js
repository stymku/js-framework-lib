// JavaScript created by Tymku Sergey
// v.0.2.0

//
// String 
//

String.prototype.trim=function(){return  this.replace(/^\s+|\s+$/g, '');};
String.prototype.ltrim=function(){return  this.replace(/^\s+/, '');};
String.prototype.rtrim=function(){return  this.replace(/\s+$/, '');};

//
// working with date and time 
//

Date.prototype._toDate=function(){return  this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate()};
Date.prototype._toDateTime=function(){return  this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate() + ' '+  this.getHours() + ':' +this.getMinutes() + ':' + this.getSeconds() };

Date.prototype._toTime=function(){return  this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds()};

Date.prototype.getWDate = function(date){
		var day = this.getDay();
		if (day == 0) day = 7;
		return day - 1;
	}

Date.prototype.toFmt = function(format,lan) {
	
	var _l =  (typeof lan == 'underfine') ? 1 : ((lan=='ukr') ? 2 : 1);
	var f = {y : this.getYear(), m : this.getMonth() + 1,d : this.getDate(),H : this.getHours(),i : this.getMinutes(),S : this.getSeconds(),B: (_l==1) ? _monthesnames[this.getMonth() + 1] : _ukrmonthesnames[this.getMonth() + 1],C: (_l==1) ? _monthesnames[this.getMonth() + 1].substring(0,3) : _ukrmonthesnames[this.getMonth() + 1].substring(0,3), Y : this.getFullYear(), D:_daynames[this.getWDate()]}
	for(k in f)
		format = format.replace('%' + k, (isNumber(f[k]) && f[k] < 10) ? "0" + f[k] : f[k]);
	return format;
};

Date.prototype.toDbFmt = function(format) {
	var f = {y : this.getYear(), m : this.getMonth() + 1,d : this.getDate(),H : this.getHours(),M : this.getMinutes(),i : this.getMinutes(),S : this.getSeconds(),B:_monthesnames[this.getMonth() + 1], Y : this.getFullYear(), D:_daynames[this.getWDate()]}
	for(k in f)
		format = format.replace(k, (isNumber(f[k]) && f[k] < 10) ? "0" + f[k] : f[k]);
	return format;
}

Date.prototype.daysDiff = function(b){
	var _MS_PER_DAY = 1000 * 60 * 60 * 24;

	 // Discard the time and time-zone information.
	var utc1 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());
  	var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  	return Math.floor(Math.abs(utc2 - utc1) / _MS_PER_DAY);
}

Date.prototype.adjustTo = function(wday,adj){
	if (typeof adj == 'undefined') adj = 1
	while(this.getDay() != wday) this.setDate(this.getDate() + adj)
	return this
}

Date.prototype.addDays = function(numdays){
	this.setDate(this.getDate() + numdays)
	return this		
}

Date.prototype.addTime = function(date){
	//take hours minutes seconds from date
	this.setHours(this.getHours() + date.getHours(),this.getMinutes() + date.getMinutes(),this.getSeconds() + date.getSeconds(),this.getMilliseconds() + date.getMilliseconds())
	
	return this		
}

Date.prototype.isEqual = function(b,format){
	if (typeof format == 'undefined') format = '%Y-%d-%m'
	var _f1 = this.toFmt(format)
	var _f2 = b.toFmt(format)
	return (_f1 === _f2)
}

Date.prototype.getAge = function(){
    var today = new Date();    
    var age = today.getFullYear() - this.getFullYear();
    var m = today.getMonth() - this.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.getDate())) 
    {
        age--;
    }
    return age;
}

Date.prototype.daysInMonth = function(){
	var nextMonth = this.getMonth();
	return new Date(this.getYear(), 
                    ++nextMonth, 
                    0).getDate();
}


//JSON REPRESENTATION OF OBJECT DATA
function jsonReqObjData(){
	this.objname = "";
	
	this.params = [];
	this.columns = [];
	this.orders = [];
	this.ftable = [];
	this.rtable = [];
	this.expressions = [];
	
	this.resetData = function() {
		this.objname = "";
		this.params = [];
		this.columns = [];		
		this.orders = [];
		this.ftable = [];
		this.rtable = [];
		this.expressions = [];		
  	};
	
	this.reset = function() {
		this.resetData();
	};
	
	this.setObjName = function(name){
		this.objname = name;
	};
	
	this.addParam = function(paramname,value1,op,value2,logop){
		if (typeof op != 'string') op = "=";
		if (typeof value2 != 'string') value2 = "";
		if (typeof logop != 'string') logop = "and";
		this.params.push( {"colname":paramname,"value1":value1,"value2":value2,"op":op,"logop":logop});
	};
	
	this.addExpression = function(expression,logop){
		if (typeof logop != 'string') logop = "and";
		this.expressions.push( {"expression":expression,"logop":logop});
	};
	
	this.addFTable = function(fkcolumn,columns){
		this.ftable.push( {"fkcolumn":fkcolumn,"columns":columns});
	};
	
	this.addRTable = function(table,column,columns){
		this.rtable.push( {table:table,column:column,columns:columns});
	};

	this.addColumn = function(colname){
		this.columns.push( {"colname":colname});
	};
	
	this.addColumns = function(columns){
		for(var i = 0, len = columns.length;  i< len; i++)
			this.columns.push( {"colname":columns[i]});
	};
	
	this.addOrder = function(colname,order){
		order = order || "asc";
		this.orders.push( {"colname":colname,"order":order});
	};
	
	this.getJSON = function(){
		//JSON.stringify({"params":this.params});
		return JSON.stringify(this);
	}

	
	this.reset();
}


(function(win){
	
	
	function u() {		
		var ots = Object.prototype.toString,
			owp = Object.prototype.hasOwnProperty;
		
		this.extend( {Now:function(){return new Date()}})		
		this.extend( {ce:function(name){return document.createElement(name);}})
	}
	
	u.prototype = {	
	
		inherit: function(Child, Parent) {
			var F = function() { }
			F.prototype = Parent.prototype
			Child.prototype = new F()
			Child.prototype.constructor = Child
			Child.superclass = Parent.prototype
		},		
		
		extend:function(){
			var key,_e,obj=arguments[0]||{},alen=arguments.length,pos=1,nested = false,O={},obje,exte;
			this.isBool(obj) && (nested = obj, obj=arguments[1]||{},pos=2);			
			(alen == pos) && (obj = this,--pos);
			for(;pos<alen;pos++)
				if ((e=arguments[pos])!=null)
					for(key in e){
						obje = obj[key], exte = e[key];
						if (exte === obj) continue;
						if(typeof O[key] != "undefined" && O[key] == exte) continue;
						nested&&(this.isObj(exte)||(s=this.isArray(exte)))? (s?(s=false,_e=obje&&this.isArray(obje)?obje:[]):(_e=obje&&this.isObj(obje)?obje:{}), obj[key] = this.extend(nested,_e,exte)): (obj[key] = exte); 
					}
			return obj;	 
		},
				
		
		isUndef: function(e){return typeof(e) === "undefined"},
		isArray: Array.isArray || function(e){return ots(e) === "[object Array]"},
		isObj: function(e){return typeof e === "object" && e !== null},
		isBool: function(e){return typeof e === "boolean"},	
		isRegExp: function (e) {return this.isObj(re) && ots(re) === '[object RegExp]';},		
		isDate:function (e) { return this.isObj(e) && ots(e) === '[object Date]';},
		isNull: function (e) { return e === null;},
		
		isNumeric: function(n) { return !isNaN(parseFloat(n)) && isFinite(n);},
		isInt: function(n) { return !isNaN(parseInt(n)) && isFinite(n) && parseInt(n);}
	}
			
	
	win.$u = new u()	
	
})(window);

(function(win) {
	function _handler(object,qm) {		
		return new _handler.plugins.init(object,qm);								
	}

	_handler.plugins = _handler.prototype = {
    
	init :  function(object,qm){
			qm = qm || 'id';
			if (typeof object === "string"){
				//var reg = /^<([a-z]+)>$/i;
				//var result  = object.match(reg);
				//if ( $u.isArray(result) && result.length > 0 )
				if (object.length >= 3 && object.charAt(0) === "<" && object.charAt( object.length - 1 ) === ">")
						this.object = document.createElement(object.substring(1,object.length - 1));
					else
						if (qm === 'id') this.object = document.getElementById(object);
							else  if (qm === 's') this.object = document.querySelector(object);
								else  if (qm === 'all' ) this.object = document.querySelectorAll(object);
			}
			else
				if (object instanceof _handler)
					this.object = object.object;
					else
						if (typeof object == "object")
							this.object = object;
	},
	
    // возвращает все классы элемента в виде массива строк
    getAllClasses : function() {
					if (this.isUndef()) return;
                    return this.object.className.split(/\s+/)
                },

    // назначен ли элементу данный класс?
    classExists      : function(className) {
                    var classes = this.getAllClasses()
                    for(var i = 0; i < classes.length; i++)
                        if(classes[i] == className) return true
                    return false
                },
	Class			:	function(className) {						
						this.object.className = className
						return this;
	                },
    // назначает элементу класс
    addClass         : function(className) {
						this.iMS(
								function(el){el.addClass(className);},
								function(){
									var classes = this.getAllClasses()
									for(var i = 0; i < classes.length; i++)
										if(classes[i] == className) return ;
									this.object.className = this.object.className + " " + className
								}
						);
						
						return this;
	                },

    // удаляет класс из назначенных элементу.
    // можно указать как имя класса, так и регулярное выражение,
    // которое будет сравниваться отдельно с каждым из назначенных классов.
    removeClass      : function(className) {
			
						this.iMS(function(el){el.removeClass(className);},
							function() {							
								var classes = this.getAllClasses()
								var cn = ""
								for(var i = 0; i < classes.length; i++) {
									var isMatch = (typeof className.test == "function")
										? className.test(classes[i])
										: (classes[i] == className)
									if(!isMatch) cn = cn + " " + classes[i]
								}
								this.object.className = cn.substr(1)
							}
						);
						return this;
	},

    // назначает/удаляет класс в зависимости от булевского параметра state
    setClass         : function(className, state) {
						if(state)
							this.addClass(className)
						else
							this.removeClass(className)
						return this
					},

    // назначает элементу класс, если он ещё не назначен, в противном случае удаляет
    flipClass        : function(className) {
						if(this.classExists(className))
							this.removeClass(className)
						else
							this.addClass(className)
						return this	
                },
	
	iMS: function(cbmas,cbsingle){
		var O = Object(this.object);    
		var len = O.length >>> 0; // Hack to convert O.length to a UInt32
		if (len > 0) this.each(cbmas);
		 else cbsingle.call(this);
	},
	
	items: function(i){
		var len = this.count();
		if ( len > 0 && i < len && i > -1) {
			//array
			return $e(this.object[i]);
			
		} else return ;
	},
	
	count:function(){	
		var O = Object(this.object);    
		var len = O.length >>> 0; // Hack to convert O.length to a UInt32
		return len;
	},
	
	comStyle: function(prop) {
		if (this.isUndef()) return;
		
		if (document.defaultView && document.defaultView.getComputedStyle) {
			 if (prop.match(/[A-Z]/)) prop = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
			 return document.defaultView.getComputedStyle(this.object, "").getPropertyValue(prop);
			}
			 else if (this.object.currentStyle)
					{
					  var i;
					  while ((i=prop.indexOf("-"))!=-1) prop = prop.substr(0, i) + prop.substr(i+1,1).toUpperCase() + prop.substr(i+2);
					  return this.object.currentStyle[prop];
					}
	},
	
	each: function (callback){
			if (!this.isUndef()){
				var O = Object(this.object);    
			    var len = O.length >>> 0; // Hack to convert O.length to a UInt32     
				if ( typeof callback !== "function" ) { throw new TypeError( callback + " is not a function" ); }     
				var k = 0	
				while( k < len ) {       
					var kValue;       
					if ( Object.prototype.hasOwnProperty.call(O, k) ) {         			
						kValue = O[ k ];        	
						callback.call( this, new _handler(kValue), k, O );      
					}//end if      
				k++;   
				} //end while 		   
			}//end if typeof this.object == 'object'
			return this
		},
	
	getElementsByClassList : function(classlist){
		if (typeof classlist == 'string' && !this.isUndef() ){
			if (document.getElementsByClassName){
				return new _handler(this.object.getElementsByClassName(classlist));
			}
			else{				
					list = this.object.getElementsByTagName('*'),
					numel = list.length,
					classArray = classlist.split(/\s+/),
					numclasses = classArray.length,
					result = [],i,j;
					for(i=0; i < numel; i++)
						for(j=0; j < numclasses; j++)
							if (list[i].className.search('\\b'+classArray[j] + '\\b') != -1){
								result.push(new _handler(list[i]));
								break;
							}
				return result;				
			}
		}
		
		return ;
	},
	
	qSel:	function (selector){		
			if (typeof selector == 'string' && !this.isUndef() )
				return new _handler(this.object.querySelector(selector));
			 else
				if (this.isUndef() ){
					return new _handler(document.querySelector(selector));
				}
			return ;
	},
	
	qSelAll: function (selector){
		   if (typeof selector == 'string' && !this.isUndef())
			   return new _handler(this.object.querySelectorAll(selector));
			 else
				if (this.isUndef()){
					return new _handler(document.querySelectorAll(selector));
				}				 
			return ;
	},//end qSelAll
	
	clone: function(incnodes){
		if (this.isUndef()) return;
		if (typeof incnodes != "boolean") incnodes = true;
		return new _handler(this.object.cloneNode(incnodes));
	},
	
	haschilds: function() {
		if (this.isUndef()) return false;		
		return (this.object.hasChildNodes());		
	},
	
	getfirstchild: function(){
		if (!this.isUndef())
			return (this.object.firstChild);
		return ;		
	},
	
	parent: function (){
		if (!this.isUndef()) return new _handler(this.object.parentNode) 		
	},//end remove
	
	remove: function (){
		if (!this.isUndef())
			this.iMS(
					function(el){el.remove();},
					function() { if (this.object.parentNode)  this.object.parentNode.removeChild(this.object); }
			);
		return this;	
	},//end remove

	removechild: function () {
		if (!this.isUndef())
			this.iMS(
					function(el){el.removechild();},
					function() {
								while(this.object.lastChild) {
									this.object.removeChild(this.object.lastChild);
  								}}
			);
	  		
		return this	
	},//end removechild
	
	append : function(el){
		if (el instanceof _handler )
				this.object.appendChild(el.object)
			else 
				if (typeof el != 'undefined' ) this.object.appendChild(el)
		return this		
	},
	
	attachto:function(el){
		if (el instanceof _handler)
			el.append(this)
		else 
			el.appendChild(this.object)	
			
		return this;	
	},
	
	addfirst: function(refElem){
		if (!this.isUndef())		
			if (this.haschilds()) {
				if (refElem instanceof _handler)
					this.object.insertBefore( refElem.object,this.object.firstChild);
				else	
					this.object.insertBefore( refElem,this.object.firstChild);
			} 
			else 		
				this.append(refElem);
					

		return this;	
	},
	
	attachafterto :function (refElem) {			
		if (!this.isUndef())
			if (refElem instanceof _handler )
				refElem.object.parentNode.insertBefore(this.object, refElem.object.nextSibling);
			else 
				refElem.parentNode.insertBefore(this.object, refElem.nextSibling);
		
		return this;	
	}, 

	attachfirstto :function (refElem) {
		if (!this.isUndef())
					
		if (refElem instanceof _handler )
				refElem.addfirst(this);
		 else 
			refElem.insertBefore( this.object,refElem.firstChild);;
		
		return this;	
	}, 
	
	attachbeforeto :function (refElem) {
		if (!this.isUndef())

		if (refElem instanceof _handler )
			refElem.object.parentNode.insertBefore(this.object, refElem.object);
		else 
			refElem.parentNode.insertBefore(this.object, refElem);

		return this;	
	}, 
	
	ischild: function(child){
		if (typeof child == 'undefined') return false;
		
		 var node = child;
	     while (node != null) {
	         if (node == this.object) {
    	         return true;
        	 }
	         node = node.parentNode;			 
     	}
		return false;
	},
	
	getparent:function(){		
		for(var node = this.object.parentNode; node != null;node = node.parentNode ) {
	         if (node.nodeType !== 1) {continue;}
	         return $e(node);			 
     	}		
	},
	
	getmaxparentvalue: function (propname){		
		var maxv;				 
	    for(var node = this.object; node != null && node != document.body; node = node.parentNode) 
		{
			if (node.nodeType != 1 ) continue;
	         var v = $e(node).comStyle(propname)
			 var n = parseFloat(v)
			 if (!isNaN(n) && isFinite(n)) {
				 if (isNumber(maxv) ) { 
				    if (maxv < n) maxv = n
				 }
				 	else maxv =  n
			 }	         
     	}
		return maxv;
	},
	
	getmaxchildsvalue: function (propname){		
		var maxv;		
		 
		if (!this.object.hasChildNodes() || typeof propname == 'undefined' ) return;
		 
		for (var i = 0, len = this.object.childNodes.length; i < len; i++) {
			if (this.object.childNodes[i].nodeType != 1 ) continue;
	   		var v = $e(this.object.childNodes[i]).comStyle(propname);
			var n = parseFloat(v);
			 if (!isNaN(n) && isFinite(n)) {
				 if (isNumber(maxv) ) { 
				    if (maxv < n) maxv = n
				 }
				 	else maxv =  n
			 }
     	}
		return maxv;
	},
	
	
	getnextsibling : function()	{
		if (this.isUndef()) return;
		var x=this.object.nextSibling;
		while (x != null && x.nodeType!=1)
		{
			x=x.nextSibling;
		}
		if (x == null) return $e();
		return $e(x);
	},
	
	getFLChilds: function(){
		if (this.isUndef()) return;
		var sibs = [];
		var x=this.object.firstChild;
		while (x != null )
		{
			if (x.nodeType != 3) //skiping text element
				sibs.push(x);
			x=x.nextSibling;
		}
		return $e(sibs);	
	},
	
	isUndef: function(){
		if (typeof this.object == "undefined" || this.object == null) return true;
		return false;
	},
			
	addEvent: function(evType, fn, useCapture ){
		if (this.isUndef()) return false;
		if (typeof useCapture != 'boolean') useCapture = false;
		
		this.iMS(
				 function(el){el.addEvent(evType, fn, useCapture);},
				function(){
					if (this.object.addEventListener) 
						this.object.addEventListener(evType,fn,useCapture);
						else if (this.object.attachEvent ) 
							this.object.attachEvent('on'+evType,fn);
				}
		);
		
		return this;
	},
	
	addEventToParents: function (evType, fn, useCapture){				
		//add event to all parents up to body node. body node is included.	
		
	    for(var node = this.object.parentNode;node != null;node = node.parentNode) {
			if (node.nodeType != 1 ) continue;
			$e(node).addEvent(evType, fn, useCapture);	         
     	}
	},
	
	removeEvent: function(evType, fn, useCapture ){
		if (this.isUndef()) return false;
		if (typeof useCapture != 'boolean') useCapture = false;
		
		this.iMS(
			function(el){el.removeEvent(evType, fn, useCapture);},
			function(){this.object.removeEventListener(evType,fn,useCapture);}
		);
		
		return this;
	},

	hide: function(){
		if (this.isUndef()) return ;
		
		this.iMS(
			function(el){el.hide();},
			function(){
				if (!this.attr('displayOld')) {
					this.attr("displayOld", this.comStyle('display'))
				}			
				this.style('display','none');
			}
		);	
		
		return this
	},
	
	show: function(){
		if (this.isUndef()) return ;
		
		this.iMS(
			function(el){el.show();},
			function(){			
				if (this.comStyle('display') != 'none') return;
				
				if (this.attr("displayOld") != 'none')
					this.style('display',this.attr("displayOld") || "")
				else
					this.style('display',"");
			}/*end else*/
		);
		
		return this
	},
	
	isdisplayed: function(){
		if (this.comStyle('display') === 'none') return false
		return true	
	},
	
	toggle: function(){
		if (this.isUndef()) return;
		
		this.iMS(
			function(el){el.toggle();},
			function(){
				if (this.isdisplayed()) {
					//showed
					 this.hide()
					 return false;
				}
				 else {
					this.show()
					return true
				 }
			}
		);	
	},
	
	attr: function(attrname,attrvalue){
		if (this.isUndef()) return ;		
		
		if (typeof attrvalue == 'undefined' ){
			return this.object.getAttribute(attrname)
		} else{			 
			this.iMS(
				function(el){el.attr(attrname,attrvalue);},
				function(){this.object.setAttribute(attrname,attrvalue);}
			);	
			return this
		}
	},
	
	attrs: function(oAttrs){
		if (this.isUndef()) return ;
	
		this.iMS(
			function(el){el.attrs(oAttrs);},		
			function(){ 
				for(var attr in oAttrs){
					 this.object.setAttribute(attr,oAttrs[attr])	
				}
			}
		);	
		return this
	},
	
	prop: function(propname,propvalue){
		if (this.isUndef()) return ;		
		
		if (typeof propvalue == 'undefined' ){
			return this.object[propname];
		} else 
			this.iMS(
				function(el){el.prop(propname,propvalue);},
				function(){this.object[propname] = propvalue;}
			);	

		return this;
	},
	
	props: function(oProps){
		if (this.isUndef()) return ;
		
		this.iMS(
				function(el){el.props(oProps);},
				function(){
					for(var propname in oProps){
						this.object[propname] = oProps[propname];
					}
				}
		);		
		
		return this
	},
	
	removeattr: function(attrname){
		if (this.isUndef()) return ;

		this.iMS(
				function(el){el.removeattr(attrname);},
				function(){this.object.removeAttribute(attrname);}
		);
		
		return this;
	},
	
	hasattr: function(attrname){
		if (this.isUndef()) return ;		
		return this.object.hasAttribute(attrname);	 				
	},
	
	value:function(_v){
		if (this.isUndef() || typeof(this.object.value) === 'undefined') return ;		
		if (typeof _v === 'undefined') return this.object.value
		this.object.value = _v
		return this
	},
	
	id: function(_v){
		if (this.isUndef() || typeof(this.object.id) === 'undefined') return ;		
		if (typeof _v === 'undefined') return this.object.id
		this.object.id = _v
		return this
	},	
	
	fire: function(eventname){
		if (this.isUndef()) return ;		

		if ("dispatchEvent" in this.object){
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(eventname, false, true);
			this.object.dispatchEvent(evt);
		}				
			else
				{
					this.object.fireEvent("on"+eventname);
				}
	},
	
	html: function(texthtml){
		if (this.isUndef()) return ;
		
		if (typeof texthtml == 'undefined' && 'innerHTML' in this.object) return this.object.innerHTML ;
		
		this.iMS(
				function(el){el.html(texthtml);},
				function(){
					if ('innerHTML' in this.object)						
							this.object.innerHTML = texthtml;
				}
		);		
				
		return this;
	},
	
	style:function(propname,value){
		if (this.isUndef()) return ;	
		
		if (typeof value != 'undefined'){
			this.iMS(
				function(el){el.style(propname,value);},
				function(){		
			  		if(propname in this.object.style) this.object.style[propname] = value;
				}
			);					
		}
		else{
				return this.object.style[propname]
			}
			
		return this
	},//end style
	
	styles:function(styles){
		if (this.isUndef() || typeof styles != 'object') return ;
		this.iMS(
				function(el){el.styles(styles);},
				function(){
					for(var propname in styles){
						if(propname in this.object.style){
							this.object.style[propname] = styles[propname]
						}
					}
				}
		);
		
		return this
	},
	
	click:function(fn){
		if  (typeof fn == 'function' ) 
			this.iMS(
					function(el){el.click(fn);},
					function(){
						if (typeof this.object.onclick != 'undefined')
							this.object.onclick  = function(event){
								event = event || window.event;
								return fn.call(this,event);
							}
						}
			);
		else
			if (typeof this.object.click == "function" ) this.object.click();
		return this		
	},
	
	focus:function(){
		if (this.isUndef() || typeof(this.object.focus) !== 'function') return ;	
		this.object.focus()
		return this
	},	

	/* UI */
	getBoundingClientRect: function(){
		if (!this.isUndef() && typeof this.object.getBoundingClientRect == "function")
			return this.object.getBoundingClientRect()
	},
	
	width: function(_w){
		if (typeof _w == "undefined") {
			//get width
			return this.comStyle('width');
		}	
			else {
				this.style('width',_w);
				return this;
			}
	},
	
	height: function(_h){
		if (typeof _h == "undefined") {
			//get width
			return this.comStyle('height');
		}
			else {
				this.style('height',_h);
				return this;
			}
	},
	
	clientDim: function(){
		// inner + padding
		if (this.isUndef() ) return ;
		return { 
			clientWidth:this.object.clientWidth, clientHeight:this.object.clientHeight,
			clientTop:this.object.clientTop, clientLeft:this.object.clientLeft
		};
	},
	
	
	getOffsetRect: function() {
		if (this.isUndef()) return;
		var box = this.object.getBoundingClientRect()

		var body = document.body
		var docElem = document.documentElement

		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

		var clientTop = docElem.clientTop || body.clientTop || 0
		var clientLeft = docElem.clientLeft || body.clientLeft || 0

		var top    = box.top +  scrollTop - clientTop
		var bottom = box.bottom +  scrollTop - clientTop

		var left   = box.left + scrollLeft - clientLeft
		var right  = box.right +  scrollLeft - clientLeft

		return { top: Math.round(top), left: Math.round(left), right:Math.round(right), bottom:Math.round(bottom)}
	},
	
	getHeight : function(){
		if (this.isUndef()) return ;
		var _r = this.getOffsetRect()
		return _r.bottom  - _r.top
	},
	
	getWidth : function(){
		if (this.isUndef()) return ;
		var _r = this.getOffsetRect()
		return _r.right  - _r.left
	},
	
	
	
	getScrollDim: function(){
		if (this.isUndef()) return ;
		return { scrollWidth:this.object.scrollWidth, scrollHeight:this.object.scrollHeight};
	},

	getWindowViewDim : function(){	
		//return view part of window
		return { width:document.documentElement.clientWidth, height:document.documentElement.clientHeight};
	},
	
	getWindowDim : function(){
		
		var scrollHeight = document.documentElement.scrollHeight;		
		var clientHeight = document.documentElement.clientHeight;

		var scrollWidth = document.documentElement.scrollWidth;		
		var clientWidth = document.documentElement.clientWidth;

		return { width:Math.max(scrollWidth, clientWidth), height:Math.max(scrollHeight, clientHeight)};
	},
	
	getPageScroll : function(){
		if (window.pageXOffset !== undefined) 		
			return {
			  left: window.pageXOffset,
			  top: window.pageYOffset
			};
		    else
			   {
				var html = document.documentElement;
				var body = document.body;

				var top = html.scrollTop || body && body.scrollTop || 0;
				top -= html.clientTop;

				var left = html.scrollLeft || body && body.scrollLeft || 0;
				left -= html.clientLeft;

				return { top: top, left: left };
			  }
	},
	
	scrollTop: function(){
		if (this.isUndef()) return ;
		//if (typeof this.object.scrollTop != "undefined") return this.object.scrollTop		

		if ( 'scrollTop' in this.object) return this.object.scrollTop
	},
	
	scrollLeft: function(){
		if (this.isUndef()) return ;
		//if ( typeof this.object.scrollLeft != "undefined") return this.object.scrollLeft
		if ( 'scrollLeft' in this.object) return this.object.scrollLeft
	},
	
	offsetHeight:function(){
		if (this.isUndef()) return ;
		//if (typeof this.object.offsetHeight != "undefined") return this.object.offsetHeight;
		return this.object.offsetHeight;
	},	
	
	offsetWidth:function(){
		if (this.isUndef()) return ;
		//if ( typeof this.object.offsetWidth != "undefined") return this.object.offsetWidth
		return this.object.offsetWidth
	},

	getPageOffsets: function(){
		if (this.isUndef()) return ;
		return {pageX: this.object.pageX , pageY:this.object.pageY};
	},
	
	getClientOffsets: function(){
		if (this.isUndef()) return ;
		return {clientX: this.object.clientX , clientY:this.object.clientY};
	},
	
	getDocTL: function(){
		var body = document.body
		var docElem = document.documentElement
		
		return { 
				clientTop:  docElem.clientTop || body.clientTop || 0,
				clientLeft : docElem.clientLeft || body.clientLeft || 0
		}
	},			
	
	getDocDim: function(){
		var body = document.body
		var docElem = document.documentElement
		
		return { 
				clientTop:  docElem.clientTop || body.clientTop || 0,
				clientLeft : docElem.clientLeft || body.clientLeft || 0,
				clientWidth : docElem.clientWidth || body.clientWidth || 0,
				clientHeight : docElem.clientHeight || body.clientHeight || 0
		}
	},	
	
	getDocOffsets: function(){
		var body = document.body
		var docElem = document.documentElement
		
		return { 
				offsetHeight:  docElem.offsetHeight || body.offsetHeight || 0,
				offsetWidth:  docElem.offsetWidth || body.offsetWidth || 0
		}
	},	
	
	winScrollTo: function(X,Y){
		window.scrollTo(X,Y)
	},
	
	winScrollBy: function(Xoffset,Yoffset){
		window.scrollBy(Xoffset,Yoffset)
	},

	scrollIntoView: function(alignWithTop){
		if (this.isUndef()) return ;
		if (typeof this.object.scrollIntoView == 'function') this.object.scrollIntoView(alignWithTop)
		return this;
	}
}

	_handler.plugins.init.prototype = _handler.plugins;
	
	win.$e =  _handler;	
	
})(window);

