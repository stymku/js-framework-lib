

(function(e,win){

	function _ajax(url,async) {
		this.xmlhttp = null;
		
		this.requestFile = url;
		this.async = (typeof async != 'boolean') ? true : async;
		
		this.reset();
		this.createAJAX();
	}

	_ajax.prototype.resetData =  function() {
		
			this.method = "GET";
			this.queryStringSeparator = "?";
			this.argumentSeparator = "&";
			this.URLString = "";
			this.encodeURIString = true;
			this.execute = false;
			
			this.vars = new Object();
			this.responseStatus = new Array(2);
			this.failed = false;		
		},

	_ajax.prototype.resetFunctions = function() {
			this.onLoading = function() { };
			
			this.onProgress = function() { };
			
			this.onLoaded = function() { };
			this.onInteractive = function() { };
			this.onCompletion = function() { };
			this.onError = function() {
					alert("Ошибка обработки запроса.Адрес:"+this.requestFile);
				 };
			this.onFail = function() { };
		},

	_ajax.prototype.abort = function(){
			if (!this.failed) {this.isaborted = true; this.xmlhttp.abort();}
		},
		
	_ajax.prototype.reset = function() {
			this.resetFunctions();
			this.resetData();
		},

	_ajax.prototype.createAJAX = function() {
			// try {
				// this.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			// } catch (e1) {
				// try {
					// this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				// } catch (e2) {
					// this.xmlhttp = null;
				// }
			// }

			if (! this.xmlhttp) {
				if (typeof XMLHttpRequest != "undefined") {
					this.xmlhttp = new XMLHttpRequest();
				} else {
					this.failed = true;
				}
			}
		},

	_ajax.prototype.setVar = function(name, value){
			this.vars[encodeURIComponent(name)] = encodeURIComponent(value);
		},

	_ajax.prototype.createURLString = function() {

			this.setVar("__timestamp", new Date().getTime());

			var _turl = new Array();
		
			for (var key in this.vars) {
				_turl[_turl.length] = key + "=" + this.vars[key];
			}
			
			this.URLString += _turl.join(this.argumentSeparator);
		},

	_ajax.prototype.runAJAX = function(urlstring) {
			if (this.failed) {
				this.onFail();
			} else {
				this.createURLString();
				
				if (this.xmlhttp) {
					var self = this;
					if ( this.method.toLowerCase() == "get") {
						var totalurlstring = this.requestFile + this.queryStringSeparator + this.URLString;
						//alert("Ajax: total string:"+totalurlstring);
						this.xmlhttp.open(this.method, totalurlstring, this.async);
					} else {
						this.xmlhttp.open(this.method, this.requestFile, this.async);
						//alert("Request file:"+this.requestFile);
						try {
							this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=windows-1251;");
						} catch (e) { }
					}								
					
					this.xmlhttp.onreadystatechange = function() {
						switch (self.xmlhttp.readyState) {
							case 1:
								self.onLoading();
								break;
							case 2:
								self.onLoaded();
								break;
							case 3:
								self.onInteractive();
								break;
							case 4:
								self.response = self.xmlhttp.responseText;
								self.responseXML = self.xmlhttp.responseXML;
								self.responseStatus[0] = self.xmlhttp.status;
								self.responseStatus[1] = self.xmlhttp.statusText;								

								if (self.responseStatus[0] == "200") {
									self.onCompletion();
								} else {
									self.onError();
								}

								self.URLString = "";
								break;
						}
					};
					//alert("Before send" + this.URLString);
					this.xmlhttp.send(this.URLString);
				}
			}
		}
	
	function _ajxUF(url,async) {
		this.xmlhttp = null;

		this.resetData = function() {
			this.method = "POST";
			this.queryStringSeparator = "?";
			this.argumentSeparator = "&";
			this.URLString = "";
			this.encodeURIString = true;
			this.execute = false;
			this.requestFile = url;
			this.vars = new Object();
			this.responseStatus = new Array(2);
			this.failed = false;
			this.isaborted = false;
			this.iscompleted = false;
			this.async = (typeof async != 'boolean') ? true : async;
		};

		this.resetFunctions = function() {
			this.onLoading = function() { };
			
			this.onProgress = function() { };
			this.onProgressStart = function () {};
			this.onProgressAbort = function() { };
			this.onProgressError = function() { };
			
			this.onLoaded = function() { };
			this.onInteractive = function() { };
			this.onCompletion = function() { };
			this.onError = function() {
					if (this.isaborted) {
						this.onProgressAbort()
					}
						else
							this.onProgressError()//alert("Ошибка обработки запроса.Адрес:"+this.requestFile);
				 };
			this.onFail = function() { };
			
		};
		
		this.abort = function(){
			if (!this.failed) {this.isaborted = true; this.xmlhttp.abort();}
		}

		this.reset = function() {
			this.resetFunctions();
			this.resetData();
		};

		this.createAJAX = function() {			
			if (! this.xmlhttp) {
				if (typeof XMLHttpRequest != "undefined") {
					this.xmlhttp = new XMLHttpRequest();
				} else {
					this.failed = true;
				}
			}
		};

		this.runAJAX = function(data) {
			if (this.failed) {
				this.onFail();
			} else 		
				if (this.xmlhttp) {
					var self = this;																										
					
					this.xmlhttp.upload.onprogress = this.onProgress
					this.xmlhttp.onloadstart = this.onProgressStart
					
					this.xmlhttp.onreadystatechange = function() {
						switch (self.xmlhttp.readyState) {
							case 1:
								self.onLoading();
								break;
							case 2:
								self.onLoaded();
								break;
							case 3:
								self.onInteractive();
								break;
							case 4:
								self.response = self.xmlhttp.responseText;
								self.responseXML = self.xmlhttp.responseXML;
								self.responseStatus[0] = self.xmlhttp.status;
								self.responseStatus[1] = self.xmlhttp.statusText;

								if (self.execute) {
									self.runResponse();
								}

								if (self.responseStatus[0] == "200") {
									self.iscompleted = true;
									self.onCompletion();
								} else {
									self.onError();
								}

								self.URLString = "";
								break;
						}
					};
					//alert("Before send" + this.URLString);
					this.xmlhttp.open(this.method, this.requestFile, this.async);
					this.xmlhttp.setRequestHeader("Cache-Control", "no-cache");
					this.xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					this.xmlhttp.send(data);
				}		
		};

		this.reset();
		this.createAJAX();
	}
	
	function _getjson(url,async,method,params,onsucess,onerror) {
		var me = this;
	 
		this.jr = null	
				
		_getjson.superclass.constructor.call(this, url,async);
		
		if (typeof method != 'string') method = 'POST';
		this.method = method;
			
		for(var k in params)
			this.setVar(k,params[k])

		this.onError= function() { 						
			if (typeof onerror == 'function') onerror(); else alert('Ошибка обработки данных на сервере')
		}
	
		this.onCompletion = function() {
			var _err = false;
			try 
			{	
				me.jr = JSON.parse(this.response);
			}
			catch (e) {
				_err  = true;
				if (typeof onerror == 'function')	onerror(this.response);
					else alert ("Ошибка обработки результата с сервера. Сервер вернул"+this.response)
					
			}
			if (_err === false)
				if (me.jr !=  null && typeof me.jr.errno != "undefined"){
						if (typeof onerror == 'function')	onerror(me.jr,me)						
					}
					 else
						{						
							if (typeof onsucess == 'function') onsucess(me.jr,me)
						}	
		}			
			
		
		this.runAJAX()	
			
	}
	
	$u.inherit(_getjson, _ajax)
	
	e.ajx = function(url,async){return new _ajax(url,async)}
	e.getjson = function(url,async,method,params,onsucess,onerror){return new _getjson(url,async,method,params,onsucess,onerror)}
	e.ajxUploadFiles = function(url,async){return new _ajxUF(url,async)}
	
})(window.$e,window);


