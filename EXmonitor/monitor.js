/* 
    通过匿名自执行函数进行封装防止全局变量污染
*/
(function(window){
    if(!localStorage) {
        window.localStorage = new Object();
    }
    var fetchHttpUrl = null,        // 用fetch方式请求接口时，暂存接口url
        monitorUploadTimer = null,  // 自动上传日志记录的定时器
        uploadMessageArray = null,  // 暂存本地用于保存日志信息的数组
        jsMonitorStarted = false,     // onerror错误监控启动状态
        uploadRemoteServer = true;  // 上传日志的开关，如果为false，则不再上传
    
    var MONITOR_ID = 'exmonitor',   // 所属项目ID，用于替换相应项目的UUID，生成监控代码的时候搜索替换
        HTTP_TYPE = window.location.href.indexOf('https') === -1 ? 'http://' : 'https://',  // 判断是http还是https
        LOCACTION = window.location.href,
        LOCAL_IP = 'localhost',
        MONITOR_IP = 'lijiawei.com.cn', // 监控平台地址
        UPLOAD_URI = LOCACTION.indexOf(LOCAL_IP) === -1 ? HTTP_TYPE + MONITOR_IP : HTTP_TYPE + LOCAL_IP + ':8010',
        UPLOAD_LOG_URL = UPLOAD_URI + '/api/uploadLog', // 上传数据的接口
        PROJECT_INFO_URL = UPLOAD_URI + '/project/getProject',  // 获取当前项目的参数信息的接口
        UPLOAD_RECORD_URL = UPLOAD_URI + '',    // 上传埋点数据接口
        CUSTOMER_PV = 'CUSTOMER_PV',    //用户访问日志类型
        HTTP_LOG = 'HTTP_LOG',  // 接口日志类型
        HTTP_ERROR = 'HTTP_ERROR',   // 接口错误日志类型
        JS_ERROR = "JS_ERROR",  // JS报错日志类型
        BEHAVIOR_INFO = 'BEHAVIOR_INFO', // 用户行为类型
        BROWSER_INFO = window.navigator.userAgent,  // 浏览器信息
        utils = new MonitorUtils(), // 工具类实例化
        DEVICE_INFO = utils.getDevice(),    // 设备信息
        USER_INFO = localStorage.userDefineInfo ? JSON.parse(localStorage.userDefineInfo) : {}; //获取用户自定义信息

    // 日志基类，用于其他日志的继承
    function MonitorBaseInfo() {
        this.handleLogInfo = function(type, logInfo){
            var tempString = localStorage[type] ? localStorage[type] : '';
            switch(type){
                case BEHAVIOR_INFO:
                    localStorage[BEHAVIOR_INFO] = tempString + JSON.stringify(logInfo) + '$$$';
                    break;
                case JS_ERROR:
                    localStorage[JS_ERROR] = tempString + JSON.parse(logInfo) + '$$$';
                    break;
                case CUSTOMER_PV:
                    localStorage[CUSTOMER_PV] = tempString + JSON.parse(logInfo) + '$$$';
                    break;
                default:
                    break;
            }
        };
    }

    // 设置日志对象类的通用属性
    function setCommonProperty(){
        this.happenTime = new Date().getTime(); // 日志发生时间
        this.monitorId = MONITOR_ID;    //用于区分应用的唯一标识（一个项目对应一个）
        this.simpleUrl = window.location.href.split('?')[0].replace('#', '');   // 页面URL
        this.customerKey = utils.getCustomerKey();  // 用于区分用户，所对应唯一的标识，清理本地数据就失效
        this.pageKey = utils.getPageKey();  // 用户区分页面，所对应的唯一标识，每个新页面对应一个值
        this.deviceName = DEVICE_INFO.deviceName;
        this.os = DEVICE_INFO.os + (DEVICE_INFO.osVersion ? '' + DEVICE_INFO.osVersion : '');
        this.browserName = DEVICE_INFO.browserName;
        this.browserVersion = DEVICE_INFO.browserVersion;
        // 用户自定义信息，由开发者主动传入，便于对线上进行准确定位
        this.userId = USER_INFO.userId;
        this.firstUserParam = USER_INFO.firstUserParam;
        this.secondUserParam = USER_INFO.secondUserParam;   
    }

    // 用户PV访问行为日志
    function CustomerPV(uploadType, loadType, loadTime){
        setCommonProperty.apply(this);
        this.uploadType = uploadType;
        this.loadType = loadType;   // 用于区分首次加载
        this.loadTime = loadTime;   // 加载时间
    }
    // 原型链继承
    CustomerPV.prototype = new MonitorBaseInfo();
    
    // 用户行为日志，继承于日志基类MonitorBaseInfo
    function BehaviorInfo(uploadType, behaviorType, className, placeholder, inputValue, tagName, innerText){
        setCommonProperty.apply(this);
        this.uploadType = uploadType;
        this.behaviorType = behaviorType;
        this.className = className;
        this.placeholder = placeholder;
        this.inputValue = inputValue;
        this.tagName = tagName;
        this.innerText = innerText;
    }
    BehaviorInfo.prototype = new MonitorBaseInfo();

    // JS错误日志，继承于日志基类MonitorBaseInfo
    function JSErrorInfo(uploadType, errorMsg, errorStack){
        setCommonProperty.apply(this);
        this.uploadType = uploadType;
        this.errorMsg = encodeURIComponent(errorMsg);
        this.errorStack = errorStack;
        this.browserInfo = BROWSER_INFO;
    }
    JSErrorInfo.prototype = new MonitorBaseInfo();

    /*
        监控初始化配置，以及启动的方法
    */
    function init(){
        recordPV();
        recordJSError();

        /**
         * 添加一个定时器进行数据的上传
         * 2s进行一次URL是否变化的检测
         * 10s进行一次数据的检查并上传
         */
        var defaultLocation = window.location.href.split('?')[0].replace('#','');
        var timeCount = 0;
        setInterval(function(){
            var nowLocation = window.location.href.split('?')[0].replace('#', '');
            // 如果url变化，就更新default，重新设置pageKey
            if(defaultLocation != nowLocation){
                recordPV();
                defaultLocation = nowLocation;
            }
            if(timeCount >= 5){
                var logInfo = (localStorage[BEHAVIOR_INFO] || '') +
                 (localStorage[JS_ERROR] || '') + 
                 (localStorage[CUSTOMER_PV] || '');
                if(logInfo){
                    utils.ajax("POST", UPLOAD_LOG_URL, {logInfo: logInfo}, function(res){
                        // 上传完成后，清空本地记录
                        if(res.code === 200){
                            localStorage[BEHAVIOR_INFO] = '';
                            localStorage[JS_ERROR] = '';
                            localStorage[CUSTOMER_PV] = '';
                        }
                    }, function(){
                        localStorage[BEHAVIOR_INFO] = '';
                        localStorage[JS_ERROR] = '';
                        localStorage[CUSTOMER_PV] = '';
                    })
                }
                timeCount = 0;
            }
            timeCount ++;
        }, 2000);
    }

    /**
     * 用户PV访问记录监控
     */
    function recordPV(){
        utils.setPageKey();
        var customerPV = new CustomerPV(CUSTOMER_PV, "none", 0);
        customerPV.handleLogInfo(CUSTOMER_PV, customerPV);
    }
    /**
     * JS错误监控
     */
    function recordJSError(){
        // 重写console.error,用于捕获全面的报错信息
        var oldError = console.error;
        console.error = function(){
            var errorMsg = arguments[0] && arguments[0].message;
            var url = LOCACTION;
            var lineNumber = 0;
            var columnNumber = 0;
            var errorObj = arguments[0] && arguments[0].stack;
            if(!errorObj)
                errorObj = arguments[0];
            // 如果在onerror处捕获了，则无须在此处上报了
            !jsMonitorStarted && siftAndMakeUpMsg(errorMsg, url, lineNumber, columnNumber, errorObj);
            return oldError.apply(console, arguments);
        };
        // 重写onerror进行jsError的监听
        window.onerror = function(errorMsg, url, lineNumber, columnNumber, errObj){
            jsMonitorStarted = true;
            var errStack = errObj ? errObj.stack : null;
            siftAndMakeUpMsg(errorMsg, url, lineNumber, columnNumber, errStack);
        };

        function siftAndMakeUpMsg(origin_errorMsg, origin_url, origin_lineNumber, origin_columnNumber, origin_errorObj){
            var errorMsg = origin_errorMsg ? origin_errorMsg : '';
            var errorObj = origin_errorObj ? origin_errorObj : '';
            var errorType = "";
            if (errorMsg) {
                var errorStackStr = JSON.stringify(errorObj);
                errorType = errorStackStr.split(": ")[0].replace('"',"");
            }
            var jsErrorInfo = new JSErrorInfo(JS_ERROR, errorType + ": " + errorMsg, errorObj);
            jsErrorInfo.handleLogInfo(JS_ERROR, jsErrorInfo);
        };
    };

    /**
     * 用户行为记录监控
     * @param project 项目详情
     */
    function recordBehavior(project){
        if(project && project.record && project.record == 1){
            // 记录用户的点击行为
            document.onclick = function(e){
                var tagName = e.target.tagName;
                var className = e.target.className ? e.target.className.replace(/\s/g, '') : "";
                var placeholder = encodeURIComponent(e.target.placeholder);
                var inputValue = encodeURIComponent(e.target.value || '');
                var innerText = encodeURIComponent(e.target.innerText.replace(/\s*/g, ''));
                // 若点击的元素内容过长，则进行截取
                if(innerText.length > 200){
                    innerText = innerText.substring(0,100) + "... ..." + innerText.substring(innerText.length - 99, innerText.length - 1);
                }
                var behaviorInfo = new BehaviorInfo(BEHAVIOR_INFO, "click", className, placeholder, inputValue, tagName, innerText);
                behaviorInfo.handleLogInfo(BEHAVIOR_INFO, BehaviorInfo);
            };
        }
    }

    /**
     * 工具类构造函数
     */
    function MonitorUtils(){
        this.getUuid = function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        /**
         * 根据uuid获取用户的唯一标识
         */
        this.getCustomerKey = function(){
            var customerKey = this.getUuid();
            if(!localStorage.monitorCustomerKey){
                localStorage.monitorCustomerKey = customerKey;
            }
            return localStorage.monitorCustomerKey;
        }

        /**
         * 获取页面的唯一标识
         */
        this.getPageKey = function(){
            var pageKey = this.getUuid();
            if(!localStorage.monitorPageKey){
                localStorage.monitorPageKey = pageKey;
            }
            return localStorage.monitorPageKey;
        }

        /**
         * 设置页面的唯一标识
         */
        this.setPageKey = function(){
            localStorage.monitorPageKey = this.getPageKey();
        }

        /**
         * @param method 请求方法（大写）GET/POST
         * @param url 请求URL
         * @param param 请求参数
         * @param successCallback 成功回调函数
         * @param failCallback 失败回调函数
         */
        this.ajax = function(method, url, param, successCallback, failCallback){
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    var res = JSON.parse(xhr.responseText);
                    typeof successCallback == 'function' && successCallback(res);
                }else{
                    typeof failCallback == 'function' && failCallback();
                }
            }
            xhr.send("data=" + JSON.stringify(param));
        }

        /**
         * 获取设备信息
         */
        this.getDevice = function(){
            var device = {};
            var ua = navigator.userAgent;
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            var mobileInfo = ua.match(/Android\s[\S\s]+Build\//);
            // 默认初始值
            device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
            device.isWeixin = /MicroMessenger/i.test(ua);
            device.os = "web";
            device.deviceName = "PC";
            // Android
            if(android){
                device.os = 'android';
                device.osVersion = android[2];
                device.android = true;
                device.androidChrome = ua.toLowerCase().indexOf("chrome") >= 0;
            }
            if(ipad || iphone || ipod){
                device.os = 'ios';
                device.ios = true;
            }
            // ipad
            if(iphone && !ipod){
                decive.osVersion = iphone[2].replace(/_/g, '.');
                device.ipad = true;
            }
            if(ipod){
                device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
                device.iphone = true;
            }
            // iOS 8+ changed UA
            if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
                if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
                }
            }

            if(device.iphone){
                device.deviceName = "iphone";
                var screenWidth = window.screen.width;
                var screenHeight = window.screen.height;
                if(screenWidth === 320 && screenHeight === 480){
                    device.deviceName = "iphone 4";
                }else if(screenWidth === 320 && screenHeight === 568){
                    device.deviceName = "iphone 5/SE";
                }else if(screenWidth === 375 && screenHeight === 667){
                    device.deviceName = "iphone 6/7/8";
                }else if(screenWidth === 414 && screenHeight === 736){
                    device.deviceName = "iphone 6/7/8 Plus";
                }else if(screenWidth === 375 && screenHeight === 812){
                    device.deviceName = "iphone X";
                }
            }else if(device.ipad){
                device.deviceName = "ipad";
            }else if(mobileInfo){
                var info = mobileInfo[0];
                var deviceName = info.split(';')[1].replace(/Build\//g, "");
                device.deviceName = deviceName.replace(/(^\s*)|(\s*$)/g, "");
            }
            // PC端浏览器模式，获取更多浏览器信息
            if(ua.indexOf("Mobile") == -1){
                device.deviceName = "未知";
                var agent = navigator.userAgent.toLowerCase();
                var regStr_ie = /msie[\d.]+/gi;
                var regStr_ff = /firefox\/[\d.]+/gi;
                var regStr_chrome = /chrome\/[\d.]+/gi;
                var refStr_safari = /safari\/[\d.]+/gi;

                // IE
                if(agent.indexOf("msie") > 0){
                    var browserInfo = agent.match(regStr_ie)[0];
                    device.browserName = browserInfo.split('/')[0];
                    device.browserVersion = browserInfo.split('/')[1];
                }
                //firefox
                if(agent.indexOf("firefox") > 0) {
                    var browserInfo = agent.match(regStr_ff)[0];
                    device.browserName = browserInfo.split('/')[0];
                    device.browserVersion = browserInfo.split('/')[1];
                }
                //Safari
                if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
                    var browserInfo = agent.match(regStr_saf)[0];
                    device.browserName = browserInfo.split('/')[0];
                    device.browserVersion = browserInfo.split('/')[1];
                }
                //Chrome
                if(agent.indexOf("chrome") > 0) {
                    var browserInfo = agent.match(regStr_chrome)[0];
                    device.browserName = browserInfo.split('/')[0];
                    device.browserVersion = browserInfo.split('/')[1];
                }
            }

            // Webview
            device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
            
            return device;
        }

        this.loadJs = function(src, callback){
            var script = documnt.createElement("script");
            script.async = 1;
            script.src = src;
            script.onload = callback;
            var node = document.getElementsByTagName("script")[0];
            node.parentNode.insertBefore(script, node);
            return node;
        }
    }
    /**
     * 执行初始化函数
     */
    init();

    window.webMonitor = {
        /**
         * 埋点上传数据
         * @param url 当前页面的URL
         * @param type 埋点类型
         * @param index 埋点顺序
         * @param description 相关信息描述
         */
        wm_upload: function(url, type, index, description){
            var createTime = new Date().toString();
            var logParams = {
                createTime: encodeURIComponent(createTime),
                happenTime: new Date().getTime(),
                uploadType: "WM_UPLOAD",
                simpleUrl: encodeURIComponent(url),
                webMonitorId: MONITOR_ID,
                recordType: type,
                recordIndex: index,
                description: description
            };
            var http_api = UPLOAD_RECORD_URL;
            var recordDataXhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            recordDataXhr.open("POST", url, true);
            recordDataXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            recordDataXhr.send("data=" + JSON.stringify(logParams));
        },
        /**
         * 使用者传入的自定义信息
         * @param userId
         * @param userName
         * @param userType
         */
        wm_initUser: function(userId, firstUserParam, secondUserParam){
            if(!userId)
                console.warn("userId 初始值为0 或 未初始化");
            if(!firstUserParam){
                console.warn("firstUserParam 初始值为0 或 未初始化");
            }
            if(!secondUserParam)
                console.warn("secondUserParam 初始值为0 或 未初始化");
            localStorage.wmUserInfo = JSON.stringify({
                userId: userId,
                firstUserParam: firstUserParam,
                secondUserParam: secondUserParam
            });
        }
    }
})(window)