function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionEnd',
      'OTransition':'oTransitionEnd',
      'MSTransition':'msTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

window.onload = function(){
	var $adapter = ismart.adapter;
	var hello = document.getElementById('hello');
	var IS = iSmart();
	var $E = IS.event;
	var dom = IS.dom;
	var $C = IS.effects.CSSAnimation;
	var $T = IS.effects.CSSTranstion;
	var $M = IS.module;
	var miss = document.getElementById('miss');
	var transitionEnd = whichTransitionEvent();
	$adapter.transitionEndEvent(miss, function(){
		//console.log('transition end',arguments[0]);
	});
	var stage = dom.$('.ismart-stage')[0];

	// for(var i = 1; i < 20; i ++){
	// 	new $M.Point({
	// 		x: i * 10,
	// 		y: i * i,
	// 		container: stage,
	// 		size: i * 2,
	// 		drag: true
	// 	});	
	// }

	var rect1 = new $M.Rectangle({
		x: 400,
		y: 200,
		width:200,
		height:100,
		container: stage,
		drag:true,
		dom: $('.test')
	});

	var point1 = new $M.Point({
		x: 400,
		y: 100,
		container: stage,
		size: 10,
		drag: true
	});	

	new $M.Rectangle({
		x: 200,
		y: 200,
		width:100,
		height:100,
		container: stage,
		drag:true
	});

	$('#hello, #miss, #text').toggle(function(){
		//$T.zoom.in(stage, this,3);
		$T.rotate.to(this, '180', {
			//transformOrigin: 'left top'
		});
	}, function(){
		//$T.zoom.out(stage, this, 1);
		$T.rotate.back(this);
	});

	$E.addObserver(hello, 'cssAnimationStart', function(){
		console.log('Obserber cssAnimationStart');
	});

	$E.addObserver(hello, 'cssAnimationEnd', function(){
		console.log('Obserber cssAnimationEnd');
	});
	$E.addObserver(hello, 'cssAnimationStop', function(){
		console.log('Obserber cssAnimationStop');
	});
	$E.addObserver(hello, 'cssAnimationResume', function(){
		console.log('Obserber cssAnimationResume');
	});
	$E.addObserver(hello, 'cssAnimationIteration', function(){
		console.log('Obserber cssAnimationIteration');
	});
	$C._createKeyframe();
	$C.animate(hello, {
		animationName:'flash',
		animationDuration:'1s',
		animationIterationCount: 1
	});

	$C.animate(rect1.adapter(), {
		animationName:'flash',
		animationDuration:'1s',
		animationIterationCount: 1
	});

	$(rect1.adapter()).toggle(function(){
		//$T.zoom.in(stage, this,3);
		$T.rotate.to(this, '180', {
			//transformOrigin: 'left top'
		});
	}, function(){
		//$T.zoom.out(stage, this, 1);
		$T.rotate.back(this);
	});

	
	// hello.addEventListener('webkitAnimationIteration', function(event){
	// 	console.log('iteration');
	// });	
	// hello.addEventListener('webkitAnimationEnd', function(event){
	// 	console.log('end');
	// });
	// hello.addEventListener('webkitAnimationStart', function(event){
	// 	console.log('start');
	// });

}
