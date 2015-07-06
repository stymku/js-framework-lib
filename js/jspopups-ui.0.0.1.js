// JavaScript created by Tymku Sergey
// v.0.0.1

(function(e,win){
	
	
	function _lw(isattachtobg){	
			var me = this;
			
			this.oForm = e.ui.oForm().attrs({method:'POST',action:'/'});			
			
			//this.oForm = $e('<FORM>').attrs({method:'POST',action:'/'});
			this.oHidden = $e('<INPUT>').attrs({type:'hidden',name:'auth'}).value('1').attachto(this.oForm);
			this.oCheckOnly = $e('<INPUT>').attrs({type:'hidden',name:'check'}).value('1').attachto(this.oForm);
			this.oLogin = $e('<INPUT>').attrs({type:'text',name:'login'}).value('');
			this.oPassword = $e('<INPUT>').attrs({type:'password',name:'pwd'}).value('');
			this.oSignin = $e('<BUTTON>').attrs({type:'submit',name:'signin'}).html('Вход');
			this.oErrLogin = $e('<DIV>').Class('login-error').html('').hide();
			this.oErrPassword = $e('<DIV>').Class('login-error').html('').hide();
			
			this.click = function(){
				//alert(me.oSignin.attr('url'));
				var _err = false;
				if (me.oLogin.value().trim() == '' )  {
						me.oErrLogin.html('Введите логин').show();
						me.oLogin.addClass('login-error');
						_err = true;
					} else { me.oErrLogin.hide(); me.oLogin.removeClass('login-error'); }
					
				if (me.oPassword.value().trim() == '' ) { 
						me.oPassword.addClass('login-error');
						me.oErrPassword.html('Введите пароль').show();
						_err = true;
					} else { me.oErrPassword.hide();me.oPassword.removeClass('login-error');}
				
				var url = me.oSignin.prop('formAction');
				if (_err === false && typeof  url != 'undefined') {
					//authentificate
					//var _v = me.oForm.getvalues();
					me.oForm.getresponse(false,
						function(js,aj){
							if (typeof js != 'object') return;
							if (js.pass == "1") {me.oCheckOnly.remove(); me.oForm.submit();}
								else me.oErrPassword.html('Ошибка авторизации').show();
						},
						function(js,aj){
							if (typeof js == 'string') alert('Ошибка');
								else
									if (typeof js == 'object') {
										me.oLogin.focus();	
										me.oErrPassword.html(js.errmsg).show();
									}
						})
				}				
				return true;
			}						
			
			
			_lw.superclass.constructor.call(this,{
												isclose:true,
												pc:'winpopup_layer pad15',
												pfc:'winpopup-form',
												pfh:'login-header',
												pfb:'login-body',
												pff:''
											});
			
			this.oSignin.click(this.click);
			
			this.oPopUpHeader.append($e('<h2>').html('Добро пожаловать в МедЭкспертизу!')); 
			
			this.oPopUpBody.append(this.oForm);
			this.oForm.append($e('<DIV>').Class('login-prompt').html('Логин:'));
			this.oForm.append(this.oLogin);
			this.oForm.append(this.oErrLogin);
			this.oForm.append($e('<DIV>').Class('login-prompt').html('Пароль:'));
			this.oForm.append(this.oPassword);
			this.oForm.append(this.oErrPassword);
			this.oForm.append(this.oSignin);
			
			if (typeof isattachtobg != 'boolean') isattachtobg = true;
			if (isattachtobg) this.attachFormToBG();
	}

	$u.inherit(_lw, e.ui.abspopupWin)			
	
	e.ui.LoginWin = function(isattachtobg){
			return new _lw(isattachtobg);
	}
	
	
})(window.$e,window);


