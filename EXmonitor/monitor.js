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
        uploadRemoteServer = true,  // 上传日志的开关，如果为false，则不再上传
        screenShotDescriptions = [],    // 保存图片对应的描述，同一个描述只保存一次
        tempScreenShot = "",        // 屏幕截图字符串
        defaultLocation = window.location.href.split('?')[0].replace('#', ''),  //获取当前url
        timingObj = performance && performance.timing,  // 页面加载相关属性
        resourcesObj = (function() {          // 页面加载具体属性
            if(performance && typeof performance.getEntries === 'function') {
                return performance.getEntries();
            }
            return null;
        })();

    
    var MONITOR_ID = '',   // 所属项目ID，用于替换相应项目的UUID，引入监控代码时初始化initMonitor配置
        projectName = '',
        HTTP_TYPE = window.location.href.indexOf('https') === -1 ? 'http://' : 'https://',  // 判断是http还是https
        LOCACTION = window.location.href,
        LOCAL_IP = 'localhost',
        MONITOR_IP = 'lijiawei.com.cn', // 监控平台地址
        UPLOAD_URI = (LOCACTION.indexOf(LOCAL_IP) === -1 ? HTTP_TYPE + MONITOR_IP : HTTP_TYPE + LOCAL_IP) + ':8086',
        UPLOAD_LOG_API = '/api/uploadLog',  //上传数据的接口API
        UPLOAD_LOG_URL = UPLOAD_URI + '/api/uploadLog', // 上传数据的接口
        PROJECT_INFO_URL = UPLOAD_URI + '/project/getProject',  // 获取当前项目的参数信息的接口
        UPLOAD_RECORD_URL = UPLOAD_URI + '/api/',    // 上传埋点数据接口,后端暂未支持埋点功能
        CUSTOMER_PV = 'CUSTOMER_PV',    //用户访问日志类型
        LOAD_PAGE = 'LOAD_PAGE',    // 用户加载页面信息类型
        HTTP_LOG = 'HTTP_LOG',  // 接口日志类型
        HTTP_ERROR = 'HTTP_ERROR',   // 接口错误日志类型
        JS_ERROR = "JS_ERROR",  // JS报错日志类型
        SCREEN_SHOT = 'SCREEN_SHOT', // 截屏类型
        BEHAVIOR_INFO = 'BEHAVIOR_INFO', // 用户行为类型
        BROWSER_INFO = window.navigator.userAgent,  // 浏览器信息
        utils = new MonitorUtils(), // 工具类实例化
        DEVICE_INFO = utils.getDevice(),    // 设备信息
        USER_INFO = localStorage.wmUserInfo ? JSON.parse(localStorage.wmUserInfo) : {}; //获取用户自定义信息

    // 日志基类，用于其他日志的继承
    function MonitorBaseInfo() {
        this.handleLogInfo = function(type, logInfo){
            var tempString = localStorage[type] ? localStorage[type] : '';
            switch(type){
                case BEHAVIOR_INFO:
                    localStorage[BEHAVIOR_INFO] = tempString + JSON.stringify(logInfo) + '$$$';
                    break;
                case JS_ERROR:
                    localStorage[JS_ERROR] = tempString + JSON.stringify(logInfo) + '$$$';
                    break;
                case HTTP_LOG:
                    localStorage[HTTP_LOG] = tempString + JSON.stringify(logInfo) + '$$$';
                    break;
                case SCREEN_SHOT:
                    localStorage[SCREEN_SHOT] = tempString + JSON.stringify(logInfo) + '$$$';
                    break;
                case CUSTOMER_PV:
                    localStorage[CUSTOMER_PV] = tempString + JSON.stringify(logInfo) + '$$$';
                    break;
                case LOAD_PAGE:
                    localStorage[LOAD_PAGE] = tempString + JSON.stringify(logInfo) + '$$$';
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
        this.completeUrl = encodeURIComponent(window.location.href),
        this.customerKey = utils.getCustomerKey();  // 用于区分用户，所对应唯一的标识，清理本地数据就失效
        this.pageKey = utils.getPageKey();  // 用户区分页面，所对应的唯一标识，每个新页面对应一个值
        this.deviceName = DEVICE_INFO.deviceName;
        this.os = DEVICE_INFO.os + (DEVICE_INFO.osVersion ? ' ' + DEVICE_INFO.osVersion : '');
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
        this.pageKey = utils.getPageKey();  // 用于区分页面，所对应唯一的标识，每个新页面对应一个值
        this.deviceName = DEVICE_INFO.deviceName;
        this.os = DEVICE_INFO.os + (DEVICE_INFO.osVersion ? " " + DEVICE_INFO.osVersion : "");
        this.browserName = DEVICE_INFO.browserName;
        this.browserVersion = DEVICE_INFO.browserVersion;
        // ip对应的信息服务端去处理获取了
        this.monitorIp = "";  // 用户的IP地址
        this.country = "";  // 用户所在国家
        this.province = "";  // 用户所在省份
        this.city = "";  // 用户所在城市
        this.loadType = loadType;   // 用于区分首次加载
        this.loadTime = loadTime;   // 加载时间
    }
    // 原型链继承
    CustomerPV.prototype = new MonitorBaseInfo();
    
    // 用户加载页面的信息日志
    function LoadPageInfo(uploadType, loadType, loadPage, domReady, redirect, lookupDomain, ttfb, request, loadEvent, appcache, unloadEvent, connect) {
        setCommonProperty.apply(this);
        this.uploadType = uploadType;
        this.loadType = loadType;
        this.loadPage = loadPage;
        this.domReady = domReady;
        this.redirect = redirect;
        this.lookupDomain = lookupDomain;
        this.ttfb = ttfb;
        this.request = request;
        this.loadEvent = loadEvent;
        this.appcache = appcache;
        this.unloadEvent = unloadEvent;
        this.connect = connect;
    }
    LoadPageInfo.prototype = new MonitorBaseInfo();
    
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
    function JSErrorInfo(uploadType, errorMsg, errorStack, url, lineNumber, columnNumber){
        setCommonProperty.apply(this);
        this.uploadType = uploadType;
        this.errorMessage = encodeURIComponent(errorMsg).replace(/\'/g, '"');
        this.errorStack = errorStack;
        this.browserInfo = BROWSER_INFO;
        this.url = url;
        this.row = lineNumber;
        this.col = columnNumber;
    }
    JSErrorInfo.prototype = new MonitorBaseInfo();

    // 接口请求日志， 继承于日志基类MonitorBaseInfo()
    function HttpLogInfo(uploadType, url, status, statusText, statusResult, currentTime, loadTime) {
        setCommonProperty.apply(this);
        this.uploadType = uploadType;
        this.httpUrl = encodeURIComponent(url),
        this.status = status;
        this.statusText = statusText;
        this.statusResult = statusResult;
        this.happenTime = currentTime;
        this.loadTime = loadTime;
    }
    HttpLogInfo.prototype = new MonitorBaseInfo();

    // JS错误截图， 继承于日志基类MonitorBaseInfo
    function ScreenShotInfo(uploadType, des, screenInfo){
        setCommonProperty.apply(this);
        this.uploadType = uploadType;
        this.description = encodeURIComponent(des);
        this.screenInfo = screenInfo;
        this.imgType = 'webp';
    }
    ScreenShotInfo.prototype = new MonitorBaseInfo();

    /*
        监控初始化配置，以及启动的方法
    */
    function init(){
        recordPV();
        recordLoadPage();
        recordBehavior({record: 1});
        recordJSError();
        recordHttpLog();

        /**
         * 添加一个定时器进行数据的上传
         * .2s进行一次URL是否变化的检测
         * 5s进行一次数据的检查并上传
         */
        var timeCount = 0;
        setInterval(function(){
            checkUrlChange();
            if(timeCount >= 25){
                var logInfo = (localStorage[BEHAVIOR_INFO] || '') +
                 (localStorage[JS_ERROR] || '') + 
                 (localStorage[HTTP_LOG] || '') +
                 (localStorage[SCREEN_SHOT] || '') +
                 (localStorage[CUSTOMER_PV] || '')+
                 (localStorage[LOAD_PAGE] || '');
                if(logInfo){
                    localStorage[BEHAVIOR_INFO] = '';
                    localStorage[JS_ERROR] = '';
                    localStorage[HTTP_LOG] = '';
                    localStorage[SCREEN_SHOT] = '';
                    localStorage[CUSTOMER_PV] = '';
                    localStorage[LOAD_PAGE] = '';
                    utils.ajax("POST", UPLOAD_LOG_URL, {logInfo: logInfo}, function(res) {}, function() {});
                }
                timeCount = 0;
            }
            timeCount ++;
        }, 200);
    }

    /**
     * 检查url是否变化
     */
    function checkUrlChange() {
        // 如果是单页应用， 只更改url
        var webLocation = window.location.href.split('?')[0].replace('#', '');
        // 如果url变化了， 就把更新的url记录为 defaultLocation, 重新设置pageKey
        if (defaultLocation != webLocation) {
            recordPV();
            defaultLocation = webLocation;
        }
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
     * 用户加载页面信息监控
     * @param project 项目详情
     */
    function recordLoadPage() {
        utils.addLoadEvent(function () {
            setTimeout(function() {
                if(resourcesObj) {
                    var loadType = "load";
                    if(resourcesObj[0] && resourcesObj[0].type === 'navigate') {
                        loadType = "load";
                    } else {
                        loadType = "reload";
                    }
                }
                var t = timingObj;
                var loadPageInfo = new LoadPageInfo(LOAD_PAGE);
                // 页面加载类型，区分第一次load还是reload
                loadPageInfo.loadType = loadType;

                //【重要】页面加载完成的时间
                //【原因】这几乎代表了用户等待页面可用的时间
                loadPageInfo.loadPage = t.loadEventEnd - t.navigationStart;

                //【重要】解析 DOM 树结构的时间
                //【原因】反省下你的 DOM 树嵌套是不是太多了！
                loadPageInfo.domReady = t.domComplete - t.responseEnd;

                //【重要】重定向的时间
                //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
                loadPageInfo.redirect = t.redirectEnd - t.redirectStart;

                //【重要】DNS 查询时间
                //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
                // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
                loadPageInfo.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

                //【重要】读取页面第一个字节的时间
                //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
                // TTFB 即 Time To First Byte 的意思
                // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
                loadPageInfo.ttfb = t.responseStart - t.navigationStart;

                //【重要】内容加载完成的时间
                //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
                loadPageInfo.request = t.responseEnd - t.requestStart;

                //【重要】执行 onload 回调函数的时间
                //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
                loadPageInfo.loadEvent = t.loadEventEnd - t.loadEventStart;

                // DNS 缓存时间
                loadPageInfo.appcache = t.domainLookupStart - t.fetchStart;

                // 卸载页面的时间
                loadPageInfo.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

                // TCP 建立连接完成握手的时间
                loadPageInfo.connect = t.connectEnd - t.connectStart;

                loadPageInfo.handleLogInfo(LOAD_PAGE, loadPageInfo);
            }, 1000);
        })
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
            if (errObj) {
                console.error(errObj.stack || errorMsg);
            }
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
            var jsErrorInfo = new JSErrorInfo(JS_ERROR, errorMsg, errorObj, origin_url, origin_lineNumber, origin_columnNumber);
            jsErrorInfo.handleLogInfo(JS_ERROR, jsErrorInfo);
            setTimeout(function(){
                // 保存该错误相关的截图信息，并存入历史
                if (screenShotDescriptions.indexOf(errorMsg) !== -1)
                    return;
                screenShotDescriptions.push(errorMsg);
                utils.screenShot(document.body, errorMsg);
            }, 500);
        };
    };

    /**
     * 
     * 页面请求接口监控
     */
    function recordHttpLog(){
        function ajaxEventTrigger(event) {
            var ajaxEvent = new CustomEvent(event, {
                detail: this,
            });
            window.dispatchEvent(ajaxEvent);
        }
        var oldXHR = window.XMLHttpRequest;
        function newXHR() {
            var realXHR = new oldXHR();
            realXHR.addEventListener('abort', function() { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
            realXHR.addEventListener('error', function() { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
            realXHR.addEventListener('load', function() { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
            realXHR.addEventListener('loadstart', function() { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
            realXHR.addEventListener('progress', function() { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
            realXHR.addEventListener('timeout', function() { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
            realXHR.addEventListener('loadend', function() { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
            realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
            return realXHR;
        }

        var timeRecordArray = [];
        window.XMLHttpRequest = newXHR;
        window.addEventListener('ajaxLoadStart', function(e) {
            var tempObj = {
                timeStamp: new Date().getTime(),
                event: e,
                flag: false,
            };
            timeRecordArray.push(tempObj);
        });

        window.addEventListener('ajaxLoadEnd', function(e) {
            for(var i = 0; i< timeRecordArray.length; i++) {
                if(!timeRecordArray[i].flag) {
                    var currentTime = new Date().getTime();
                    var url = timeRecordArray[i].event.detail.responseURL;
                    var status = timeRecordArray[i].event.detail.status;
                    var statusText = timeRecordArray[i].event.detail.statusText;
                    var loadTime = currentTime - timeRecordArray[i].timeStamp;
                    if (url && url.indexOf(UPLOAD_LOG_API) === -1) {
                        var httpLogInfoStart = new HttpLogInfo(HTTP_LOG, url, status, statusText, "发起请求", timeRecordArray[i].timeStamp, 0);
                        httpLogInfoStart.handleLogInfo(HTTP_LOG, httpLogInfoStart);
                        var httpLogInfoEnd = new HttpLogInfo(HTTP_LOG, url, status, statusText, "请求返回", currentTime, loadTime);
                        httpLogInfoEnd.handleLogInfo(HTTP_LOG, httpLogInfoEnd);
                    }
                    timeRecordArray[i].flag = true;
                }
            }
        });
    }

    /**
     * 用户行为记录监控
     * @param project 项目详情
     */
    function recordBehavior(project){
        if(project && project.record && project.record == 1){
            // 记录行为前，检查一下url记录是否变化
            checkUrlChange();
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
                behaviorInfo.handleLogInfo(BEHAVIOR_INFO, behaviorInfo);
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
            localStorage.monitorPageKey = this.getUuid();
        }

        /**
         * 重写页面的onload事件
         */
        this.addLoadEvent = function(func){
            var oldonload = window.onload;
            if(typeof window.onload != 'function'){
                window.onload = func;
            } else {
                window.onload = function() {
                    oldonload();
                    func();
                }
            }
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
         * 处理屏幕截图
         */
        this.screenShot = function(ele, description) {
            var shotDom = ele;  // 截图时包裹的DOM对象
            var width = shotDom.offsetWidth;    // 获取dom宽度
            var height = shotDom.offsetHeight;  //获取dom高度
            var canvas = document.createElement('canvas');
            var scale = 1;    // 定义任意放大倍数
            canvas.width = width * scale;
            canvas.height = height * scale;
            var context = canvas.getContext("2d");
            context.scale(scale, scale);

            var opt = {
                scale: scale,
                canvas: canvas,
                logging: false, // 日志开关，便于查看html2canvas的内部执行流程
                width: width * scale,
                height: height * scale,
                useCORS: true,  // 开启跨域配置
            };
            window.html2canvas && window.html2canvas(ele, opt).then(function(canvas) {
                var dataUrl = canvas.toDataURL("image/webp");
                var screenShotInfo = new ScreenShotInfo(SCREEN_SHOT, description, encodeURIComponent(dataUrl));
                screenShotInfo.handleLogInfo(SCREEN_SHOT, screenShotInfo);
            })
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
            device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
            device.isWeixin = /MicroMessenger/i.test(ua);
            device.os = "web";
            device.deviceName = "PC";
            // Android
            if (android) {
                device.os = 'android';
                device.osVersion = android[2];
                device.android = true;
                device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
            }
            if (ipad || iphone || ipod) {
                device.os = 'ios';
                device.ios = true;
            }
            // iOS
            if (iphone && !ipod) {
                device.osVersion = iphone[2].replace(/_/g, '.');
                device.iphone = true;
            }
            if (ipad) {
                device.osVersion = ipad[2].replace(/_/g, '.');
                device.ipad = true;
            }
            if (ipod) {
                device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
                device.iphone = true;
            }
            // iOS 8+ changed UA
            if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
                if (device.osVersion.split('.')[0] === '10') {
                device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
                }
            }

            // 如果是ios, deviceName 就设置为iphone，根据分辨率区别型号
            if (device.iphone) {
                device.deviceName = "iphone";
                var screenWidth = window.screen.width;
                var screenHeight = window.screen.height;
                if (screenWidth === 320 && screenHeight === 480) {
                device.deviceName = "iphone 4";
                } else if (screenWidth === 320 && screenHeight === 568) {
                device.deviceName = "iphone 5/SE";
                } else if (screenWidth === 375 && screenHeight === 667) {
                device.deviceName = "iphone 6/7/8";
                } else if (screenWidth === 414 && screenHeight === 736) {
                device.deviceName = "iphone 6/7/8 Plus";
                } else if (screenWidth === 375 && screenHeight === 812) {
                device.deviceName = "iphone X";
                }
            } else if (device.ipad) {
                device.deviceName = "ipad";
            } else if (mobileInfo) {
                var info = mobileInfo[0];
                var deviceName = info.split(';')[1].replace(/Build\//g, "");
                device.deviceName = deviceName.replace(/(^\s*)|(\s*$)/g, "");
            }
            // 浏览器模式, 获取浏览器信息
            // TODO 需要补充更多的浏览器类型进来
            if (ua.indexOf("Mobile") == -1) {
                var agent = navigator.userAgent.toLowerCase() ;
                var regStr_ie = /msie [\d.]+;/gi ;
                var regStr_ff = /firefox\/[\d.]+/gi
                var regStr_chrome = /chrome\/[\d.]+/gi ;
                var regStr_saf = /safari\/[\d.]+/gi ;

                device.browserName = '未知';
                //IE
                if(agent.indexOf("msie") > 0) {
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

            // Export object
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
         * @param config
         */
        wm_init: function(config){
            var monitorId = config.monitorId;
            var userId = config.userId;
            var secondUserParam = config.secondUserParam;
            
            if(!userId)
                console.warn("userId 初始值为0 或 未初始化");
            if(!secondUserParam)
                console.warn("secondUserParam 初始值为01 或 未初始化");
            localStorage.wmUserInfo = JSON.stringify({
                userId: userId,
                secondUserParam: secondUserParam
            });
            MONITOR_ID = monitorId;
            init();
        },
        /** 使用者使用自定义截屏模式
         * @param description 截屏描述
         */
        wm_screenSHot: function (description) {
            setTimeout(function() {
                utils.screenShot(document.body, description);
            }, 500);
        },
    }
})(window)