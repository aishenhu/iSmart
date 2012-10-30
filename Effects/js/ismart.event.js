/**
 *
 * Thanks JX
 */
;
(function(){
	iSmart().$package('ismart.event', function(IS){
		IS.event = this;
		/**
	     * 
	     * 为自定义Model添加事件监听器
	     * 
	     * @method addObserver
	     * @memberOf event
	     * 
	     * @param targetModel 目标 model，即被观察的目标
	     * @param eventType 事件类型，不含on
	     * @param handler 观察者要注册的事件处理器
	     */
	    addObserver = function(targetModel, eventType, handler){
	        var handlers,
	            length,
	            index,
	            i;
	        if(handler){
	            
	        
	            // 转换成完整的事件描述字符串
	            eventType = "on" + eventType;
	            
	            // 判断对象是否含有$events对象
	            if(!targetModel._$events){
	                targetModel._$events={};
	            }
	            
	            // 判断对象的$events对象是否含有eventType描述的事件类型
	            if(!targetModel._$events[eventType]){
	                //若没有则新建
	                targetModel._$events[eventType] = [];
	            }else if(targetModel._$events[eventType].length == 0){
	                //bug: ie会有引用泄漏的问题, 如果数组为空, 则重新创建一个
	                targetModel._$events[eventType] = [];
	            }
	        
	            handlers = targetModel._$events[eventType];
	            length = handlers.length;
	            index = -1;
	        
	            // 通过循环，判断对象的handlers数组是否已经含有要添加的handler
	            for(i=0; i<length; i++){
	                
	                var tempHandler = handlers[i];

	                if(tempHandler == handler){
	                    index = i;
	                    break;
	                }        
	            }
	            // 如果没有找到，则加入此handler
	            if(index === -1){
	                handlers.push(handler);
	                //alert(handlers[handlers.length-1])
	            }
	        }else{
	            console.log(">>> 添加的观察者方法不存在："+targetModel+eventType+handler);
	        }
	    };
	    /**
	     * 
	     * 批量为自定义Model添加事件监听器
	     * 
	     * @method addObservers
	     * @memberOf event
	     * 
	     * @param obj 目标 model，即被观察的目标
	     *     obj = { targetModel : {eventType:handler,eventType2:handler2...} , targetModel2: {eventType:handler,eventType2:handler2...}  }
	     */
	    addObservers = function(obj){
	        //TODO 这里的代码是直接复制addObserver的（为避免太多函数调用耗费栈）
	        var t=obj['targetModel'];
	        var m=obj['eventMapping'];
	        for(var i in m){
	            addObserver(t,i,m[i]);
	        }
	    
	    };
	    /**
	     * 
	     * 触发自定义Model事件的监听器
	     * 
	     * @method notifyObservers
	     * @memberOf event
	     * 
	     * @param targetModel 目标 model，即被观察目标
	     * @param eventType 事件类型，不含on
	     * @param options 触发的参数对象
	     * @return {Boolean} 
	     */
	    notifyObservers = function(targetModel, eventType, argument){/*addInvokeTime(eventType);*/
	        var handlers,
	            i;
	            
	        eventType = "on" + eventType;
	        var flag = true;
	        if(targetModel._$events && targetModel._$events[eventType]){
	            handlers = targetModel._$events[eventType];
	            if(handlers.length > 0){
	                // 通过循环，执行handlers数组所包含的所有函数function
	                for(i=0; i<handlers.length; i++){
	                    if(handlers[i].apply(targetModel, [argument]) === false){
	                        flag = false;
	                    }
	                }
	                //return flag;
	            }
	        }else{
	            // throw new Error("还没有定义 [" + targetModel + "] 对象的: " + eventType + " 事件！");
	            //return false;
	        }
	        return flag;
	    };
	    
	    
	    /**
	     * 
	     * 为自定义 Model 移除事件监听器
	     * 
	     * @method removeObserver
	     * @memberOf event
	     * 
	     * @param targetModel 目标 model，即被观察的目标
	     * @param eventType 事件类型，不含on
	     * @param handler 观察者要取消注册的事件处理器
	     */
	    // 按照对象和事件处理函数来移除事件处理函数
	    removeObserver = function(targetModel, eventType, handler){
	        var i,
	            j,
	            flag = false,
	            handlers,
	            length,
	            events = targetModel._$events;
	        if(handler){
	            
	            if(events){
	                eventType = "on" + eventType;
	                handlers = events[eventType];
	                
	                if(handlers){
	                    length = handlers.length;
	                    for(i=0; i<length; i++){
	                        //由==修改为===
	                        if(handlers[i] == handler){
	                            handlers[i] = null;
	                            handlers.splice(i, 1);
	                            flag = true;
	                            break;
	                        }    
	                    }
	                }
	                
	                
	            }
	        }else if(eventType){
	            if(events){
	                eventType = "on" + eventType;
	                handlers = events[eventType];
	                if(handlers){
	                    length = handlers.length;
	                    for(i=0; i<length; i++){
	                        handlers[i] = null;
	                    }
	                    delete events[eventType];
	                    flag = true;
	                }
	                
	            }
	            
	        }else if(targetModel){
	            if(events){
	                for(i in events){
	                    delete events[i];
	                }
	                delete targetModel._$events;
	                flag = true;
	            }
	        }
	        return flag;
	    };

	    this.addObserver = addObserver;
	    this.addObservers = addObservers;
	    this.notifyObservers = notifyObservers;
	    this.removeObserver = removeObserver;
	});
})()