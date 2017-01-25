var app = angular.module('app', ['ionic']);
var $this = null;
var _Error = 0;

app.factory('commonService', function($timeout, $ionicLoading, $ionicPopup, $ionicModal, $ionicBackdrop, $http) {
	return {
		postData: function(ci_options) {
			$this = this;
			if(ci_options != undefined && ci_options.url != undefined) {
				var m_bShowMask = true;
				if(ci_options.showMask != undefined) {
					m_bShowMask = ci_options.showMask;
				}
				if(m_bShowMask) {
					$this.showMask();
				}
				var m_bIsSys = false;
				try {
					m_bIsSys = ci_options.isSys;
				} catch(ex) {}
				var m_params = {};
				try {
					m_params = ci_options.params;
				} catch(ex) {}
				if(ci_options.form != undefined) {
					var m_objForm = angular.element('#' + ci_options.form);
					if(m_objForm.length > 0) {
						m_objForm.find('[name]').each(function() {
							var m_obj = angular.element(this);
							if(m_obj[0].type == 'checkbox') {
								m_params[m_obj.attr('name')] = (m_obj.attr('checked') == 'checked' ? true : false)
							} else {
								m_params[m_obj.attr('name')] = m_obj.val();
							}
						});
						m_objForm.find('.listbox').each(function() {
							var m_obj = angular.element(this);
							m_params[m_obj.attr('name')] = m_obj.listbox('getValues');
						});
					}
				}
				if(ci_options != undefined && ci_options.onPost != undefined) {
					if(!ci_options.onPost()) {
						$this.hideMask();
						return;
					}
				}
				$http({
					method: 'post',
					url: getInterfaceName(ci_options.url, m_bIsSys),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					transformRequest: function(obj) {
						var str = [];
						for(var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
					data: m_params
				}).success(function(ci_result) {
					$this.hideMask();
					ci_result = convertToJson(ci_result);
					if(checkReturnJson(ci_result)) {
						if(ci_options.success != undefined) {
							ci_options.success(ci_result);
						}
					} else {
						if(ci_options != undefined && ci_options.failure != undefined) {
							ci_options.failure(ci_result);
						} else {
							if(!top._bShowError) {
								$this.showAlert('操作失败', ci_result.DcMessage);
							}
						}
					}
				}).error(function(err) {
					$this.hideMask();
					$this.showAlert('提示', '操作失败，请重试或通知管理员');
				});

				function closeInnerMask() {
					if(m_bShowMask) {
						hiddMask();
					}
				}
			}
		},
		checkPagePower: function(ci_options) {
			$this = this;
			var m_bShowMask = true;
			if(ci_options != undefined && ci_options.showMask != undefined) {
				m_bShowMask = ci_options.showMask;
			}
			if(m_bShowMask) {
				$this.showMask();
			}
			var m_bIsCheck = true;
			if(ci_options != undefined && ci_options.check != undefined) {
				m_bIsCheck = ci_options.check;
			}

			if(m_bIsCheck) {
				$http({
					method: 'post',
					url: getInterfaceName('DcCdGetUserPageFunPower', true),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					transformRequest: function(obj) {
						var str = [];
						for(var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					},
					data: {
						dcmenuid: this.menuID
					}
				}).success(function(ci_result) {
					ci_result = convertToJson(ci_result);
					if(checkReturnJson(ci_result)) {
						if(ci_options != undefined && ci_options.onload != undefined) {
							ci_options.onload();
						}
					} else {
						if(ci_options != undefined && ci_options.failure != undefined) {
							ci_options.failure(ci_result);
						}
					}
					$this.hideMask();
				}).error(function(err) {
					$this.showAlert('提示', '初始化页面失败，请重试或通知管理员');
				});
			} else {
				$this.hideMask();
				if(ci_options.onload != undefined) {
					ci_options.onload();
				}
			}
		},
		showMask: function() {
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
		},
		hideMask: function() {
			$timeout(function() {
				$ionicLoading.hide();
			}, 500);
		},

		showPopup: function(params) {
			var customPopup = $ionicPopup.show({
				template: params.template,
				title: params.title,
				subTitle: params.subTitle,
				scope: params.scope,
				buttons: params.buttons
			});
		},

		showAlert: function(title, message) {
			if(message == undefined) {
				message = title;
				title = '提示';
			}
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: message,
				okType: 'button-brown'
			});
		},

		showConfirm: function(title, message, successCallBack, errorCallBack) {
			var confirmPopup = $ionicPopup.confirm({
				title: title,
				template: message
			});
			confirmPopup.then(function(res) {
				if(res) {
					successCallBack();
				} else {
					errorCallBack();
				}
			});
		},

		fromTemplateUrl: function(url, $scope, animation,backup,params) {
			animation = animation || 'slide-in-up';
			$ionicModal.fromTemplateUrl(url, {
				scope: $scope,
				animation: animation
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
				if(backup!=undefined){
					backup(params);
				}
				$scope.$on('$destroy', function() {
					$scope.modal.remove();
				});
			});
		},

		fromTemplateUrl2: function(url, $scope, animation) {
			animation = animation || 'slide-in-up';
			$ionicModal.fromTemplateUrl(url, {
				scope: $scope,
				animation: animation
			}).then(function(modal) {
				$scope.modal2 = modal;
				$scope.modal2.show();
				$scope.$on('$destroy', function() {
					$scope.modal2.remove();
				})
			});
		},

		fromTemplateUrl3: function(url, $scope, animation) {
			animation = animation || 'slide-in-up';
			$ionicModal.fromTemplateUrl(url, {
				scope: $scope,
				animation: animation
			}).then(function(modal) {
				$scope.modal3 = modal;
				$scope.modal3.show();
				$scope.$on('$destroy', function() {
					$scope.modal3.remove();
				});
			});
		},

		openModal: function($scope) {
			$scope.modal.show();
		},

		closeModal: function($scope) {
			$scope.modal.hide();
			$timeout(function() {
				$scope.modal.remove();
			}, 500);
		},

		openModal2: function($scope) {
			$scope.modal2.show();
		},

		closeModal2: function($scope) {
			$scope.modal2.hide();
			$timeout(function() {
				$scope.modal2.remove();
			}, 500);
		},

		openModal3: function($scope) {
			$scope.modal3.show();
		},

		closeModal3: function($scope) {
			$scope.modal3.hide();
			$timeout(function() {
				$scope.modal3.remove();
			}, 500);
		},

		retainBackdrop: function() {
			$ionicBackdrop.retain();
		},

		releaseBackdrop: function() {
			$ionicBackdrop.release();
		}
	}
});

function getInterfaceName(ci_Name, ci_bIsSys) {
	var m_strUrl = _strLocalUrl;
	if(ci_bIsSys != undefined && ci_bIsSys) {
		m_strUrl = _strSysUrl;
	} else {
		var m_strName = ci_Name.split(",");
		if(m_strName.length > 1) {
			m_strUrl = m_strName[0];
			ci_Name = m_strName[1];
		}
	}
	return m_strUrl + "Ajax/" + ci_Name + ".ashx";
}

function convertToJson(ci_String) {
	if(typeof ci_String == "string") {
		try {
			return eval("(" + ci_String + ")");
		} catch(ex) {
			return "";
		}
	}
	return ci_String;
}

function checkReturnJson(ci_Json) {
	if(ci_Json != "") {
		if(ci_Json.DcCode >= 0) {
			return true;
		} else {
			switch(ci_Json.DcCode) {
				case -1:
					if(_Error == 0) {
						_Error = -1;
						if(getQueryStringValue("app") == 1) {
							window.android.clnLoginOver();
						} else {
							$this.showAlert(ci_Json.DcMessage);
						}
					}
					break;

				case -2:
					if(_Error == 0) {
						_Error = -2;
						$this.showAlert(ci_Json.DcMessage);
						document.body.innerHTML = '';
					}
					break;
			}
		}
	}
	return false;
}

function getParameter(ci_strSource, ci_strKey) {
	var m_strResult = ci_strSource.match(new RegExp("[\?\&\#]" + ci_strKey + "=([^\&]+)", "i"));
	if(m_strResult == null || m_strResult.length < 1) {
		return "";
	}
	return m_strResult[1];
}

function getQueryStringValue(ci_strKey) {
	return getParameter(location.search, ci_strKey);
}

function existData(ci_objData) {
	return(ci_objData.rows != undefined && ci_objData.rows.length > 0);
}

function getHashValue(ci_strKey) {
	return getParameter(location.hash, ci_strKey);
}

function clnGoBack() {
	try {
		if(back && typeof(back) == 'function') {
			back();
		} else {
			gotoApp();
		}
	} catch(e) {
		gotoApp();
	}
}

function gotoApp() {
	if(getQueryStringValue("app") == "2") {
		document.location = "objc:clnGoClient;refresh:" + _AppRefresh + ";desc:Marketing";
	} else {
		window.android.clnGoClient(_AppRefresh, "Marketing");
	}
}

function html_encode(str) {
	var s = "";
	if(str.length == 0) return "";
	s = str.replace(/&/g, "&gt;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/\'/g, "&#39;");
	s = s.replace(/\"/g, "&quot;");
	s = s.replace(/\n/g, "<br>");
	return s;
}

function html_decode(str) {
	var s = "";
	if(str.length == 0) return "";
	s = str.replace(/&gt;/g, "&");
	s = s.replace(/&lt;/g, "<");
	s = s.replace(/&gt;/g, ">");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/&#39;/g, "\'");
	s = s.replace(/&quot;/g, "\"");
	s = s.replace(/<br>/g, "\n");
	return s;
}

function clone(obj) {
	var o;
	if(typeof obj == "object") {
		if(obj === null) {
			o = null;
		} else {
			if(obj instanceof Array) {
				o = [];
				for(var i = 0, len = obj.length; i < len; i++) {
					o.push(clone(obj[i]));
				}
			} else {
				o = {};
				for(var j in obj) {
					o[j] = clone(obj[j]);
				}
			}
		}
	} else {
		o = obj;
	}
	return o;
}

function setCookie(c_name, value, expiredays) {
	var exdate = new Date()
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = c_name + "=" + escape(value) +
		((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function getCookie(c_name) {
	if(document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if(c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if(c_end == -1) c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return ""
}